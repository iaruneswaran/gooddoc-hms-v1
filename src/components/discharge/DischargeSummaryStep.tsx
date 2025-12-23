import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  Send,
  AlertTriangle,
  Phone
} from "lucide-react";
import { DischargeSummaryData, StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY, SAMPLE_PATIENT_SNAPSHOT } from "@/data/discharge-flow.mock";
import { toast } from "sonner";

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

interface DischargeSummaryStepProps {
  stepStatus: StepStatus;
  onFinalize: () => void;
  requireBillingClearance: boolean;
  totalOutstanding: number;
}

export default function DischargeSummaryStep({ 
  stepStatus, 
  onFinalize, 
  requireBillingClearance, 
  totalOutstanding 
}: DischargeSummaryStepProps) {
  const [data] = useState<DischargeSummaryData>(SAMPLE_DISCHARGE_SUMMARY);
  const patient = SAMPLE_PATIENT_SNAPSHOT;
  const [confirmReview, setConfirmReview] = useState(false);

  const canFinalize = confirmReview && (!requireBillingClearance || totalOutstanding === 0);

  const handleFinalize = () => {
    toast.success("Discharge finalized successfully!");
    onFinalize();
  };

  const handlePrint = () => toast.info("Preparing discharge summary for print...");
  const handleDownload = () => toast.info("Downloading discharge summary PDF...");

  const lengthOfStay = Math.ceil(
    (new Date(data.header.dischargeAt || new Date()).getTime() - new Date(data.header.admissionAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Discharge Summary</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Printable Summary Card */}
      <Card className="border-border overflow-hidden bg-white print:shadow-none">
        <CardContent className="p-6 space-y-5 text-[13px]">
          
          {/* Hospital Header */}
          <div className="text-center border-b-2 border-primary pb-4">
            <h1 className="text-xl font-bold text-primary tracking-wide">APOLLO HOSPITALS</h1>
            <p className="text-xs text-muted-foreground">21, Greams Lane, Off Greams Road, Chennai - 600006</p>
            <p className="text-xs text-muted-foreground">Phone: 044-28290200 | Emergency: 044-28296000</p>
            <p className="text-sm font-semibold mt-2 tracking-widest">DISCHARGE SUMMARY</p>
          </div>

          {/* Patient Information */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <div className="flex"><span className="w-32 text-muted-foreground">Patient Name:</span><span className="font-medium">{patient.name}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">UHID/MRN:</span><span className="font-medium">{patient.mrn}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Age/Gender:</span><span className="font-medium">{patient.age} Years / {patient.sex === "M" ? "Male" : "Female"}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Blood Group:</span><span className="font-medium">B Positive</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Contact:</span><span className="font-medium">+91 98765 43210</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Address:</span><span className="font-medium">42, Anna Nagar West, Chennai - 600040</span></div>
            </div>
          </div>

          {/* Admission Details */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Admission Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <div className="flex"><span className="w-32 text-muted-foreground">Date of Admission:</span><span className="font-medium">{formatDateTime(data.header.admissionAt)}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Date of Discharge:</span><span className="font-medium">{formatDateTime(data.header.dischargeAt || "")}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Length of Stay:</span><span className="font-medium">{lengthOfStay} Days</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Ward/Bed:</span><span className="font-medium">{patient.ward} / {patient.bed}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Attending Physician:</span><span className="font-medium">{data.header.attending}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Department:</span><span className="font-medium">{data.header.service}</span></div>
              <div className="flex"><span className="w-32 text-muted-foreground">Condition at Discharge:</span><span className="font-medium text-green-600">{data.conditionAtDischarge}</span></div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Diagnosis</h3>
            <div className="space-y-1">
              <div className="flex">
                <span className="w-32 text-muted-foreground">Primary:</span>
                <span className="font-medium">{data.diagnoses.primary.text} ({data.diagnoses.primary.code})</span>
              </div>
              {data.diagnoses.secondary && data.diagnoses.secondary.length > 0 && (
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Secondary:</span>
                  <span className="font-medium">
                    {data.diagnoses.secondary.map((d, i) => (
                      <span key={i}>{d.text} ({d.code}){i < data.diagnoses.secondary!.length - 1 ? ", " : ""}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Allergies */}
          {data.allergies && data.allergies.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="flex items-center gap-1.5 text-red-600 font-semibold text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                KNOWN ALLERGIES
              </div>
              <p className="text-sm">
                {data.allergies.map((a, i) => (
                  <span key={i}>{a.substance} ({a.reaction}){i < data.allergies!.length - 1 ? ", " : ""}</span>
                ))}
              </p>
            </div>
          )}

          {/* History & Hospital Course */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Hospital Course / Clinical Summary</h3>
            <p className="text-justify leading-relaxed">{data.hospitalCourse}</p>
          </div>

          {/* Investigations */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Investigations</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold w-12">S.No</th>
                  <th className="text-left py-1.5 font-semibold">Investigation</th>
                  <th className="text-left py-1.5 font-semibold w-24">Date</th>
                  <th className="text-left py-1.5 font-semibold">Result/Findings</th>
                </tr>
              </thead>
              <tbody>
                {data.investigations?.map((inv, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5">{i + 1}</td>
                    <td className="py-1.5">{inv.name}</td>
                    <td className="py-1.5">{formatDate(inv.date)}</td>
                    <td className="py-1.5">{inv.resultSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Procedures */}
          {data.procedures && data.procedures.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Procedures Performed</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 font-semibold w-12">S.No</th>
                    <th className="text-left py-1.5 font-semibold">Procedure</th>
                    <th className="text-left py-1.5 font-semibold w-24">Date</th>
                    <th className="text-left py-1.5 font-semibold">Operator</th>
                    <th className="text-left py-1.5 font-semibold">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.procedures.map((proc, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-1.5">{i + 1}</td>
                      <td className="py-1.5">{proc.name}</td>
                      <td className="py-1.5">{formatDate(proc.date)}</td>
                      <td className="py-1.5">{proc.operator}</td>
                      <td className="py-1.5">{proc.findings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Discharge Medications */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Discharge Medications</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold w-10">S.No</th>
                  <th className="text-left py-1.5 font-semibold">Medicine</th>
                  <th className="text-left py-1.5 font-semibold w-20">Strength</th>
                  <th className="text-left py-1.5 font-semibold w-20">Dose</th>
                  <th className="text-left py-1.5 font-semibold">Frequency</th>
                  <th className="text-left py-1.5 font-semibold w-20">Duration</th>
                  <th className="text-left py-1.5 font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {data.dischargeMeds?.map((med, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5">{i + 1}</td>
                    <td className="py-1.5 font-medium">{med.name} <span className="text-muted-foreground">({med.brandName})</span></td>
                    <td className="py-1.5">{med.strength}</td>
                    <td className="py-1.5">{med.dose}</td>
                    <td className="py-1.5">{med.frequency}</td>
                    <td className="py-1.5">{med.duration}</td>
                    <td className="py-1.5 text-muted-foreground">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discharge Instructions */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Discharge Instructions</h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Diet: </span>
                <span>{data.instructions?.diet}</span>
              </div>
              <div>
                <span className="font-semibold">Activity: </span>
                <span>{data.instructions?.activity}</span>
              </div>
              {data.instructions?.woundCare && (
                <div>
                  <span className="font-semibold">Wound Care: </span>
                  <span>{data.instructions.woundCare}</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning Signs */}
          {data.instructions?.returnPrecautions && data.instructions.returnPrecautions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="font-semibold text-amber-700 text-xs mb-1.5">⚠️ SEEK IMMEDIATE MEDICAL ATTENTION IF YOU EXPERIENCE:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {data.instructions.returnPrecautions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Follow-up Appointment</h3>
            {data.followUps.followUpDate ? (
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Reason:</span>
                  <span className="font-medium">Post-discharge cardiac evaluation and medication review</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Consultant:</span>
                  <span className="font-medium">{data.header.attending}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No follow-up scheduled</p>
            )}
          </div>

          {/* Pending Results */}
          {data.pendingResults && data.pendingResults.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Pending Investigations</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 font-semibold">Test</th>
                    <th className="text-left py-1.5 font-semibold">Expected Date</th>
                    <th className="text-left py-1.5 font-semibold">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingResults.map((test, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-1.5">{test.name}</td>
                      <td className="py-1.5">{formatDate(test.expectedDate)}</td>
                      <td className="py-1.5">{test.responsible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bill Summary */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-primary border-b border-border pb-1 mb-2">Billing Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/30 rounded p-2">
                <p className="text-muted-foreground text-xs">Total Bill</p>
                <p className="font-bold text-base">{formatCurrency(data.billingSummary.total)}</p>
              </div>
              <div className="bg-green-50 rounded p-2">
                <p className="text-muted-foreground text-xs">Amount Paid</p>
                <p className="font-bold text-base text-green-600">{formatCurrency(data.billingSummary.paid)}</p>
              </div>
              <div className={`rounded p-2 ${data.billingSummary.outstanding > 0 ? "bg-red-50" : "bg-green-50"}`}>
                <p className="text-muted-foreground text-xs">Balance Due</p>
                <p className={`font-bold text-base ${data.billingSummary.outstanding > 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(data.billingSummary.outstanding)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-2">
            <div className="text-center">
              <div className="border-t border-foreground/50 pt-1 mt-8 mx-4">
                <p className="font-semibold">{data.signatures?.[0]?.name || "Dr. Priya Sharma"}</p>
                <p className="text-xs text-muted-foreground">{data.signatures?.[0]?.role || "Resident Doctor"}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-foreground/50 pt-1 mt-8 mx-4">
                <p className="font-semibold">{data.signatures?.[1]?.name || data.header.attending}</p>
                <p className="text-xs text-muted-foreground">{data.signatures?.[1]?.role || "Consultant Physician"}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-muted-foreground pt-3 border-t border-border space-y-0.5">
            <p>This is a computer-generated document. For any queries, please contact the Medical Records Department.</p>
            <div className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" />
              <span>Helpline: 1800-102-0288 (Toll Free) | Email: patientcare@apollohospitals.com</span>
            </div>
            <p className="font-medium">Generated on: {new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </CardContent>
      </Card>

      {/* Finalize */}
      <Card className="border-border print:hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="confirm-review"
              checked={confirmReview}
              onCheckedChange={(checked) => setConfirmReview(checked as boolean)}
            />
            <label htmlFor="confirm-review" className="text-sm cursor-pointer">
              I confirm all documentation is accurate and complete
            </label>
          </div>
          <Button onClick={handleFinalize} disabled={!canFinalize} size="sm" className="gap-1.5">
            <Send className="w-4 h-4" />
            Finalize
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
