import { Search, UserPlus, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  icon: React.ElementType;
  label: string;
  value: string;
}

const steps: Step[] = [
  { icon: Search, label: "Search", value: "search" },
  { icon: UserPlus, label: "Registration", value: "registration" },
  { icon: Calendar, label: "Appointment", value: "appointment" },
  { icon: CreditCard, label: "Payment", value: "payment" },
];

interface BookingStepsProps {
  currentStep: string;
  hideSteps?: string[];
}

export function BookingSteps({ currentStep, hideSteps = [] }: BookingStepsProps) {
  const visibleSteps = steps.filter(step => !hideSteps.includes(step.value));
  const currentIndex = visibleSteps.findIndex(s => s.value === currentStep);

  return (
    <div className="flex items-center justify-center gap-8 pt-4 pb-10">
      {visibleSteps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
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
            
            {index < visibleSteps.length - 1 && (
              <div className="w-32 h-px bg-border -mt-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
