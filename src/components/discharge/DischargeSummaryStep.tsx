import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Printer,
  Download,
  FileText, 
  AlertTriangle,
  Stethoscope,
  Activity,
  ClipboardList,
  Pill,
  CalendarCheck,
  Phone,
  Heart,
  Utensils,
  User
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
  const printRef = useRef<HTMLDivElement>(null);
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

  const formatShortDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Fallback to print dialog for PDF save
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar - Hidden on print */}
      <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4 print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Discharge Summary</h2>
            <p className="text-xs text-muted-foreground">Print-ready clinical document</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">
            {summary.conditionAtDischarge}
          </Badge>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Print-optimized Document */}
      <div 
        ref={printRef}
        className="bg-white border border-border rounded-lg overflow-hidden print:border-0 print:rounded-none"
      >
        {/* Header Card */}
        <div className="bg-primary text-primary-foreground p-6 print:bg-[#1D3557] print:text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Baines Memorial Hospital</h1>
                <p className="text-sm opacity-85">Excellence in Healthcare</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500 text-white border-0">
                FINAL
              </Badge>
              <span className="text-lg font-semibold">Discharge Summary</span>
            </div>
          </div>
        </div>

        {/* Patient Identity Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wide border-b-2 border-primary pb-1">
                <User className="h-4 w-4" />
                Patient Information
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono">{patient.mrn}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block">Age / Gender</span>
                  <span className="font-medium">{patient.age} Years / {patient.sex === 'M' ? 'Male' : 'Female'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Ward / Bed</span>
                  <span className="font-medium">{patient.ward} / {patient.bed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Contact</span>
                  <span className="font-medium">+91 98765 43210</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Code Status</span>
                  <span className="font-medium">{patient.codeStatus}</span>
                </div>
              </div>
            </div>

            {/* Admission Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wide border-b-2 border-primary pb-1">
                <ClipboardList className="h-4 w-4" />
                Admission Details
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block">Date of Admission</span>
                  <span className="font-medium">{formatDate(summary.header.admissionAt)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Date of Discharge</span>
                  <span className="font-medium">{summary.header.dischargeAt ? formatDate(summary.header.dischargeAt) : 'Pending'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Attending Physician</span>
                  <span className="font-medium">{summary.header.attending}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Service / Department</span>
                  <span className="font-medium">{summary.header.service}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Length of Stay</span>
                  <span className="font-medium">4 Days</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Disposition</span>
                  <span className="font-medium">Home</span>
                </div>
              </div>
            </div>
          </div>

          {/* At a Glance Pills */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/50">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Stethoscope className="h-3 w-3" />
              {summary.diagnoses.primary.text}
            </span>
            {summary.procedures.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                <Activity className="h-3 w-3" />
                {summary.procedures[0].name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Disposition: Home
            </span>
            {clearance.followUps.followUpDate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <CalendarCheck className="h-3 w-3" />
                Follow-up: {formatShortDate(clearance.followUps.followUpDate)}
              </span>
            )}
          </div>
        </div>

        {/* Diagnoses Section */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Stethoscope className="h-5 w-5 text-primary/70" />
              Diagnoses
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 py-2 border-b border-border/50">
                <span className="shrink-0 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-primary-foreground uppercase">
                  Primary
                </span>
                <div className="flex-1">
                  <span className="font-medium">{summary.diagnoses.primary.text}</span>
                  <span className="text-muted-foreground text-xs font-mono ml-2">({summary.diagnoses.primary.code})</span>
                </div>
              </div>
              {summary.diagnoses.secondary.map((diag, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <span className="shrink-0 px-2 py-0.5 text-xs font-semibold rounded bg-muted text-muted-foreground border border-border uppercase">
                    Secondary
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{diag.text}</span>
                    <span className="text-muted-foreground text-xs font-mono ml-2">({diag.code})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Known Allergies */}
        {summary.allergies.length > 0 && (
          <section className="border-b border-border">
            <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
              <h3 className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Known Allergies
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {summary.allergies.map((allergy, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-red-50 text-red-700 border border-red-200"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {allergy.substance} ({allergy.reaction})
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Hospital Course */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <ClipboardList className="h-5 w-5 text-primary/70" />
              Hospital Course / Clinical Summary
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {summary.hospitalCourse}
            </p>
          </div>
        </section>

        {/* Procedures */}
        {summary.procedures.length > 0 && (
          <section className="border-b border-border">
            <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
              <h3 className="flex items-center gap-2 font-semibold text-primary">
                <Activity className="h-5 w-5 text-primary/70" />
                Procedures Performed
              </h3>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Procedure</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Date</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Operator</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.procedures.map((proc, idx) => (
                    <tr key={idx} className="border-b border-border/50 even:bg-muted/30">
                      <td className="py-2 px-3 font-medium">{proc.name}</td>
                      <td className="py-2 px-3 text-nowrap">{formatShortDate(proc.date)}</td>
                      <td className="py-2 px-3">{proc.operator}</td>
                      <td className="py-2 px-3">{proc.findings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Discharge Medications */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Pill className="h-5 w-5 text-primary/70" />
              Discharge Medications
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Medication</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Dose</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Route</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Frequency</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Duration</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground border-b-2 border-border">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {summary.dischargeMeds.map((med, idx) => (
                  <tr key={idx} className="border-b border-border/50 even:bg-muted/30">
                    <td className="py-2 px-3">
                      <span className="font-medium">{med.name}</span>
                      {med.action === 'Start' && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-green-500 text-white rounded uppercase">New</span>
                      )}
                      {med.action === 'Continue' && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded uppercase">Cont</span>
                      )}
                      <div className="text-xs text-muted-foreground">{med.strength}</div>
                    </td>
                    <td className="py-2 px-3">{med.dose}</td>
                    <td className="py-2 px-3">{med.route}</td>
                    <td className="py-2 px-3">{med.frequency}</td>
                    <td className="py-2 px-3 text-nowrap">{med.duration}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Discharge Instructions */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <FileText className="h-5 w-5 text-primary/70" />
              Discharge Instructions
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                  <Utensils className="h-4 w-4" />
                  Diet
                </div>
                <p className="text-sm">{summary.instructions.diet}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </div>
                <p className="text-sm">{summary.instructions.activity}</p>
              </div>
              {summary.instructions.woundCare && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                    <Heart className="h-4 w-4" />
                    Wound Care
                  </div>
                  <p className="text-sm">{summary.instructions.woundCare}</p>
                </div>
              )}
            </div>

            {/* Red Flags */}
            {summary.instructions.returnPrecautions.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-red-700 mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  SEEK IMMEDIATE MEDICAL ATTENTION IF YOU EXPERIENCE:
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {summary.instructions.returnPrecautions.map((precaution, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Follow-up Recommendation */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <CalendarCheck className="h-5 w-5 text-primary/70" />
              Follow-up Recommendation
            </h3>
          </div>
          <div className="p-6">
            <div className="p-5 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed">
                The attending physician, <span className="font-semibold">{summary.header.attending}</span>, recommends a follow-up visit on{" "}
                <span className="font-semibold text-primary">
                  {clearance.followUps.followUpDate 
                    ? formatDateOnly(clearance.followUps.followUpDate) 
                    : '[Date to be scheduled]'}
                </span>{" "}
                for <span className="font-medium">post-discharge evaluation and medication review</span>.
              </p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Please contact the outpatient reception or call the hospital helpline to schedule your appointment.
              </p>
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Phone className="h-5 w-5 text-primary/70" />
              Contacts
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="font-semibold text-primary text-sm">Hospital Helpline</div>
                <div className="text-sm">1800-123-4567</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="font-semibold text-primary text-sm">Attending Physician</div>
                <div className="text-sm">{summary.header.attending}</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="font-semibold text-primary text-sm">Pharmacy</div>
                <div className="text-sm">(555) 123-4570</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="font-semibold text-primary text-sm">Emergency</div>
                <div className="text-sm">(555) 123-4599</div>
              </div>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <section className="border-b border-border">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h3 className="font-semibold text-primary">Authorized Signatures</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {summary.signatures.map((sig, idx) => (
                <div key={idx} className="text-center">
                  <div className="h-12 border-b border-foreground mb-2" />
                  <p className="font-semibold">{sig.name}</p>
                  <p className="text-sm text-muted-foreground">{sig.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <div className="p-6 text-center text-xs text-muted-foreground">
          <div className="p-4 bg-muted/30 rounded-lg border border-border mb-4 text-left">
            <strong className="text-foreground">CONFIDENTIALITY NOTICE:</strong> This document contains Protected Health Information (PHI) under HIPAA regulations. 
            It is intended solely for the use of the individual or entity to whom it is addressed. Unauthorized disclosure, copying, 
            distribution, or use of this information is strictly prohibited.
          </div>
          <p>Baines Memorial Hospital • 1234 Medical Center Dr, Healthcare City, HC 12345 • (555) 123-4567 • www.baineshospital.com</p>
          <p className="mt-2">Document ID: DS-{patient.mrn}-{Date.now()} • Generated: {format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:border-0 {
            border-width: 0 !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          section {
            break-inside: avoid;
          }
          
          table {
            break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}
