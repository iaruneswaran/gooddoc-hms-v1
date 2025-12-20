import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type KpiVariant = "outstanding" | "advance" | "bills" | "balance";

interface KpiTileProps {
  label: string;
  amount: string;
  icon: LucideIcon;
  variant: KpiVariant;
  delta?: string;
  tooltipText?: string;
  onClick?: () => void;
}

const variantStyles: Record<KpiVariant, { bg: string; iconBg: string; iconColor: string }> = {
  outstanding: {
    bg: "bg-[hsl(var(--kpi-outstanding-bg))]",
    iconBg: "bg-[hsl(var(--kpi-outstanding-icon)/0.15)]",
    iconColor: "text-[hsl(var(--kpi-outstanding-icon))]",
  },
  advance: {
    bg: "bg-[hsl(var(--kpi-advance-bg))]",
    iconBg: "bg-[hsl(var(--kpi-advance-icon)/0.15)]",
    iconColor: "text-[hsl(var(--kpi-advance-icon))]",
  },
  bills: {
    bg: "bg-[hsl(var(--kpi-bills-bg))]",
    iconBg: "bg-[hsl(var(--kpi-bills-icon)/0.15)]",
    iconColor: "text-[hsl(var(--kpi-bills-icon))]",
  },
  balance: {
    bg: "bg-[hsl(var(--kpi-balance-bg))]",
    iconBg: "bg-[hsl(var(--kpi-balance-icon)/0.15)]",
    iconColor: "text-[hsl(var(--kpi-balance-icon))]",
  },
};

export function KpiTile({ 
  label, 
  amount, 
  icon: Icon, 
  variant,
  delta,
  tooltipText,
  onClick 
}: KpiTileProps) {
  const styles = variantStyles[variant];
  
  const content = (
    <div
      className={cn(
        "relative min-w-[160px] h-[88px] rounded-xl border border-border/60 p-4",
        "shadow-[var(--shadow-s)] transition-all duration-200 ease-out",
        "hover:shadow-[var(--shadow-m)] hover:-translate-y-0.5 hover:border-primary/20",
        "bg-card",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${label} ₹${amount}${tooltipText ? `. ${tooltipText}` : ''}`}
    >
      {/* Top-right icon chip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                "absolute top-3 right-3 h-7 w-7 rounded-full flex items-center justify-center",
                styles.iconBg
              )}
            >
              <Icon className={cn("h-4 w-4", styles.iconColor)} strokeWidth={2} />
            </div>
          </TooltipTrigger>
          {tooltipText && (
            <TooltipContent side="top" className="text-xs">
              {tooltipText}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      {/* Bottom-left label and value stack */}
      <div className="absolute bottom-3 left-4">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-xl font-bold text-[hsl(var(--brand-primary-700))]">
          ₹{amount}
        </p>
        {delta && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {delta}
          </p>
        )}
      </div>
    </div>
  );

  return content;
}
