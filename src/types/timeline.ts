export type EventType = 
  | "Admission" 
  | "Laboratory" 
  | "Medication" 
  | "Imaging" 
  | "Procedure" 
  | "Notes" 
  | "Discharge";

export type EventStatus = "Completed" | "Scheduled" | "Planned" | "Missed" | "Cancelled";

export interface TimelineEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: EventType;
  title: string;
  dept: string;
  status: EventStatus;
}

export interface DailyCount {
  date: string;
  total: number;
  byType: Record<EventType, number>;
  byStatus: Record<EventStatus, number>;
}

export interface PatientJourney {
  visitId: string;
  status: "active" | "completed";
  admissionDate: string;
  dischargeDate: string | null;
  patient: {
    name: string;
    mrn: string;
    age: number;
    sex: string;
  };
  events: TimelineEvent[];
  dailyCounts: DailyCount[];
}

export type HeatmapMode = "density" | "byType" | "status" | "meds" | "labs" | "imaging" | "procedures" | "notes";
export type HeatmapPalette = "greens" | "blues" | "purples" | "greyscale";
