import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

type SpecimenStatus = "not_collected" | "collected" | "received" | "processing" | "completed";

interface SpecimenStatusBarProps {
  status: SpecimenStatus;
  specimenType: string;
  barcode?: string;
  collectedAt?: string;
  receivedAt?: string;
  analyzer?: string;
  collectedBy?: string;
  className?: string;
}

const statusConfig: Record<
  SpecimenStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  not_collected: {
    label: "Not Collected",
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  },
  collected: {
    label: "Collected",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  },
  received: {
    label: "Received",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
  },
  processing: {
    label: "Processing",
    icon: Beaker,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
  },
};

export function SpecimenStatusBar({
  status,
  specimenType,
  barcode,
  collectedAt,
  receivedAt,
  analyzer,
  collectedBy,
  className,
}: SpecimenStatusBarProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-3 rounded-lg border",
        config.color,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant="outline" className={cn("font-medium", config.color)}>
            {config.label}
          </Badge>
        </div>
        <div className="h-4 w-px bg-current opacity-20" />
        <div className="text-sm">
          <span className="font-medium">{specimenType}</span>
          {barcode && (
            <span className="text-muted-foreground ml-2">• {barcode}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {collectedAt && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Collected:</span>
            <span className="font-medium">{collectedAt}</span>
            {collectedBy && (
              <span className="text-muted-foreground">by {collectedBy}</span>
            )}
          </div>
        )}
        {receivedAt && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Received:</span>
            <span className="font-medium">{receivedAt}</span>
          </div>
        )}
        {analyzer && (
          <div className="flex items-center gap-1.5">
            <Beaker className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{analyzer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
