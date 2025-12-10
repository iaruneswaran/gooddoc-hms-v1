import React from "react";
import { AlertTriangle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CriticalValue {
  testName: string;
  value: string;
  unit: string;
  refRange: string;
}

interface CriticalBannerProps {
  criticalValues: CriticalValue[];
  onEscalate?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function CriticalBanner({
  criticalValues,
  onEscalate,
  onDismiss,
  className,
}: CriticalBannerProps) {
  if (criticalValues.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4",
        "animate-pulse",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-destructive mb-1">
              Critical Values Detected ({criticalValues.length})
            </h3>
            <div className="space-y-1">
              {criticalValues.map((cv, idx) => (
                <div
                  key={idx}
                  className="text-sm flex items-center gap-2 flex-wrap"
                >
                  <span className="font-medium text-destructive">
                    {cv.testName}:
                  </span>
                  <span className="font-mono font-semibold text-destructive">
                    {cv.value} {cv.unit}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    (Ref: {cv.refRange})
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Critical values require immediate physician notification per policy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onEscalate && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onEscalate}
              className="gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              Escalate
            </Button>
          )}
          {onDismiss && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onDismiss}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
