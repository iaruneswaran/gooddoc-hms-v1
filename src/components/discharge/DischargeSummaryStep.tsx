import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  Pill,
  Send,
  Building2,
  Bed,
  CreditCard,
  Activity,
  ArrowRight,
  Clock,
  FileText,
  Stethoscope
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

const servicesUsed = [
  { name: "Cardiac Catheterization", department: "Cardiology", date: "18 Dec" },
  { name: "Echocardiography", department: "Cardiology", date: "19 Dec" },
  { name: "CT Coronary Angiography", department: "Radiology", date: "21 Dec" },
];

const bedTransfers = [
  { from: "ER Bay 3", to: "Cardiac ICU C-302", date: "18 Dec" },
  { from: "Cardiac ICU C-302", to: "Cardiac Ward B-108", date: "21 Dec" },
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

  const handlePrint = () => toast.info("Preparing discharge summary for print...");
  const handleDownload = () => toast.info("Downloading discharge summary PDF...");

  const lengthOfStay = Math.ceil(
    (new Date(data.header.dischargeAt || new Date()).getTime() - new Date(data.header.admissionAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Discharge Summary</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Main Summary Card */}
      <Card className="border-border overflow-hidden">
        {/* Hospital Header Bar */}
        <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-sm">Apollo Hospitals</p>
              <p className="text-[10px] text-muted-foreground">Chennai</p>
            </div>
          </div>
          <Badge variant="secondary" className={cn("text-xs", conditionColors[data.conditionAtDischarge])}>
            {data.conditionAtDischarge}
          </Badge>
        </div>

        <CardContent className="p-5">
          {/* Admission Details Grid */}
          <div className="grid grid-cols-5 gap-3 mb-5">
            {[
              { label: "Patient ID", value: data.header.patientId },
              { label: "Admitted", value: new Date(data.header.admissionAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
              { label: "Discharged", value: new Date(data.header.dischargeAt || new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
              { label: "Stay", value: `${lengthOfStay} days` },
              { label: "Physician", value: data.header.attending },
            ].map((item, i) => (
              <div key={i} className="bg-muted/40 rounded-md p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                <p className="font-semibold text-sm mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* Column 1: Services & Transfers */}
            <div className="space-y-4">
              {/* Services */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Services</h4>
                </div>
                <div className="space-y-1.5">
                  {servicesUsed.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-background rounded px-2 py-1.5">
                      <div>
                        <p className="text-xs font-medium">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.department}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{s.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bed Transfers */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Bed className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Bed Transfers</h4>
                </div>
                <div className="space-y-1.5">
                  {bedTransfers.map((t, i) => (
                    <div key={i} className="bg-background rounded px-2 py-1.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium">{t.from}</span>
                        <ArrowRight className="w-3 h-3 text-primary" />
                        <span className="font-medium">{t.to}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Payments & Follow-up */}
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Payment</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-background rounded px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">Total Bill</span>
                    <span className="font-semibold text-sm">{formatCurrency(data.billingSummary.total)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-500/10 rounded px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">Paid</span>
                    <span className="font-semibold text-sm text-green-600">{formatCurrency(data.billingSummary.paid)}</span>
                  </div>
                  <div className={cn("flex justify-between items-center rounded px-2 py-1.5", 
                    data.billingSummary.outstanding > 0 ? "bg-red-500/10" : "bg-green-500/10"
                  )}>
                    <span className="text-xs text-muted-foreground">Outstanding</span>
                    <span className={cn("font-semibold text-sm", 
                      data.billingSummary.outstanding > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {formatCurrency(data.billingSummary.outstanding)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow-up */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Follow-up</h4>
                </div>
                {data.followUps.followUpDate ? (
                  <div className="bg-primary/10 border border-primary/20 rounded px-3 py-2">
                    <p className="text-sm font-semibold text-primary">
                      {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Not scheduled</p>
                )}
              </div>
            </div>

            {/* Column 3: Medications */}
            <div className="bg-muted/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Pill className="w-3.5 h-3.5 text-primary" />
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Medications ({data.dischargeMeds.length})
                </h4>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {data.dischargeMeds.map((med, i) => (
                  <div key={i} className="flex gap-2 bg-background rounded px-2 py-1.5">
                    <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{med.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="bg-muted/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Clinical Summary</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{data.hospitalCourse}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{data.header.attending}</p>
                <p className="text-[10px] text-muted-foreground">Attending Physician</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              Prepared: {new Date().toLocaleDateString("en-GB")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finalize */}
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="confirm-review"
              checked={confirmReview}
              onCheckedChange={(checked) => setConfirmReview(checked as boolean)}
            />
            <label htmlFor="confirm-review" className="text-sm cursor-pointer">
              I confirm all documentation is accurate and complete
            </label>
          </div>
          <Button onClick={handleFinalize} disabled={!canFinalize} size="sm" className="gap-1.5">
            <Send className="w-4 h-4" />
            Finalize
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
