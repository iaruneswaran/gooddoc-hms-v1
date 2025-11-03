import { useMemo, useState, useRef, useEffect } from "react";
import { TimelineEvent, EventType } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Beaker, Pill, Activity, Stethoscope, FileText, LogOut, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineViewProps {
  events: TimelineEvent[];
  admissionDate: string;
  dischargeDate: string | null;
  status: "active" | "completed";
  scrollToDate?: string;
}

const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  Admission: <UserPlus className="h-4 w-4" />,
  Laboratory: <Beaker className="h-4 w-4" />,
  Medication: <Pill className="h-4 w-4" />,
  Imaging: <Activity className="h-4 w-4" />,
  Procedure: <Stethoscope className="h-4 w-4" />,
  Notes: <FileText className="h-4 w-4" />,
  Discharge: <LogOut className="h-4 w-4" />,
};

const EVENT_COLORS: Record<EventType, string> = {
  Admission: "border-blue-500 bg-blue-50 text-blue-900",
  Laboratory: "border-purple-500 bg-purple-50 text-purple-900",
  Medication: "border-green-500 bg-green-50 text-green-900",
  Imaging: "border-cyan-500 bg-cyan-50 text-cyan-900",
  Procedure: "border-amber-500 bg-amber-50 text-amber-900",
  Notes: "border-slate-500 bg-slate-50 text-slate-900",
  Discharge: "border-emerald-500 bg-emerald-50 text-emerald-900",
};

export function TimelineView({ events, admissionDate, dischargeDate, status, scrollToDate }: TimelineViewProps) {
  const [viewportStart, setViewportStart] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const VISIBLE_DAYS = 7;

  const today = new Date().toISOString().split("T")[0];

  // Generate all dates
  const allDates = useMemo(() => {
    const start = new Date(admissionDate);
    const end = dischargeDate ? new Date(dischargeDate) : new Date();
    const dates: string[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }
    
    return dates;
  }, [admissionDate, dischargeDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, TimelineEvent[]>();
    
    events.forEach(event => {
      if (!grouped.has(event.date)) {
        grouped.set(event.date, []);
      }
      grouped.get(event.date)!.push(event);
    });
    
    // Sort events within each day by time
    grouped.forEach(dayEvents => {
      dayEvents.sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return grouped;
  }, [events]);

  // Visible dates
  const visibleDates = useMemo(() => {
    return allDates.slice(viewportStart, viewportStart + VISIBLE_DAYS);
  }, [allDates, viewportStart]);

  // Auto-scroll to date
  useEffect(() => {
    if (scrollToDate) {
      const index = allDates.indexOf(scrollToDate);
      if (index !== -1) {
        setViewportStart(Math.max(0, index - 3)); // Center the date
      }
    }
  }, [scrollToDate, allDates]);

  const handlePrevious = () => {
    setViewportStart(Math.max(0, viewportStart - VISIBLE_DAYS));
  };

  const handleNext = () => {
    setViewportStart(Math.min(allDates.length - VISIBLE_DAYS, viewportStart + VISIBLE_DAYS));
  };

  const canGoPrevious = viewportStart > 0;
  const canGoNext = viewportStart + VISIBLE_DAYS < allDates.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Timeline Header */}
      <div className="sticky top-[280px] z-10 bg-background border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Patient Journey Timeline</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              {visibleDates.length > 0 && (
                <>
                  {new Date(visibleDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' — '}
                  {new Date(visibleDates[visibleDates.length - 1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${VISIBLE_DAYS}, minmax(180px, 1fr))` }}>
            {visibleDates.map(date => {
              const dayEvents = eventsByDate.get(date) || [];
              const isToday = date === today;
              const dateObj = new Date(date);
              
              return (
                <div key={date} className="flex flex-col">
                  {/* Day Header */}
                  <div className={cn(
                    "sticky top-0 bg-card border-b border-border pb-2 mb-3",
                    isToday && "bg-blue-50"
                  )}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {isToday && (
                        <Badge variant="default" className="ml-auto text-[10px]">Today</Badge>
                      )}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="space-y-2">
                    {dayEvents.length === 0 ? (
                      <div className="p-3 rounded-md bg-muted/30 border border-dashed border-border">
                        <p className="text-xs text-muted-foreground text-center">No events</p>
                      </div>
                    ) : (
                      <>
                        {dayEvents.slice(0, 4).map(event => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={cn(
                              "w-full p-3 rounded-md border-l-4 text-left transition-all hover:shadow-md",
                              EVENT_COLORS[event.type],
                              event.status === "Scheduled" && "border-dashed"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">{EVENT_ICONS[event.type]}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{event.title}</p>
                                <p className="text-xs opacity-75">{event.time}</p>
                                <p className="text-xs opacity-60 mt-1">{event.dept}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="mt-2 text-[10px]">
                              {event.status}
                            </Badge>
                          </button>
                        ))}
                        {dayEvents.length > 4 && (
                          <button className="w-full p-2 text-xs text-primary hover:bg-accent rounded-md transition-colors">
                            +{dayEvents.length - 4} more events
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
      </div>

      {/* Event Details Drawer */}
      <Drawer open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Event Details</DrawerTitle>
            <DrawerDescription>
              {selectedEvent && `${selectedEvent.date} at ${selectedEvent.time}`}
            </DrawerDescription>
          </DrawerHeader>
          {selectedEvent && (
            <div className="px-4 pb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <div className="flex items-center gap-2 mt-1">
                    {EVENT_ICONS[selectedEvent.type]}
                    <p className="text-base">{selectedEvent.type}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="text-base mt-1">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-base mt-1">{selectedEvent.dept}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className="mt-1">{selectedEvent.status}</Badge>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
