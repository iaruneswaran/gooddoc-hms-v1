import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

export function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Get the start of the week (Monday) for the selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      dayLetter: format(date, "EEEEE"), // Single letter day
      date: date,
      dayNumber: format(date, "dd"),
    };
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsOpen(false);
    }
  };

  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={goToPreviousWeek}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-1 items-center bg-muted/50 rounded-lg px-2 py-1.5">
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day.date)}
            className={cn(
              "flex flex-col items-center gap-0.5 w-9 py-1 rounded-md transition-all",
              isSameDay(day.date, selectedDate)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-background text-foreground"
            )}
          >
            <span className={cn(
              "text-[10px] font-medium leading-none",
              isSameDay(day.date, selectedDate) ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {day.dayLetter}
            </span>
            <span className="text-sm font-semibold leading-none">
              {day.dayNumber}
            </span>
          </button>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={goToNextWeek}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            {format(selectedDate, "MMM yyyy").toUpperCase()}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
