import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Calendar, 
  Loader2,
  Stethoscope,
  Pill,
  ClipboardCheck,
  ShieldCheck
} from "lucide-react";

interface DentalFinalizeConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  patientName: string;
  mrn: string;
  encounterId: string;
}

export function DentalFinalizeConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  patientName,
  mrn,
  encounterId,
}: DentalFinalizeConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Dental specific summary data
  const visitSummary = {
    visitDate: "12-May-2026",
    startTime: "10:30 AM",
    duration: "45 mins",
    clinic: "Dental Unit - Operatory 1",
    procedures: "Composite Restoration (#14), Scaling",
    prescriptions: "Amoxicillin 500mg, Paracetamol 650mg",
    attendingDentist: "Dr. Arun Eswaran",
    nextFollowUp: "19-May-2026",
    clinicalStatus: "Treatment Complete",
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
      setConfirmed(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 border-0 flex flex-col [&>button]:text-white [&>button]:top-3 [&>button]:right-4 [&>button]:hover:bg-white/10">
        {/* Header */}
        <div className="bg-primary px-6 h-16 flex items-center rounded-t-lg shrink-0">
          <h2 className="text-base font-semibold text-white">Confirm Visit Finalization</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Patient Info */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{patientName}</h3>
              <p className="text-xs text-muted-foreground">MRN: {mrn} • Visit ID: {encounterId}</p>
            </div>
          </div>

          {/* Clinical Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Visit Date</span>
              <span className="font-medium">{visitSummary.visitDate}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Duration</span>
              <span className="font-medium">{visitSummary.duration}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-muted-foreground block">Procedures Performed</span>
              <span className="font-medium">{visitSummary.procedures}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-muted-foreground block">Prescriptions Issued</span>
              <span className="font-medium">{visitSummary.prescriptions}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Attending Dentist</span>
              <span className="font-medium">{visitSummary.attendingDentist}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Next Follow-up</span>
              <span className="font-medium">{visitSummary.nextFollowUp}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Clinical Status</span>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-xs mt-1">
                {visitSummary.clinicalStatus}
              </Badge>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="confirm-finalize" 
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(!!checked)}
              />
              <Label htmlFor="confirm-finalize" className="text-sm cursor-pointer leading-relaxed">
                I confirm that all clinical findings, procedures, and prescriptions are accurately recorded. I understand that locking this visit will prevent further edits.
              </Label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex items-center justify-end gap-3 bg-muted/30 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!confirmed || isConfirming}
            className="bg-primary"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizing...
              </>
            ) : (
              "Confirm & Lock Visit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
