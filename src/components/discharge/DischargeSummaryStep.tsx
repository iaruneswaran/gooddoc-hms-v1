import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  User,
  Calendar,
  Stethoscope,
  Pill,
  Send,
  Building2,
  Bed,
  CreditCard,
  Activity,
  ArrowRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DischargeSummaryData, StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY } from "@/data/discharge-flow.mock";
import { toast } from "sonner";

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

interface DischargeSummaryStepProps {
  stepStatus: StepStatus;
  onFinalize: () => void;
  requireBillingClearance: boolean;
  totalOutstanding: number;
}

const conditionColors: Record<string, string> = {
  Stable: "bg-green-500/10 text-green-600 border-green-500/30",
  Improved: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  Unchanged: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  Guarded: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

// Mock data for services and bed transfers
const servicesUsed = [
  { name: "Cardiac Catheterization", department: "Cardiology", date: "18 Dec" },
  { name: "Echocardiography", department: "Cardiology", date: "19 Dec" },
  { name: "CT Coronary Angiography", department: "Radiology", date: "21 Dec" },
];

const bedTransfers = [
  { from: "ER Bay 3", to: "Cardiac ICU C-302", date: "18 Dec", time: "11:30 AM" },
  { from: "Cardiac ICU C-302", to: "Cardiac Ward B-108", date: "21 Dec", time: "09:00 AM" },
];

export default function DischargeSummaryStep({ 
  stepStatus, 
  onFinalize, 
  requireBillingClearance, 
  totalOutstanding 
}: DischargeSummaryStepProps) {
  const [data] = useState<DischargeSummaryData>(SAMPLE_DISCHARGE_SUMMARY);
  const [confirmReview, setConfirmReview] = useState(false);

  const canFinalize = confirmReview && (!requireBillingClearance || totalOutstanding === 0);

  const handleFinalize = () => {
    toast.success("Discharge finalized successfully!");
    onFinalize();
  };

  const handlePrint = () => {
    toast.info("Preparing discharge summary for print...");
  };

  const handleDownload = () => {
    toast.info("Downloading discharge summary PDF...");
  };

  const lengthOfStay = Math.ceil(
    (new Date(data.header.dischargeAt || new Date()).getTime() - new Date(data.header.admissionAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Discharge Summary</h2>
          <p className="text-sm text-muted-foreground">Review and finalize patient discharge</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Document */}
      <Card className="border-border">
        <CardContent className="p-6">
          {/* Hospital Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Discharge Summary</h1>
                <p className="text-xs text-muted-foreground">Apollo Hospitals, Chennai</p>
              </div>
            </div>
            <Badge variant="secondary" className={cn("text-xs px-2 py-0.5", conditionColors[data.conditionAtDischarge])}>
              {data.conditionAtDischarge}
            </Badge>
          </div>

          {/* Patient Info Row */}
          <div className="grid grid-cols-5 gap-4 mb-6 p-3 bg-muted/30 rounded-lg text-sm">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Patient</p>
              <p className="font-semibold">{data.header.patientId}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Admission</p>
              <p className="font-semibold">{new Date(data.header.admissionAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Discharge</p>
              <p className="font-semibold">{new Date(data.header.dischargeAt || new Date()).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">LOS</p>
              <p className="font-semibold">{lengthOfStay} days</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Attending</p>
              <p className="font-semibold">{data.header.attending}</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Services Used */}
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Services Used
                </h3>
                <div className="space-y-1.5">
                  {servicesUsed.map((service, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">({service.department})</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{service.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bed Transfers */}
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-primary" />
                  Bed Transfers
                </h3>
                <div className="space-y-1.5">
                  {bedTransfers.map((transfer, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded">
                      <span className="font-medium text-xs">{transfer.from}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium text-xs">{transfer.to}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{transfer.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Summary
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-muted/30 rounded text-center">
                    <p className="text-[10px] text-muted-foreground">Total</p>
                    <p className="font-bold text-sm">{formatCurrency(data.billingSummary.total)}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded text-center">
                    <p className="text-[10px] text-muted-foreground">Paid</p>
                    <p className="font-bold text-sm text-green-600">{formatCurrency(data.billingSummary.paid)}</p>
                  </div>
                  <div className={cn("p-2 rounded text-center", data.billingSummary.outstanding > 0 ? "bg-red-500/10" : "bg-green-500/10")}>
                    <p className="text-[10px] text-muted-foreground">Due</p>
                    <p className={cn("font-bold text-sm", data.billingSummary.outstanding > 0 ? "text-red-600" : "text-green-600")}>
                      {formatCurrency(data.billingSummary.outstanding)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Follow-up
                </h3>
                {data.followUps.followUpDate ? (
                  <div className="p-2 bg-primary/5 border border-primary/20 rounded flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No follow-up scheduled</p>
                )}
              </div>
            </div>

            {/* Right Column - Medications */}
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                Discharge Medications ({data.dischargeMeds.length})
              </h3>
              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                {data.dischargeMeds.map((med, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm py-1.5 border-b border-border/50 last:border-0">
                    <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{med.name} <span className="text-muted-foreground font-normal">{med.dose}</span></p>
                      <p className="text-xs text-muted-foreground">{med.frequency} • {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Clinical Summary - Compact */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-2">Clinical Summary</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{data.hospitalCourse}</p>
          </div>

          {/* Signature Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <div>
                <p className="font-semibold text-sm">{data.header.attending}</p>
                <p className="text-[10px] text-muted-foreground">Attending Physician</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Prepared: {new Date().toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Finalize Section */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="confirm-review"
                checked={confirmReview}
                onCheckedChange={(checked) => setConfirmReview(checked as boolean)}
              />
              <label htmlFor="confirm-review" className="text-sm font-medium cursor-pointer">
                I confirm all discharge documentation is accurate
              </label>
            </div>
            <Button 
              onClick={handleFinalize}
              disabled={!canFinalize}
              size="sm"
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Finalize Discharge
            </Button>
          </div>
          {requireBillingClearance && totalOutstanding > 0 && (
            <p className="text-xs text-amber-600 mt-2">
              Outstanding balance of {formatCurrency(totalOutstanding)} must be cleared
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
