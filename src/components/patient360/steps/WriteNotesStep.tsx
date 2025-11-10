import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Patient, Vitals } from "@/types/patient360";
import { VitalsCard } from "../VitalsCard";

interface WriteNotesStepProps {
  patient: Patient;
  vitals?: Vitals;
  onNext?: () => void;
}

export function WriteNotesStep({ patient, vitals, onNext }: WriteNotesStepProps) {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hpi, setHpi] = useState("");
  const [assessmentPlan, setAssessmentPlan] = useState("");

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-6">Write patient clinical notes</p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="chiefComplaint" className="text-sm font-medium">
                Chief Complaint
              </Label>
              <Input
                id="chiefComplaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Enter chief complaint"
                className="mt-2"
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
              <Label className="text-sm font-medium">Review of Systems (ROS)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Constitutional</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Cardiovascular</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Respiratory</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Gastrointestinal</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Neurological</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Musculoskeletal</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Genitourinary</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    <span>Psychiatric</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="physicalExam" className="text-sm font-medium">
                Physical Examination
              </Label>
              <Textarea
                id="physicalExam"
                placeholder="Document physical examination findings"
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="assessmentPlan" className="text-sm font-medium">
                Assessment & Plan
              </Label>
              <Textarea
                id="assessmentPlan"
                value={assessmentPlan}
                onChange={(e) => setAssessmentPlan(e.target.value)}
                placeholder="Enter assessment and plan"
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>

          {onNext && (
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost">Skip, Fill later</Button>
              <Button onClick={onNext}>Save & Continue</Button>
            </div>
          )}
        </Card>
      </div>

      <div>
        <VitalsCard vitals={vitals} />
      </div>
    </div>
  );
}
