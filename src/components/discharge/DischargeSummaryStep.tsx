import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  User,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Send,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DischargeSummaryData, StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY } from "@/data/discharge-flow.mock";
import { toast } from "sonner";

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

interface DischargeSummaryStepProps {
  stepStatus: StepStatus;
  onFinalize: () => void;
  requireBillingClearance: boolean;
  totalOutstanding: number;
}

const conditionColors: Record<string, string> = {
  Stable: "bg-green-500/10 text-green-600 border-green-500/30",
  Improved: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  Unchanged: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  Guarded: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function DischargeSummaryStep({ 
  stepStatus, 
  onFinalize, 
  requireBillingClearance, 
  totalOutstanding 
}: DischargeSummaryStepProps) {
  const [data] = useState<DischargeSummaryData>(SAMPLE_DISCHARGE_SUMMARY);
  const [confirmReview, setConfirmReview] = useState(false);

  const canFinalize = confirmReview && (!requireBillingClearance || totalOutstanding === 0);

  const handleFinalize = () => {
    toast.success("Discharge finalized successfully!");
    onFinalize();
  };

  const handlePrint = () => {
    toast.info("Preparing discharge summary for print...");
  };

  const handleDownload = () => {
    toast.info("Downloading discharge summary PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Discharge Summary</h2>
          <p className="text-sm text-muted-foreground">Review and finalize patient discharge</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Document */}
      <Card className="border-border">
        <CardContent className="p-8">
          {/* Hospital Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Discharge Summary</h1>
                <p className="text-sm text-muted-foreground">Apollo Hospitals, Chennai</p>
              </div>
            </div>
            <Badge variant="secondary" className={cn("text-sm px-3 py-1", conditionColors[data.conditionAtDischarge])}>
              {data.conditionAtDischarge}
            </Badge>
          </div>

          {/* Patient & Encounter Info - Compact Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Patient
              </p>
              <p className="font-semibold text-sm">{data.header.patientId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Admission
              </p>
              <p className="font-semibold text-sm">{new Date(data.header.admissionAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Discharge
              </p>
              <p className="font-semibold text-sm">
                {data.header.dischargeAt ? new Date(data.header.dischargeAt).toLocaleDateString() : "Today"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" /> Attending
              </p>
              <p className="font-semibold text-sm">{data.header.attending}</p>
            </div>
          </div>

          {/* Diagnoses - Compact */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              Diagnoses
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-md">
                <Badge variant="default" className="text-xs">Primary</Badge>
                <span className="text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{data.diagnoses.primary.code}</span>
                  {" — "}
                  <span className="font-medium">{data.diagnoses.primary.text}</span>
                </span>
              </div>
              {data.diagnoses.secondary.map((dx, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md">
                  <Badge variant="outline" className="text-xs">Secondary</Badge>
                  <span className="text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{dx.code}</span>
                    {" — "}
                    <span>{dx.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Hospital Course - Compact */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Clinical Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.hospitalCourse}</p>
          </div>

          <Separator className="my-6" />

          {/* Discharge Medications - Clean Table */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Pill className="w-4 h-4 text-primary" />
              Discharge Medications ({data.dischargeMeds.length})
            </h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Medication</TableHead>
                    <TableHead className="font-semibold">Dose</TableHead>
                    <TableHead className="font-semibold">Frequency</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.dischargeMeds.map((med, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="font-medium">{med.name}</TableCell>
                      <TableCell>{med.dose}</TableCell>
                      <TableCell className="text-primary">{med.frequency}</TableCell>
                      <TableCell>{med.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Follow-up - Simple */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              Follow-up
            </h3>
            {data.followUps.followUpDate ? (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg inline-block">
                <p className="text-sm font-semibold text-primary">
                  {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No follow-up scheduled</p>
            )}
          </div>

          {/* Signature Section - Compact */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{data.header.attending}</p>
                  <p className="text-xs text-muted-foreground">Attending Physician</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Prepared on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finalize Section */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox 
                id="confirm-review"
                checked={confirmReview}
                onCheckedChange={(checked) => setConfirmReview(checked as boolean)}
              />
              <label htmlFor="confirm-review" className="text-sm font-medium cursor-pointer">
                I confirm all discharge documentation is accurate and complete
              </label>
            </div>
            <Button 
              onClick={handleFinalize}
              disabled={!canFinalize}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Finalize Discharge
            </Button>
          </div>
          {requireBillingClearance && totalOutstanding > 0 && (
            <p className="text-sm text-amber-600 mt-2">
              Outstanding balance of {formatCurrency(totalOutstanding)} must be cleared before discharge
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
