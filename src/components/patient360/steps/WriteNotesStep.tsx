import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Patient, Vitals } from "@/types/patient360";
import { VitalsCard } from "../VitalsCard";
import { ClinicalCopilotPanel } from "../ClinicalCopilotPanel";
import { useClinicalCopilot } from "@/hooks/useClinicalCopilot";
import { AlertTriangle } from "lucide-react";

interface WriteNotesStepProps {
  patient: Patient;
  vitals?: Vitals;
  onNext: () => void;
}

export function WriteNotesStep({ patient, vitals, onNext }: WriteNotesStepProps) {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hpi, setHpi] = useState("");
  const [physicalExam, setPhysicalExam] = useState("");

  const { generate, response, isLoading, error, clearResponse } = useClinicalCopilot({
    patient,
    vitals,
    clinician: "Dr. Sharma",
    visitReason: chiefComplaint,
  });

  const handleApplyToFields = (data: {
    chiefComplaint: string;
    hpi: string;
    physicalExam: string;
  }) => {
    if (data.chiefComplaint) setChiefComplaint(data.chiefComplaint);
    if (data.hpi) setHpi(data.hpi);
    if (data.physicalExam) setPhysicalExam(data.physicalExam);
  };

  const hasAllergies = patient.alerts?.allergies && patient.alerts.allergies.length > 0;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content - Clinical Notes Form */}
      <div className="col-span-7 space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">Write patient clinical notes</p>
            {hasAllergies && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div className="flex gap-1">
                  {patient.alerts?.allergies?.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="chiefComplaint" className="text-sm font-medium">
                Chief Complaint
              </Label>
              <Textarea
                id="chiefComplaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Enter chief complaint"
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="hpi" className="text-sm font-medium">
                History of Present Illness (HPI)
              </Label>
              <Textarea
                id="hpi"
                value={hpi}
                onChange={(e) => setHpi(e.target.value)}
                placeholder="Describe the history of present illness"
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="physicalExam" className="text-sm font-medium">
                Physical Examination
              </Label>
              <Textarea
                id="physicalExam"
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                placeholder="Document physical examination findings"
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="ghost">Skip, Fill later</Button>
            <Button onClick={onNext}>Save & Continue</Button>
          </div>
        </Card>
      </div>

      {/* Right Side - Vitals + AI Copilot */}
      <div className="col-span-5 flex flex-col gap-4 max-h-[calc(100vh-220px)]">
        <div className="shrink-0">
          <VitalsCard vitals={vitals} />
        </div>
        <div className="flex-1 min-h-0">
          <ClinicalCopilotPanel
            response={response}
            isLoading={isLoading}
            error={error}
            onGenerate={generate}
            onApplyToFields={handleApplyToFields}
          />
        </div>
      </div>
    </div>
  );
}
