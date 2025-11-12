import { useState } from "react";
import { 
  QrCode, 
  CreditCard, 
  Banknote, 
  Shield, 
  Clock, 
  Wallet,
  Download,
  Calendar,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "./SummaryCard";
import type { PaymentMethod, SummaryResponse } from "@/types/payment-summary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentsHeaderProps {
  data: SummaryResponse;
  activeFilter?: PaymentMethod | null;
  onFilterChange: (filter: PaymentMethod | null) => void;
  onDateRangeChange?: (range: string) => void;
  onExport?: () => void;
}

const cardConfigs = {
  upi: {
    icon: QrCode,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    gradientClass: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  card: {
    icon: CreditCard,
    colorClass: "text-blue-600 dark:text-blue-400",
    gradientClass: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  cash: {
    icon: Banknote,
    colorClass: "text-green-600 dark:text-green-400",
    gradientClass: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  insurance: {
    icon: Shield,
    colorClass: "text-teal-600 dark:text-teal-400",
    gradientClass: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  outstanding: {
    icon: Clock,
    colorClass: "text-amber-600 dark:text-amber-400",
    gradientClass: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  advance: {
    icon: Wallet,
    colorClass: "text-violet-600 dark:text-violet-400",
    gradientClass: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
};

export function PaymentsHeader({
  data,
  activeFilter,
  onFilterChange,
  onDateRangeChange,
  onExport,
}: PaymentsHeaderProps) {
  const [dateRange, setDateRange] = useState("30d");

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onDateRangeChange?.(value);
  };

  const handleCardClick = (method: PaymentMethod) => {
    if (activeFilter === method) {
      onFilterChange(null);
    } else {
      onFilterChange(method);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Select a date range to filter transactions</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.items.map((item) => {
            const config = cardConfigs[item.id];
            return (
              <SummaryCard
                key={item.id}
                item={item}
                icon={config.icon}
                colorClass={config.colorClass}
                gradientClass={config.gradientClass}
                isActive={activeFilter === item.id}
                onClick={() => handleCardClick(item.id)}
              />
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        {activeFilter && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing transactions for:</span>
            <span className="font-medium text-foreground capitalize">
              {activeFilter}
            </span>
            <button
              onClick={() => onFilterChange(null)}
              className="text-primary hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
