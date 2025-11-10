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
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.number
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium",
                  currentStep === step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] w-32 mx-4 transition-colors",
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

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
