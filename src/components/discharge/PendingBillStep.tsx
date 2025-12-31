import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PendingBill, StepStatus } from "@/types/discharge-flow";
import { formatINR } from "@/utils/currency";

interface PendingBillStepProps {
  bills: PendingBill[];
  patientName: string;
  mrn: string;
  encounterId: string;
  stepStatus: StepStatus;
  onBillsUpdated: (bills: PendingBill[]) => void;
  onStepComplete: () => void;
  requireBillingClearance: boolean;
}

const formatCurrency = (amount: number) => formatINR(amount * 100);

const getOutstandingRiskColor = (amount: number) => {
  if (amount === 0) return "text-green-600";
  if (amount < 10000) return "text-amber-600";
  if (amount < 50000) return "text-orange-600";
  return "text-red-600";
};

export default function PendingBillStep({
  bills,
  requireBillingClearance,
}: PendingBillStepProps) {
  // Calculate totals
  const totalAmount = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = bills.reduce((sum, b) => sum + b.outstandingAmount, 0);
  const allCleared = totalOutstanding === 0;

  // Mock unbilled amount for demo
  const unbilledAmount = 2000;

  return (
    <div className="space-y-6">
      {/* Billing Summary Card */}
      <Card className="max-w-md">
        <div className="p-5">
          <h3 className="font-semibold text-foreground mb-4 pb-2 border-b">Billing Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Billed Amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Unbilled Amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(unbilledAmount)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Outstanding</span>
              <span className={`font-semibold ${getOutstandingRiskColor(totalOutstanding)}`}>
                {formatCurrency(totalOutstanding)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Billing Clearance Warning */}
      {requireBillingClearance && totalOutstanding > 0 && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30 max-w-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Billing Clearance Required</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Outstanding balance of {formatCurrency(totalOutstanding)} must be cleared before discharge.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* All Cleared Message */}
      {allCleared && (
        <Card className="p-4 bg-green-500/10 border-green-500/30 max-w-md">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">All Bills Cleared</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                All outstanding bills have been settled.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
