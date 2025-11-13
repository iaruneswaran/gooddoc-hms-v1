import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
}

interface StepHeaderProps {
  steps: Step[];
  currentStep: number;
}

export function StepHeader({ steps, currentStep }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep > step.id
                    ? "bg-green-600 text-white"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center max-w-[100px]",
                  currentStep === step.id ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-muted mx-2 relative top-[-16px]">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: currentStep > step.id ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
