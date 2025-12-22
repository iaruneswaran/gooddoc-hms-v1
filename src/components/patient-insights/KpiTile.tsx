interface KpiTileProps {
  label: string;
  amount: string;
  variant?: "default" | "light";
  subtitle?: string;
  secondaryLabel?: string;
  secondaryAmount?: string;
}

export function KpiTile({ 
  label, 
  amount, 
  variant = "default", 
  subtitle,
  secondaryLabel,
  secondaryAmount
}: KpiTileProps) {
  const isLight = variant === "light";
  
  return (
    <div className={`rounded-lg px-4 py-2.5 w-[160px] ${
      isLight 
        ? "bg-white/10" 
        : "border border-border bg-card"
    }`}>
      <p className={`text-[11px] font-medium uppercase tracking-wide ${isLight ? "text-white/60" : "text-muted-foreground"}`}>
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-0.5">
        <p className={`text-lg font-semibold ${isLight ? "text-white" : "text-foreground"}`}>
          {amount}
        </p>
        {secondaryAmount && (
          <p className={`text-[10px] ${isLight ? "text-amber-300" : "text-amber-600"}`}>
            +{secondaryAmount}
          </p>
        )}
      </div>
      {subtitle && (
        <p className={`text-[10px] mt-0.5 ${isLight ? "text-white/50" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
