// ═══════════════════════════════════════════════════════════════════════════
// DISCHARGE FLOW - TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// Config flags
export interface DischargeConfig {
  requireBillingClearanceToFinalize: boolean;
  enableeSignForDoctor: boolean;
  enablePDFDownload: boolean;
  enablePatientPortalShare: boolean;
}

// Permission levels
export type UserRole = 'billing' | 'doctor' | 'nurse' | 'medical_records' | 'admin';

export interface StepPermission {
  canView: boolean;
  canEdit: boolean;
  canFinalize?: boolean;
}

// Step statuses
export type StepStatus = 'pending' | 'in_progress' | 'cleared' | 'finalized';

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 - PENDING BILL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type BillStatus = 'Pending' | 'PartiallyPaid' | 'Cleared' | 'OnHold';
export type PayerType = 'Self' | 'Insurance' | 'TPA';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'neft' | 'cheque' | 'insurance';

export interface PendingBill {
  billNumber: string;
  serviceDateFrom: string;
  serviceDateTo: string;
  payerType: PayerType;
  payerName?: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  lastPaymentAt?: string;
  status: BillStatus;
  lineItems: BillLineItem[];
  insurance?: BillInsurance;
  payments: BillPayment[];
  notes?: string;
}

export interface BillLineItem {
  code: string;
  description: string;
  quantity: number;
  unitCost: number;
  tax: number;
  discount: number;
  net: number;
  dateTime?: string;
  clinician?: string;
}

export interface BillInsurance {
  policyNumber?: string;
  coveragePercent?: number;
  preauthNumber?: string;
  approvedAmount?: number;
  tpaRemarks?: string;
}

export interface BillPayment {
  date: string;
  method: PaymentMethod;
  reference?: string;
  amount: number;
  remarks?: string;
}

export interface BillAdjustment {
  type: 'package' | 'concession' | 'write_off';
  reason: string;
  amount: number;
  approvedBy?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 - DOCTOR CLEARANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ConditionAtDischarge = 'Stable' | 'Improved' | 'Unchanged' | 'Guarded';
export type DischargeDestination = 'Home' | 'Rehab' | 'SNF' | 'Other';
export type MedicationAction = 'Continue' | 'Start' | 'Change' | 'Stop';
export type ActivityLevel = 'BedRest' | 'LightActivity' | 'AsTolerated';
export type DietType = 'Regular' | 'Diabetic' | 'Renal' | 'Custom';

export interface ClinicalChecklist {
  stableVitals: boolean;
  stableVitalsComment?: string;
  afebrile: boolean;
  afebrileComment?: string;
  painControlled: boolean;
  painControlledComment?: string;
  oxygenBaseline: boolean;
  oxygenBaselineComment?: string;
  toleratingDiet: boolean;
  toleratingDietComment?: string;
  mobilitySafe: boolean;
  mobilitySafeComment?: string;
  anticoagPlan: boolean;
  anticoagPlanComment?: string;
  ivRemovedOrPlan: boolean;
  ivRemovedOrPlanComment?: string;
  drainsSafe: boolean;
  drainsSafeComment?: string;
  criticalLabsReviewed: boolean;
  criticalLabsReviewedComment?: string;
  imagingReviewed: boolean;
  imagingReviewedComment?: string;
  returnPrecautionsGiven: boolean;
  returnPrecautionsGivenComment?: string;
}

export interface ClinicalStatus {
  checklist: ClinicalChecklist;
  conditionAtDischarge: ConditionAtDischarge;
  destination: DischargeDestination;
  justification?: string;
  vitalsSnapshot?: VitalsSnapshot;
  labsSummary?: LabSummary[];
  imagingSummary?: ImagingSummary[];
}

export interface VitalsSnapshot {
  timestamp: string;
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  respRate?: number;
}

export interface LabSummary {
  name: string;
  value: string;
  date: string;
  critical?: boolean;
}

export interface ImagingSummary {
  type: string;
  date: string;
  impression: string;
}

export interface MedicationReconciliationItem {
  medId: string;
  name: string;
  action: MedicationAction;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  reason?: string;
  interactionsOverridden?: boolean;
  overrideReason?: string;
  hasInteraction?: boolean;
  hasAllergyConflict?: boolean;
}

export interface HomeCareOrders {
  nursing: boolean;
  physiotherapy: boolean;
  woundCare: boolean;
  catheterCare?: boolean;
  drainCare?: boolean;
  notes?: string;
}

export interface ActivityOrders {
  level: ActivityLevel;
  restrictions?: string;
}

export interface DietOrders {
  type: DietType;
  fluidRestriction?: string;
  customNotes?: string;
}

export interface InvestigationAfterDischarge {
  type: 'Lab' | 'Imaging';
  name: string;
  dueDate: string;
}

export interface OrdersInstructions {
  homeCare: HomeCareOrders;
  activity: ActivityOrders;
  diet: DietOrders;
  investigationsAfterDischarge: InvestigationAfterDischarge[];
  returnPrecautions: string[];
  returnPrecautionsNotes?: string;
  language: string;
}

export interface Appointment {
  service: string;
  provider?: string;
  location: string;
  datetime?: string;
  telehealth?: boolean;
  toBeScheduled?: boolean;
}

export interface ExternalReferral {
  providerName: string;
  contact?: string;
  address?: string;
  notes?: string;
}

export interface Certificates {
  sickLeaveDays?: number;
  startDate?: string;
  fitToTravel?: boolean;
}

export interface FollowUps {
  appointments: Appointment[];
  externalReferrals: ExternalReferral[];
  certificates: Certificates;
}

export interface DischargeAttachment {
  fileId: string;
  name: string;
  type: string;
  url?: string;
}

export interface NotesAttachments {
  doctorNote: string;
  attachments: DischargeAttachment[];
}

export interface ESign {
  byUserId: string;
  signedAt: string;
}

export interface Signoff {
  confirmFitForDischarge: boolean;
  eSign?: ESign;
}

export interface DoctorClearance {
  patientId: string;
  encounterId: string;
  clinicalStatus: ClinicalStatus;
  medicationReconciliation: {
    items: MedicationReconciliationItem[];
    completed: boolean;
    noMedsConfirmed?: boolean;
  };
  ordersInstructions: OrdersInstructions;
  followUps: FollowUps;
  notesAttachments: NotesAttachments;
  signoff: Signoff;
  status: StepStatus;
  lastUpdated?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 - DISCHARGE SUMMARY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DiagnosisCode {
  code: string;
  text: string;
}

export interface Procedure {
  name: string;
  date: string;
  operator: string;
  anesthesia?: string;
  findings?: string;
  implants?: string;
  complications?: string;
}

export interface InvestigationResult {
  type: 'Lab' | 'Imaging';
  name: string;
  date: string;
  resultSummary: string;
  critical?: boolean;
}

export interface DeviceLine {
  type: string;
  status: 'Removed' | 'Continued';
  carePlan?: string;
}

export interface Allergy {
  substance: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface Instructions {
  diet: string;
  activity: string;
  woundCare?: string;
  deviceCare?: string;
  returnPrecautions: string[];
}

export interface PendingResult {
  name: string;
  expectedDate: string;
  responsible?: string;
}

export interface BillingSummary {
  total: number;
  paid: number;
  outstanding: number;
  status: BillStatus;
}

export interface Signature {
  name: string;
  role: string;
  signedAt?: string;
  method?: 'PIN' | 'OTP' | 'Digital';
}

export interface DischargeSummaryData {
  header: {
    patientId: string;
    encounterId: string;
    admissionAt: string;
    dischargeAt?: string;
    attending: string;
    service: string;
  };
  diagnoses: {
    primary: DiagnosisCode;
    secondary: DiagnosisCode[];
  };
  hospitalCourse: string;
  procedures: Procedure[];
  investigations: InvestigationResult[];
  conditionAtDischarge: ConditionAtDischarge;
  devicesAndLines: DeviceLine[];
  dischargeMeds: MedicationReconciliationItem[];
  allergies: Allergy[];
  instructions: Instructions;
  followUps: FollowUps;
  pendingResults: PendingResult[];
  certificates: Certificates;
  billingSummary: BillingSummary;
  signatures: Signature[];
  status: StepStatus;
  lastUpdated?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED DISCHARGE FLOW STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface DischargeFlowState {
  patientId: string;
  encounterId: string;
  currentStep: 1 | 2 | 3;
  config: DischargeConfig;
  userRole: UserRole;
  pendingBills: PendingBill[];
  doctorClearance?: DoctorClearance;
  dischargeSummary?: DischargeSummaryData;
  stepStatuses: {
    step1: StepStatus;
    step2: StepStatus;
    step3: StepStatus;
  };
  isDirty: boolean;
  lastAutoSave?: string;
}

export interface PatientSnapshot {
  patientId: string;
  name: string;
  mrn: string;
  age: number;
  sex: 'M' | 'F';
  ward: string;
  bed: string;
  diagnosis: string;
  allergies: string[];
  codeStatus?: string;
  admittingTeam: string;
  admissionDate: string;
}
