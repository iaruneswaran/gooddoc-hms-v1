import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  User, 
  Calendar, 
  Stethoscope, 
  Pill, 
  AlertTriangle,
  FileText,
  Loader2
} from "lucide-react";

interface DischargeConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  patientName: string;
  mrn: string;
  encounterId: string;
}

export function DischargeConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  patientName,
  mrn,
  encounterId,
}: DischargeConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [acknowledgements, setAcknowledgements] = useState({
    medicationsReviewed: false,
    instructionsProvided: false,
    followUpScheduled: false,
  });

  // Mock discharge summary data - in real app this would come from props/API
  const dischargeSummary = {
    admissionDate: "15-Dec-2025",
    dischargeDate: "20-Dec-2025",
    lengthOfStay: "5 days",
    admissionType: "Emergency",
    ward: "General Ward - A",
    bed: "Bed 12",
    primaryDiagnosis: "Acute Viral Gastroenteritis with Dehydration",
    secondaryDiagnosis: "Hypokalemia",
    attendingPhysician: "Dr. Meera Nair",
    department: "Internal Medicine",
    conditionAtDischarge: "Stable",
    dischargeTo: "Home",
    procedures: [
      "IV Fluid Resuscitation",
      "Electrolyte Correction",
      "Symptomatic Management"
    ],
    medications: [
      { name: "ORS Sachets", dosage: "1 sachet in 200ml water", frequency: "After each loose stool" },
      { name: "Tab. Ondansetron 4mg", dosage: "4mg", frequency: "TID x 3 days" },
      { name: "Tab. Potassium Chloride 600mg", dosage: "600mg", frequency: "BID x 5 days" },
      { name: "Cap. Pantoprazole 40mg", dosage: "40mg", frequency: "OD x 7 days" },
    ],
    followUp: {
      date: "27-Dec-2025",
      department: "Internal Medicine",
      physician: "Dr. Meera Nair",
      reason: "Review of symptoms and electrolyte levels"
    },
    instructions: [
      "Continue oral rehydration with ORS",
      "Soft bland diet for 3-5 days, avoid spicy and oily food",
      "Complete the prescribed medication course",
      "Return immediately if symptoms worsen or fever develops",
      "Get serum electrolytes checked before follow-up visit"
    ]
  };

  const allAcknowledged = Object.values(acknowledgements).every(Boolean);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 flex flex-col">
        {/* Header */}
        <div className="bg-primary px-6 h-20 flex items-center justify-between rounded-t-lg shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Discharge Summary</h2>
            <p className="text-sm text-white/80 mt-0.5">Review and confirm patient discharge</p>
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs">
            Ready for Discharge
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Information Card */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{patientName}</h3>
                <p className="text-xs text-muted-foreground">MRN: {mrn} • Encounter: {encounterId}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Admission Date</span>
                <span className="font-medium">{dischargeSummary.admissionDate}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Discharge Date</span>
                <span className="font-medium">{dischargeSummary.dischargeDate}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Length of Stay</span>
                <span className="font-medium">{dischargeSummary.lengthOfStay}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Ward / Bed</span>
                <span className="font-medium">{dischargeSummary.ward} - {dischargeSummary.bed}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-medium">Diagnosis</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Primary</span>
                  <p className="text-sm font-medium">{dischargeSummary.primaryDiagnosis}</p>
                </div>
                {dischargeSummary.secondaryDiagnosis && (
                  <div>
                    <span className="text-xs text-muted-foreground">Secondary</span>
                    <p className="text-sm">{dischargeSummary.secondaryDiagnosis}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-medium">Discharge Status</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Condition</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
                    {dischargeSummary.conditionAtDischarge}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Discharge To</span>
                  <span className="text-sm font-medium">{dischargeSummary.dischargeTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Attending Physician</span>
                  <span className="text-sm">{dischargeSummary.attendingPhysician}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Procedures Performed */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium">Procedures / Treatment Given</h4>
            </div>
            <ul className="space-y-1">
              {dischargeSummary.procedures.map((procedure, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {procedure}
                </li>
              ))}
            </ul>
          </div>

          {/* Discharge Medications */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium">Discharge Medications</h4>
            </div>
            <div className="space-y-2">
              {dischargeSummary.medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Follow-up Appointment</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-blue-600/70 block">Date</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{dischargeSummary.followUp.date}</span>
              </div>
              <div>
                <span className="text-xs text-blue-600/70 block">Department</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{dischargeSummary.followUp.department}</span>
              </div>
              <div>
                <span className="text-xs text-blue-600/70 block">With</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{dischargeSummary.followUp.physician}</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              Reason: {dischargeSummary.followUp.reason}
            </p>
          </div>

          {/* Discharge Instructions */}
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">Discharge Instructions</h4>
            </div>
            <ul className="space-y-1.5">
              {dischargeSummary.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <span className="text-amber-600 font-medium">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Acknowledgements */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="text-sm font-medium mb-4">Discharge Checklist</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="meds-reviewed" 
                  checked={acknowledgements.medicationsReviewed}
                  onCheckedChange={(checked) => setAcknowledgements(prev => ({...prev, medicationsReviewed: !!checked}))}
                />
                <Label htmlFor="meds-reviewed" className="text-sm cursor-pointer">
                  Discharge medications have been reviewed with patient/attendant
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="instructions-provided" 
                  checked={acknowledgements.instructionsProvided}
                  onCheckedChange={(checked) => setAcknowledgements(prev => ({...prev, instructionsProvided: !!checked}))}
                />
                <Label htmlFor="instructions-provided" className="text-sm cursor-pointer">
                  Discharge instructions and warning signs explained
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="followup-scheduled" 
                  checked={acknowledgements.followUpScheduled}
                  onCheckedChange={(checked) => setAcknowledgements(prev => ({...prev, followUpScheduled: !!checked}))}
                />
                <Label htmlFor="followup-scheduled" className="text-sm cursor-pointer">
                  Follow-up appointment has been scheduled/communicated
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex items-center justify-between bg-muted/30 shrink-0">
          <p className="text-xs text-muted-foreground max-w-md">
            By confirming discharge, you acknowledge that all clinical documentation is complete 
            and the patient is medically fit for discharge.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!allAcknowledged || isConfirming}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Discharge"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
