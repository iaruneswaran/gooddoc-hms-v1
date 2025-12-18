import { useState } from "react";
import { format, parseISO, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: string;
  title: string;
  dept: string;
  status: string;
}

// Mock timeline data
const timelineEvents: TimelineEvent[] = [
  {
    id: "e1",
    date: "2025-11-01",
    time: "09:32",
    type: "Admission",
    title: "ER → Ward 3B",
    dept: "Admission",
    status: "Completed",
  },
  {
    id: "e2",
    date: "2025-11-02",
    time: "08:10",
    type: "Laboratory",
    title: "CBC + CMP",
    dept: "Lab",
    status: "Completed",
  },
  {
    id: "e3",
    date: "2025-11-02",
    time: "14:15",
    type: "Medication",
    title: "Ceftriaxone 1 g IV",
    dept: "Pharmacy",
    status: "Completed",
  },
  {
    id: "e4",
    date: "2025-11-03",
    time: "10:00",
    type: "Radiology",
    title: "Chest X‑ray",
    dept: "Radiology",
    status: "Completed",
  },
  {
    id: "e5",
    date: "2025-11-04",
    time: "16:00",
    type: "Observation",
    title: "Discharge planning meeting",
    dept: "Ward 3B",
    status: "Scheduled",
  },
];

const startDate = "2025-11-01";
const endDate = "2025-11-07";

export function TimelineTab() {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  const getEventsForDate = (date: Date) => {
    return timelineEvents.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );
  };

  return (
    <div className="p-6">
      <div className="space-y-0">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div key={day.toISOString()} className="flex">
              {/* Date Column */}
              <div className="w-[100px] flex-shrink-0 pr-4 text-right">
                <p className="text-xs text-muted-foreground font-medium">
                  {format(day, "EEE")}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {format(day, "MMM d")}
                </p>
              </div>

              {/* Timeline Line & Events */}
              <div className="flex-1 relative pl-6 pb-6 border-l-2 border-border">
                {hasEvents ? (
                  <div className="space-y-3">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="relative"
                      >
                        {/* Dot on timeline */}
                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        
                        {/* Event Card */}
                        <div className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {event.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {event.dept}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {event.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Empty dot */}
                    <div className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground italic">
                      No events
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
