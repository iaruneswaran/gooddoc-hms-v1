import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { TimelineEvent } from "@/types/timeline";
import { format, parseISO, isSameDay } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TimelineViewProps {
  events: TimelineEvent[];
  startDate: string;
  endDate: string;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

export function TimelineView({ 
  events, 
  startDate, 
  endDate,
  activeFilters = [],
  onFilterChange 
}: TimelineViewProps) {
  const [visibleDayStart, setVisibleDayStart] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const DAYS_TO_SHOW = 7;

  // Generate all days between start and end
  const allDays = generateDayRange(startDate, endDate);
  
  // Filter events based on active filters
  const filteredEvents = activeFilters.length > 0
    ? events.filter(e => activeFilters.includes(e.type))
    : events;

  // Group events by date
  const eventsByDate = groupEventsByDate(filteredEvents);

  // Get visible days
  const visibleDays = allDays.slice(visibleDayStart, visibleDayStart + DAYS_TO_SHOW);
  const canScrollLeft = visibleDayStart > 0;
  const canScrollRight = visibleDayStart + DAYS_TO_SHOW < allDays.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setVisibleDayStart(Math.max(0, visibleDayStart - DAYS_TO_SHOW));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setVisibleDayStart(Math.min(allDays.length - DAYS_TO_SHOW, visibleDayStart + DAYS_TO_SHOW));
    }
  };

  // Filter chips
  const eventTypes = ["Admission", "Laboratory", "Medication", "Imaging", "Procedure", "Observation", "Discharge"];

  const toggleFilter = (type: string) => {
    const newFilters = activeFilters.includes(type)
      ? activeFilters.filter(f => f !== type)
      : [...activeFilters, type];
    onFilterChange?.(newFilters);
  };

  const today = new Date();

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          {eventTypes.map(type => (
            <Badge
              key={type}
              variant={activeFilters.includes(type) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(type)}
            >
              {type}
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFilterChange?.([])}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-stretch h-full">
          {/* Left Scroll Button */}
          <div className="flex items-center px-2 border-r border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Day Columns */}
          <div ref={scrollRef} className="flex-1 overflow-auto">
            <div className="flex h-full">
              {visibleDays.map((date) => {
                const dayEvents = eventsByDate[date] || [];
                const isToday = isSameDay(parseISO(date), today);
                const showMore = dayEvents.length > 4;
                const displayEvents = showMore ? dayEvents.slice(0, 3) : dayEvents;

                return (
                  <div
                    key={date}
                    className={`flex-shrink-0 border-r border-border ${isToday ? 'bg-primary/5' : ''}`}
                    style={{ width: `${100 / DAYS_TO_SHOW}%` }}
                  >
                    {/* Day Header */}
                    <div className="sticky top-0 bg-background border-b border-border px-3 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            {format(parseISO(date), "EEE")}
                          </div>
                          <div className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                            {format(parseISO(date), "MMM d")}
                          </div>
                        </div>
                        {isToday && (
                          <Badge variant="default" className="text-xs">Today</Badge>
                        )}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="p-3 space-y-2">
                      {dayEvents.length === 0 ? (
                        <div className="text-xs text-muted-foreground text-center py-4">
                          No events
                        </div>
                      ) : (
                        <>
                          {displayEvents.map(event => (
                            <EventCard
                              key={event.id}
                              type={event.type}
                              title={event.title}
                              time={event.time}
                              dept={event.dept}
                              status={event.status}
                              onClick={() => setSelectedEvent(event)}
                            />
                          ))}
                          {showMore && (
                            <button className="w-full text-xs text-primary hover:underline py-2">
                              +{dayEvents.length - 3} more
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Scroll Button */}
          <div className="flex items-center px-2 border-l border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details Drawer */}
      <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <SheetContent>
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedEvent.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Type</div>
                  <div className="text-sm text-foreground mt-1">{selectedEvent.type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
                  <div className="text-sm text-foreground mt-1">
                    {format(parseISO(selectedEvent.date), "MMM d, yyyy")} at {selectedEvent.time}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Department</div>
                  <div className="text-sm text-foreground mt-1">{selectedEvent.dept}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge>{selectedEvent.status}</Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Helper functions
function generateDayRange(start: string, end: string): string[] {
  const days: string[] = [];
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  let current = startDate;

  while (current <= endDate) {
    days.push(format(current, "yyyy-MM-dd"));
    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function groupEventsByDate(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const grouped: Record<string, TimelineEvent[]> = {};
  
  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });

  // Sort events within each day by time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => a.time.localeCompare(b.time));
  });

  return grouped;
}
