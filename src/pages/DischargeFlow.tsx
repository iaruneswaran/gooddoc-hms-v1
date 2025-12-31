import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Receipt, Stethoscope, FileText, Save, AlertTriangle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { toast } from "sonner";
import PendingBillStep from "@/components/discharge/PendingBillStep";
import DoctorClearanceStep from "@/components/discharge/DoctorClearanceStep";
import DischargeSummaryStep from "@/components/discharge/DischargeSummaryStep";
import {
  SAMPLE_PENDING_BILLS,
  SAMPLE_PATIENT_SNAPSHOT,
  DEFAULT_DISCHARGE_CONFIG,
} from "@/data/discharge-flow.mock";
import { PendingBill, StepStatus } from "@/types/discharge-flow";

type Step = 1 | 2 | 3;

const steps = [
  { step: 1 as Step, label: "Pending Bill", icon: Receipt },
  { step: 2 as Step, label: "Doctor Clearance", icon: Stethoscope },
  { step: 3 as Step, label: "Discharge Summary", icon: FileText },
];

const getStepStatusBadge = (status: StepStatus) => {
  const config = {
    pending: { label: "Pending", className: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
    in_progress: { label: "In Progress", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    cleared: { label: "Cleared", className: "bg-green-500/10 text-green-600 border-green-500/30" },
    finalized: { label: "Finalized", className: "bg-primary/10 text-primary border-primary/30" },
  };
  const { label, className } = config[status];
  return <Badge variant="secondary" className={className}>{label}</Badge>;
};

export default function DischargeFlow() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { isCollapsed } = useSidebarContext();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [bills, setBills] = useState<PendingBill[]>(SAMPLE_PENDING_BILLS);
  const [stepStatuses, setStepStatuses] = useState<Record<Step, StepStatus>>({
    1: "in_progress",
    2: "pending",
    3: "pending",
  });
  const [isDirty, setIsDirty] = useState(false);

  const patient = SAMPLE_PATIENT_SNAPSHOT;
  const config = DEFAULT_DISCHARGE_CONFIG;

  // Autosave every 10 seconds
  useEffect(() => {
    if (!isDirty) return;
    const timer = setInterval(() => {
      toast.success("Draft saved automatically");
      setIsDirty(false);
    }, 10000);
    return () => clearInterval(timer);
  }, [isDirty]);

  const handleBillsUpdated = (updatedBills: PendingBill[]) => {
    setBills(updatedBills);
    setIsDirty(true);
    
    const totalOutstanding = updatedBills.reduce((sum, b) => sum + b.outstandingAmount, 0);
    if (totalOutstanding === 0) {
      setStepStatuses((prev) => ({ ...prev, 1: "cleared" }));
      toast.success("All bills cleared!");
    }
  };

  const handleStepChange = (step: Step) => {
    if (step > currentStep && stepStatuses[currentStep] === "pending") {
      toast.error("Please complete the current step first");
      return;
    }
    setCurrentStep(step);
    if (stepStatuses[step] === "pending") {
      setStepStatuses((prev) => ({ ...prev, [step]: "in_progress" }));
    }
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}?from=ip-patients`);
  };

  const totalOutstanding = bills.reduce((sum, b) => sum + b.outstandingAmount, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Patients", patient.name, "Discharge"]} />

        {/* Patient Snapshot Bar with Stepper */}
        <div className="h-20 bg-card border-b border-border flex items-center justify-between px-6">
          {/* Left - Back Button */}
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-foreground hover:text-primary shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Back to Patient</span>
          </button>

          {/* Center - Stepper */}
          <div className="flex items-center gap-6">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.step === currentStep;
              const status = stepStatuses[s.step];

              return (
                <div key={s.step} className="flex items-center gap-6">
                  <button
                    onClick={() => handleStepChange(s.step)}
                    className="flex items-center gap-2 group"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                        isActive && "bg-primary border-primary text-primary-foreground",
                        status === "cleared" && "bg-green-500 border-green-500 text-white",
                        status === "finalized" && "bg-primary border-primary text-primary-foreground",
                        !isActive && status === "pending" && "border-border text-muted-foreground group-hover:border-primary/50",
                        !isActive && status === "in_progress" && "border-blue-500 text-blue-500"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {s.label}
                      </span>
                      {getStepStatusBadge(status)}
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={cn("w-12 h-0.5", status === "cleared" || status === "finalized" ? "bg-green-500" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {isDirty && (
              <Button variant="outline" size="sm" onClick={() => { toast.success("Draft saved"); setIsDirty(false); }}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
            <Button 
              className="h-10"
              disabled={stepStatuses[1] !== "cleared" || stepStatuses[2] !== "cleared"}
              onClick={() => {
                setStepStatuses(p => ({...p, 3: "finalized"}));
                toast.success("Patient discharged successfully!");
                setTimeout(() => navigate(`/patient-insights/${patientId}?from=ip-patients`), 1500);
              }}
            >
              Proceed to Discharge
            </Button>
          </div>
        </div>

        {/* Step Content */}
        <main className="p-6">
          {currentStep === 1 && (
            <PendingBillStep
              bills={bills}
              patientName={patient.name}
              mrn={patient.mrn}
              encounterId="E-98765"
              stepStatus={stepStatuses[1]}
              onBillsUpdated={handleBillsUpdated}
              onStepComplete={() => handleStepChange(2)}
              requireBillingClearance={config.requireBillingClearanceToFinalize}
            />
          )}
          {currentStep === 2 && (
            <DoctorClearanceStep
              stepStatus={stepStatuses[2]}
              onStepComplete={() => { setStepStatuses(p => ({...p, 2: "cleared"})); handleStepChange(3); }}
            />
          )}
          {currentStep === 3 && (
            <DischargeSummaryStep
              stepStatus={stepStatuses[3]}
              onFinalize={() => { setStepStatuses(p => ({...p, 3: "finalized"})); }}
              requireBillingClearance={config.requireBillingClearanceToFinalize}
              totalOutstanding={totalOutstanding}
            />
          )}
        </main>
      </PageContent>
    </div>
  );
}
