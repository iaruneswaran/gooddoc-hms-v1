// =====================================
// RADIOLOGY STAFF FEATURES - DATA MODELS
// =====================================

export type ExamPriority = "STAT" | "Urgent" | "Routine";
export type ExamStatus = "Ordered" | "Scheduled" | "Arrived" | "In Room" | "Images Available" | "To Be Read" | "For Review" | "Completed" | "Released";
export type SafetyCheckType = "pregnancy" | "egfr" | "allergy" | "mri_implants" | "iv_access";
export type SafetyCheckStatus = "pending" | "passed" | "failed" | "waived";
export type ReportStatus = "Draft" | "Locked" | "Submitted" | "Approved" | "Released";
export type CriticalCategory = "Stroke" | "PE" | "Aortic Dissection" | "Mass/Malignancy" | "Fracture" | "Other";
export type CommunicationMethod = "Phone" | "Page" | "In Person" | "HIPAA Secure Message";

// F1: STAT Triage + SLA Countdown
export interface ExamPriorityData {
  id: string;
  priority: ExamPriority;
  slaDueAt: string; // dd-MM-yyyy HH:mm format
  slaMinutesRemaining?: number;
  escalatedAt?: string;
  escalatedBy?: string;
  escalationReason?: string;
}

// F2: Safety Gate Panel
export interface SafetyCheck {
  type: SafetyCheckType;
  value: string;
  status: SafetyCheckStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  waivedReason?: string;
}

export interface SafetyGateData {
  examId: string;
  checks: SafetyCheck[];
  overallStatus: "incomplete" | "passed" | "waived";
  lastUpdated: string;
}

// F3: Draft Lock + Co-sign
export interface ReportVersion {
  version: number;
  content: {
    technique: string;
    findings: string;
    impression: string;
    recommendations: string;
  };
  editedBy: string;
  editedAt: string;
}

export interface ReportLock {
  id: string;
  examId: string;
  status: ReportStatus;
  version: number;
  lockedBy?: string;
  lockedAt?: string;
  reviewerId?: string;
  reviewerComment?: string;
  history: ReportVersion[];
  lastAutoSavedAt?: string;
  requiresCoSign: boolean;
}

// F4: Critical Results Workflow
export interface CriticalCommunication {
  id: string;
  examId: string;
  category: CriticalCategory;
  contact: string;
  contactRole: string;
  method: CommunicationMethod;
  readbackConfirmed: boolean;
  timestamp: string;
  notes: string;
  documentedBy: string;
}

// F5: Tech QC + Contrast/Dose Logging
export interface ContrastInfo {
  type: string;
  volume: number; // mL
  lot: string;
  extravasation: boolean;
  extravasationNotes?: string;
}

export interface DoseInfo {
  ctdiVol?: number; // mGy
  dlp?: number; // mGy·cm
  fluoroTime?: number; // minutes
  airKerma?: number; // mGy
  dap?: number; // Gy·cm²
  source: "DICOM-SR" | "Manual";
}

export interface TechQCData {
  examId: string;
  contrast?: ContrastInfo;
  dose: DoseInfo;
  artifact: boolean;
  artifactNotes?: string;
  redoRequired: boolean;
  redoReason?: string;
  imageQuality: "Excellent" | "Adequate" | "Suboptimal" | "Non-diagnostic";
  completedBy?: string;
  completedAt?: string;
  status: "pending" | "complete" | "issue_logged";
}

// Staff Notes / Chat
export interface StaffNote {
  id: string;
  examId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  mentions: string[]; // user IDs mentioned
  createdAt: string;
  isUrgent: boolean;
}

// Measurements for PE Helpers
export interface Measurement {
  id: string;
  type: "RV/LV Ratio" | "Main PA Diameter" | "Aortic Root" | "Other";
  value: number;
  unit: string;
  normal?: string;
  annotation?: string;
  capturedBy: string;
  capturedAt: string;
  isAbnormal: boolean;
}

// Billing Readiness
export interface BillingReadiness {
  examId: string;
  cptCodes: string[];
  modifiers: string[];
  icd10Codes: string[];
  documentationComplete: boolean;
  readyToBill: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

// Row Actions for Orders List
export type OrderRowAction = 
  | "approve" 
  | "assign_radiologist" 
  | "assign_technologist" 
  | "mark_arrived" 
  | "start_now" 
  | "enter_results" 
  | "complete_qc" 
  | "release";

// Extended Order with Staff Features
export interface RadiologyOrderStaff {
  id: string;
  type: "radiology";
  patient: {
    name: string;
    gdid: string;
    mrn: string;
    age: number;
    sex: string;
    phone: string;
  };
  workorderId: string;
  orderDate: string;
  orderTime: string;
  status: ExamStatus;
  priority: ExamPriority;
  slaDueAt?: string;
  slaMinutesRemaining?: number;
  waitingForApproval: string;
  approvedBy: string;
  price: number;
  assignedRadiologistId?: string;
  assignedRadiologistName?: string;
  assignedTechnologistId?: string;
  assignedTechnologistName?: string;
  modality: string;
  study: string;
  departments: {
    name: string;
    tests: string[];
  }[];
  // Staff feature flags
  safetyStatus: "incomplete" | "passed" | "waived";
  qcStatus: "pending" | "complete" | "issue_logged";
  reportStatus: ReportStatus;
  hasCriticalFinding: boolean;
  criticalCommunicationLogged: boolean;
}

// Mock Staff Users
export interface StaffUser {
  id: string;
  name: string;
  role: "Radiologist" | "Resident" | "Technologist" | "Nurse" | "Front Desk" | "Coder" | "Manager";
  initials: string;
}

export const MOCK_STAFF: StaffUser[] = [
  { id: "rad_101", name: "Dr. Kumar", role: "Radiologist", initials: "DK" },
  { id: "rad_102", name: "Dr. Patel", role: "Radiologist", initials: "DP" },
  { id: "res_201", name: "Dr. Singh", role: "Resident", initials: "DS" },
  { id: "tech_207", name: "Tech. Patel", role: "Technologist", initials: "TP" },
  { id: "tech_208", name: "Tech. Sharma", role: "Technologist", initials: "TS" },
  { id: "nurse_33", name: "Nurse Priya", role: "Nurse", initials: "NP" },
  { id: "coder_01", name: "Anita Desai", role: "Coder", initials: "AD" },
];

// Sample data for Kavya Iyer's exam
export const MOCK_KAVYA_EXAM: RadiologyOrderStaff = {
  id: "OR-RD-55421",
  type: "radiology",
  patient: {
    name: "Kavya Iyer",
    gdid: "GD2042",
    mrn: "MRN-217564",
    age: 28,
    sex: "F",
    phone: "+91 98xxxx567",
  },
  workorderId: "GD2042",
  orderDate: "08-12-2025",
  orderTime: "09:45:00",
  status: "To Be Read",
  priority: "STAT",
  slaDueAt: "08-12-2025 10:15",
  slaMinutesRemaining: 18,
  waitingForApproval: "-",
  approvedBy: "Dr. Patel",
  price: 3500.00,
  assignedRadiologistId: "rad_101",
  assignedRadiologistName: "Dr. Kumar",
  assignedTechnologistId: "tech_207",
  assignedTechnologistName: "Tech. Patel",
  modality: "CT",
  study: "CT Chest with IV contrast",
  departments: [{ name: "Radiology", tests: ["CT Chest with contrast"] }],
  safetyStatus: "passed",
  qcStatus: "complete",
  reportStatus: "Draft",
  hasCriticalFinding: false,
  criticalCommunicationLogged: false,
};

export const MOCK_ARNAV_EXAM: RadiologyOrderStaff = {
  id: "OR-RD-55438",
  type: "radiology",
  patient: {
    name: "Arnav Rao",
    gdid: "GD2048",
    mrn: "MRN-219873",
    age: 45,
    sex: "M",
    phone: "+91 98xxxx789",
  },
  workorderId: "GD2048",
  orderDate: "08-12-2025",
  orderTime: "14:30:00",
  status: "Released",
  priority: "Routine",
  waitingForApproval: "-",
  approvedBy: "Dr. Kumar",
  price: 8500.00,
  assignedRadiologistId: "rad_102",
  assignedRadiologistName: "Dr. Patel",
  assignedTechnologistId: "tech_208",
  assignedTechnologistName: "Tech. Sharma",
  modality: "MRI",
  study: "MRI Brain w/o contrast",
  departments: [{ name: "Radiology", tests: ["MRI Brain w/o contrast"] }],
  safetyStatus: "passed",
  qcStatus: "complete",
  reportStatus: "Released",
  hasCriticalFinding: false,
  criticalCommunicationLogged: false,
};

// Mock Safety Data for Kavya
export const MOCK_KAVYA_SAFETY: SafetyGateData = {
  examId: "OR-RD-55421",
  checks: [
    { type: "pregnancy", value: "Negative - LMP 2 weeks ago", status: "passed", verifiedBy: "Nurse Priya", verifiedAt: "08-12-2025 09:35" },
    { type: "egfr", value: "0.8 mg/dL (eGFR >90)", status: "passed", verifiedBy: "Nurse Priya", verifiedAt: "08-12-2025 09:36" },
    { type: "allergy", value: "No known contrast allergies", status: "passed", verifiedBy: "Nurse Priya", verifiedAt: "08-12-2025 09:37" },
    { type: "iv_access", value: "20G right AC", status: "passed", verifiedBy: "Tech. Patel", verifiedAt: "08-12-2025 09:42" },
  ],
  overallStatus: "passed",
  lastUpdated: "08-12-2025 09:42",
};

// Mock Tech QC Data for Kavya
export const MOCK_KAVYA_TECH_QC: TechQCData = {
  examId: "OR-RD-55421",
  contrast: {
    type: "Iohexol 350",
    volume: 70,
    lot: "AX9K3",
    extravasation: false,
  },
  dose: {
    ctdiVol: 8.2,
    dlp: 180,
    source: "DICOM-SR",
  },
  artifact: false,
  redoRequired: false,
  imageQuality: "Excellent",
  completedBy: "Tech. Patel",
  completedAt: "08-12-2025 09:58",
  status: "complete",
};

// Mock Report Lock for Kavya
export const MOCK_KAVYA_REPORT: ReportLock = {
  id: "RPT-55421",
  examId: "OR-RD-55421",
  status: "Draft",
  version: 1,
  lockedBy: "Dr. Kumar",
  lockedAt: "08-12-2025 10:02",
  history: [],
  lastAutoSavedAt: undefined,
  requiresCoSign: false,
};
