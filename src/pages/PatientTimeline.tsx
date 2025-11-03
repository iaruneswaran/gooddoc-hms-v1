import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { VisitHeader } from "@/components/timeline/VisitHeader";
import { ActivityHeatmap } from "@/components/timeline/ActivityHeatmap";
import { TimelineView } from "@/components/timeline/TimelineView";
import { PatientJourney, DailyCount, TimelineEvent, EventType, EventStatus } from "@/types/timeline";

const PatientTimeline = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const { visitId, patient } = location.state || {};
  
  const [scrollToDate, setScrollToDate] = useState<string | undefined>(undefined);

  // Mock patient journey data
  const mockJourney: PatientJourney = {
    visitId: visitId || "VST-205431",
    status: "active",
    admissionDate: "2025-11-01",
    dischargeDate: null,
    patient: patient || {
      name: "Harish Kalyan",
      mrn: "883920",
      age: 44,
      sex: "M",
    },
    events: [
      {
        id: "e1",
        date: "2025-11-01",
        time: "09:32",
        type: "Admission",
        title: "Admitted to Ward 3B",
        dept: "ER → Ward 3B",
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
        title: "Ceftriaxone 1g IV",
        dept: "Pharmacy",
        status: "Completed",
      },
      {
        id: "e4",
        date: "2025-11-02",
        time: "16:30",
        type: "Notes",
        title: "Nurse Assessment",
        dept: "Ward 3B",
        status: "Completed",
      },
      {
        id: "e5",
        date: "2025-11-03",
        time: "07:00",
        type: "Laboratory",
        title: "Blood Culture",
        dept: "Lab",
        status: "Completed",
      },
      {
        id: "e6",
        date: "2025-11-03",
        time: "10:00",
        type: "Imaging",
        title: "Chest X-ray",
        dept: "Radiology",
        status: "Completed",
      },
      {
        id: "e7",
        date: "2025-11-03",
        time: "15:00",
        type: "Medication",
        title: "Paracetamol 500mg",
        dept: "Pharmacy",
        status: "Completed",
      },
      {
        id: "e8",
        date: "2025-11-04",
        time: "09:00",
        type: "Laboratory",
        title: "Electrolyte Panel",
        dept: "Lab",
        status: "Scheduled",
      },
      {
        id: "e9",
        date: "2025-11-04",
        time: "11:00",
        type: "Procedure",
        title: "Minor Wound Dressing",
        dept: "Ward 3B",
        status: "Scheduled",
      },
      {
        id: "e10",
        date: "2025-11-05",
        time: "08:00",
        type: "Laboratory",
        title: "Complete Blood Count",
        dept: "Lab",
        status: "Planned",
      },
      {
        id: "e11",
        date: "2025-11-05",
        time: "14:00",
        type: "Imaging",
        title: "Abdominal Ultrasound",
        dept: "Radiology",
        status: "Planned",
      },
      {
        id: "e12",
        date: "2025-11-06",
        time: "10:00",
        type: "Discharge",
        title: "Discharge Planning Meeting",
        dept: "Ward 3B",
        status: "Planned",
      },
    ],
    dailyCounts: [],
  };

  // Calculate daily counts from events
  const calculateDailyCounts = (events: TimelineEvent[]): DailyCount[] => {
    const countsMap = new Map<string, DailyCount>();
    
    events.forEach(event => {
      if (!countsMap.has(event.date)) {
        countsMap.set(event.date, {
          date: event.date,
          total: 0,
          byType: {
            Admission: 0,
            Laboratory: 0,
            Medication: 0,
            Imaging: 0,
            Procedure: 0,
            Notes: 0,
            Discharge: 0,
          },
          byStatus: {
            Completed: 0,
            Scheduled: 0,
            Planned: 0,
            Missed: 0,
            Cancelled: 0,
          },
        });
      }
      
      const count = countsMap.get(event.date)!;
      count.total++;
      count.byType[event.type]++;
      count.byStatus[event.status]++;
    });
    
    return Array.from(countsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  };

  const dailyCounts = calculateDailyCounts(mockJourney.events);

  const handleDateClick = (date: string) => {
    setScrollToDate(date);
  };

  const handleRangeSelect = (startDate: string, endDate: string) => {
    // For simplicity, just scroll to the start date
    setScrollToDate(startDate);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px] flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={["Patient Insights", "Timeline"]} />
        
        {/* Visit Header */}
        <VisitHeader
          visitId={mockJourney.visitId}
          status={mockJourney.status}
          patient={mockJourney.patient}
          patientId={patientId}
        />

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Activity Heatmap */}
          <ActivityHeatmap
            dailyCounts={dailyCounts}
            admissionDate={mockJourney.admissionDate}
            dischargeDate={mockJourney.dischargeDate}
            onDateClick={handleDateClick}
            onRangeSelect={handleRangeSelect}
          />

          {/* Timeline */}
          <TimelineView
            events={mockJourney.events}
            admissionDate={mockJourney.admissionDate}
            dischargeDate={mockJourney.dischargeDate}
            status={mockJourney.status}
            scrollToDate={scrollToDate}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientTimeline;
