import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient, ClinicalNote, Prescription, LabOrder } from "@/types/patient360";
import { FileText, Pill, FlaskConical } from "lucide-react";

interface OrderSummaryStepProps {
  patient: Patient;
  clinicalNote?: ClinicalNote;
  prescription?: Prescription;
  labOrder?: LabOrder;
  onBack: () => void;
}

export function OrderSummaryStep({ 
  patient, 
  clinicalNote, 
  prescription, 
  labOrder,
  onBack 
}: OrderSummaryStepProps) {
  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dob).getTime()) / 
    (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h3 font-semibold text-foreground">{patient.name}</h3>
            <p className="text-small text-muted-foreground">
              GDID: {patient.gdid} • {age} yrs • {patient.sex === 'M' ? 'Male' : 'Female'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-small text-muted-foreground">Phone: {patient.phone}</p>
            <p className="text-small text-muted-foreground">Email: {patient.email}</p>
          </div>
        </div>
      </Card>

      {/* Clinical Notes - Full Width */}
      {clinicalNote && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="text-label font-semibold text-foreground">Clinical Notes</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-caption text-muted-foreground mb-1">Chief Complaint</p>
                <p className="text-small text-foreground">{clinicalNote.chiefComplaint || "Not specified"}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-1">History of Present Illness (HPI)</p>
                <p className="text-small text-foreground">{clinicalNote.hpi || "Not specified"}</p>
              </div>
            </div>
            <div className="space-y-3">
              {clinicalNote.physicalExam && Object.keys(clinicalNote.physicalExam).length > 0 && (
                <div>
                  <p className="text-caption text-muted-foreground mb-1">Physical Examination</p>
                  <div className="space-y-1">
                    {Object.entries(clinicalNote.physicalExam).map(([key, value]) => (
                      <p key={key} className="text-small text-foreground">
                        <span className="font-medium">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {clinicalNote.assessmentPlan && (
                <div>
                  <p className="text-caption text-muted-foreground mb-1">Assessment & Plan</p>
                  <p className="text-small text-foreground">{clinicalNote.assessmentPlan}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Prescription Summary */}
        {prescription && prescription.items.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-primary" />
              <h4 className="text-label font-semibold text-foreground">Prescriptions ({prescription.items.length})</h4>
            </div>
            <div className="space-y-2">
              {prescription.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-small py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.strength && <span className="text-muted-foreground ml-2">{item.strength}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {item.dosage && <span>{item.dosage}</span>}
                    {item.timing && <span>{item.timing}</span>}
                    {item.frequency && <span>{item.frequency}</span>}
                    {item.durationDays && <span>{item.durationDays}d</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Lab Orders Summary */}
        {labOrder && labOrder.tests.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-4 h-4 text-primary" />
              <h4 className="text-label font-semibold text-foreground">{labOrder.type} Orders ({labOrder.tests.length})</h4>
            </div>
            <div className="space-y-2">
              {labOrder.tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between text-small py-2 border-b border-border last:border-0">
                  <span className="text-foreground">{test.name}</span>
                  <span className="font-medium text-foreground">₹{test.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{labOrder.totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">CGST (9%)</span>
              <span className="text-foreground">₹{labOrder.totals.cgst.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">SGST (9%)</span>
              <span className="text-foreground">₹{labOrder.totals.sgst.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
              <span className="font-semibold text-foreground">Net Payable</span>
              <span className="font-semibold text-foreground">₹{Math.round(labOrder.totals.net).toLocaleString()}</span>
            </div>
          </Card>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-start pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
