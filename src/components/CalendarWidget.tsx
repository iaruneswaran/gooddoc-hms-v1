import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
const dates = [2, 3, 4, 5, 6, 7, 8];

export function CalendarWidget() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-2 h-10 items-center">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-muted-foreground font-medium leading-none">{day}</span>
            <button
              className={`w-8 h-6 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                index === 3
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {dates[index]}
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" className="gap-2">
        AUG 2025
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
