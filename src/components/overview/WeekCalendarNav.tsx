import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Generate month options for dropdown
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      options.push({
        label: format(date, "MMM yyyy").toUpperCase(),
        date,
      });
    }
    return options;
  }, []);

  const handleMonthSelect = (date: Date) => {
    setWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
    onDateChange(date);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevWeek}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/50 rounded-lg">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayLetter = dayLetters[day.getDay()];
          const dayNum = format(day, "dd");

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`flex flex-col items-center justify-center w-8 h-10 rounded-md text-xs transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-[10px] leading-none font-medium">{dayLetter}</span>
              <span className="text-sm font-semibold mt-0.5">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextWeek}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-2 gap-2 h-9 px-3 text-sm font-medium"
          >
            {monthYear}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {monthOptions.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={() => handleMonthSelect(option.date)}
              className={option.label === monthYear ? "bg-muted" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
