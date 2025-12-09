import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, XCircle, AlertCircle, Clock, Shield, 
  Syringe, Heart, AlertTriangle, Activity, MessageSquare,
  User, Send
} from "lucide-react";
import type { SafetyCheck, SafetyGateData, TechQCData, StaffNote, SafetyCheckType } from "@/types/radiology-staff";

interface SafetyGatePanelProps {
  safetyData: SafetyGateData;
  techQCData: TechQCData;
  notes: StaffNote[];
  onSafetyUpdate: (check: SafetyCheck) => void;
  onTechQCUpdate: (data: Partial<TechQCData>) => void;
  onAddNote: (content: string, isUrgent: boolean) => void;
  modality: "CT" | "MRI" | "XR" | "US" | "NM";
}

const SAFETY_CHECK_CONFIG: Record<SafetyCheckType, { label: string; icon: React.ReactNode; required: boolean }> = {
  pregnancy: { label: "Pregnancy Status", icon: <Heart className="h-4 w-4" />, required: true },
  egfr: { label: "eGFR / Creatinine", icon: <Activity className="h-4 w-4" />, required: true },
  allergy: { label: "Contrast Allergy", icon: <AlertTriangle className="h-4 w-4" />, required: true },
  mri_implants: { label: "MRI Implant Screen", icon: <Shield className="h-4 w-4" />, required: false },
  iv_access: { label: "IV Access", icon: <Syringe className="h-4 w-4" />, required: true },
};

export function SafetyGatePanel({
  safetyData,
  techQCData,
  notes,
  onSafetyUpdate,
  onTechQCUpdate,
  onAddNote,
  modality,
}: SafetyGatePanelProps) {
  const [activeTab, setActiveTab] = useState("safety");
  const [newNote, setNewNote] = useState("");
  const [isUrgentNote, setIsUrgentNote] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "waived":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Passed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "waived":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Waived</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim(), isUrgentNote);
      setNewNote("");
      setIsUrgentNote(false);
    }
  };

  // Filter checks based on modality
  const relevantChecks = safetyData.checks.filter(check => {
    if (check.type === "mri_implants") return modality === "MRI";
    return true;
  });

  const passedCount = relevantChecks.filter(c => c.status === "passed" || c.status === "waived").length;
  const totalRequired = relevantChecks.length;
  const allPassed = passedCount === totalRequired;

  return (
    <Card className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader className="pb-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="safety" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Safety
              {!allPassed && (
                <span className="ml-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {totalRequired - passedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="techqc" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Tech QC
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Notes
              {notes.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {notes.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Safety Tab */}
          <TabsContent value="safety" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Safety Checklist</span>
              {getStatusBadge(safetyData.overallStatus)}
            </div>
            <Separator />
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {relevantChecks.map((check) => {
                  const config = SAFETY_CHECK_CONFIG[check.type];
                  return (
                    <div
                      key={check.type}
                      className={`p-3 rounded-lg border ${
                        check.status === "passed" ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800" :
                        check.status === "failed" ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800" :
                        check.status === "waived" ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800" :
                        "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              {config.label}
                              {config.required && <span className="text-destructive">*</span>}
                            </div>
                            {check.value && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {check.value}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {check.verifiedBy && (
                        <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {check.verifiedBy} • {check.verifiedAt}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="pt-2">
              <Button 
                className="w-full" 
                disabled={!allPassed}
                variant={allPassed ? "default" : "secondary"}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {allPassed ? "Pass & Proceed" : "Complete All Checks First"}
              </Button>
              {!allPassed && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Complete all safety checks to enable "In Room" and "Submit for Review"
                </p>
              )}
            </div>
          </TabsContent>

          {/* Tech QC Tab */}
          <TabsContent value="techqc" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Technical Quality Control</span>
              {techQCData.status === "complete" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Complete</Badge>
              ) : techQCData.status === "issue_logged" ? (
                <Badge variant="destructive">Issue Logged</Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
            <Separator />
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {/* Contrast Info */}
                {techQCData.contrast && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Contrast</Label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">Type</div>
                        <div className="font-medium">{techQCData.contrast.type}</div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">Volume</div>
                        <div className="font-medium">{techQCData.contrast.volume} mL</div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">Lot #</div>
                        <div className="font-medium">{techQCData.contrast.lot}</div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">Extravasation</div>
                        <div className={`font-medium ${techQCData.contrast.extravasation ? "text-destructive" : "text-green-600"}`}>
                          {techQCData.contrast.extravasation ? "Yes ⚠" : "No"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dose Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">Radiation Dose</Label>
                    <Badge variant="outline" className="text-[10px]">
                      {techQCData.dose.source}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {techQCData.dose.ctdiVol !== undefined && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">CTDIvol</div>
                        <div className="font-medium">{techQCData.dose.ctdiVol} mGy</div>
                      </div>
                    )}
                    {techQCData.dose.dlp !== undefined && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground">DLP</div>
                        <div className="font-medium">{techQCData.dose.dlp} mGy·cm</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Quality */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Image Quality</Label>
                  <div className="p-2 bg-muted/30 rounded">
                    <div className={`font-medium text-sm ${
                      techQCData.imageQuality === "Excellent" ? "text-green-600" :
                      techQCData.imageQuality === "Adequate" ? "text-foreground" :
                      "text-amber-600"
                    }`}>
                      {techQCData.imageQuality}
                    </div>
                  </div>
                </div>

                {/* Artifact Check */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="artifact" 
                    checked={techQCData.artifact}
                    onCheckedChange={(checked) => onTechQCUpdate({ artifact: !!checked })}
                  />
                  <Label htmlFor="artifact" className="text-sm">Artifact present</Label>
                </div>

                {/* Redo Required */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="redo" 
                    checked={techQCData.redoRequired}
                    onCheckedChange={(checked) => onTechQCUpdate({ redoRequired: !!checked })}
                  />
                  <Label htmlFor="redo" className="text-sm text-destructive">Redo required</Label>
                </div>

                {techQCData.redoRequired && (
                  <Textarea
                    placeholder="Reason for redo..."
                    value={techQCData.redoReason || ""}
                    onChange={(e) => onTechQCUpdate({ redoReason: e.target.value })}
                    rows={2}
                    className="text-sm"
                  />
                )}
              </div>
            </ScrollArea>

            {techQCData.completedBy && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Completed by {techQCData.completedBy} at {techQCData.completedAt}
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={techQCData.status === "complete"}
              variant={techQCData.status === "complete" ? "secondary" : "default"}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete QC
            </Button>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-0 space-y-3">
            <div className="text-sm font-medium">Staff Notes</div>
            <Separator />
            <ScrollArea className="h-[220px]">
              {notes.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No notes yet. Add a note below.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg border ${
                        note.isUrgent ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{note.authorName}</span>
                          <Badge variant="outline" className="text-[10px] h-4">
                            {note.authorRole}
                          </Badge>
                          {note.isUrgent && (
                            <Badge variant="destructive" className="text-[10px] h-4">Urgent</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{note.content}</p>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {note.createdAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="space-y-2 pt-2">
              <Textarea
                placeholder="Add a note... Use @mention to notify staff"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="urgent" 
                    checked={isUrgentNote}
                    onCheckedChange={(checked) => setIsUrgentNote(!!checked)}
                  />
                  <Label htmlFor="urgent" className="text-xs text-destructive">Mark as urgent</Label>
                </div>
                <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
