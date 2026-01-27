import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BillingSummaryCardsProps {
  billedAmount: string;
  unbilledAmount: string;
  totalDue: string;
  advanceAmount: string;
  collectedAmount: string;
  balanceAmount: string;
  patientId?: string;
  patientName?: string;
  admissionId?: string;
  variant?: "default" | "light";
  onTabChange?: (tab: string) => void;
}

export function BillingSummaryCards({
  billedAmount,
  unbilledAmount,
  totalDue,
  advanceAmount,
  collectedAmount,
  balanceAmount,
  patientId,
  patientName = "Patient",
  admissionId = "ADM-2026-001",
  onTabChange,
}: BillingSummaryCardsProps) {
  const navigate = useNavigate();
  
  // Calculate advance balance (advance - used portion)
  const advanceNum = parseFloat(advanceAmount.replace(/[₹,]/g, '')) || 0;
  const advanceBalance = `₹${(advanceNum).toLocaleString('en-IN')}`;

  const handleInterimBillClick = () => {
    if (patientId) {
      const params = new URLSearchParams({
        amount: balanceAmount,
        name: patientName,
        admissionId: admissionId,
        from: 'ip-patients',
      });
      navigate(`/patient-insights/${patientId}/interim-bill?${params.toString()}`);
    }
  };

  const handleProceedPaymentClick = () => {
    if (onTabChange) {
      onTabChange('payments');
    }
  };

  return (
    <div className="flex gap-3">
      {/* Billing Summary Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 px-4 py-3 min-w-[200px] hover:bg-white/15 transition-colors">
        <p className="text-white text-xs pb-2 border-b border-white/25 mb-2">
          Billing Summary
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70 text-[11px]">Billed Amount</span>
            <span className="text-white font-medium text-sm tabular-nums">{billedAmount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70 text-[11px]">Unbilled Amount</span>
            <span className="text-white/90 text-xs tabular-nums">{unbilledAmount}</span>
          </div>
        </div>
      </Card>

      {/* Collection Status Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 px-4 py-3 min-w-[200px] hover:bg-white/15 transition-colors">
        <p className="text-white text-xs pb-2 border-b border-white/25 mb-2">
          Collection Status
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70 text-[11px]">Advance Paid</span>
            <span className="text-emerald-300 font-medium text-sm tabular-nums">{advanceAmount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70 text-[11px]">Advance Balance</span>
            <span className="text-white/90 text-xs tabular-nums">{advanceBalance}</span>
          </div>
        </div>
      </Card>

      {/* Total Due Amount Card - Hero Card */}
      <Card 
        className="bg-white/15 backdrop-blur-sm border-white/30 px-4 py-3 min-w-[280px] hover:bg-white/20 transition-colors ring-1 ring-white/10"
        data-testid="card-total-payable"
      >
        <div className="flex items-baseline justify-between pb-2 border-b border-white/25 mb-2">
          <p className="text-white text-xs">Total Due Amount</p>
          <span className="text-white font-semibold text-base tabular-nums">{totalDue}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70 text-[11px]">Total Paid</span>
            <span className="text-emerald-300 text-xs tabular-nums">−{collectedAmount}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/15">
            <span className="text-white text-[11px]">Total Payable</span>
            <span className="text-amber-300 font-semibold text-sm tabular-nums">{balanceAmount}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-3 pt-2 border-t border-white/15">
          <Button
            size="sm"
            variant="outline"
            onClick={handleInterimBillClick}
            className="flex-1 h-7 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
          >
            Interim Bill
          </Button>
          <Button
            size="sm"
            onClick={handleProceedPaymentClick}
            className="flex-1 h-7 text-xs bg-white text-slate-900 hover:bg-white/90"
          >
            Proceed Payment
          </Button>
        </div>
      </Card>
    </div>
  );
}
