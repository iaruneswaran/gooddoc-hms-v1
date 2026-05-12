import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  ArrowLeft,
  FileText,
  ClipboardList,
  Pill,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisitNotesTab } from './tabs/VisitNotesTab';
import { DiagnosisPlanTab } from './tabs/DiagnosisPlanTab';
import { PrescriptionsTab } from './tabs/PrescriptionsTab';

interface FinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    hasNotes: boolean;
    hasDiagnosis: boolean;
    hasVitals: boolean;
    consentSigned: boolean;
    completedProcedures: number;
  };
}

type Step = 'notes' | 'diagnosis' | 'rx' | 'finalize';

export const FinalizeModal: React.FC<FinalizeModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  data 
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('notes');

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'notes', label: 'Visit Notes', icon: FileText },
    { id: 'diagnosis', label: 'Diagnosis & Plan', icon: ClipboardList },
    { id: 'rx', label: 'Prescriptions', icon: Pill },
    { id: 'finalize', label: 'Finalize', icon: ShieldCheck },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === 'notes') setCurrentStep('diagnosis');
    else if (currentStep === 'diagnosis') setCurrentStep('rx');
    else if (currentStep === 'rx') setCurrentStep('finalize');
  };

  const handleBack = () => {
    if (currentStep === 'finalize') setCurrentStep('rx');
    else if (currentStep === 'rx') setCurrentStep('diagnosis');
    else if (currentStep === 'diagnosis') setCurrentStep('notes');
  };

  const checks = [
    { label: 'Clinical Notes & Attestation', status: data.hasNotes, required: true },
    { label: 'Linked Diagnosis for Procedures', status: data.hasDiagnosis, required: true },
    { label: 'Signed Informed Consent', status: data.consentSigned, required: true },
    { label: 'Complete Vital Signs', status: data.hasVitals, required: false }
  ];

  const canFinalize = checks.every(c => !c.required || c.status);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[85vh] p-0 overflow-hidden border-none rounded-3xl shadow-2xl flex flex-col">
        {/* Wizard Header */}
        <div className="bg-slate-900 px-8 py-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/10">
                 <Lock size={20} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                   Finalize Visit Wizard
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-medium text-xs mt-0.5">
                   Step {currentIndex + 1} of 4: {steps[currentIndex].label}
                </DialogDescription>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                    currentStep === step.id ? "bg-primary text-white" : i < currentIndex ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-500"
                  )}>
                    {i < currentIndex ? <Check size={12} /> : <step.icon size={12} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-4 h-px bg-slate-800" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-hidden bg-white flex flex-col">
          {currentStep === 'notes' && (
            <div className="flex-1 overflow-hidden">
               <VisitNotesTab />
            </div>
          )}
          {currentStep === 'diagnosis' && (
            <div className="flex-1 overflow-hidden">
               <DiagnosisPlanTab />
            </div>
          )}
          {currentStep === 'rx' && (
            <div className="flex-1 overflow-hidden">
               <PrescriptionsTab />
            </div>
          )}
          {currentStep === 'finalize' && (
            <div className="flex-1 overflow-y-auto p-12 space-y-12">
               <div className="max-w-2xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20">
                        <ShieldCheck size={40} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">Clinical Review & Validation</h3>
                     <p className="text-slate-500 text-sm">Please verify the clinical requirements before locking the record.</p>
                  </div>

                  {/* Pre-check Flags */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Validation Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {checks.map((check, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "p-5 rounded-2xl border transition-all flex items-center justify-between",
                              check.status ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
                            )}
                          >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center",
                                  check.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                  {check.status ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                                </div>
                                <div>
                                  <p className={cn("text-sm font-bold", check.status ? "text-green-800" : "text-red-800")}>{check.label}</p>
                                  {check.required && !check.status && <p className="text-[9px] font-bold uppercase text-red-500 mt-1">Required for Finalization</p>}
                                </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {!canFinalize && (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                      <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
                      <p className="text-sm font-medium text-amber-800 leading-relaxed">
                        Required clinical data is missing. Please go back and complete the visit notes or diagnosis before finalizing this visit.
                      </p>
                    </div>
                  )}

                  {/* Session Summary */}
                  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-12 text-center">
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-slate-900">{data.completedProcedures}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Procedures</p>
                    </div>
                    <div className="space-y-1 border-l border-slate-200">
                        <p className="text-2xl font-bold text-slate-900">Active</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnosis State</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <DialogFooter className="p-8 bg-slate-50 border-t border-slate-200 gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={currentIndex === 0 ? onClose : handleBack} 
            className="h-12 px-8 text-sm font-bold uppercase tracking-wider"
          >
            {currentIndex === 0 ? "Cancel" : "Back"}
          </Button>
          
          {currentStep !== 'finalize' ? (
            <Button 
              onClick={handleNext}
              className="h-12 px-10 text-sm font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10"
            >
              Continue to {steps[currentIndex + 1].label} <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={onConfirm}
              disabled={!canFinalize}
              className="h-12 px-12 text-sm font-bold uppercase tracking-wider shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
            >
              Lock & Finalize Visit <CheckCircle2 size={16} className="ml-2" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
