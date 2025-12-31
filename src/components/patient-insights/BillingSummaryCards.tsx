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
  balanceAmount,
}: BillingSummaryCardsProps) {
  // Calculate advance balance (advance - used portion)
  const advanceNum = parseFloat(advanceAmount.replace(/[₹,]/g, '')) || 0;
  const collectedNum = parseFloat(collectedAmount.replace(/[₹,]/g, '')) || 0;
  const advanceBalance = `₹${(advanceNum).toLocaleString('en-IN')}`;

  return (
    <div className="flex gap-4">
      {/* Billing Summary Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 px-5 py-4 min-w-[280px] hover:bg-white/15 transition-colors">
        <p className="text-white text-sm pb-2.5 border-b border-white/25 mb-3 tracking-wide">
          Billing Summary
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Billed Amount</span>
            <span className="text-white font-semibold text-base tabular-nums">{billedAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Unbilled Amount</span>
            <span className="text-white/90 font-medium text-sm tabular-nums">{unbilledAmount}</span>
          </div>
        </div>
      </Card>

      {/* Collection Status Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 px-5 py-4 min-w-[280px] hover:bg-white/15 transition-colors">
        <p className="text-white text-sm pb-2.5 border-b border-white/25 mb-3 tracking-wide">
          Collection Status
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Advance Paid</span>
            <span className="text-emerald-300 font-semibold text-base tabular-nums">{advanceAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Advance Balance</span>
            <span className="text-white/90 font-medium text-sm tabular-nums">{advanceBalance}</span>
          </div>
        </div>
      </Card>

      {/* Total Due Amount Card - Hero Card */}
      <Card className="bg-white/15 backdrop-blur-sm border-white/30 px-5 py-4 min-w-[300px] hover:bg-white/20 transition-colors ring-1 ring-white/10">
        <div className="flex items-baseline justify-between pb-2.5 border-b border-white/25 mb-3">
          <p className="text-white text-sm tracking-wide">Total Due Amount</p>
          <span className="text-white font-bold text-2xl tabular-nums">{totalDue}</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Advance Paid</span>
            <span className="text-emerald-300 font-medium text-sm tabular-nums">−{collectedAmount}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/15">
            <span className="text-white font-medium text-xs">Total Payable</span>
            <span className="text-amber-300 font-bold text-lg tabular-nums">{balanceAmount}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}