import { Appointment, Patient, Vitals, VisitSummary, LabPackage, LabTest } from "@/types/patient360";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    gdid: "001",
    name: "Harish Kalyan",
    dob: "1980-04-10",
    sex: "M",
    phone: "+91 98765 43210",
    email: "name@example.com",
    whatsapp: "+91 98765 43210",
    bloodGroup: "O+",
    insurance: {
      provider: "Star Life Insurance",
      policyNumber: "IND1000012345",
      validTo: "2025-12-31"
    },
    address: {
      street: "Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "012 345",
      country: "India"
    },
    alerts: {
      allergies: ["Penicillin", "Sulfa drugs"],
      critical: []
    },
    tags: ["Hypertension", "Diabetes"]
  },
  {
    id: "p2",
    gdid: "009",
    name: "Siva Karthikeyan",
    dob: "1990-02-17",
    sex: "M",
    phone: "+91 98765 43211",
    email: "siva@example.com",
    whatsapp: "+91 98765 43211",
    bloodGroup: "B+",
    insurance: {
      provider: "Health Plus Insurance",
      policyNumber: "IND1000012346",
      validTo: "2025-11-30"
    },
    address: {
      street: "T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600 017",
      country: "India"
    },
    alerts: {
      allergies: [],
      critical: []
    },
    tags: []
  },
  // Patients from registry
  {
    id: "P-0001",
    gdid: "P-0001",
    name: "Anaya Shah",
    dob: "1991-03-15",
    sex: "F",
    phone: "98XXXXXX21",
    email: "anaya@email.com",
    whatsapp: "98XXXXXX21",
    bloodGroup: "O+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Mumbai", state: "Maharashtra", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0002",
    gdid: "P-0002",
    name: "Rahul Verma",
    dob: "1980-06-22",
    sex: "M",
    phone: "97XXXXXX54",
    email: "rahul@email.com",
    whatsapp: "97XXXXXX54",
    bloodGroup: "B+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Delhi", state: "Delhi", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0003",
    gdid: "P-0003",
    name: "Sana Ali",
    dob: "1996-09-08",
    sex: "F",
    phone: "96XXXXXX87",
    email: "sana@email.com",
    whatsapp: "96XXXXXX87",
    bloodGroup: "A+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Bengaluru", state: "Karnataka", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0004",
    gdid: "P-0004",
    name: "Arjun Patel",
    dob: "1973-01-12",
    sex: "M",
    phone: "99XXXXXX34",
    email: "arjun@email.com",
    whatsapp: "99XXXXXX34",
    bloodGroup: "AB+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Ahmedabad", state: "Gujarat", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0005",
    gdid: "P-0005",
    name: "Meera Nair",
    dob: "1984-11-30",
    sex: "F",
    phone: "95XXXXXX66",
    email: "meera@email.com",
    whatsapp: "95XXXXXX66",
    bloodGroup: "O−",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Kochi", state: "Kerala", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0006",
    gdid: "P-0006",
    name: "Vikram Singh",
    dob: "1989-04-18",
    sex: "M",
    phone: "94XXXXXX19",
    email: "vikram@email.com",
    whatsapp: "94XXXXXX19",
    bloodGroup: "B−",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Jaipur", state: "Rajasthan", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0007",
    gdid: "P-0007",
    name: "Priya Iyer",
    dob: "1998-07-25",
    sex: "F",
    phone: "93XXXXXX72",
    email: "priya@email.com",
    whatsapp: "93XXXXXX72",
    bloodGroup: "A−",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Chennai", state: "Tamil Nadu", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0008",
    gdid: "P-0008",
    name: "Mohit Agarwal",
    dob: "1965-12-05",
    sex: "M",
    phone: "92XXXXXX58",
    email: "mohit@email.com",
    whatsapp: "92XXXXXX58",
    bloodGroup: "O+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Kolkata", state: "West Bengal", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0009",
    gdid: "P-0009",
    name: "Neha Kulkarni",
    dob: "1992-02-14",
    sex: "F",
    phone: "91XXXXXX44",
    email: "neha@email.com",
    whatsapp: "91XXXXXX44",
    bloodGroup: "B+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Pune", state: "Maharashtra", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  },
  {
    id: "P-0010",
    gdid: "P-0010",
    name: "Ramesh Rao",
    dob: "1977-08-20",
    sex: "M",
    phone: "90XXXXXX11",
    email: "ramesh@email.com",
    whatsapp: "90XXXXXX11",
    bloodGroup: "A+",
    insurance: { provider: "", policyNumber: "", validTo: "" },
    address: { street: "", city: "Hyderabad", state: "Telangana", pincode: "", country: "India" },
    alerts: { allergies: [], critical: [] },
    tags: []
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    date: "2025-08-05",
    time: "07:30",
    token: "T-015",
    patientId: "p1",
    patientName: "Harish Kalyan",
    gdid: "001",
    age: 35,
    sex: "M",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
    chiefComplaint: "Patient presents with recurring chest pain, described as a dull ache in the left side of the chest, worsening with physical exertion. Symptoms began two weeks ago and have gradually increased in frequency. No associated shortness of breath or palpitations noted.",
    mode: "In-Clinic",
    type: "Follow-up",
    doctorName: "Dr. Meera Nair",
    department: "Cardiology",
    vitalsPreview: { bp: "120/80", hr: 78, rr: 18, spo2: 98, temp: 37.2, bg: 95 },
    status: "Scheduled"
  },
  {
    id: "apt2",
    date: "2025-08-05",
    time: "08:00",
    token: "T-016",
    patientId: "p2",
    patientName: "Siva Karthikeyan",
    gdid: "009",
    age: 35,
    sex: "M",
    phone: "+91 98765 43211",
    email: "9876543211@gooddoc.app",
    chiefComplaint: "Annual health screening and routine checkup requested. Patient has no acute complaints but wishes to monitor overall health status as part of preventive care. No significant medical history. Family history of diabetes noted on paternal side.",
    mode: "In-Clinic",
    type: "New",
    doctorName: "Dr. Rajesh Kumar",
    department: "General Medicine",
    vitalsPreview: { bp: "118/78", hr: 70, rr: 16, spo2: 99, temp: 36.8, bg: 92 },
    status: "Scheduled"
  }
];

export const mockVitals: Record<string, Vitals> = {
  p1: {
    patientId: "p1",
    recordedAt: "2025-08-05T07:30:00Z",
    bpSystolic: 120,
    bpDiastolic: 80,
    spo2: 98,
    heartRate: 72,
    respiratoryRate: 16,
    temperatureC: 37,
    weightKg: 70,
    heightCm: 175
  },
  p2: {
    patientId: "p2",
    recordedAt: "2025-08-05T08:00:00Z",
    bpSystolic: 118,
    bpDiastolic: 78,
    spo2: 99,
    heartRate: 68,
    respiratoryRate: 15,
    temperatureC: 36.8,
    weightKg: 75,
    heightCm: 178
  }
};

export const mockVisitHistory: Record<string, VisitSummary[]> = {
  p1: [
    {
      appointmentId: "APP015",
      date: "2025-08-05",
      location: "Outpatient",
      doctorName: "Dr. Sharma",
      reason: "Chest discomfort with mild exertion",
      vitals: mockVitals.p1,
      diagnoses: ["Angina (suspected)", "Hypertension"],
      plan: "ECG ordered, Troponin levels, follow-up in 3 days",
      prescriptions: [
        {
          id: "rx1",
          name: "Aspirin",
          strength: "75mg",
          frequency: "OD",
          durationDays: 30,
          notes: "Take after breakfast"
        },
        {
          id: "rx2",
          name: "Atorvastatin",
          strength: "10mg",
          frequency: "HS",
          durationDays: 30,
          notes: "At bedtime"
        }
      ],
      documents: [
        {
          id: "doc1",
          name: "OPD Summary.pdf",
          sizeKB: 220,
          uploadedBy: "Front Desk",
          uploadedAt: "2025-08-05T09:00:00Z",
          url: "#",
          type: "PDF"
        }
      ],
      aiSummary: "35-year-old male with chest discomfort on exertion. Vitals stable. Cardiac workup initiated with ECG and troponin. Started on aspirin and statin therapy."
    },
    {
      appointmentId: "APP010",
      date: "2025-07-20",
      location: "Outpatient",
      doctorName: "Dr. Kumar",
      reason: "Diabetes follow-up",
      vitals: {
        patientId: "p1",
        recordedAt: "2025-07-20T10:00:00Z",
        bpSystolic: 125,
        bpDiastolic: 82,
        spo2: 97,
        heartRate: 76,
        respiratoryRate: 16,
        temperatureC: 37.1,
        weightKg: 71,
        heightCm: 175
      },
      diagnoses: ["Type 2 Diabetes Mellitus", "Hypertension"],
      plan: "Continue current medications, dietary counseling",
      prescriptions: [
        {
          id: "rx3",
          name: "Metformin",
          strength: "500mg",
          frequency: "BD",
          durationDays: 30,
          notes: "After meals"
        }
      ],
      documents: [
        {
          id: "doc2",
          name: "Discharge Report.pdf",
          sizeKB: 540,
          uploadedBy: "Ward A",
          uploadedAt: "2025-07-20T14:00:00Z",
          url: "#",
          type: "PDF"
        }
      ],
      aiSummary: "Diabetes management visit. HbA1c at 7.2%. Blood pressure slightly elevated. Medication compliance good. Advised continued monitoring and lifestyle modifications."
    }
  ]
};

export const labPackages: LabPackage[] = [
  {
    code: "PKG001",
    name: "Full Body Health Check",
    price: 1999,
    includes: [
      "Complete Blood Count",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Function Test",
      "Thyroid Profile"
    ]
  },
  {
    code: "PKG002",
    name: "Diabetic Care Panel",
    price: 899,
    includes: [
      "HbA1c",
      "Fasting Glucose",
      "Post Meal Glucose",
      "Lipid Profile"
    ]
  },
  {
    code: "PKG003",
    name: "Heart Health Package",
    price: 2499,
    includes: [
      "ECG",
      "Echo Cardiography",
      "Lipid Profile",
      "CRP",
      "Troponin"
    ]
  }
];

export const labTests: LabTest[] = [
  { code: "LAB001", name: "Complete Blood Count (CBC)", price: 200, type: "Lab" },
  { code: "LAB002", name: "Liver Function Test (LFT)", price: 400, type: "Lab" },
  { code: "LAB003", name: "Kidney Function Test (KFT)", price: 350, type: "Lab" },
  { code: "LAB004", name: "Lipid Profile", price: 500, type: "Lab" },
  { code: "LAB005", name: "HbA1c", price: 450, type: "Lab" },
  { code: "LAB006", name: "Thyroid Profile", price: 600, type: "Lab" },
  { code: "RAD001", name: "X-Ray Chest", price: 300, type: "Radiology" },
  { code: "RAD002", name: "CT Scan", price: 3500, type: "Radiology" },
  { code: "RAD003", name: "MRI", price: 6000, type: "Radiology" },
  { code: "RAD004", name: "Ultrasound", price: 800, type: "Radiology" }
];
