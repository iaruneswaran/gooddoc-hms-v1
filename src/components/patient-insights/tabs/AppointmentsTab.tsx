import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Visit } from "../VisitListItem";
import { format, parseISO } from "date-fns";

interface AppointmentsTabProps {
  selectedVisit: Visit | null;
}

// Mock timeline events data
const mockTimelineEvents = [
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
    status: "Completed",
  },
];

// Helper function to group events by date
function groupEventsByDate(events: typeof mockTimelineEvents): Record<string, typeof mockTimelineEvents> {
  const grouped: Record<string, typeof mockTimelineEvents> = {};
  
  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });

  return grouped;
}

// Helper function to get badge color based on event type
function getEventTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "admission":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "laboratory":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
    case "medication":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "radiology":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
    case "observation":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function AppointmentsTab({ selectedVisit }: AppointmentsTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view appointment details.
        </p>
      </div>
    );
  }

  // Filter events to only show past dates (completed)
  const today = new Date();
  const pastEvents = mockTimelineEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate <= today && event.status === "Completed";
  });

  const eventsByDate = groupEventsByDate(pastEvents);
  const sortedDates = Object.keys(eventsByDate).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No appointment details available for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {sortedDates.map((date) => {
        const events = eventsByDate[date];
        const dateObj = parseISO(date);
        
        return (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-sm font-semibold text-foreground">
                {format(dateObj, "EEE")}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(dateObj, "MMM d")}
              </div>
            </div>

            {/* Events for this date */}
            <div className="space-y-3 pl-6 border-l-2 border-border">
              {events.map((event) => (
                <Card key={event.id} className="p-4 ml-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)} variant="secondary">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{event.time}</span>
                        <span>{event.dept}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
