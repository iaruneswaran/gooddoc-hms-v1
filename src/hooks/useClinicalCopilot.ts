import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Patient, Vitals } from "@/types/patient360";
import {
  CopilotMode,
  CopilotPayload,
  CopilotResponse,
  CopilotPatient,
  CopilotVitals,
} from "@/types/clinical-copilot";

interface UseClinicalCopilotProps {
  patient: Patient;
  vitals?: Vitals;
  clinician?: string;
  visitReason?: string;
}

interface UseClinicalCopilotReturn {
  generate: (mode: CopilotMode, userRequest: string) => Promise<void>;
  response: CopilotResponse | null;
  isLoading: boolean;
  error: string | null;
  clearResponse: () => void;
}

// Calculate age from DOB
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Transform app patient to copilot patient format
function transformPatient(patient: Patient, vitals?: Vitals): CopilotPatient {
  const copilotVitals: CopilotVitals = {};
  
  if (vitals) {
    if (vitals.bpSystolic && vitals.bpDiastolic) {
      copilotVitals.bp = `${vitals.bpSystolic}/${vitals.bpDiastolic}`;
    }
    copilotVitals.hr = vitals.heartRate;
    copilotVitals.rr = vitals.respiratoryRate;
    copilotVitals.temp_c = vitals.temperatureC;
    copilotVitals.spo2 = vitals.spo2;
    copilotVitals.height_cm = vitals.heightCm;
    copilotVitals.weight_kg = vitals.weightKg;
  }

  return {
    id: patient.id,
    name: patient.name,
    age: calculateAge(patient.dob),
    sex: patient.sex === "O" ? "Other" : patient.sex,
    dob: patient.dob,
    allergies: patient.alerts?.allergies || [],
    problems: patient.tags || [],
    vitals: copilotVitals,
    medications: [], // Would come from patient history
    labs: [], // Would come from previous lab results
    imaging: [], // Would come from previous imaging
    previous_visits: [], // Would come from visit history
    locale: "en-IN",
  };
}

export function useClinicalCopilot({
  patient,
  vitals,
  clinician = "Dr. Sharma",
  visitReason = "",
}: UseClinicalCopilotProps): UseClinicalCopilotReturn {
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (mode: CopilotMode, userRequest: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: CopilotPayload = {
          mode,
          patient: transformPatient(patient, vitals),
          visit: {
            date: new Date().toISOString().split("T")[0],
            reason: visitReason || userRequest,
            clinician,
            setting: "Outpatient",
          },
          preferences: {
            note_style: "Problem-Oriented",
            detail_level: "standard",
            include_codes: true,
          },
          constraints: {
            max_tokens: 2000,
            output_version: "1.0",
          },
          user_request: userRequest,
        };

        const { data, error: fnError } = await supabase.functions.invoke(
          "clinical-copilot",
          { body: payload }
        );

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setResponse(data as CopilotResponse);
      } catch (err) {
        console.error("Clinical Copilot error:", err);
        setError(err instanceof Error ? err.message : "Failed to generate clinical notes");
      } finally {
        setIsLoading(false);
      }
    },
    [patient, vitals, clinician, visitReason]
  );

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    generate,
    response,
    isLoading,
    error,
    clearResponse,
  };
}
