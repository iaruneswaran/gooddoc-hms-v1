import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Shield, ClipboardCheck, FileEdit, AlertTriangle, 
  CheckCircle2, Clock, Eye, Send
} from "lucide-react";
import type { RadiologyOrderStaff } from "@/types/radiology-staff";

interface StatusBadgesProps {
  order: RadiologyOrderStaff;
}

export function StatusBadges({ order }: StatusBadgesProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Safety Status */}
      {order.safetyStatus !== "passed" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/20">
                <Shield className="h-3 w-3 mr-0.5" />
                Safety
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Safety checks incomplete - required before exam
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* QC Status */}
      {order.qcStatus === "pending" && order.status === "Images Available" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-900/20">
                <ClipboardCheck className="h-3 w-3 mr-0.5" />
                QC
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Tech QC pending - complete before interpretation
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {order.qcStatus === "issue_logged" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-0.5" />
                QC Issue
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              QC issue logged - review required
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Report Status */}
      {order.reportStatus === "Submitted" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/20">
                <Eye className="h-3 w-3 mr-0.5" />
                Review
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Awaiting co-sign review
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Critical Finding */}
      {order.hasCriticalFinding && !order.criticalCommunicationLogged && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-0.5" />
                Critical
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Critical finding - communication required before release
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {order.hasCriticalFinding && order.criticalCommunicationLogged && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="h-5 px-1.5 text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                Critical ✓
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Critical communication documented
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Exam Status Badge
export function ExamStatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "Ordered":
      case "Scheduled":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      case "Arrived":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "In Room":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      case "Images Available":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "To Be Read":
      case "For Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Completed":
      case "Released":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge className={getStatusStyles()}>
      {status}
    </Badge>
  );
}
