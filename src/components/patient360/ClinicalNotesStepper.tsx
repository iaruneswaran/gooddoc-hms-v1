import { Patient, Vitals } from "@/types/patient360";
import { WriteNotesStep } from "./steps/WriteNotesStep";
import { PrescriptionsStep } from "./steps/PrescriptionsStep";
import { LabOrdersStep } from "./steps/LabOrdersStep";

interface ClinicalNotesStepperProps {
  patient: Patient;
  vitals?: Vitals;
}

export function ClinicalNotesStepper({ patient, vitals }: ClinicalNotesStepperProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Write Notes</h3>
        <WriteNotesStep patient={patient} vitals={vitals} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Prescriptions</h3>
        <PrescriptionsStep patient={patient} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Lab Orders</h3>
        <LabOrdersStep patient={patient} />
      </div>
    </div>
  );
}
