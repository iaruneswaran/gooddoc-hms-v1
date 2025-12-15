// Mock data for Overview list pages

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  assignedDoctor: string;
  status: "OP" | "IP" | "ER";
  admitDate: string;
  visitDate?: string;
  checkInDate?: string;
  dischargeDate?: string;
  roomBed?: string;
  appointmentTime?: string;
  arrivalTime?: string;
  hasAppointment?: boolean;
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

// Generate 847 OP Patients
export const opPatients: PatientRecord[] = Array.from({ length: 847 }, (_, i) =>
  generatePatient(i, { status: "OP" })
);

// Generate 234 IP Patients
export const ipPatients: PatientRecord[] = Array.from({ length: 234 }, (_, i) =>
  generatePatient(i, {
    status: "IP",
    roomBed: `${["A", "B", "C", "D"][i % 4]}${100 + Math.floor(i / 4)}-${(i % 4) + 1}`,
    admitDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  })
);

// Generate 67 Check-in patients
export const checkInPatients: PatientRecord[] = Array.from({ length: 67 }, (_, i) => {
  const statuses: Array<"OP" | "IP" | "ER"> = ["OP", "OP", "OP", "IP", "ER"];
  const status = statuses[i % statuses.length];
  const today = new Date().toISOString().split("T")[0];
  const hour = 7 + Math.floor(i / 7);
  const minute = (i * 9) % 60;
  
  return generatePatient(i, {
    status,
    checkInDate: `${today}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    roomBed: status === "IP" ? `${["A", "B", "C"][i % 3]}${100 + i}-1` : status === "ER" ? `ER-${i + 1}` : "-",
  });
});

// Generate 45 Discharged patients
export const dischargedPatients: PatientRecord[] = Array.from({ length: 45 }, (_, i) => {
  const today = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 5);
  const minute = (i * 12) % 60;
  
  return generatePatient(i, {
    status: "IP",
    dischargeDate: `${today}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    roomBed: `${["A", "B", "C", "D"][i % 4]}${100 + i}-${(i % 4) + 1}`,
  });
});

// Generate 89 Doctors on Duty
const doctorStatuses: Array<"Available" | "In Consultation" | "In Surgery" | "On Break"> = [
  "Available", "Available", "In Consultation", "In Consultation", "In Consultation", "On Break", "In Surgery"
];

export const doctorsOnDuty: DoctorRecord[] = Array.from({ length: 89 }, (_, i) =>
  generateDoctor(i, { status: doctorStatuses[i % doctorStatuses.length] })
);

// Generate 34 Available Doctors
export const availableDoctors: DoctorRecord[] = Array.from({ length: 34 }, (_, i) =>
  generateDoctor(i, { status: "Available", queue: Math.floor(Math.random() * 5) })
);

// Generate 342 Scheduled appointments
export const scheduledToday: PatientRecord[] = Array.from({ length: 342 }, (_, i) => {
  const today = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 40);
  const minute = (i * 3) % 60;
  
  return generatePatient(i, {
    status: "OP",
    appointmentTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    hasAppointment: true,
  });
});

// Generate 56 Walk-in patients
export const walkInPatients: PatientRecord[] = Array.from({ length: 56 }, (_, i) => {
  const today = new Date().toISOString().split("T")[0];
  const hour = 8 + Math.floor(i / 7);
  const minute = (i * 8) % 60;
  const statuses: Array<"OP" | "ER"> = ["OP", "OP", "OP", "ER"];
  
  return generatePatient(i, {
    status: statuses[i % statuses.length],
    arrivalTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    hasAppointment: false,
  });
});
