import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock,
  User,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  ClipboardList,
  Receipt,
  Edit3,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DischargeSummaryData, StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY } from "@/data/discharge-flow.mock";
// Format currency helper
const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
import { toast } from "sonner";

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

  const handleShare = () => {
    toast.info("Sharing to patient portal...");
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Discharge Summary</h2>
          <p className="text-sm text-muted-foreground">Review and finalize patient discharge documentation</p>
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share to Portal
          </Button>
        </div>
      </div>

      {/* Summary Document */}
      <Card className="border-border">
        <CardContent className="p-6">
          {/* Hospital Header */}
          <div className="text-center mb-6 pb-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">Discharge Summary</h1>
            <p className="text-muted-foreground">Apollo Hospitals, Chennai</p>
          </div>

          {/* Patient & Encounter Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Patient ID:</span>
                <span className="font-medium">{data.header.patientId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Admission:</span>
                <span className="font-medium">{new Date(data.header.admissionAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Discharge:</span>
                <span className="font-medium">
                  {data.header.dischargeAt ? new Date(data.header.dischargeAt).toLocaleDateString() : "Pending"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Attending:</span>
                <span className="font-medium">{data.header.attending}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{data.header.service}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Condition:</span>
                <Badge variant="secondary" className={conditionColors[data.conditionAtDischarge]}>
                  {data.conditionAtDischarge}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Diagnoses */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Diagnoses
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="default">Primary</Badge>
                <span className="text-sm">
                  <span className="font-mono text-muted-foreground">{data.diagnoses.primary.code}</span>
                  {" — "}
                  <span className="font-medium">{data.diagnoses.primary.text}</span>
                </span>
              </div>
              {data.diagnoses.secondary.map((dx, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Badge variant="secondary">Secondary</Badge>
                  <span className="text-sm">
                    <span className="font-mono text-muted-foreground">{dx.code}</span>
                    {" — "}
                    <span>{dx.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Hospital Course */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Hospital Course</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.hospitalCourse}</p>
          </div>

          <Separator className="my-6" />

          {/* Procedures */}
          {data.procedures.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Procedures Performed</h3>
                <div className="space-y-3">
                  {data.procedures.map((proc, i) => (
                    <Card key={i} className="border-border bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{proc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(proc.date).toLocaleDateString()} • {proc.operator}
                            </p>
                          </div>
                          {proc.anesthesia && (
                            <Badge variant="outline">{proc.anesthesia}</Badge>
                          )}
                        </div>
                        {proc.findings && (
                          <p className="text-sm mt-2"><span className="text-muted-foreground">Findings:</span> {proc.findings}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Investigations */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Key Investigations</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Investigation</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.investigations.map((inv, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {inv.critical && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="font-medium">{inv.name}</span>
                        <Badge variant="outline" className="text-xs">{inv.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                    <TableCell>{inv.resultSummary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-6" />

          {/* Discharge Medications */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Discharge Medications
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Medication</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.dischargeMeds.map((med, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dose}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{med.instructions || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-6" />

          {/* Allergies */}
          {data.allergies.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Known Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.allergies.map((allergy, i) => (
                    <Badge key={i} variant="destructive" className="gap-1">
                      {allergy.substance} ({allergy.reaction})
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Discharge Instructions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Diet</p>
                <p className="text-sm">{data.instructions.diet}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Activity</p>
                <p className="text-sm">{data.instructions.activity}</p>
              </div>
              {data.instructions.woundCare && (
                <div className="p-4 bg-muted/30 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Wound Care</p>
                  <p className="text-sm">{data.instructions.woundCare}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Return Precautions (seek immediate medical attention if you experience):</p>
              <ul className="grid grid-cols-2 gap-2">
                {data.instructions.returnPrecautions.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-3 h-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Follow-ups */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Follow-up Appointments
            </h3>
            <div className="space-y-2">
              {data.followUps.appointments.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{apt.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.provider ? `${apt.provider} • ` : ""}{apt.location}
                    </p>
                  </div>
                  {apt.toBeScheduled ? (
                    <Badge variant="secondary">To be scheduled</Badge>
                  ) : apt.datetime ? (
                    <span className="text-sm font-medium">{new Date(apt.datetime).toLocaleDateString()}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Billing Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Billing Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Bill</p>
                <p className="text-lg font-bold">{formatCurrency(data.billingSummary.total)}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Paid</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(data.billingSummary.paid)}</p>
              </div>
              <div className={cn(
                "p-4 rounded-lg text-center",
                data.billingSummary.outstanding > 0 ? "bg-red-500/10" : "bg-green-500/10"
              )}>
                <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
                <p className={cn(
                  "text-lg font-bold",
                  data.billingSummary.outstanding > 0 ? "text-red-600" : "text-green-600"
                )}>
                  {formatCurrency(data.billingSummary.outstanding)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Signatures */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Signatures</h3>
            <div className="grid grid-cols-2 gap-6">
              {data.signatures.map((sig, i) => (
                <div key={i} className="p-4 border border-dashed border-border rounded-lg">
                  <div className="h-12 flex items-center justify-center text-muted-foreground text-sm italic mb-2">
                    {sig.signedAt ? "Signed electronically" : "Pending signature"}
                  </div>
                  <Separator className="my-2" />
                  <p className="font-medium text-center">{sig.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{sig.role}</p>
                </div>
              ))}
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
                I have reviewed all discharge documentation and confirm it is accurate and complete
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
              Outstanding balance of {formatCurrency(totalOutstanding)} must be cleared before discharge can be finalized
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
