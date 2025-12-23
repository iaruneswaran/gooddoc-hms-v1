import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Stethoscope, 
  Building2, 
  FileText, 
  AlertTriangle,
  ClipboardList,
  Heart,
  CalendarCheck,
  Clock,
  Phone,
  MapPin
} from "lucide-react";
import { StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY, SAMPLE_PATIENT_SNAPSHOT, SAMPLE_DOCTOR_CLEARANCE } from "@/data/discharge-flow.mock";
import { format } from "date-fns";

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
  const summary = SAMPLE_DISCHARGE_SUMMARY;
  const patient = SAMPLE_PATIENT_SNAPSHOT;
  const clearance = SAMPLE_DOCTOR_CLEARANCE;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
      return dateStr;
    }
  };

  const formatDateOnly = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, dd MMMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const getConditionBadge = (condition: string) => {
    const colors: Record<string, string> = {
      Stable: "bg-green-500/10 text-green-600 border-green-500/30",
      Improved: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      Unchanged: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
      Guarded: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    };
    return colors[condition] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Discharge Summary
            </CardTitle>
            <Badge variant="secondary" className={getConditionBadge(summary.conditionAtDischarge)}>
              Condition at Discharge: {summary.conditionAtDischarge}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Patient Name</span>
                  <p className="font-medium text-foreground">{patient.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">UHID/MRN</span>
                  <p className="font-medium text-foreground">{patient.mrn}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Age/Gender</span>
                  <p className="font-medium text-foreground">{patient.age} Years / {patient.sex === 'M' ? 'Male' : 'Female'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ward/Bed</span>
                  <p className="font-medium text-foreground">{patient.ward} / {patient.bed}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Admission Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Date of Admission</span>
                  <p className="font-medium text-foreground">{formatDate(summary.header.admissionAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date of Discharge</span>
                  <p className="font-medium text-foreground">{summary.header.dischargeAt ? formatDate(summary.header.dischargeAt) : 'Pending'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Attending Physician</span>
                  <p className="font-medium text-foreground">{summary.header.attending}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium text-foreground">{summary.header.service}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Diagnosis Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Diagnosis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Primary Diagnosis</span>
                <p className="font-medium text-foreground mt-1">
                  {summary.diagnoses.primary.text}
                  <span className="text-muted-foreground ml-2">({summary.diagnoses.primary.code})</span>
                </p>
              </div>
              {summary.diagnoses.secondary.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Secondary Diagnoses</span>
                  <div className="mt-1 space-y-1">
                    {summary.diagnoses.secondary.map((diag, idx) => (
                      <p key={idx} className="font-medium text-foreground">
                        {diag.text}
                        <span className="text-muted-foreground ml-2">({diag.code})</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Known Allergies */}
          {summary.allergies.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Known Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {summary.allergies.map((allergy, idx) => (
                    <Badge key={idx} variant="outline" className="bg-destructive/5 text-destructive border-destructive/30">
                      {allergy.substance} ({allergy.reaction})
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Hospital Course / Clinical Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Hospital Course / Clinical Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {summary.hospitalCourse}
          </p>
        </CardContent>
      </Card>

      {/* Procedures Performed */}
      {summary.procedures.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Procedures Performed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">S.No</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Procedure</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Operator</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.procedures.map((proc, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-foreground">{idx + 1}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{proc.name}</td>
                      <td className="py-3 px-4 text-foreground">{formatDate(proc.date)}</td>
                      <td className="py-3 px-4 text-foreground">{proc.operator}</td>
                      <td className="py-3 px-4 text-foreground">{proc.findings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discharge Instructions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Discharge Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Diet</span>
              <p className="font-medium text-foreground mt-1">{summary.instructions.diet}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Activity</span>
              <p className="font-medium text-foreground mt-1">{summary.instructions.activity}</p>
            </div>
            {summary.instructions.woundCare && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Wound Care</span>
                <p className="font-medium text-foreground mt-1">{summary.instructions.woundCare}</p>
              </div>
            )}
          </div>

          {/* Return Precautions */}
          {summary.instructions.returnPrecautions.length > 0 && (
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">SEEK IMMEDIATE MEDICAL ATTENTION IF YOU EXPERIENCE:</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {summary.instructions.returnPrecautions.map((precaution, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    {precaution}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-up Appointment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Follow-up Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Date</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {clearance.followUps.followUpDate 
                    ? formatDateOnly(clearance.followUps.followUpDate) 
                    : 'To be scheduled'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Reason</span>
                <p className="font-medium text-foreground mt-0.5">
                  Post-discharge evaluation and medication review
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Consultant</span>
                <p className="font-medium text-foreground mt-0.5">{summary.header.attending}</p>
              </div>
            </div>
          </div>

          {/* External Referrals if any */}
          {clearance.followUps.externalReferrals && clearance.followUps.externalReferrals.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">External Referrals</h4>
              <div className="space-y-2">
                {clearance.followUps.externalReferrals.map((ref, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{ref.providerName}</p>
                      {ref.notes && <p className="text-xs text-muted-foreground">{ref.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Results / Investigations After Discharge */}
      {(summary.pendingResults.length > 0 || clearance.ordersInstructions.investigationsAfterDischarge.length > 0) && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Pending Investigations / Follow-up Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Test</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Expected Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.pendingResults.map((result, idx) => (
                    <tr key={`pending-${idx}`} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-foreground font-medium">{result.name}</td>
                      <td className="py-3 px-4 text-foreground">{result.expectedDate}</td>
                      <td className="py-3 px-4 text-foreground">{result.responsible}</td>
                    </tr>
                  ))}
                  {clearance.ordersInstructions.investigationsAfterDischarge.map((inv, idx) => (
                    <tr key={`inv-${idx}`} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-foreground font-medium">
                        <Badge variant="outline" className="mr-2 text-xs">{inv.type}</Badge>
                        {inv.name}
                      </td>
                      <td className="py-3 px-4 text-foreground">{inv.dueDate}</td>
                      <td className="py-3 px-4 text-foreground">{summary.header.attending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signatures */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Authorized Signatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summary.signatures.map((sig, idx) => (
              <div key={idx} className="text-center p-4 border border-border rounded-lg">
                <div className="h-12 border-b border-dashed border-muted-foreground/30 mb-2" />
                <p className="font-semibold text-foreground">{sig.name}</p>
                <p className="text-sm text-muted-foreground">{sig.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            This is a computer-generated document. For any queries, please contact the Medical Records Department.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
