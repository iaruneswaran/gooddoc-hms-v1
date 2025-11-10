import { useState } from "react";
import { Patient, Vitals } from "@/types/patient360";
import { WriteNotesStep } from "./steps/WriteNotesStep";
import { PrescriptionsStep } from "./steps/PrescriptionsStep";
import { LabOrdersStep } from "./steps/LabOrdersStep";
import { cn } from "@/lib/utils";

interface ClinicalNotesStepperProps {
  patient: Patient;
  vitals?: Vitals;
}

export function ClinicalNotesStepper({ patient, vitals }: ClinicalNotesStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, label: "Write Notes" },
    { number: 2, label: "Prescriptions" },
    { number: 3, label: "Lab Orders" }
  ];

  return (
    <div>
      <div>
        {currentStep === 1 && (
          <WriteNotesStep
            patient={patient}
            vitals={vitals}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <PrescriptionsStep
            patient={patient}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <LabOrdersStep
            patient={patient}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}
