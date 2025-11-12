// Front Office Discharge types

export type ClearanceStatus = 'Pending' | 'Requested' | 'In Review' | 'Cleared';
export type DischargeStatus = 'Not Started' | 'In Progress' | 'Ready to Finalize' | 'Finalized';

export interface DepartmentClearance {
  department: string;
  status: ClearanceStatus;
  notes: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
  canMarkCleared: boolean; // system-computed
}

export interface ClinicalItem {
  id: string;
  label: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  owner: string; // responsible team/role
  canNotify: boolean;
}

export interface DischargeDocument {
  id: string;
  name: string;
  type: 'summary' | 'prescription' | 'bill' | 'instructions';
  url?: string;
  generated: boolean;
}

export interface PatientDischargeInfo {
  visitId: string;
  patientName: string;
  mrn: string;
  age: number;
  sex: string;
  admissionDate: string;
  intendedDischargeDate?: string;
  attendingDoctor: string;
  overallStatus: DischargeStatus;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}
