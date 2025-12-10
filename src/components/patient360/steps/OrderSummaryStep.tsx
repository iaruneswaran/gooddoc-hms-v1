import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient, ClinicalNote, Prescription, LabOrder } from "@/types/patient360";
import { Printer, Share2, CreditCard, FileText, Pill, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  const { toast } = useToast();

  const handlePrint = (type: 'all' | 'prescription' | 'lab-requisition' | 'clinical-notes') => {
    toast({
      title: "Printing...",
      description: `Printing ${type === 'all' ? 'all documents' : type.replace('-', ' ')}`
    });
    window.print();
  };

  const handleShareToPatient = () => {
    toast({
      title: "Shared",
      description: "Order summary shared to patient via SMS/Email"
    });
  };

  const handleProceedToPayment = () => {
    toast({
      title: "Redirecting to Payment",
      description: "Opening payment screen for front office billing"
    });
  };

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

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Summary Details */}
        <div className="col-span-2 space-y-4">
          {/* Clinical Notes Summary */}
          {clinicalNote && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="text-label font-semibold text-foreground">Clinical Notes</h4>
              </div>
              <div className="space-y-2 text-small">
                <div>
                  <span className="text-muted-foreground">Chief Complaint: </span>
                  <span className="text-foreground">{clinicalNote.chiefComplaint}</span>
                </div>
                {clinicalNote.assessmentPlan && (
                  <div>
                    <span className="text-muted-foreground">Assessment & Plan: </span>
                    <span className="text-foreground">{clinicalNote.assessmentPlan}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => handlePrint('clinical-notes')}>
                  <Printer className="w-3 h-3 mr-1" />
                  Print Clinical Notes
                </Button>
              </div>
            </Card>
          )}

          {/* Prescription Summary */}
          {prescription && prescription.items.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-primary" />
                <h4 className="text-label font-semibold text-foreground">Prescriptions</h4>
              </div>
              <div className="space-y-2">
                {prescription.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-small py-1 border-b border-border last:border-0">
                    <div>
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-muted-foreground ml-2">{item.strength}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {item.dosage} • {item.frequency} • {item.durationDays}d
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => handlePrint('prescription')}>
                  <Printer className="w-3 h-3 mr-1" />
                  Print Prescription
                </Button>
              </div>
            </Card>
          )}

          {/* Lab Orders Summary */}
          {labOrder && labOrder.tests.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4 text-primary" />
                <h4 className="text-label font-semibold text-foreground">Lab Orders</h4>
              </div>
              <div className="space-y-2">
                {labOrder.tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between text-small py-1 border-b border-border last:border-0">
                    <span className="text-foreground">{test.name}</span>
                    <span className="font-medium text-foreground">₹{test.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  ₹{labOrder.tests.reduce((sum, t) => sum + t.price, 0).toLocaleString()}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => handlePrint('lab-requisition')}>
                  <Printer className="w-3 h-3 mr-1" />
                  Print Lab Requisition
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Actions */}
        <div>
          <Card className="p-4 sticky top-24">
            <h4 className="text-label font-semibold text-foreground mb-4">Front Office Actions</h4>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => handlePrint('all')}>
                <Printer className="w-4 h-4 mr-2" />
                Print All Documents
              </Button>
              
              <Button className="w-full justify-start" variant="outline" onClick={() => handlePrint('prescription')}>
                <Pill className="w-4 h-4 mr-2" />
                Print Prescription
              </Button>
              
              <Button className="w-full justify-start" variant="outline" onClick={() => handlePrint('lab-requisition')}>
                <FlaskConical className="w-4 h-4 mr-2" />
                Print Lab Requisition
              </Button>
              
              <Button className="w-full justify-start" variant="outline" onClick={handleShareToPatient}>
                <Share2 className="w-4 h-4 mr-2" />
                Share to Patient
              </Button>
              
              <div className="pt-3 border-t border-border">
                <Button className="w-full" onClick={handleProceedToPayment}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleProceedToPayment}>
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
