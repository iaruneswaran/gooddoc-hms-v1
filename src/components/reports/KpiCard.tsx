import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number | string;
  tooltip?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: "currency" | "number" | "days" | "text";
  variant?: "default" | "success" | "danger" | "warning" | "info";
}

export function KpiCard({ title, value, tooltip, trend, format = "currency", variant = "default" }: KpiCardProps) {
  const formattedValue = () => {
    if (format === "currency" && typeof value === "number") {
      return formatCurrency(value);
    }
    if (format === "number" && typeof value === "number") {
      return value.toLocaleString("en-IN");
    }
    if (format === "days" && typeof value === "number") {
      return `${value} days`;
    }
    return value;
  };

  const variantClasses = {
    default: "",
    success: "border-success/20 bg-success/5",
    danger: "border-danger/20 bg-danger/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-info/20 bg-info/5",
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", variantClasses[variant])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3.5 h-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{formattedValue()}</div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-sm",
            trend.isPositive ? "text-success" : "text-danger"
          )}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
