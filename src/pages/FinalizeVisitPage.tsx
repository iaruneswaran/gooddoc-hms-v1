import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, FileText, Pill, ShieldCheck, ClipboardList, Save, CheckCircle2, AlertTriangle, ArrowRight, Check } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { PageContent } from "@/components/PageContent";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VisitNotesTab } from '@/components/dental/tabs/VisitNotesTab';
import { DiagnosisPlanTab } from '@/components/dental/tabs/DiagnosisPlanTab';
import { PrescriptionsTab } from '@/components/dental/tabs/PrescriptionsTab';
import { DentalFinalizeConfirmationModal } from '@/components/dental/DentalFinalizeConfirmationModal';
import { DentalConsultationProvider, useDentalConsultation } from "@/contexts/DentalConsultationContext";
import { toast } from "sonner";

type Step = 1 | 2 | 3;
type StepStatus = 'pending' | 'in_progress' | 'cleared' | 'finalized';

const steps = [
  { step: 1 as Step, label: "Visit Notes", icon: FileText },
  { step: 2 as Step, label: "Diagnosis & Plan", icon: ClipboardList },
  { step: 3 as Step, label: "Prescriptions", icon: Pill },
];

const getStepStatusText = (status: StepStatus) => {
  const config = {
    pending: { label: "Pending", color: "text-muted-foreground" },
    in_progress: { label: "In Progress", color: "text-blue-600" },
    cleared: { label: "Cleared", color: "text-green-600" },
    finalized: { label: "Finalized", color: "text-primary" },
  };
  return config[status];
};

const FinalizeVisitContent = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { notes, saveConsultation } = useDentalConsultation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [stepStatuses, setStepStatuses] = useState<Record<Step, StepStatus>>({
    1: "in_progress",
    2: "pending",
    3: "pending",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-save logic
  useEffect(() => {
    if (!isDirty) return;
    const timer = setInterval(() => {
      saveConsultation().then(() => {
        toast.success("Changes saved");
        setIsDirty(false);
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [isDirty, saveConsultation]);

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

  const handleNext = async () => {
    await saveConsultation();
    setStepStatuses(prev => ({ ...prev, [currentStep]: 'cleared' }));
    if (currentStep < 3) {
      const nextStep = (currentStep + 1) as Step;
      setCurrentStep(nextStep);
      setStepStatuses(prev => ({ ...prev, [nextStep]: 'in_progress' }));
    }
  };

  const handleConfirmFinalize = async () => {
    setStepStatuses(p => ({...p, 3: "finalized"}));
    toast.success('Visit finalized successfully. Record is now locked.');
    setTimeout(() => navigate('/dental/procedures'), 1500);
  };

  const checks = [
    { label: 'Clinical Notes & Attestation', status: notes.subjective.complaint.length > 5 && notes.subjective.historyReviewed, required: true },
    { label: 'Linked Diagnosis for Procedures', status: true, required: true }, // Mocked
    { label: 'Signed Informed Consent', status: notes.plan.consentSigned, required: true },
    { label: 'Complete Vital Signs', status: notes.objective.vitals.bp.length > 0, required: false }
  ];

  const canFinalize = checks.every(c => !c.required || c.status);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden p-0 gap-0">
        <AppHeader breadcrumbs={["Consultation", "Finalize Visit"]} />
        
        {/* Patient Snapshot Bar with Stepper - Discharge Style */}
        <div className="h-20 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          {/* Left - Back Button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-foreground hover:text-primary shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Back to Chart</span>
          </button>

          {/* Center - Stepper */}
          <div className="flex items-center gap-4">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.step === currentStep;
              const status = stepStatuses[s.step];
              const statusInfo = getStepStatusText(status);

              return (
                <div key={s.step} className="flex items-center gap-4">
                  <button
                    onClick={() => handleStepChange(s.step)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all w-[220px]",
                      isActive && "bg-primary/10 border border-primary/30",
                      !isActive && "hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0",
                        isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                        status === "cleared" && !isActive && "bg-green-500 text-white",
                        status === "finalized" && "bg-primary text-primary-foreground",
                        !isActive && status === "pending" && "bg-muted text-muted-foreground",
                        !isActive && status === "in_progress" && "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                      )}
                    >
                      {status === "cleared" && !isActive ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {s.label}
                      </span>
                      <span className={cn("text-xs", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={cn("w-8 h-px", status === "cleared" || status === "finalized" ? "bg-green-500" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {isDirty && (
              <Button variant="outline" size="sm" onClick={() => { toast.success("Draft saved"); setIsDirty(false); }} className="h-9 px-4">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
            {currentStep < 3 ? (
              <Button className="h-9 px-6 font-medium text-sm" onClick={handleNext}>
                Proceed to Finalize <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="h-9 px-8 font-medium text-sm bg-primary"
                onClick={() => setShowConfirmModal(true)}
              >
                Finalize & Lock Visit
              </Button>
            )}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-hidden bg-white flex flex-col">
          {currentStep === 1 && (
            <div className="flex-1 overflow-hidden">
               <VisitNotesTab />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex-1 overflow-hidden">
               <DiagnosisPlanTab />
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex-1 overflow-hidden">
               <PrescriptionsTab />
            </div>
          )}
        </div>

        <DentalFinalizeConfirmationModal 
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={handleConfirmFinalize}
          patientName="Harish Kalyan"
          mrn="GDID-001"
          encounterId="V25-004"
        />
      </PageContent>
    </div>
  );
};

const FinalizeVisitPage = () => {
  const { patientId } = useParams();
  return (
    <DentalConsultationProvider patientId={patientId || 'unknown'}>
      <FinalizeVisitContent />
    </DentalConsultationProvider>
  );
};

export default FinalizeVisitPage;
