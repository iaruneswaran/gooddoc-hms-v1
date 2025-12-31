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
  variant = "light"
}: BillingSummaryCardsProps) {
  const isLight = variant === "light";
  
  const cardClass = isLight 
    ? "bg-white/10 border-white/20" 
    : "bg-card border-border";
  
  const titleClass = isLight 
    ? "text-white font-semibold text-sm" 
    : "text-foreground font-semibold text-sm";
  
  const labelClass = isLight 
    ? "text-white/70 text-xs" 
    : "text-muted-foreground text-xs";
  
  const valueClass = isLight 
    ? "text-white font-semibold text-sm" 
    : "text-foreground font-semibold text-sm";
  
  const subtitleClass = isLight 
    ? "text-white/50 text-[10px]" 
    : "text-muted-foreground text-[10px]";

  return (
    <div className="flex gap-3">
      {/* Billing Summary Card */}
      <Card className={`${cardClass} px-4 py-3 min-w-[280px]`}>
        <p className={titleClass}>Billing Summary</p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Billed Amount</span>
            <div className="text-right">
              <span className={valueClass}>{billedAmount}</span>
              <p className={subtitleClass}>Invoices sent</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={labelClass}>Unbilled Amount</span>
            <div className="text-right">
              <span className={valueClass}>{unbilledAmount}</span>
              <p className={subtitleClass}>Services used but not invoiced</p>
            </div>
          </div>
          <div className={`flex items-center justify-between pt-1.5 border-t ${isLight ? "border-white/20" : "border-border"}`}>
            <span className={labelClass}>Total Due</span>
            <div className="text-right">
              <span className={valueClass}>{totalDue}</span>
              <p className={subtitleClass}>Billed + Unbilled</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Collection Status Card */}
      <Card className={`${cardClass} px-4 py-3 min-w-[320px]`}>
        <p className={titleClass}>Collection Status</p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Advance Amount</span>
            <div className="text-right">
              <span className={valueClass}>{advanceAmount}</span>
              <p className={subtitleClass}>Paid in advance</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={labelClass}>Collected Amount</span>
            <div className="text-right">
              <span className={valueClass}>{collectedAmount}</span>
              <p className={subtitleClass}>Includes advance + against invoice</p>
            </div>
          </div>
          <div className={`flex items-center justify-between pt-1.5 border-t ${isLight ? "border-white/20" : "border-border"}`}>
            <span className={labelClass}>Balance Amount</span>
            <div className="text-right">
              <span className={valueClass}>{balanceAmount}</span>
              <p className={subtitleClass}>Amount still to be collected</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
