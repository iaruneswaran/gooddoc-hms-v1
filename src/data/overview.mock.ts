// Mock data for Overview list pages - Hospital Operations Dashboard

import { format, subDays, subHours, subMinutes, addDays } from "date-fns";

// ============== TYPE DEFINITIONS ==============

export interface OPPatientRecord {
  mrn: string;
  patient: string;
  ageSex: string;
  contact: string;
  visitId: string;
  appointmentTime: string;
  department: string;
  provider: string;
  visitReason: string;
  status: "Scheduled" | "Pending Check-in" | "Checked-in" | "With Doctor" | "Awaiting Billing" | "Completed" | "No-show" | "Canceled";
  checkInTime?: string;
  waitingTime?: string;
  tokenQueueNo?: string;
  insurancePlan?: string;
  billingStatus?: "Paid" | "Pending" | "Partially Paid";
  prescriptions?: number;
  labsOrdered?: number;
  radiologyOrdered?: number;
  completionTime?: string;
  followUpDate?: string;
  triageDone?: boolean;
  paymentStatus?: string;
  reminderStatus?: "Not Sent" | "Sent" | "Confirmed";
  insuranceVerified?: boolean;
  noShowRisk?: "Low" | "Med" | "High";
}

export interface IPPatientRecord {
  mrn: string;
  patient: string;
  ageSex: string;
  admitDateTime: string;
  ward: string;
  room: string;
  bed: string;
  bedClass: "ICU" | "HDU" | "Private" | "Ward";
  attendingDoctor: string;
  primaryDiagnosis: string;
  lengthOfStay: number;
  isolation?: string;
  source?: "ER" | "OPD" | "Transfer";
  admittingDiagnosis?: string;
  admittingDoctor?: string;
  dischargeDateTime?: string;
  dischargeType?: "Home" | "Transfer" | "AMA" | "Expired";
  billingStatus?: "Paid" | "Pending" | "Partially Paid";
  dischargeSummary?: "Ready" | "Not Ready";
  followUpAppointment?: string;
  plannedDischargeDateTime?: string;
  blockingTasks?: string[];
}

export interface BedRecord {
  ward: string;
  room: string;
  bed: string;
  bedType: "ICU" | "HDU" | "Ward" | "Private" | "Isolation";
  status: "Available" | "Cleaning" | "Reserved" | "Blocked";
  lastDischargedAt?: string;
  cleaningETA?: string;
  isolationCapability: boolean;
  reservedFor?: string;
}

export interface ERCaseRecord {
  mrn: string;
  patient: string;
  ageSex: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  arrivalTime: string;
  modeOfArrival: "Ambulance" | "Walk-in" | "Transfer";
  erZoneArea: string;
  bedChair: string;
  attending: string;
  chiefComplaint: string;
  timeSinceArrival: string;
  disposition: "Pending" | "Admit" | "Discharge" | "Transfer";
}

export interface DoctorOnDutyRecord {
  doctorName: string;
  specialty: string;
  role: "Onsite" | "On-call" | "In OPD" | "In OT" | "In Ward Rounds";
  shiftStart: string;
  shiftEnd: string;
  currentLocation: string;
  contactPager: string;
}

export interface AppointmentRequestRecord {
  requestId: string;
  patient: string;
  contact: string;
  preferredDateTime: string;
  department: string;
  preferredProvider?: string;
  reason: string;
  urgency: "Low" | "Med" | "High";
  source: "Call" | "Portal" | "Walk-in" | "Referral";
  insuranceVerified: boolean;
  status: "New" | "Pending" | "Scheduled" | "Rejected";
  createdAt: string;
}

export interface LabOrderRecord {
  orderId: string;
  patient: string;
  ageSex: string;
  location: string;
  tests: string;
  priority: "Routine" | "Stat";
  status: "Ordered" | "Collected" | "In-Process" | "Completed" | "Verified";
  specimenType: string;
  collectedAt?: string;
  resultETA?: string;
  criticalResult: boolean;
  orderTime: string;
}

export interface SurgeryRecord {
  caseId: string;
  patient: string;
  ageSex: string;
  procedure: string;
  surgeon: string;
  orRoom: string;
  startTime: string;
  estimatedDuration: string;
  status: "Scheduled" | "In-Progress" | "Completed" | "Canceled";
  anesthesiaType: string;
  asaClass: string;
  postOpBedReserved: boolean;
}

export interface MedicineOrderRecord {
  orderId: string;
  patient: string;
  location: string;
  prescriber: string;
  medications: string;
  route: "PO" | "IV" | "IM" | "SC" | "Topical";
  priority: "Routine" | "Stat";
  status: "Pending" | "Verifying" | "Verified" | "Dispensed" | "Administered" | "Canceled";
  allergiesFlag: boolean;
  interactionsFlag: boolean;
  dispensedAt?: string;
  orderTime: string;
}

export interface RadiologyOrderRecord {
  orderId: string;
  patient: string;
  location: string;
  modality: "X-ray" | "CT" | "MRI" | "US" | "Fluoro" | "Mammo";
  exam: string;
  priority: "Routine" | "Stat";
  status: "Ordered" | "Scheduled" | "In-Progress" | "Completed" | "Finalized";
  scheduledTime: string;
  imagingLocation: string;
  contrast: boolean;
  pregnancySafetyFlags?: string;
  orderTime: string;
}

export interface LowStockRecord {
  itemName: string;
  category: "Drug" | "Consumable" | "Device";
  onHand: number;
  reorderPoint: number;
  parLevel: number;
  avgDailyUse: number;
  daysOfStockLeft: number;
  onOrder: number;
  supplier: string;
  leadTimeDays: number;
  suggestedReorderQty: number;
  severity: "Normal" | "Low" | "Critical";
}

// ============== HELPER FUNCTIONS ==============

const firstNames = ["Amit", "Priya", "Rahul", "Sneha", "Vikram", "Anjali", "Karthik", "Divya", "Suresh", "Lakshmi", "Rajan", "Meena", "Arjun", "Kavitha", "Sanjay"];
const lastNames = ["Sharma", "Patel", "Reddy", "Kumar", "Singh", "Nair", "Menon", "Rao", "Gupta", "Joshi", "Iyer", "Bhat", "Verma", "Mishra", "Das"];
const departments = ["Cardiology", "Orthopedics", "Neurology", "General Medicine", "Pediatrics", "Oncology", "ENT", "Dermatology", "Gastroenterology", "Pulmonology"];
const doctors = ["Dr. Meera Nair", "Dr. Rajesh Kumar", "Dr. Anita Singh", "Dr. Sunil Reddy", "Dr. Prakash Shah", "Dr. Priya Menon", "Dr. Arun Bhat", "Dr. Sunita Rao"];
const insurancePlans = ["Aetna PPO", "BlueCross", "United Healthcare", "Cigna", "Medicare", "Self-Pay", "Star Health", "HDFC Ergo"];
const visitReasons = ["Annual checkup", "Follow-up", "Chest pain", "Headache", "Joint pain", "Fever", "Cough", "Skin rash", "Diabetes review", "BP monitoring"];
const diagnoses = ["Hypertension", "Type 2 Diabetes", "COPD", "Coronary Artery Disease", "Osteoarthritis", "Pneumonia", "Appendicitis", "Cholecystitis", "Fracture", "Anemia"];
const chiefComplaints = ["Chest pain", "Shortness of breath", "Abdominal pain", "Trauma", "Altered consciousness", "Severe headache", "High fever", "Allergic reaction"];
const specimenTypes = ["Blood", "Urine", "Stool", "Swab", "CSF", "Sputum"];
const testPanels = ["CBC", "BMP", "CMP", "Lipid Panel", "LFT", "TFT", "Coagulation", "Cardiac Markers", "Urinalysis"];
const procedures = ["Appendectomy", "Knee Replacement", "Cardiac Bypass", "Cholecystectomy", "Hip Replacement", "Hernia Repair", "Cataract Surgery", "Spinal Fusion", "CABG", "Laparoscopy"];
const medicationNames = ["Metformin 500mg", "Amlodipine 5mg", "Lisinopril 10mg", "Omeprazole 20mg", "Atorvastatin 20mg", "Aspirin 81mg"];
const radiologyExams = ["Chest X-ray", "CT Abdomen", "MRI Brain", "US Abdomen", "CT Chest", "MRI Spine", "X-ray Knee", "CT Head"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(index: number): string {
  return `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`;
}

function generateMRN(index: number): string {
  return `MRN${String(100000 + index).padStart(7, "0")}`;
}

function generateAgeSex(index: number): string {
  const age = 18 + Math.floor(Math.random() * 65);
  const sex = index % 2 === 0 ? "M" : "F";
  return `${age}/${sex}`;
}

function generatePhone(): string {
  return `+91 ${9}${Math.floor(Math.random() * 1000000000).toString().padStart(9, "0")}`;
}

function formatDateTime(date: Date): string {
  return format(date, "dd-MMM-yyyy HH:mm");
}

function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

// ============== OP PATIENTS ==============

const now = new Date();
const today = format(now, "yyyy-MM-dd");

function generateOPPatient(index: number, statusOverride?: OPPatientRecord["status"]): OPPatientRecord {
  const statuses: OPPatientRecord["status"][] = ["Scheduled", "Pending Check-in", "Checked-in", "With Doctor", "Awaiting Billing", "Completed", "No-show", "Canceled"];
  const status = statusOverride || statuses[index % statuses.length];
  const appointmentHour = 8 + Math.floor(index / 50);
  const appointmentDate = new Date(now);
  appointmentDate.setHours(appointmentHour, (index * 7) % 60, 0, 0);
  
  const checkInDate = status !== "Scheduled" && status !== "No-show" && status !== "Canceled" 
    ? subMinutes(appointmentDate, Math.floor(Math.random() * 15)) 
    : undefined;
  
  const waitingMins = status === "Checked-in" || status === "With Doctor" 
    ? Math.floor(Math.random() * 45) + 5 
    : undefined;

  return {
    mrn: generateMRN(index),
    patient: generateName(index),
    ageSex: generateAgeSex(index),
    contact: generatePhone(),
    visitId: `V${today.replace(/-/g, "")}${String(index).padStart(4, "0")}`,
    appointmentTime: formatDateTime(appointmentDate),
    department: departments[index % departments.length],
    provider: doctors[index % doctors.length],
    visitReason: visitReasons[index % visitReasons.length],
    status,
    checkInTime: checkInDate ? formatDateTime(checkInDate) : undefined,
    waitingTime: waitingMins ? `${waitingMins} min` : undefined,
    tokenQueueNo: status !== "Scheduled" && status !== "No-show" && status !== "Canceled" ? `T${String(index + 1).padStart(3, "0")}` : undefined,
    insurancePlan: insurancePlans[index % insurancePlans.length],
    billingStatus: status === "Completed" ? (["Paid", "Pending", "Partially Paid"] as const)[index % 3] : undefined,
    prescriptions: status === "Completed" ? Math.floor(Math.random() * 5) : undefined,
    labsOrdered: status === "Completed" ? Math.floor(Math.random() * 3) : undefined,
    radiologyOrdered: status === "Completed" ? Math.floor(Math.random() * 2) : undefined,
    completionTime: status === "Completed" ? formatDateTime(subMinutes(now, Math.floor(Math.random() * 120))) : undefined,
    followUpDate: status === "Completed" && Math.random() > 0.5 ? format(addDays(now, 7 + Math.floor(Math.random() * 21)), "dd-MMM-yyyy") : undefined,
    triageDone: status !== "Scheduled" && status !== "No-show" && status !== "Canceled" ? Math.random() > 0.2 : undefined,
    paymentStatus: status === "Checked-in" ? (Math.random() > 0.3 ? "Collected" : "Pending") : undefined,
    reminderStatus: status === "Scheduled" ? (["Not Sent", "Sent", "Confirmed"] as const)[index % 3] : undefined,
    insuranceVerified: Math.random() > 0.2,
    noShowRisk: status === "Scheduled" ? (["Low", "Med", "High"] as const)[index % 3] : undefined,
  };
}

// 847 OP Patients with various statuses
export const opPatients: OPPatientRecord[] = Array.from({ length: 847 }, (_, i) => generateOPPatient(i));

// Filtered sublists
export const opCompleted = opPatients.filter(p => p.status === "Completed");
export const opCheckedIn = opPatients.filter(p => ["Checked-in", "With Doctor", "Awaiting Billing"].includes(p.status));
export const opPendingCheckIn = opPatients.filter(p => p.status === "Scheduled" || p.status === "Pending Check-in");

// ============== IP PATIENTS ==============

function generateIPPatient(index: number, isNewAdmission = false, isERCase = false): IPPatientRecord {
  const admitDaysAgo = isNewAdmission ? 0 : Math.floor(Math.random() * 14) + 1;
  const admitDate = subDays(now, admitDaysAgo);
  admitDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
  
  const bedClasses: IPPatientRecord["bedClass"][] = ["ICU", "HDU", "Private", "Ward"];
  const bedClass = bedClasses[index % bedClasses.length];
  const wardMap = { ICU: "ICU", HDU: "HDU", Private: "Private Wing", Ward: `Ward-${["A", "B", "C", "D"][index % 4]}` };

  return {
    mrn: generateMRN(5000 + index),
    patient: generateName(index + 100),
    ageSex: generateAgeSex(index),
    admitDateTime: formatDateTime(admitDate),
    ward: wardMap[bedClass],
    room: `${String(100 + Math.floor(index / 4)).padStart(3, "0")}`,
    bed: `${(index % 4) + 1}`,
    bedClass,
    attendingDoctor: doctors[index % doctors.length],
    primaryDiagnosis: diagnoses[index % diagnoses.length],
    lengthOfStay: admitDaysAgo,
    isolation: index % 10 === 0 ? "Contact" : undefined,
    source: isERCase ? "ER" : isNewAdmission ? (["ER", "OPD", "Transfer"] as const)[index % 3] : undefined,
    admittingDiagnosis: diagnoses[(index + 3) % diagnoses.length],
    admittingDoctor: doctors[(index + 2) % doctors.length],
  };
}

// 234 IP Patients
export const ipPatients: IPPatientRecord[] = Array.from({ length: 234 }, (_, i) => generateIPPatient(i));

// Sub-filtered: New Admissions (admitted today)
export const newAdmissions: IPPatientRecord[] = Array.from({ length: 19 }, (_, i) => generateIPPatient(i, true));

// Sub-filtered: ER Cases today
export const erCasesToday: IPPatientRecord[] = Array.from({ length: 8 }, (_, i) => generateIPPatient(i, true, true));

// ============== BEDS AVAILABILITY ==============

function generateBed(index: number, typeOverride?: BedRecord["bedType"]): BedRecord {
  const bedTypes: BedRecord["bedType"][] = ["ICU", "HDU", "Ward", "Private", "Isolation"];
  const bedType = typeOverride || bedTypes[index % bedTypes.length];
  const statuses: BedRecord["status"][] = ["Available", "Available", "Available", "Cleaning", "Reserved", "Blocked"];
  const status = statuses[index % statuses.length];
  const wardMap = { ICU: "ICU", HDU: "HDU", Ward: `Ward-${["A", "B", "C"][index % 3]}`, Private: "Private Wing", Isolation: "Isolation" };

  return {
    ward: wardMap[bedType],
    room: `${String(100 + Math.floor(index / 4)).padStart(3, "0")}`,
    bed: `${(index % 4) + 1}`,
    bedType,
    status,
    lastDischargedAt: status === "Cleaning" ? formatDateTime(subHours(now, 1)) : undefined,
    cleaningETA: status === "Cleaning" ? formatTime(subMinutes(now, -30)) : undefined,
    isolationCapability: bedType === "Isolation" || Math.random() > 0.7,
    reservedFor: status === "Reserved" ? generateName(index + 500) : undefined,
  };
}

// 67 Available beds across types
export const bedsAvailability: BedRecord[] = Array.from({ length: 67 }, (_, i) => generateBed(i));

// Sub-filtered by bed type
export const icuBeds = bedsAvailability.filter(b => b.bedType === "ICU");
export const wardBeds = bedsAvailability.filter(b => ["Ward", "HDU"].includes(b.bedType));
export const roomBeds = bedsAvailability.filter(b => ["Private", "Isolation"].includes(b.bedType));

// ============== DISCHARGED PATIENTS ==============

function generateDischargedPatient(index: number, isPending = false): IPPatientRecord {
  const dischargeDate = isPending ? addDays(now, 0) : now;
  dischargeDate.setHours(8 + Math.floor(index / 5), (index * 12) % 60, 0, 0);
  const admitDate = subDays(dischargeDate, 2 + Math.floor(Math.random() * 10));
  
  const bedClasses: IPPatientRecord["bedClass"][] = ["ICU", "HDU", "Private", "Ward"];
  const bedClass = bedClasses[index % bedClasses.length];
  const wardMap = { ICU: "ICU", HDU: "HDU", Private: "Private Wing", Ward: `Ward-${["A", "B", "C", "D"][index % 4]}` };

  const blockingTasksOptions = ["Billing", "Meds", "Transport", "Paperwork", "Clearance"];

  return {
    mrn: generateMRN(8000 + index),
    patient: generateName(index + 200),
    ageSex: generateAgeSex(index),
    admitDateTime: formatDateTime(admitDate),
    ward: wardMap[bedClass],
    room: `${String(100 + Math.floor(index / 4)).padStart(3, "0")}`,
    bed: `${(index % 4) + 1}`,
    bedClass,
    attendingDoctor: doctors[index % doctors.length],
    primaryDiagnosis: diagnoses[index % diagnoses.length],
    lengthOfStay: Math.floor((dischargeDate.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24)),
    dischargeDateTime: isPending ? undefined : formatDateTime(dischargeDate),
    dischargeType: isPending ? undefined : (["Home", "Transfer", "AMA", "Expired"] as const)[index % 4],
    billingStatus: (["Paid", "Pending", "Partially Paid"] as const)[index % 3],
    dischargeSummary: isPending ? "Not Ready" : (["Ready", "Not Ready"] as const)[index % 2],
    followUpAppointment: !isPending && Math.random() > 0.4 ? formatDateTime(addDays(now, 7 + Math.floor(Math.random() * 14))) : undefined,
    plannedDischargeDateTime: isPending ? formatDateTime(dischargeDate) : undefined,
    blockingTasks: isPending ? blockingTasksOptions.slice(0, 1 + Math.floor(Math.random() * 3)) : undefined,
  };
}

// 45 Discharged today
export const dischargedPatients: IPPatientRecord[] = Array.from({ length: 45 }, (_, i) => generateDischargedPatient(i));

// 11 Pending discharge
export const dischargePending: IPPatientRecord[] = Array.from({ length: 11 }, (_, i) => generateDischargedPatient(i, true));

// ============== ER CASES ==============

function generateERCase(index: number): ERCaseRecord {
  const arrivalDate = subHours(now, Math.floor(Math.random() * 12));
  const triageLevels: ERCaseRecord["triageLevel"][] = [1, 2, 2, 3, 3, 3, 4, 4, 5];
  const triageLevel = triageLevels[index % triageLevels.length];
  const minsAgo = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 60));

  return {
    mrn: generateMRN(9000 + index),
    patient: generateName(index + 300),
    ageSex: generateAgeSex(index),
    triageLevel,
    arrivalTime: formatDateTime(arrivalDate),
    modeOfArrival: (["Ambulance", "Walk-in", "Transfer"] as const)[index % 3],
    erZoneArea: (["Trauma", "Acute", "Minor", "Resus", "Obs"] as const)[index % 5],
    bedChair: `ER-${index + 1}`,
    attending: doctors[index % doctors.length],
    chiefComplaint: chiefComplaints[index % chiefComplaints.length],
    timeSinceArrival: `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m`,
    disposition: (["Pending", "Admit", "Discharge", "Transfer"] as const)[index % 4],
  };
}

// 15 Emergency Cases (active)
export const emergencyCases: ERCaseRecord[] = Array.from({ length: 15 }, (_, i) => generateERCase(i));

// ============== DOCTORS ON DUTY ==============

function generateDoctorOnDuty(index: number): DoctorOnDutyRecord {
  const shiftStart = new Date(now);
  shiftStart.setHours(index % 2 === 0 ? 8 : 20, 0, 0, 0);
  const shiftEnd = new Date(shiftStart);
  shiftEnd.setHours(shiftStart.getHours() + 12);

  return {
    doctorName: doctors[index % doctors.length],
    specialty: departments[index % departments.length],
    role: (["Onsite", "On-call", "In OPD", "In OT", "In Ward Rounds"] as const)[index % 5],
    shiftStart: formatTime(shiftStart),
    shiftEnd: formatTime(shiftEnd),
    currentLocation: (["OPD", "ER", "Ward", "OR"] as const)[index % 4],
    contactPager: `Ext. ${1000 + index}`,
  };
}

// 89 Doctors on Duty
export const doctorsOnDuty: DoctorOnDutyRecord[] = Array.from({ length: 89 }, (_, i) => generateDoctorOnDuty(i));

// ============== APPOINTMENT REQUESTS ==============

function generateAppointmentRequest(index: number): AppointmentRequestRecord {
  const createdDate = subHours(now, Math.floor(Math.random() * 8));
  const preferredDate = addDays(now, 1 + Math.floor(Math.random() * 7));
  preferredDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

  return {
    requestId: `REQ${today.replace(/-/g, "")}${String(index).padStart(4, "0")}`,
    patient: generateName(index + 400),
    contact: generatePhone(),
    preferredDateTime: formatDateTime(preferredDate),
    department: departments[index % departments.length],
    preferredProvider: Math.random() > 0.3 ? doctors[index % doctors.length] : undefined,
    reason: visitReasons[index % visitReasons.length],
    urgency: (["Low", "Med", "High"] as const)[index % 3],
    source: (["Call", "Portal", "Walk-in", "Referral"] as const)[index % 4],
    insuranceVerified: Math.random() > 0.3,
    status: (["New", "Pending", "Scheduled", "Rejected"] as const)[index % 4],
    createdAt: formatDateTime(createdDate),
  };
}

// 342 Appointment Requests
export const appointmentRequests: AppointmentRequestRecord[] = Array.from({ length: 342 }, (_, i) => generateAppointmentRequest(i));

// ============== LAB ORDERS ==============

function generateLabOrder(index: number): LabOrderRecord {
  const orderDate = subHours(now, Math.floor(Math.random() * 8));
  const isIP = index % 3 === 0;

  return {
    orderId: `LAB${today.replace(/-/g, "")}${String(index).padStart(4, "0")}`,
    patient: generateName(index + 500),
    ageSex: generateAgeSex(index),
    location: isIP ? `Ward-${["A", "B", "C"][index % 3]}/Bed ${index % 10 + 1}` : "OP",
    tests: testPanels[index % testPanels.length],
    priority: index % 5 === 0 ? "Stat" : "Routine",
    status: (["Ordered", "Collected", "In-Process", "Completed", "Verified"] as const)[index % 5],
    specimenType: specimenTypes[index % specimenTypes.length],
    collectedAt: index % 5 !== 0 ? formatDateTime(subMinutes(now, 30 + Math.floor(Math.random() * 60))) : undefined,
    resultETA: index % 5 < 3 ? formatTime(subMinutes(now, -60)) : undefined,
    criticalResult: index % 20 === 0,
    orderTime: formatDateTime(orderDate),
  };
}

// 156 Lab Orders
export const labOrders: LabOrderRecord[] = Array.from({ length: 156 }, (_, i) => generateLabOrder(i));

// ============== SURGERIES ==============

function generateSurgery(index: number): SurgeryRecord {
  const startDate = new Date(now);
  startDate.setHours(7 + Math.floor(index / 3), (index * 20) % 60, 0, 0);

  return {
    caseId: `SURG${today.replace(/-/g, "")}${String(index).padStart(3, "0")}`,
    patient: generateName(index + 600),
    ageSex: generateAgeSex(index),
    procedure: procedures[index % procedures.length],
    surgeon: doctors[index % doctors.length],
    orRoom: `OR-${(index % 5) + 1}`,
    startTime: formatDateTime(startDate),
    estimatedDuration: `${1 + Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 4) * 15}m`,
    status: (["Scheduled", "In-Progress", "Completed", "Canceled"] as const)[index % 4],
    anesthesiaType: (["General", "Spinal", "Local", "Epidural"] as const)[index % 4],
    asaClass: `ASA ${(index % 4) + 1}`,
    postOpBedReserved: Math.random() > 0.2,
  };
}

// 24 Surgeries
export const surgeries: SurgeryRecord[] = Array.from({ length: 24 }, (_, i) => generateSurgery(i));

// ============== MEDICINE ORDERS ==============

function generateMedicineOrder(index: number): MedicineOrderRecord {
  const orderDate = subHours(now, Math.floor(Math.random() * 6));
  const isIP = index % 2 === 0;

  return {
    orderId: `RX${today.replace(/-/g, "")}${String(index).padStart(4, "0")}`,
    patient: generateName(index + 700),
    location: isIP ? `Ward-${["A", "B", "C"][index % 3]}/Bed ${index % 10 + 1}` : "OP",
    prescriber: doctors[index % doctors.length],
    medications: medicationNames.slice(0, 1 + Math.floor(Math.random() * 3)).join(", "),
    route: (["PO", "IV", "IM", "SC", "Topical"] as const)[index % 5],
    priority: index % 8 === 0 ? "Stat" : "Routine",
    status: (["Pending", "Verifying", "Verified", "Dispensed", "Administered", "Canceled"] as const)[index % 6],
    allergiesFlag: index % 15 === 0,
    interactionsFlag: index % 25 === 0,
    dispensedAt: index % 6 >= 3 ? formatDateTime(subMinutes(now, Math.floor(Math.random() * 60))) : undefined,
    orderTime: formatDateTime(orderDate),
  };
}

// 89 Medicine Orders
export const medicineOrders: MedicineOrderRecord[] = Array.from({ length: 89 }, (_, i) => generateMedicineOrder(i));

// ============== RADIOLOGY ORDERS ==============

function generateRadiologyOrder(index: number): RadiologyOrderRecord {
  const scheduledDate = new Date(now);
  scheduledDate.setHours(8 + Math.floor(index / 4), (index * 15) % 60, 0, 0);
  const orderDate = subHours(scheduledDate, 1 + Math.floor(Math.random() * 4));
  const isIP = index % 3 === 0;

  return {
    orderId: `RAD${today.replace(/-/g, "")}${String(index).padStart(4, "0")}`,
    patient: generateName(index + 800),
    location: isIP ? `Ward-${["A", "B", "C"][index % 3]}/Bed ${index % 10 + 1}` : "OP",
    modality: (["X-ray", "CT", "MRI", "US", "Fluoro", "Mammo"] as const)[index % 6],
    exam: radiologyExams[index % radiologyExams.length],
    priority: index % 6 === 0 ? "Stat" : "Routine",
    status: (["Ordered", "Scheduled", "In-Progress", "Completed", "Finalized"] as const)[index % 5],
    scheduledTime: formatDateTime(scheduledDate),
    imagingLocation: `RAD-${(index % 4) + 1}`,
    contrast: index % 4 === 0,
    pregnancySafetyFlags: index % 10 === 0 ? "Verify pregnancy status" : undefined,
    orderTime: formatDateTime(orderDate),
  };
}

// 34 Radiology Orders
export const radiologyOrders: RadiologyOrderRecord[] = Array.from({ length: 34 }, (_, i) => generateRadiologyOrder(i));

// ============== LOW STOCK ==============

const inventoryItems = [
  "Paracetamol 500mg", "Amoxicillin 250mg", "Surgical Gloves (L)", "Syringes 5ml",
  "N95 Masks", "IV Cannula 20G", "Gauze Pads 4x4", "Alcohol Swabs",
  "Bandages 3in", "Normal Saline 500ml", "Dextrose 5%", "Suture Kit",
  "Blood Collection Tubes", "Catheter 16F", "Oxygen Masks", "Hand Sanitizer 500ml",
  "Insulin Syringes", "ECG Electrodes", "Pulse Oximeter Probes", "BP Cuffs",
  "Nebulizer Masks", "Sterile Drapes", "Surgical Blades", "Tourniquet",
  "Urinary Bags", "NG Tubes", "Tracheostomy Tubes", "Endotracheal Tubes",
  "Central Line Kits", "Arterial Line Kits", "PICC Line Kits", "Chest Tubes",
  "Wound Vac Canisters", "Ostomy Bags"
];

const suppliers = ["MedSupply Co.", "PharmaCare Ltd.", "HealthStock Inc.", "MedEquip Solutions", "Hospital Supplies Ltd."];

function generateLowStockItem(index: number): LowStockRecord {
  const reorderPoint = 50 + Math.floor(Math.random() * 100);
  const parLevel = reorderPoint * 2;
  const avgDailyUse = 5 + Math.floor(Math.random() * 20);
  const onHand = Math.floor(reorderPoint * (0.1 + Math.random() * 0.9));
  const daysOfStockLeft = Math.round((onHand / avgDailyUse) * 10) / 10;

  return {
    itemName: inventoryItems[index % inventoryItems.length],
    category: (["Drug", "Consumable", "Device"] as const)[index % 3],
    onHand,
    reorderPoint,
    parLevel,
    avgDailyUse,
    daysOfStockLeft,
    onOrder: Math.random() > 0.6 ? Math.floor(Math.random() * parLevel) : 0,
    supplier: suppliers[index % suppliers.length],
    leadTimeDays: 2 + Math.floor(Math.random() * 7),
    suggestedReorderQty: parLevel - onHand,
    severity: daysOfStockLeft <= 2 || onHand === 0 ? "Critical" : daysOfStockLeft <= 5 ? "Low" : "Normal",
  };
}

// 34 Low Stock Items
export const lowStockItems: LowStockRecord[] = Array.from({ length: 34 }, (_, i) => generateLowStockItem(i))
  .sort((a, b) => a.daysOfStockLeft - b.daysOfStockLeft);
