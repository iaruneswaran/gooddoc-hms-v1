import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain, 
  RefreshCw,
  AlertCircle,
  Info,
  FileText,
  ClipboardCheck
} from "lucide-react";
import { LabDiagnosticsResponse, ChecklistStatus, BannerType } from "@/types/lab-diagnostics-ai";
import { cn } from "@/lib/utils";

interface DiagnosticsAIPanelProps {
  response: LabDiagnosticsResponse | null;
  isAnalyzing: boolean;
  error: string | null;
  onAnalyze: () => void;
  onApplyNarrative?: (text: string) => void;
  onApplyComments?: (text: string) => void;
}

export function DiagnosticsAIPanel({
  response,
  isAnalyzing,
  error,
  onAnalyze,
  onApplyNarrative,
  onApplyComments,
}: DiagnosticsAIPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "attention":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "block":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getChecklistIcon = (status: ChecklistStatus) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "needs_attention":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBannerStyles = (type: BannerType) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200";
    }
  };

  const getBannerIcon = (type: BannerType) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  if (!response && !isAnalyzing && !error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AI analysis will run automatically when test results are entered.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Processing lab results...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!response) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon(response.summary.status)}
          <span className="text-sm font-medium capitalize">{response.summary.status}</span>
          {response.uiDirectives.blockRelease && (
            <Badge variant="destructive" className="ml-auto text-xs">
              Release Blocked
            </Badge>
          )}
        </div>

        {/* Page Banners */}
        {response.uiDirectives.pageBanners.length > 0 && (
          <div className="space-y-2">
            {response.uiDirectives.pageBanners.map((banner, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-md border text-sm",
                  getBannerStyles(banner.type)
                )}
              >
                {getBannerIcon(banner.type)}
                <span>{banner.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Critical Alerts */}
        {response.criticalAlerts.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Critical Alerts ({response.criticalAlerts.length})
              </h4>
              <ScrollArea className="max-h-32">
                <div className="space-y-2">
                  {response.criticalAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="text-sm p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-900"
                    >
                      <div className="font-medium">{alert.testId}: {alert.value}</div>
                      <div className="text-xs text-muted-foreground">{alert.recommendedAction}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Validation Checklist */}
        {response.validationChecklist.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Validation Checklist
              </h4>
              <div className="space-y-1">
                {response.validationChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {getChecklistIcon(item.status)}
                    <span className={cn(
                      item.status === "needs_attention" && "text-yellow-700 dark:text-yellow-300",
                      item.status === "pending" && "text-muted-foreground"
                    )}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Reflex Suggestions */}
        {response.reflexSuggestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Reflex Tests</h4>
              <div className="space-y-1">
                {response.reflexSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium">{suggestion.testId}</span>
                    <span className="text-muted-foreground"> — {suggestion.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Narrative Draft */}
        {response.narrativeDraft && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Suggested Narrative
                </h4>
                {onApplyNarrative && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onApplyNarrative(response.narrativeDraft)}
                  >
                    Apply
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                {response.narrativeDraft}
              </p>
            </div>
          </>
        )}

        {/* Comments Draft */}
        {response.commentsDraft && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Suggested Comments</h4>
                {onApplyComments && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onApplyComments(response.commentsDraft)}
                  >
                    Apply
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                {response.commentsDraft}
              </p>
            </div>
          </>
        )}

        {/* Audit Info */}
        <Separator />
        <div className="text-xs text-muted-foreground">
          Analyzed at {new Date(response.audit.generatedAt).toLocaleTimeString()} • 
          Engine v{response.audit.engine.rulesVersion}
        </div>
      </CardContent>
    </Card>
  );
}
