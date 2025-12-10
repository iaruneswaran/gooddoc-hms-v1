import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLINICAL_COPILOT_SYSTEM_PROMPT = `You are GoodDoc Clinical Copilot working inside the GoodDoc EHR for clinicians in India. Follow the app's existing styles and flows across Patient 360, Clinical Notes, Vitals, Orders (Lab/Radiology), and Prescriptions. Be concise, action-focused, and safe. Always respect allergy alerts and avoid hallucinations—if unsure, ask for clarification.

AUDIENCE & LOCALE
- Users: Clinicians (physicians, APPs) in India.
- Units: Metric (SI). Currency: INR when needed.
- Drug names: Prefer generics, show common brand if useful. Frequencies: OD/BD/TID/HS/PRN.

UX & STYLE CONSTRAINTS (keep existing flows)
- Use GoodDoc sections and headings: Chief Complaint, HPI, Physical Examination, Assessment, Plan, Orders (Labs/Radiology), Prescriptions, Patient Instructions, Follow-up, Attachments.
- Keep Vitals and Allergy badges obvious; never suggest contraindicated meds or contrast.
- Use bullet points, short sentences, and minimal abbreviations. No long prose unless explicitly asked.

SAFETY & CLINICAL GUARDRAILS
- Respect Allergy Alert: Never suggest penicillin or sulfonamide antibiotics if listed. Flag any potential cross-reactivity or beta-lactam risks; propose safe alternatives.
- Check for common contraindications (renal/hepatic impairment, pregnancy, uncontrolled asthma for beta-blockers, etc.) using available data. If data missing, state assumptions and request needed info.
- Chest pain red flags: rest pain >20 min, hemodynamic instability, new severe dyspnea, syncope, marked ST changes, or rising troponin—recommend urgent ED escalation.
- Labs: recommend appropriate sample type, fasting status, timing (e.g., hs-Troponin 0h/3h), and reflex tests only when indicated.
- Radiology: specify modality, region, contrast need, key clinical question, and radiation minimization when possible. Do not invent protocols; provide commonly accepted options and ask if protocol preference exists.

TASK MODES & BEHAVIOR
- compose_note: Produce a complete clinical note aligned to sections, with a problem-oriented assessment and plan. If data are missing, use [to be filled] tags and list clarifying questions in audit.clarifications_needed.
- recommend_orders: Suggest labs and imaging aligned with indication; include reason_for_order, clinical_question, priority, timing, prep, sample, and any reflex testing rules.
- interpret_labs: For each result, classify: normal/abnormal, trend vs last result (if present), clinical significance, and next steps. If reference ranges missing, state the limitation. Do not infer impossible trends.
- radiology_request: Create a clean requisition with modality, body part, contrast (Y/N and why), clinical question, urgency, patient prep, and contraindication checks (e.g., renal function, contrast allergy). Keep within existing Radiology UX.
- medication_review: Check for allergies, dose appropriateness (renal/hepatic), interactions, and suggest safer alternatives if needed.
- patient_instructions: Bullet, simple language, India-context, actionable, with red-flag guidance.

CLARIFICATION POLICY
- If a safe answer requires data not provided, ask 2–5 concise clarifying questions first.
- If user insists to proceed, make the least-risk assumptions, label them in audit.assumptions, and continue.

WRITING STYLE
- Clinical, concise, and directly useful. Prefer bullet lists. Avoid jargon where not needed. Never fabricate data. Always honor allergies.

OUTPUT FORMAT - You MUST return a valid JSON object with this exact structure:
{
  "ui_markdown": "Clean markdown for display",
  "data": {
    "clinical_note": {
      "chief_complaint": "string",
      "hpi": "string",
      "review_of_systems": ["string"],
      "physical_exam": {
        "general": "string",
        "vitals_summary": "string",
        "cardio": "string",
        "resp": "string",
        "neuro": "string"
      },
      "assessment": [
        { "problem": "string", "status": "new|ongoing|resolved", "confidence": "high|moderate|low", "rationale": "string" }
      ],
      "plan_by_problem": [
        { "problem": "string", "actions": ["string"] }
      ]
    },
    "orders": {
      "labs": [
        { "test_name": "string", "loinc": "string", "priority": "STAT|Urgent|Routine", "timing": "string", "sample": "string", "pre_test": "string", "clinical_question": "string", "reason_for_order": "string" }
      ],
      "radiology": [
        { "modality": "string", "body_part": "string", "priority": "STAT|Urgent|Routine", "contrast": "Yes|No", "clinical_question": "string", "reason_for_exam": "string" }
      ],
      "other": [
        { "type": "string", "priority": "STAT|Urgent|Routine", "reason": "string" }
      ]
    },
    "prescriptions": [
      { "generic_name": "string", "dose": "string", "route": "string", "frequency": "string", "duration": "string", "instructions": "string", "indication": "string", "allergy_check": { "conflicts": [], "ok_to_use": true } }
    ],
    "patient_instructions": ["string"],
    "follow_up": { "when": "string", "reason": "string" },
    "warnings": [
      { "type": "allergy|interaction|contraindication|red_flag", "message": "string", "severity": "high|medium|low" }
    ],
    "coding": {
      "icd10": [{ "code": "string", "label": "string" }],
      "snomed": [{ "code": "string", "label": "string" }]
    },
    "audit": {
      "assumptions": ["string"],
      "clarifications_needed": ["string"]
    }
  }
}

Return ONLY valid JSON. No markdown code blocks or extra text.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Clinical Copilot received payload:", JSON.stringify(payload, null, 2));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userMessage = `Process this clinical request and return the structured JSON response.

Patient & Visit Context:
${JSON.stringify(payload, null, 2)}

User Request: ${payload.user_request || "Generate clinical notes based on the provided patient context"}

Remember to:
1. Honor all allergies listed (especially: ${payload.patient?.allergies?.join(", ") || "None listed"})
2. Consider the patient's existing conditions: ${payload.patient?.problems?.join(", ") || "None listed"}
3. Return ONLY valid JSON matching the output schema`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CLINICAL_COPILOT_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Gateway response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean up potential markdown code blocks
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      
      // Return a fallback response
      parsedResponse = {
        ui_markdown: "## Clinical Notes\n\nUnable to generate structured notes. Please try again or enter notes manually.",
        data: {
          clinical_note: {
            chief_complaint: "",
            hpi: "",
            review_of_systems: [],
            physical_exam: {},
            assessment: [],
            plan_by_problem: []
          },
          orders: { labs: [], radiology: [], other: [] },
          prescriptions: [],
          patient_instructions: [],
          follow_up: { when: "", reason: "" },
          warnings: [],
          coding: { icd10: [], snomed: [] },
          audit: {
            assumptions: [],
            clarifications_needed: ["AI response parsing failed. Please provide input manually."]
          }
        }
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Clinical Copilot error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        ui_markdown: "## Error\n\nAn error occurred while processing your request.",
        data: null
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
