interface KpiTileProps {
  label: string;
  amount: string;
  variant?: "default" | "light";
}

export function KpiTile({ label, amount, variant = "default" }: KpiTileProps) {
  const isLight = variant === "light";
  
  return (
    <div className={`rounded-lg px-4 py-3 ${
      isLight 
        ? "bg-white/15 backdrop-blur-sm border border-white/20" 
        : "border border-border"
    }`}>
      <p className={`text-xs mb-1 ${isLight ? "text-white/70" : "text-muted-foreground"}`}>{label}</p>
      <p className={`text-lg font-bold ${isLight ? "text-white" : "text-primary"}`}>₹{amount}</p>
    </div>
  );
}
