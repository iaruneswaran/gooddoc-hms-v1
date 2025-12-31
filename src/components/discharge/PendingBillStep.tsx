import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Receipt, Wallet } from "lucide-react";
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

export default function PendingBillStep({
  bills,
  requireBillingClearance,
}: PendingBillStepProps) {
  // Calculate totals
  const totalAmount = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = bills.reduce((sum, b) => sum + b.outstandingAmount, 0);
  const allCleared = totalOutstanding === 0;

  // Mock values for demo
  const unbilledAmount = 2000;
  const advancePaid = 8000;
  const totalDue = totalOutstanding + unbilledAmount;
  const totalPayable = totalDue - advancePaid;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Billing Summary Card */}
        <Card className="overflow-hidden">
          <div className="bg-muted/50 px-5 py-3 border-b flex items-center gap-2">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Billing Summary</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Billed Amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unbilled Amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(unbilledAmount)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Paid Amount</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Outstanding</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalOutstanding)}</span>
            </div>
          </div>
        </Card>

        {/* Total Due Amount Card */}
        <Card className="overflow-hidden">
          <div className="bg-muted/50 px-5 py-3 border-b flex items-center gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Total Due Amount</h3>
          </div>
          <div className="p-5">
            <p className="text-3xl font-bold text-foreground mb-4">{formatCurrency(totalDue)}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Advance Paid</span>
                <span className="font-semibold text-green-600">−{formatCurrency(advancePaid)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Payable</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalPayable)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Messages */}
      <div className="max-w-3xl w-full mt-6">
        {/* Billing Clearance Warning */}
        {requireBillingClearance && totalPayable > 0 && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Billing Clearance Required</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Outstanding balance of {formatCurrency(totalPayable)} must be cleared before discharge.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* All Cleared Message */}
        {allCleared && totalPayable <= 0 && (
          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
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
    </div>
  );
}
