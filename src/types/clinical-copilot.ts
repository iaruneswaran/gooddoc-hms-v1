// Clinical Copilot AI Types

export type CopilotMode = 
  | "compose_note" 
  | "recommend_orders" 
  | "interpret_labs" 
  | "radiology_request" 
  | "summarize_visit" 
  | "patient_instructions" 
  | "medication_review";

export type NoteStyle = "SOAP" | "Problem-Oriented";
export type DetailLevel = "concise" | "standard" | "extended";

export interface CopilotPatient {
  id: string;
  name: string;
  age: number;
  sex: "M" | "F" | "Other";
  dob: string;
  allergies: string[];
  problems: string[];
  vitals: CopilotVitals;
  medications: CopilotMedication[];
  labs: CopilotLabResult[];
  imaging: CopilotImagingResult[];
  previous_visits: CopilotPreviousVisit[];
  locale: string;
}

export interface CopilotVitals {
  bp?: string;
  hr?: number;
  rr?: number;
  temp_c?: number;
  spo2?: number;
  height_cm?: number;
  weight_kg?: number;
}

export interface CopilotMedication {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  status: "active" | "discontinued";
}

export interface CopilotLabResult {
  name: string;
  value: number | string;
  unit: string;
  ref_range: string;
  date: string;
  flag?: "H" | "L" | "C" | "N";
}

export interface CopilotImagingResult {
  modality: string;
  body_part: string;
  date: string;
  findings: string;
}

export interface CopilotPreviousVisit {
  date: string;
  reason: string;
  diagnoses: string[];
  summary: string;
}

export interface CopilotVisit {
  date: string;
  reason: string;
  clinician: string;
  setting: "Outpatient" | "Inpatient" | "Emergency";
}

export interface CopilotPreferences {
  note_style: NoteStyle;
  detail_level: DetailLevel;
  include_codes: boolean;
}

export interface CopilotConstraints {
  max_tokens: number;
  output_version: string;
}

export interface CopilotPayload {
  mode: CopilotMode;
  patient: CopilotPatient;
  visit: CopilotVisit;
  preferences: CopilotPreferences;
  constraints: CopilotConstraints;
  user_request: string;
}

// Response types
export interface CopilotPhysicalExam {
  general?: string;
  vitals_summary?: string;
  cardio?: string;
  resp?: string;
  neuro?: string;
  abdominal?: string;
  musculoskeletal?: string;
}

export interface CopilotAssessment {
  problem: string;
  status: "new" | "ongoing" | "resolved";
  confidence: "high" | "moderate" | "low";
  rationale: string;
}

export interface CopilotPlanItem {
  problem: string;
  actions: string[];
}

export interface CopilotClinicalNote {
  chief_complaint: string;
  hpi: string;
  review_of_systems: string[];
  physical_exam: CopilotPhysicalExam;
  assessment: CopilotAssessment[];
  plan_by_problem: CopilotPlanItem[];
}

export interface CopilotLabOrder {
  test_name: string;
  loinc?: string;
  priority: "STAT" | "Urgent" | "Routine";
  timing?: string;
  sample?: string;
  pre_test?: string;
  clinical_question: string;
  reason_for_order: string;
}

export interface CopilotRadiologyOrder {
  modality: string;
  body_part: string;
  priority: "STAT" | "Urgent" | "Routine";
  contrast: "Yes" | "No";
  clinical_question: string;
  reason_for_exam: string;
}

export interface CopilotOtherOrder {
  type: string;
  priority: "STAT" | "Urgent" | "Routine";
  reason: string;
}

export interface CopilotOrders {
  labs: CopilotLabOrder[];
  radiology: CopilotRadiologyOrder[];
  other: CopilotOtherOrder[];
}

export interface CopilotAllergyCheck {
  conflicts: string[];
  ok_to_use: boolean;
}

export interface CopilotPrescription {
  generic_name: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  indication: string;
  allergy_check: CopilotAllergyCheck;
}

export interface CopilotFollowUp {
  when: string;
  reason: string;
}

export interface CopilotWarning {
  type: "allergy" | "interaction" | "contraindication" | "red_flag";
  message: string;
  severity: "high" | "medium" | "low";
}

export interface CopilotICD10 {
  code: string;
  label: string;
}

export interface CopilotSNOMED {
  code: string;
  label: string;
}

export interface CopilotCoding {
  icd10: CopilotICD10[];
  snomed: CopilotSNOMED[];
}

export interface CopilotAudit {
  assumptions: string[];
  clarifications_needed: string[];
}

export interface CopilotResponseData {
  clinical_note: CopilotClinicalNote;
  orders: CopilotOrders;
  prescriptions: CopilotPrescription[];
  patient_instructions: string[];
  follow_up: CopilotFollowUp;
  warnings: CopilotWarning[];
  coding: CopilotCoding;
  audit: CopilotAudit;
}

export interface CopilotResponse {
  ui_markdown: string;
  data: CopilotResponseData;
}
