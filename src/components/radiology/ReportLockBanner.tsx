import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lock, Unlock, History, Clock, User, MoreVertical, RefreshCw } from "lucide-react";
import type { ReportLock, ReportVersion } from "@/types/radiology-staff";

interface ReportLockBannerProps {
  reportLock: ReportLock;
  currentUserId: string;
  currentUserName: string;
  onRequestControl: () => void;
  onViewHistory: () => void;
}

export function ReportLockBanner({
  reportLock,
  currentUserId,
  currentUserName,
  onRequestControl,
  onViewHistory,
}: ReportLockBannerProps) {
  const [lastSavedAgo, setLastSavedAgo] = useState<string>("Never");

  useEffect(() => {
    if (!reportLock.lastAutoSavedAt) {
      setLastSavedAgo("Never");
      return;
    }

    const updateLastSaved = () => {
      // In real implementation, calculate relative time
      setLastSavedAgo("Just now");
    };

    updateLastSaved();
    const interval = setInterval(updateLastSaved, 10000);
    return () => clearInterval(interval);
  }, [reportLock.lastAutoSavedAt]);

  const isLockedByCurrentUser = reportLock.lockedBy === currentUserName;
  const isLocked = !!reportLock.lockedBy;

  if (!isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Unlock className="h-4 w-4" />
        <span>Report unlocked</span>
        <span className="text-muted-foreground/60">•</span>
        <span>Version {reportLock.version}</span>
      </div>
    );
  }

  if (isLockedByCurrentUser) {
    return (
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Editing</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Version {reportLock.version}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Auto-saved: {lastSavedAgo}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Save now
                </Button>
              </TooltipTrigger>
              <TooltipContent>Force save draft immediately</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewHistory}>
                <History className="h-4 w-4 mr-2" />
                Version History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Unlock className="h-4 w-4 mr-2" />
                Release Lock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Locked by another user
  return (
    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Locked by {reportLock.lockedBy}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-600">
          <Clock className="h-3 w-3" />
          Since {reportLock.lockedAt}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Read Only</Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={onRequestControl}
              >
                <User className="h-3 w-3 mr-1" />
                Request Control
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Send notification to {reportLock.lockedBy} requesting editing access
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
