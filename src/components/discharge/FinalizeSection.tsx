import { useState } from "react";
import { Bell, FileText, Download, Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PatientDischargeInfo, ClinicalItem, DischargeDocument } from "@/types/discharge";
import { toast } from "sonner";

interface FinalizeSectionProps {
  visitId: string;
  patientInfo: PatientDischargeInfo;
}

export function FinalizeSection({ visitId, patientInfo }: FinalizeSectionProps) {
  const [counselingConfirmed, setCounselingConfirmed] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const [clinicalItems] = useState<ClinicalItem[]>([
    { id: "1", label: "Clinical summary completed", status: "In Progress", owner: "Doctor", canNotify: true },
    { id: "2", label: "Prescriptions prepared/sent", status: "Complete", owner: "Pharmacy", canNotify: false },
    { id: "3", label: "Patient instructions generated", status: "Pending", owner: "Care Team", canNotify: true },
  ]);

  const [documents, setDocuments] = useState<DischargeDocument[]>([
    { id: "1", name: "Discharge Summary", type: "summary", generated: false },
    { id: "2", name: "e-Prescription", type: "prescription", generated: false },
    { id: "3", name: "Final Bill & Receipt", type: "bill", generated: false },
    { id: "4", name: "Patient Instructions", type: "instructions", generated: false },
  ]);

  const allClearancesCleared = false; // Mock - would be computed from clearances
  const billingSettled = false; // Mock - would check outstanding balance = 0
  const allClinicalComplete = clinicalItems.every(i => i.status === 'Complete');
  const allDocsGenerated = documents.every(d => d.generated);

  const canGenerateDocs = allClearancesCleared && billingSettled && allClinicalComplete;
  const canFinalize = allClearancesCleared && billingSettled && allClinicalComplete && allDocsGenerated && counselingConfirmed;

  const handleNotifyOwner = (item: ClinicalItem) => {
    toast.success(`Reminder sent to ${item.owner}`);
  };

  const handleGenerateDocs = () => {
    toast.success("Generating discharge documents...");
    setTimeout(() => {
      setDocuments(prev => prev.map(d => ({ ...d, generated: true, url: `/documents/${d.id}` })));
      toast.success("All documents generated successfully");
    }, 2000);
  };

  const handleFinalize = () => {
    toast.success("Discharge finalized successfully");
    setIsFinalized(true);
  };

  const handleDocAction = (doc: DischargeDocument, action: string) => {
    toast.success(`${action} ${doc.name}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-muted">Pending</Badge>;
      case 'In Progress':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">In Progress</Badge>;
      case 'Complete':
        return <Badge variant="default" className="bg-green-600 text-white">Complete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isFinalized) {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
            ✓ Discharge Finalized
          </h3>
          <p className="text-sm text-green-600 dark:text-green-500">
            Visit {visitId} has been successfully discharged. All documents are available below.
          </p>
        </div>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Discharge Documents</h3>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{doc.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDocAction(doc, "View")}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDocAction(doc, "Print")}>
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDocAction(doc, "Email")}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Complete all prerequisites before finalizing discharge.
      </p>

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Discharge Checklist</h3>
        
        <div className="space-y-3">
          {/* System-computed items */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox checked={allClearancesCleared} disabled />
              <span className="text-sm font-medium">All department clearances received</span>
            </div>
            {!allClearancesCleared && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30">
                3 pending
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox checked={billingSettled} disabled />
              <span className="text-sm font-medium">Billing settled (₹0 outstanding)</span>
            </div>
            {!billingSettled && (
              <Badge variant="outline" className="bg-destructive/20 text-destructive">
                ₹2,000 outstanding
              </Badge>
            )}
          </div>

          {/* Clinical items (read-only for FO) */}
          {clinicalItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox checked={item.status === 'Complete'} disabled />
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">({item.owner})</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                {item.canNotify && item.status !== 'Complete' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNotifyOwner(item)}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Notify Owner
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Documents */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold">Discharge Documents</h3>
          <Button 
            onClick={handleGenerateDocs}
            disabled={!canGenerateDocs || allDocsGenerated}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Documents
          </Button>
        </div>

        {!canGenerateDocs && (
          <p className="text-sm text-muted-foreground">
            Complete all checklist items before generating documents.
          </p>
        )}

        {allDocsGenerated && (
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{doc.name}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                    Generated
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleDocAction(doc, "View")}>
                    View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDocAction(doc, "Print")}>
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDocAction(doc, "Email/SMS")}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finalize */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox 
            id="counseling" 
            checked={counselingConfirmed}
            onCheckedChange={(checked) => setCounselingConfirmed(checked === true)}
          />
          <label 
            htmlFor="counseling" 
            className="text-sm font-medium leading-relaxed cursor-pointer"
          >
            I confirm discharge counseling has been provided and all documents have been shared with patient/attendant.
          </label>
        </div>

        <div className="flex justify-end">
          <Button 
            size="lg"
            onClick={handleFinalize}
            disabled={!canFinalize}
            className="min-w-[200px]"
          >
            Finalize Discharge
          </Button>
        </div>

        {!canFinalize && (
          <p className="text-xs text-muted-foreground text-right">
            Complete all checklist items, generate documents, and confirm counseling to enable finalization.
          </p>
        )}
      </div>
    </div>
  );
}
