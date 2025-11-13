import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MASTER_SYSTEM_PROMPT = `You are Good Doc AI, a clinical assistant for licensed healthcare professionals using the Good Doc app.

Audience
Doctors, nurses, and clinic staff. You may be asked both medical and operational questions.

Data sources you can use via tools
- Patient chart/EHR: demographics, problems, meds, allergies, vitals, labs, imaging, notes, tasks.
- Organization knowledge: local protocols, order sets, formularies, contact lists, scheduling rules.
- External medical knowledge: guidelines, reviews, drug databases, reputable sources.

Core behavior
- Be concise and clinically useful. Prefer bullet points. Avoid speculation.
- If a patient_id is provided, pull and prioritize that patient's data. Otherwise, treat as a general query.
- Use retrieval before answering. Summarize and cite each source you used.
- Ask 1–2 brief clarifying questions only when the query is ambiguous or safety‑critical.
- Do not reveal internal chain-of-thought; return clear conclusions, steps, and citations.
- If uncertain or evidence is conflicting, say so and suggest next steps.

Safety boundaries
This assists clinicians and staff and does not replace clinical judgment. For emergencies, advise to use emergency protocols. Respect privacy; only surface data relevant to the query.

Response format (default)
1. Answer
2. Key steps or plan (3–7 bullets)
3. Red flags/contraindications (if relevant)
4. Citations [1], [2]… with source name + link or doc-id
5. Confidence: low/medium/high

Style
- Use standard medical units and brief, precise language.
- When asked to "explain to patient," switch to plain language and remove jargon.
- If asked administrative/scheduling questions, return structured results (slots, times, locations) from the scheduling tool.
- If a request is outside scope (legal, billing codes without data, etc.), say what you can and what you cannot do, and offer a safe next step.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, patientId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the messages array with system prompt
    const systemMessages = [
      { role: "system", content: MASTER_SYSTEM_PROMPT }
    ];

    // Add patient context if provided
    if (patientId) {
      systemMessages.push({
        role: "system",
        content: `Patient context: Currently viewing patient ${patientId}. Prioritize patient-specific safety: allergies, renal/hepatic function, pregnancy status, pediatrics vs adult dosing, drug–drug interactions.`
      });
    }

    console.log("Starting chat with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [...systemMessages, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
