import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
const dates = [2, 3, 4, 5, 6, 7, 8];

export function CalendarWidget() {
  return (
    <div className="flex items-center gap-8">
      <Button 
        variant="outline" 
        className="gap-2 h-10 px-4 font-semibold border-border/50 hover:border-border shadow-sm"
      >
        AUG 2025
        <ChevronDown className="w-4 h-4" />
      </Button>
      <div className="flex gap-3">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground/70 font-semibold uppercase tracking-wider">
              {day}
            </span>
            <button
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                index === 3
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : "hover:bg-secondary/80 hover:scale-105"
              }`}
            >
              {dates[index]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
