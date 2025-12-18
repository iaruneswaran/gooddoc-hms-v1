import { cn } from "@/lib/utils";

interface Step {
  label: string;
  value: string;
}

const steps: Step[] = [
  { label: "Search", value: "search" },
  { label: "Registration", value: "registration" },
  { label: "Appointment", value: "appointment" },
  { label: "Payment", value: "payment" },
];

interface BookingStepsProps {
  currentStep: string;
  hideSteps?: string[];
}

export function BookingSteps({ currentStep, hideSteps = [] }: BookingStepsProps) {
  const visibleSteps = steps.filter(step => !hideSteps.includes(step.value));
  const currentIndex = visibleSteps.findIndex(s => s.value === currentStep);

  return (
    <div className="flex items-center justify-center">
      {visibleSteps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const stepNumber = index + 1;
        
        return (
          <div key={step.value} className="flex items-center">
            {/* Step with pill background for active */}
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
                isActive && "bg-primary/10 border border-primary"
              )}
            >
              {/* Number Circle */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isPast && "bg-primary text-primary-foreground",
                  !isActive && !isPast && "bg-muted text-muted-foreground"
                )}
              >
                {stepNumber}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isActive && "text-primary",
                  isPast && "text-foreground",
                  !isActive && !isPast && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < visibleSteps.length - 1 && (
              <div className={cn(
                "w-16 h-px mx-2",
                isPast ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}