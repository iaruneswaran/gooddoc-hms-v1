import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import type { ExamPriority } from "@/types/radiology-staff";

interface SLABadgeProps {
  priority: ExamPriority;
  slaDueAt?: string;
  slaMinutesRemaining?: number;
  onEscalate?: () => void;
  variant?: "compact" | "full";
}

export function SLABadge({ 
  priority, 
  slaDueAt, 
  slaMinutesRemaining: initialMinutes, 
  onEscalate,
  variant = "compact" 
}: SLABadgeProps) {
  const [minutesRemaining, setMinutesRemaining] = useState(initialMinutes ?? 0);

  useEffect(() => {
    if (priority !== "STAT" || !slaDueAt) return;
    
    const interval = setInterval(() => {
      setMinutesRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [priority, slaDueAt]);

  if (priority === "Routine") {
    return (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        Routine
      </Badge>
    );
  }

  if (priority === "Urgent") {
    return (
      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
        <Clock className="h-3 w-3 mr-1" />
        Urgent
      </Badge>
    );
  }

  // STAT with SLA countdown
  const isWarning = minutesRemaining <= 10 && minutesRemaining > 0;
  const isBreached = minutesRemaining <= 0;

  const getBadgeStyles = () => {
    if (isBreached) {
      return "bg-destructive text-destructive-foreground animate-pulse";
    }
    if (isWarning) {
      return "bg-amber-500 text-white";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  const formatTime = (mins: number) => {
    if (mins <= 0) return "BREACHED";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${getBadgeStyles()} cursor-default`}>
              <Zap className="h-3 w-3 mr-1" />
              STAT
              {slaDueAt && (
                <span className="ml-1.5 font-mono text-xs">
                  {formatTime(minutesRemaining)}
                </span>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">STAT Priority</p>
            {slaDueAt && (
              <p className="text-xs text-muted-foreground">
                SLA Due: {slaDueAt}
              </p>
            )}
            {isBreached && (
              <p className="text-xs text-destructive font-medium mt-1">
                ⚠ SLA has been breached
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full variant with escalate button
  return (
    <div className="flex items-center gap-2">
      <Badge className={getBadgeStyles()}>
        <Zap className="h-3 w-3 mr-1" />
        STAT
        {slaDueAt && (
          <span className="ml-1.5 font-mono text-xs">
            {formatTime(minutesRemaining)}
          </span>
        )}
      </Badge>
      {(isWarning || isBreached) && onEscalate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-destructive hover:text-destructive"
                onClick={onEscalate}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Escalate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Notify assigned radiologist and supervisor about SLA breach
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
