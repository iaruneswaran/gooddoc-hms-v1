import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/currency";
import type { SummaryItem } from "@/types/payment-summary";

interface SummaryCardProps {
  item: SummaryItem;
  icon: LucideIcon;
  colorClass: string;
  gradientClass: string;
  isActive?: boolean;
  onClick: () => void;
}

export function SummaryCard({
  item,
  icon: Icon,
  colorClass,
  gradientClass,
  isActive = false,
  onClick,
}: SummaryCardProps) {
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Filter by ${item.title}. Amount: ${formatINR(item.amountInPaise)}${item.transactionCount ? `, ${item.transactionCount} transactions` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive 
          ? `${colorClass} border-current shadow-lg` 
          : "border-border hover:border-primary/30",
        "group"
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
        gradientClass
      )} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg transition-colors",
            isActive ? "bg-current/10" : "bg-muted",
            "group-hover:bg-current/10"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? colorClass : "text-muted-foreground",
              "group-hover:" + colorClass
            )} />
          </div>
          
          {item.delta && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
              item.delta.direction === 'up' 
                ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                : item.delta.direction === 'down'
                ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                : "text-muted-foreground bg-muted"
            )}>
              {item.delta.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : item.delta.direction === 'down' ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              <span>{item.delta.pct > 0 ? '+' : ''}{item.delta.pct}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {item.title}
          </h3>
          
          <p className={cn(
            "text-2xl font-bold transition-colors",
            isActive ? colorClass : "text-foreground"
          )}>
            {formatINR(item.amountInPaise)}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {item.transactionCount !== undefined ? (
              <span>{item.transactionCount} txns</span>
            ) : item.statusBreakdown ? (
              <span>
                {item.statusBreakdown.approved ? `Approved: ${formatINR(item.statusBreakdown.approved)}` : ''}
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
