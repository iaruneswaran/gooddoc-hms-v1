import { Card } from "@/components/ui/card";
interface BillingSummaryCardsProps {
  billedAmount: string;
  unbilledAmount: string;
  totalDue: string;
  advanceAmount: string;
  collectedAmount: string;
  balanceAmount: string;
  variant?: "default" | "light";
}
export function BillingSummaryCards({
  billedAmount,
  unbilledAmount,
  totalDue,
  advanceAmount,
  collectedAmount,
  balanceAmount
}: BillingSummaryCardsProps) {
  // Calculate advance balance (advance - used portion)
  const advanceNum = parseFloat(advanceAmount.replace(/[₹,]/g, '')) || 0;
  const collectedNum = parseFloat(collectedAmount.replace(/[₹,]/g, '')) || 0;
  const advanceBalance = `₹${advanceNum.toLocaleString('en-IN')}`;
  return <div className="flex gap-3">
      {/* Billing Summary Card */}
      <Card className="bg-white/10 border-white/20 px-5 py-3 min-w-[260px]">
        <p className="text-white font-medium text-xs pb-2 border-b border-white/30 mb-3">
          Billing Summary
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Billed Amount</span>
            <span className="text-white font-medium text-xs">{billedAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Unbilled Amount</span>
            <span className="text-white font-medium text-xs">{unbilledAmount}</span>
          </div>
        </div>
      </Card>

      {/* Collection Status Card */}
      <Card className="bg-white/10 border-white/20 px-5 py-3 min-w-[260px]">
        <p className="text-white font-medium text-xs pb-2 border-b border-white/30 mb-3">
          Collection Status
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Advance Paid</span>
            <span className="text-white font-medium text-xs">{advanceAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Advance Balance</span>
            <span className="text-white font-medium text-xs">{advanceBalance}</span>
          </div>
        </div>
      </Card>

      {/* Total Due Amount Card */}
      <Card className="bg-white/10 border-white/20 px-5 py-3 min-w-[260px]">
        <div className="flex items-center justify-between pb-2 border-b border-white/30 mb-3">
          <p className="text-white font-medium text-xs">Total Due Amount</p>
          <span className="text-white font-medium text-lg">{totalDue}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Total Paid</span>
            <span className="text-white font-medium text-xs">{collectedAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Total Payable</span>
            <span className="text-white font-medium text-xs">{balanceAmount}</span>
          </div>
        </div>
      </Card>
    </div>;
}