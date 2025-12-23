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
  Stethoscope,
  Calendar
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
  { name: "Cardiac Catheterization", department: "Cardiology", date: "18 Dec 2025", doctor: "Dr. Arun Kumar", amount: 27500 },
  { name: "Echocardiography", department: "Cardiology", date: "19 Dec 2025", doctor: "Dr. Arun Kumar", amount: 4130 },
  { name: "CT Coronary Angiography", department: "Radiology", date: "21 Dec 2025", doctor: "Dr. Meera Nair", amount: 12500 },
  { name: "ICU Bed Charges (4 days)", department: "Cardiac ICU", date: "18-21 Dec 2025", doctor: "-", amount: 33440 },
];

const bedTransfers = [
  { from: "ER Bay 3", to: "Cardiac ICU C-302", date: "18 Dec 2025", time: "11:30 AM", reason: "Admission for monitoring" },
  { from: "Cardiac ICU C-302", to: "Cardiac Ward B-108", date: "21 Dec 2025", time: "09:00 AM", reason: "Step-down after stabilization" },
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Column 1: Services */}
            <div className="space-y-4">
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Services & Charges</h4>
                </div>
                <div className="space-y-2">
                  {servicesUsed.map((s, i) => (
                    <div key={i} className="bg-background rounded-lg p-2.5 border border-border/50">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium">{s.name}</p>
                        <span className="font-semibold text-sm">{formatCurrency(s.amount)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{s.department}</span>
                        <span>•</span>
                        <span>{s.date}</span>
                        {s.doctor !== "-" && (
                          <>
                            <span>•</span>
                            <span>{s.doctor}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bed Transfers */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <Bed className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Bed Transfers</h4>
                </div>
                <div className="space-y-2">
                  {bedTransfers.map((t, i) => (
                    <div key={i} className="bg-background rounded-lg p-2.5 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{t.from}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-medium">{t.to}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{t.date}</span>
                        <span>•</span>
                        <span>{t.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 italic">{t.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Payment & Follow-up */}
            <div className="space-y-4">
              {/* Payment */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Payment Summary</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-background rounded-lg px-3 py-2 border border-border/50">
                    <span className="text-sm text-muted-foreground">Total Bill</span>
                    <span className="font-bold text-base">{formatCurrency(data.billingSummary.total)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-500/10 rounded-lg px-3 py-2">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="font-bold text-base text-green-600">{formatCurrency(data.billingSummary.paid)}</span>
                  </div>
                  <div className={cn("flex justify-between items-center rounded-lg px-3 py-2", 
                    data.billingSummary.outstanding > 0 ? "bg-red-500/10" : "bg-green-500/10"
                  )}>
                    <span className="text-sm text-muted-foreground">Outstanding</span>
                    <span className={cn("font-bold text-base", 
                      data.billingSummary.outstanding > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {formatCurrency(data.billingSummary.outstanding)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow-up */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Follow-up Appointment</h4>
                </div>
                {data.followUps.followUpDate ? (
                  <div className="bg-background rounded-lg p-3 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-sm font-semibold">
                        {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    {data.followUps.followUpReason && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Reason</p>
                        <p className="text-sm text-foreground">{data.followUps.followUpReason}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No follow-up scheduled</p>
                )}
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
