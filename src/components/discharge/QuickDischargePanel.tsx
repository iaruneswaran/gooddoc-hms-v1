import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, RefreshCw, Send, FileText, Printer, Mail } from "lucide-react";
import { PatientDischargeInfo, DepartmentClearance, DischargeDocument } from "@/types/discharge";
import { toast } from "sonner";

interface QuickDischargePanelProps {
  visitId: string;
  patientInfo: PatientDischargeInfo;
}

export function QuickDischargePanel({ visitId, patientInfo }: QuickDischargePanelProps) {
  const [isFinalized, setIsFinalized] = useState(false);
  const [netPayable] = useState(2000); // Mock - in real app, get from billing state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock clearances data
  const [clearances, setClearances] = useState<DepartmentClearance[]>([
    { department: "Doctor", status: "Cleared", notes: "", canMarkCleared: false },
    { department: "Nursing", status: "Cleared", notes: "", canMarkCleared: false },
    { department: "Pharmacy", status: "In Review", notes: "", canMarkCleared: false },
    { department: "Laboratory", status: "Cleared", notes: "", canMarkCleared: false },
    { department: "Radiology", status: "Cleared", notes: "", canMarkCleared: false },
    { department: "Billing", status: "Requested", notes: "", canMarkCleared: false },
    { department: "Insurance/TPA", status: "Cleared", notes: "", canMarkCleared: false },
    { department: "Ward Admin", status: "Pending", notes: "", canMarkCleared: false },
  ]);

  const [clinicalDocs] = useState({
    summary: false,
    prescription: false,
    instructions: false
  });

  const [documents, setDocuments] = useState<DischargeDocument[]>([]);

  // Compute readiness
  const allClearancesCleared = clearances.every(c => c.status === "Cleared");
  const balanceCleared = netPayable <= 0;
  const isReady = allClearancesCleared && balanceCleared;

  // Compute blockers
  const blockers = [];
  if (netPayable > 0) {
    blockers.push({ type: "balance", text: `Outstanding balance: ₹${netPayable.toLocaleString()}` });
  }
  
  const unclearedDepts = clearances.filter(c => c.status !== "Cleared");
  if (unclearedDepts.length > 0) {
    blockers.push({ 
      type: "clearances", 
      text: `Department clearances pending: ${unclearedDepts.map(d => d.department).join(", ")}`,
      departments: unclearedDepts
    });
  }

  if (!clinicalDocs.summary || !clinicalDocs.prescription || !clinicalDocs.instructions) {
    const pending = [];
    if (!clinicalDocs.summary) pending.push("Discharge Summary");
    if (!clinicalDocs.prescription) pending.push("e-Prescription");
    if (!clinicalDocs.instructions) pending.push("Patient Instructions");
    blockers.push({ type: "clinical", text: `Clinical documents pending: ${pending.join(", ")}` });
  }

  const handleRequestAll = () => {
    toast.success("Clearance requests sent to all pending departments");
    // In real app: fire API calls to request clearances
    const updated = clearances.map(c => 
      c.status === "Pending" ? { ...c, status: "Requested" as const } : c
    );
    setClearances(updated);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.info("Status refreshed");
      // In real app: fetch latest clearances from API
    }, 800);
  };

  const handleFinalize = () => {
    if (!isReady) return;
    
    // Auto-generate documents
    const generatedDocs: DischargeDocument[] = [
      { id: "1", name: "Discharge Summary", type: "summary", generated: true, url: "#" },
      { id: "2", name: "e-Prescription", type: "prescription", generated: true, url: "#" },
      { id: "3", name: "Final Bill & Receipt", type: "bill", generated: true, url: "#" },
      { id: "4", name: "Patient Instructions", type: "instructions", generated: true, url: "#" },
    ];
    
    setDocuments(generatedDocs);
    setIsFinalized(true);
    toast.success("Discharge finalized. Documents generated.");
    
    // In real app: log audit action
    console.log("Audit: Discharge finalized by Front Office user at", new Date().toISOString());
  };

  return (
    <Card className="p-6 space-y-6 sticky top-6">
      
      {/* Readiness Status */}
      <div className="text-center">
        {isFinalized ? (
          <Badge className="text-base px-6 py-2 bg-primary text-primary-foreground">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Finalized
          </Badge>
        ) : isReady ? (
          <Badge className="text-base px-6 py-2 bg-green-600 text-white hover:bg-green-700">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Ready to Finalize
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-base px-6 py-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Not Ready
          </Badge>
        )}
      </div>

      {!isFinalized && (
        <>
          <Separator />

          {/* Blockers List */}
          {blockers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Blockers</h3>
              <div className="space-y-2">
                {blockers.map((blocker, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-foreground">{blocker.text}</p>
                      {blocker.type === "clearances" && blocker.departments && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {blocker.departments.map(dept => (
                            <Badge 
                              key={dept.department} 
                              variant={dept.status === "Pending" ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              {dept.department}: {dept.status}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {blockers.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>All prerequisites met</span>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            {unclearedDepts.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleRequestAll}
              >
                <Send className="w-4 h-4 mr-2" />
                Request All Clearances
              </Button>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>

            <Button 
              size="lg"
              className="w-full"
              disabled={!isReady}
              onClick={handleFinalize}
            >
              Finalize Discharge
            </Button>

            {!isReady && (
              <p className="text-xs text-center text-muted-foreground">
                Cannot finalize while outstanding balance &gt; 0
              </p>
            )}
          </div>
        </>
      )}

      {/* Documents Section (after finalization) */}
      {isFinalized && documents.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Documents</h3>
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <FileText className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Printer className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </Card>
  );
}
