import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/currency";
import type { SummaryItem } from "@/types/payment-summary";

interface SummaryCardProps {
  item: SummaryItem;
  colorClass: string;
  isActive?: boolean;
  onClick: () => void;
}

export function SummaryCard({
  item,
  colorClass,
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
        "cursor-pointer",
        "border",
        isActive 
          ? `${colorClass} border-current` 
          : "border-border",
        "bg-background"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          {item.delta && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              item.delta.direction === 'up' 
                ? "text-green-600"
                : item.delta.direction === 'down'
                ? "text-red-600"
                : "text-muted-foreground"
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
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            {item.title}
          </h3>
          
          <p className={cn(
            "text-xl font-bold",
            isActive ? colorClass : "text-foreground"
          )}>
            {formatINR(item.amountInPaise)}
          </p>
          
          <div className="text-xs text-muted-foreground">
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
