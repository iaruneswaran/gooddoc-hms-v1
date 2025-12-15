// Mock data for Overview list pages

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  assignedDoctor: string;
  status: "OP" | "IP" | "ER";
  visitStatus?: "Waiting" | "In_Consultation" | "Completed";
  admitDate: string;
  visitDate?: string;
  checkInDate?: string;
  dischargeDate?: string;
  dischargeStatus?: "Completed" | "Pending Clearance";
  roomBed?: string;
  appointmentTime?: string;
  arrivalTime?: string;
  hasAppointment?: boolean;
  isIcu?: boolean;
  lengthOfStay?: number;
}

export interface DoctorRecord {
  id: string;
  name: string;
  specialization: string;
  department: string;
  status: "Available" | "In Consultation" | "In Surgery" | "On Break";
  queue: number;
  avgTime: number;
  seenToday: number;
}

export interface LabOrderRecord {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  priority: "STAT" | "High" | "Normal";
  orderingDoctor: string;
  collectedTime?: string;
  createdTime: string;
  resultStatus: "Pending" | "Processing" | "Completed";
  eta?: string;
}

export interface SurgeryRecord {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  orRoom: string;
  anesthesia: string;
  scheduledStart: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  priority: "Emergency" | "Urgent" | "Elective";
}

export interface ERCaseRecord {
  id: string;
  patientId: string;
  patientName: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  arrivalTime: string;
  assignedPhysician: string;
  status: "Waiting" | "Treating" | "Admitted" | "Transferred" | "Discharged";
  erAreaBed: string;
}

export interface PharmacyOrderRecord {
  id: string;
  patientId: string;
  patientName: string;
  prescriber: string;
  itemsCount: number;
  priority: "STAT" | "Normal";
  queueStatus: "Pending" | "Partially Dispensed" | "Dispensed";
  createdTime: string;
}

export interface RadiologyOrderRecord {
  id: string;
  patientId: string;
  patientName: string;
  modality: "X-ray" | "CT" | "MRI" | "US";
  priority: "STAT" | "Urgent" | "Routine";
  scheduledTime: string;
  status: "Waiting" | "In Progress" | "Completed";
  room: string;
}

export interface InventoryItemRecord {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
  lastRefilled: string;
  status: "OK" | "Low" | "Critical";
}

// Generate realistic mock patients
const departments = ["Cardiology", "Orthopedics", "Neurology", "General Medicine", "Pediatrics", "Oncology", "ENT", "Dermatology"];
const doctors = ["Dr. Meera Nair", "Dr. Rajesh Kumar", "Dr. Anita Singh", "Dr. Sunil Reddy", "Dr. Prakash Shah", "Dr. Priya Menon"];
const firstNames = ["Amit", "Priya", "Rahul", "Sneha", "Vikram", "Anjali", "Karthik", "Divya", "Suresh", "Lakshmi"];
const lastNames = ["Sharma", "Patel", "Reddy", "Kumar", "Singh", "Nair", "Menon", "Rao", "Gupta", "Joshi"];

function generatePatient(index: number, overrides: Partial<PatientRecord> = {}): PatientRecord {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const today = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(Math.random() * 10);
  const minute = Math.floor(Math.random() * 60);
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  
  return {
    id: `GD${String(10000 + index).padStart(6, "0")}`,
    name: `${firstName} ${lastName}`,
    age: 18 + Math.floor(Math.random() * 60),
    gender: Math.random() > 0.5 ? "Male" : "Female",
    department: departments[index % departments.length],
    assignedDoctor: doctors[index % doctors.length],
    status: "OP",
    admitDate: today,
    visitDate: `${today}T${timeStr}`,
    roomBed: "-",
    ...overrides,
  };
}

function generateDoctor(index: number, overrides: Partial<DoctorRecord> = {}): DoctorRecord {
  const specializations = ["Cardiologist", "Orthopedic Surgeon", "Neurologist", "General Physician", "Pediatrician", "Oncologist"];
  
  return {
    id: `DOC${String(1000 + index).padStart(4, "0")}`,
    name: doctors[index % doctors.length],
    specialization: specializations[index % specializations.length],
    department: departments[index % departments.length],
    status: "Available",
    queue: Math.floor(Math.random() * 8),
    avgTime: 10 + Math.floor(Math.random() * 15),
    seenToday: Math.floor(Math.random() * 25),
    ...overrides,
  };
}

// Generate 847 OP Patients with visit statuses
const visitStatuses: Array<"Waiting" | "In_Consultation" | "Completed"> = ["Waiting", "In_Consultation", "Completed"];
export const opPatients: PatientRecord[] = Array.from({ length: 847 }, (_, i) =>
  generatePatient(i, { 
    status: "OP",
    visitStatus: visitStatuses[i % 3]
  })
);

// Sub-data counts for OP Patients
export const opSubData = {
  completed: opPatients.filter(p => p.visitStatus === "Completed").length,
  inConsultation: opPatients.filter(p => p.visitStatus === "In_Consultation").length,
  waiting: opPatients.filter(p => p.visitStatus === "Waiting").length,
};

// Generate 234 IP Patients
export const ipPatients: PatientRecord[] = Array.from({ length: 234 }, (_, i) => {
  const isIcu = i < 45; // 45 ICU patients
  const admitDaysAgo = Math.floor(Math.random() * 14);
  return generatePatient(i, {
    status: "IP",
    roomBed: isIcu ? `ICU-${i + 1}` : `${["A", "B", "C", "D"][i % 4]}${100 + Math.floor(i / 4)}-${(i % 4) + 1}`,
    admitDate: new Date(Date.now() - admitDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
    isIcu,
    lengthOfStay: admitDaysAgo,
  });
});

// Sub-data counts for IP Patients
const today = new Date().toISOString().split("T")[0];
export const ipSubData = {
  admittedToday: ipPatients.filter(p => p.admitDate.startsWith(today)).length || 28,
  icuOccupied: ipPatients.filter(p => p.isIcu).length,
  avgLos: Math.round(ipPatients.reduce((sum, p) => sum + (p.lengthOfStay || 0), 0) / ipPatients.length * 10) / 10 || 4.2,
};

// Generate 67 Check-in patients
export const checkInPatients: PatientRecord[] = Array.from({ length: 67 }, (_, i) => {
  const statuses: Array<"OP" | "IP" | "ER"> = ["OP", "OP", "OP", "IP", "ER"];
  const status = statuses[i % statuses.length];
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 7 + Math.floor(i / 7);
  const minute = (i * 9) % 60;
  
  return generatePatient(i, {
    status,
    checkInDate: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    roomBed: status === "IP" ? `${["A", "B", "C"][i % 3]}${100 + i}-1` : status === "ER" ? `ER-${i + 1}` : "-",
  });
});

// Sub-data counts for Check-in
export const checkInSubData = {
  op: checkInPatients.filter(p => p.status === "OP").length,
  ip: checkInPatients.filter(p => p.status === "IP").length,
  er: checkInPatients.filter(p => p.status === "ER").length,
};

// Generate 45 Discharged patients
export const dischargedPatients: PatientRecord[] = Array.from({ length: 45 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 5);
  const minute = (i * 12) % 60;
  const dischargeStatuses: Array<"Completed" | "Pending Clearance"> = ["Completed", "Completed", "Completed", "Pending Clearance"];
  
  return generatePatient(i, {
    status: "IP",
    dischargeDate: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    dischargeStatus: dischargeStatuses[i % dischargeStatuses.length],
    roomBed: `${["A", "B", "C", "D"][i % 4]}${100 + i}-${(i % 4) + 1}`,
    lengthOfStay: 2 + Math.floor(Math.random() * 10),
  });
});

// Sub-data counts for Discharged
export const dischargedSubData = {
  completed: dischargedPatients.filter(p => p.dischargeStatus === "Completed").length,
  pendingClearance: dischargedPatients.filter(p => p.dischargeStatus === "Pending Clearance").length,
  avgLos: Math.round(dischargedPatients.reduce((sum, p) => sum + (p.lengthOfStay || 0), 0) / dischargedPatients.length * 10) / 10 || 5.3,
};

// Generate 89 Doctors on Duty
const doctorStatuses: Array<"Available" | "In Consultation" | "In Surgery" | "On Break"> = [
  "Available", "Available", "In Consultation", "In Consultation", "In Consultation", "On Break", "In Surgery"
];

export const doctorsOnDuty: DoctorRecord[] = Array.from({ length: 89 }, (_, i) =>
  generateDoctor(i, { status: doctorStatuses[i % doctorStatuses.length] })
);

// Generate 342 Scheduled appointments
export const scheduledToday: PatientRecord[] = Array.from({ length: 342 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 40);
  const minute = (i * 3) % 60;
  
  return generatePatient(i, {
    status: "OP",
    appointmentTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    hasAppointment: true,
  });
});

// Generate 156 Lab Reports Pending
const testNames = ["Complete Blood Count", "Lipid Panel", "Liver Function Test", "Kidney Function Test", "Thyroid Panel", "HbA1c", "Urinalysis", "Cardiac Markers"];
const priorities: Array<"STAT" | "High" | "Normal"> = ["STAT", "High", "Normal", "Normal", "Normal"];

export const labReportsPending: LabOrderRecord[] = Array.from({ length: 156 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 7 + Math.floor(i / 20);
  const minute = (i * 7) % 60;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  
  return {
    id: `LAB${String(5000 + i).padStart(6, "0")}`,
    patientId: `GD${String(10000 + i).padStart(6, "0")}`,
    patientName: `${firstName} ${lastName}`,
    testName: testNames[i % testNames.length],
    priority: priorities[i % priorities.length],
    orderingDoctor: doctors[i % doctors.length],
    collectedTime: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    createdTime: `${todayStr}T${String(hour - 1).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    resultStatus: i % 3 === 0 ? "Processing" : "Pending",
    eta: `${String(hour + 2).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
});

// Generate 24 Surgeries Today
const procedures = ["Appendectomy", "Knee Replacement", "Cardiac Bypass", "Cholecystectomy", "Hip Replacement", "Hernia Repair", "Cataract Surgery", "Spinal Fusion"];
const orRooms = ["OR-1", "OR-2", "OR-3", "OR-4", "OR-5"];
const anesthesiaTypes = ["General", "Spinal", "Local", "Epidural"];
const surgeryStatuses: Array<"Scheduled" | "In Progress" | "Completed" | "Cancelled"> = ["Scheduled", "In Progress", "Completed", "Scheduled"];
const surgeryPriorities: Array<"Emergency" | "Urgent" | "Elective"> = ["Elective", "Elective", "Urgent", "Emergency"];

export const surgeriesToday: SurgeryRecord[] = Array.from({ length: 24 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 7 + Math.floor(i / 3);
  const minute = (i * 20) % 60;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  
  return {
    id: `SURG${String(100 + i).padStart(4, "0")}`,
    patientId: `GD${String(20000 + i).padStart(6, "0")}`,
    patientName: `${firstName} ${lastName}`,
    procedure: procedures[i % procedures.length],
    surgeon: doctors[i % doctors.length],
    orRoom: orRooms[i % orRooms.length],
    anesthesia: anesthesiaTypes[i % anesthesiaTypes.length],
    scheduledStart: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    status: surgeryStatuses[i % surgeryStatuses.length],
    priority: surgeryPriorities[i % surgeryPriorities.length],
  };
});

// Generate 15 Emergency Cases
const triageLevels: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 2, 3, 3, 3, 4, 4, 5];
const erStatuses: Array<"Waiting" | "Treating" | "Admitted" | "Transferred" | "Discharged"> = ["Waiting", "Treating", "Treating", "Admitted", "Discharged"];
const erAreas = ["ER-Trauma", "ER-Acute", "ER-Minor", "ER-Resus", "ER-Obs"];

export const emergencyCases: ERCaseRecord[] = Array.from({ length: 15 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 6 + Math.floor(i / 2);
  const minute = (i * 15) % 60;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  
  return {
    id: `ER${String(200 + i).padStart(4, "0")}`,
    patientId: `GD${String(30000 + i).padStart(6, "0")}`,
    patientName: `${firstName} ${lastName}`,
    triageLevel: triageLevels[i % triageLevels.length],
    arrivalTime: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    assignedPhysician: doctors[i % doctors.length],
    status: erStatuses[i % erStatuses.length],
    erAreaBed: `${erAreas[i % erAreas.length]}-${i + 1}`,
  };
});

// Generate 89 Pharmacy Pending Orders
const rxPriorities: Array<"STAT" | "Normal"> = ["STAT", "Normal", "Normal", "Normal"];
const rxStatuses: Array<"Pending" | "Partially Dispensed" | "Dispensed"> = ["Pending", "Pending", "Partially Dispensed"];

export const pharmacyPending: PharmacyOrderRecord[] = Array.from({ length: 89 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 10);
  const minute = (i * 6) % 60;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  
  return {
    id: `RX${String(3000 + i).padStart(6, "0")}`,
    patientId: `GD${String(10000 + i).padStart(6, "0")}`,
    patientName: `${firstName} ${lastName}`,
    prescriber: doctors[i % doctors.length],
    itemsCount: 1 + Math.floor(Math.random() * 6),
    priority: rxPriorities[i % rxPriorities.length],
    queueStatus: rxStatuses[i % rxStatuses.length],
    createdTime: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
});

// Generate 34 Radiology Queue
const modalities: Array<"X-ray" | "CT" | "MRI" | "US"> = ["X-ray", "X-ray", "CT", "MRI", "US"];
const radiologyPriorities: Array<"STAT" | "Urgent" | "Routine"> = ["STAT", "Urgent", "Routine", "Routine"];
const radiologyStatuses: Array<"Waiting" | "In Progress" | "Completed"> = ["Waiting", "Waiting", "In Progress"];
const radiologyRooms = ["RAD-1", "RAD-2", "CT-1", "MRI-1", "US-1", "US-2"];

export const radiologyQueue: RadiologyOrderRecord[] = Array.from({ length: 34 }, (_, i) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 4);
  const minute = (i * 15) % 60;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  
  return {
    id: `RAD${String(4000 + i).padStart(6, "0")}`,
    patientId: `GD${String(10000 + i).padStart(6, "0")}`,
    patientName: `${firstName} ${lastName}`,
    modality: modalities[i % modalities.length],
    priority: radiologyPriorities[i % radiologyPriorities.length],
    scheduledTime: `${todayStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    status: radiologyStatuses[i % radiologyStatuses.length],
    room: radiologyRooms[i % radiologyRooms.length],
  };
});

// Generate 34 Low Stock Items
const itemCategories = ["Medications", "Surgical Supplies", "Lab Consumables", "PPE", "IV Supplies", "Wound Care"];
const suppliers = ["MedSupply Co.", "PharmaCare Ltd.", "HealthStock Inc.", "MedEquip Solutions", "Hospital Supplies Ltd."];
const itemNames = [
  "Paracetamol 500mg", "Amoxicillin 250mg", "Surgical Gloves (L)", "Syringes 5ml",
  "N95 Masks", "IV Cannula 20G", "Gauze Pads 4x4", "Alcohol Swabs",
  "Bandages 3in", "Normal Saline 500ml", "Dextrose 5%", "Suture Kit",
  "Blood Collection Tubes", "Catheter 16F", "Oxygen Masks", "Hand Sanitizer 500ml"
];

export const lowStockItems: InventoryItemRecord[] = Array.from({ length: 34 }, (_, i) => {
  const reorderLevel = 50 + Math.floor(Math.random() * 100);
  const currentStock = Math.floor(reorderLevel * (0.2 + Math.random() * 0.8));
  const isCritical = currentStock < reorderLevel * 0.3;
  
  return {
    id: `INV${String(6000 + i).padStart(6, "0")}`,
    itemName: itemNames[i % itemNames.length],
    category: itemCategories[i % itemCategories.length],
    currentStock,
    reorderLevel,
    unit: i % 3 === 0 ? "boxes" : i % 3 === 1 ? "pcs" : "packs",
    supplier: suppliers[i % suppliers.length],
    lastRefilled: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: isCritical ? "Critical" : "Low",
  };
});
