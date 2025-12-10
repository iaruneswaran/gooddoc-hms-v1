import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  AlertTriangle,
  FileText,
  Pill,
  FlaskConical,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { CopilotResponse, CopilotMode } from "@/types/clinical-copilot";
import { cn } from "@/lib/utils";

interface ClinicalCopilotPanelProps {
  response: CopilotResponse | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: (mode: CopilotMode, request: string) => void;
  onApplyToFields: (data: {
    chiefComplaint: string;
    hpi: string;
    physicalExam: string;
  }) => void;
}

export function ClinicalCopilotPanel({
  response,
  isLoading,
  error,
  onGenerate,
  onApplyToFields,
}: ClinicalCopilotPanelProps) {
  const [customRequest, setCustomRequest] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    warnings: true,
    notes: true,
    orders: false,
    prescriptions: false,
    instructions: false,
  });
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleQuickAction = (mode: CopilotMode, request: string) => {
    onGenerate(mode, request);
  };

  const handleCustomGenerate = () => {
    if (customRequest.trim()) {
      onGenerate("compose_note", customRequest);
      setCustomRequest("");
    }
  };

  const handleApplyNotes = () => {
    if (response?.data?.clinical_note) {
      const note = response.data.clinical_note;
      const physicalExamText = Object.entries(note.physical_exam || {})
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
        .join("\n");

      onApplyToFields({
        chiefComplaint: note.chief_complaint || "",
        hpi: note.hpi || "",
        physicalExam: physicalExamText,
      });
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const data = response?.data;
  const hasWarnings = data?.warnings && data.warnings.length > 0;
  const hasClarifications = data?.audit?.clarifications_needed && data.audit.clarifications_needed.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Clinical Copilot</span>
          <Badge variant="secondary" className="text-xs">AI</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("compose_note", "Write clinical notes for this visit")}
                disabled={isLoading}
              >
                <FileText className="h-3 w-3 mr-1" />
                Compose Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("recommend_orders", "Recommend appropriate lab and imaging orders")}
                disabled={isLoading}
              >
                <FlaskConical className="h-3 w-3 mr-1" />
                Suggest Orders
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("medication_review", "Review medications for safety")}
                disabled={isLoading}
              >
                <Pill className="h-3 w-3 mr-1" />
                Med Review
              </Button>
            </div>
          </div>

          {/* Custom Request */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Custom Request</p>
            <Textarea
              placeholder="e.g., Generate notes for chest pain with suspected angina..."
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <Button
              size="sm"
              onClick={handleCustomGenerate}
              disabled={isLoading || !customRequest.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Response Content */}
          {response && data && (
            <>
              <Separator />

              {/* Warnings Section */}
              {hasWarnings && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("warnings")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-xs font-medium text-destructive">
                        Warnings ({data.warnings.length})
                      </span>
                    </div>
                    {expandedSections.warnings ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.warnings && (
                    <div className="space-y-2">
                      {data.warnings.map((warning, i) => (
                        <div
                          key={i}
                          className={cn(
                            "p-2 rounded-md text-xs",
                            warning.severity === "high"
                              ? "bg-destructive/10 border border-destructive/20"
                              : warning.severity === "medium"
                              ? "bg-amber-500/10 border border-amber-500/20"
                              : "bg-muted"
                          )}
                        >
                          <Badge
                            variant={warning.severity === "high" ? "destructive" : "secondary"}
                            className="text-[10px] mb-1"
                          >
                            {warning.type}
                          </Badge>
                          <p>{warning.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Clinical Notes Section */}
              {data.clinical_note && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("notes")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Clinical Notes</span>
                    </div>
                    {expandedSections.notes ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.notes && (
                    <div className="space-y-3 text-xs">
                      {data.clinical_note.chief_complaint && (
                        <div>
                          <p className="font-medium text-muted-foreground">Chief Complaint</p>
                          <p className="mt-1">{data.clinical_note.chief_complaint}</p>
                        </div>
                      )}
                      {data.clinical_note.hpi && (
                        <div>
                          <p className="font-medium text-muted-foreground">HPI</p>
                          <p className="mt-1 whitespace-pre-wrap">{data.clinical_note.hpi}</p>
                        </div>
                      )}
                      {data.clinical_note.assessment && data.clinical_note.assessment.length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground">Assessment</p>
                          <ul className="mt-1 space-y-1">
                            {data.clinical_note.assessment.map((a, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-muted-foreground">{i + 1}.</span>
                                <span>
                                  {a.problem}
                                  <Badge variant="outline" className="ml-1 text-[10px]">
                                    {a.status}
                                  </Badge>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 flex-1"
                          onClick={handleApplyNotes}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Apply to Fields
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7"
                          onClick={() =>
                            copyToClipboard(
                              `Chief Complaint: ${data.clinical_note.chief_complaint}\n\nHPI: ${data.clinical_note.hpi}`,
                              "notes"
                            )
                          }
                        >
                          {copiedSection === "notes" ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Section */}
              {data.orders && (data.orders.labs.length > 0 || data.orders.radiology.length > 0) && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("orders")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium">
                        Suggested Orders ({data.orders.labs.length + data.orders.radiology.length})
                      </span>
                    </div>
                    {expandedSections.orders ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.orders && (
                    <div className="space-y-2 text-xs">
                      {data.orders.labs.map((lab, i) => (
                        <div key={i} className="p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{lab.test_name}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {lab.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{lab.clinical_question}</p>
                        </div>
                      ))}
                      {data.orders.radiology.map((rad, i) => (
                        <div key={i} className="p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{rad.modality} - {rad.body_part}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {rad.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{rad.clinical_question}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Prescriptions Section */}
              {data.prescriptions && data.prescriptions.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("prescriptions")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium">
                        Prescriptions ({data.prescriptions.length})
                      </span>
                    </div>
                    {expandedSections.prescriptions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.prescriptions && (
                    <div className="space-y-2 text-xs">
                      {data.prescriptions.map((rx, i) => (
                        <div key={i} className="p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{rx.generic_name}</span>
                            {!rx.allergy_check.ok_to_use && (
                              <Badge variant="destructive" className="text-[10px]">
                                Allergy Risk
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {rx.dose} {rx.route} {rx.frequency} × {rx.duration}
                          </p>
                          <p className="text-muted-foreground italic">{rx.instructions}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Clarifications Needed */}
              {hasClarifications && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <p className="text-xs font-medium text-amber-700 mb-2">Clarifications Needed</p>
                  <ul className="text-xs space-y-1">
                    {data.audit.clarifications_needed.map((q, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-600">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
