import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiTileProps {
  label: string;
  amount: string;
  variant?: "default" | "light";
  type?: "bill" | "advance" | "collected" | "balance";
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KpiTile({ 
  label, 
  amount, 
  variant = "default", 
  type,
  subtitle,
  trend,
  trendValue
}: KpiTileProps) {
  const isLight = variant === "light";
  
  // Type-based styling
  const getTypeStyles = () => {
    if (isLight) {
      switch (type) {
        case "bill":
          return "border-white/30 bg-white/15";
        case "advance":
          return "border-emerald-300/40 bg-emerald-500/20";
        case "collected":
          return "border-blue-300/40 bg-blue-500/20";
        case "balance":
          return "border-amber-300/40 bg-amber-500/20";
        default:
          return "border-white/20 bg-white/15";
      }
    }
    switch (type) {
      case "bill":
        return "border-border bg-card";
      case "advance":
        return "border-emerald-200 bg-emerald-50";
      case "collected":
        return "border-blue-200 bg-blue-50";
      case "balance":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-border bg-card";
    }
  };

  const getAmountColor = () => {
    if (isLight) return "text-white";
    switch (type) {
      case "bill":
        return "text-foreground";
      case "advance":
        return "text-emerald-600";
      case "collected":
        return "text-blue-600";
      case "balance":
        return "text-amber-600";
      default:
        return "text-primary";
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };
  
  return (
    <div className={`rounded-xl px-4 py-3 backdrop-blur-sm border ${getTypeStyles()} min-w-[140px]`}>
      <p className={`text-xs font-medium mb-1 ${isLight ? "text-white/80" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`text-lg font-bold ${getAmountColor()}`}>
        ₹{amount}
      </p>
      {(subtitle || trendValue) && (
        <div className="flex items-center gap-1.5 mt-1">
          {getTrendIcon()}
          <span className={`text-[10px] ${isLight ? "text-white/60" : "text-muted-foreground"}`}>
            {trendValue || subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
