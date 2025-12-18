import { useState } from "react";
import { TimelineView } from "@/components/timeline/TimelineView";
import { TimelineEvent } from "@/types/timeline";

interface TimelineTabProps {
  patientId?: string;
}

export function TimelineTab({ patientId }: TimelineTabProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Mock timeline events
  const events: TimelineEvent[] = [
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
  const endDate = new Date().toISOString().split('T')[0];

  return (
    <div className="h-[calc(100vh-320px)]">
      <TimelineView
        events={events}
        startDate={startDate}
        endDate={endDate}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />
    </div>
  );
}
