interface KpiTileProps {
  label: string;
  amount: string;
  variant?: "default" | "light";
  subtitle?: string;
}

export function KpiTile({ 
  label, 
  amount, 
  variant = "default", 
  subtitle
}: KpiTileProps) {
  const isLight = variant === "light";
  
  return (
    <div className={`rounded-xl px-5 py-3 backdrop-blur-sm border min-w-[160px] ${
      isLight 
        ? "border-white/25 bg-white/15" 
        : "border-border bg-card"
    }`}>
      <p className={`text-xs font-medium mb-1 ${isLight ? "text-white/70" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`text-xl font-bold ${isLight ? "text-white" : "text-foreground"}`}>
        ₹{amount}
      </p>
      {subtitle && (
        <p className={`text-[11px] mt-1 ${isLight ? "text-white/60" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
