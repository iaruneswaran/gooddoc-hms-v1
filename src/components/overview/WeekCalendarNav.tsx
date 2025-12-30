import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface WeekCalendarNavProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];

export function WeekCalendarNav({ selectedDate, onDateChange }: WeekCalendarNavProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selectedDate, { weekStartsOn: 1 }));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const handlePrevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const monthYear = format(weekDays[3], "MMM yyyy").toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevWeek}
        className="h-7 w-7"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayLetter = dayLetters[day.getDay()];
          const dayNum = format(day, "dd");

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`flex flex-col items-center justify-center w-9 h-12 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-[10px] leading-none mb-0.5">{dayLetter}</span>
              <span className="text-sm font-semibold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextWeek}
        className="h-7 w-7"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <span className="text-sm font-medium text-muted-foreground ml-2">
        {monthYear}
      </span>
    </div>
  );
}
