import { LucideIcon } from "lucide-react";

interface KpiTileProps {
  label: string;
  amount: string;
  icon?: LucideIcon;
  variant?: "default" | "highlight";
}

export function KpiTile({ label, amount, icon: Icon, variant = "default" }: KpiTileProps) {
  const isHighlight = variant === "highlight";
  
  return (
    <div className={`
      flex items-center gap-3 rounded-lg px-4 py-2.5 min-w-[120px]
      ${isHighlight 
        ? "bg-primary/10 border border-primary/20" 
        : "bg-muted/50 border border-border"
      }
    `}>
      {Icon && (
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-md
          ${isHighlight ? "bg-primary/20" : "bg-background border border-border"}
        `}>
          <Icon className={`w-4 h-4 ${isHighlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className={`text-base font-bold ${isHighlight ? "text-primary" : "text-foreground"}`}>
          ₹{amount}
        </span>
      </div>
    </div>
  );
}
