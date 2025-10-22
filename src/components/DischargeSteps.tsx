import { ClipboardCheck, FileText, Pill, CreditCard, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  icon: React.ElementType;
  label: string;
  value: number;
}

const steps: Step[] = [
  { icon: ClipboardCheck, label: "Clearances", value: 1 },
  { icon: FileText, label: "Clinical Summary", value: 2 },
  { icon: Pill, label: "Medications & Follow-up", value: 3 },
  { icon: CreditCard, label: "Billing & Settlement", value: 4 },
  { icon: CheckCircle, label: "Finalize Discharge", value: 5 },
];

interface DischargeStepsProps {
  currentStep: number;
}

export function DischargeSteps({ currentStep }: DischargeStepsProps) {
  return (
    <div className="flex items-center justify-center gap-8 pb-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.value === currentStep;
        const isPast = step.value < currentStep;
        const isCompleted = isPast;
        
        return (
          <div key={step.value} className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive && "bg-primary border-primary text-primary-foreground",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-border text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="w-32 h-px bg-border -mt-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
