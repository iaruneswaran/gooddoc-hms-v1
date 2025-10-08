import { User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: string;
  category: string;
  patient: {
    name: string;
    id: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
  };
  summary: string;
  specialty: string;
  doctor: string;
  token: string;
  time: string;
}

const allAppointments: Appointment[] = [
  // Outpatient Care
  {
    id: "1",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Harish Kalyan",
      id: "GDID - 001",
      age: 35,
      gender: "M",
      phone: "+91 98765 43210",
      email: "9876543210@gooddoc.app",
    },
    summary: "2 days Fever with tiredness.",
    specialty: "Cardiology",
    doctor: "Dr. Meera Nair",
    token: "T-015",
    time: "10:30 AM",
  },
  {
    id: "2",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Sneha Reddy",
      id: "GDID - 004",
      age: 28,
      gender: "F",
      phone: "+91 98765 43211",
      email: "sneha.reddy@gooddoc.app",
    },
    summary: "Regular checkup and blood pressure monitoring.",
    specialty: "General Medicine",
    doctor: "Dr. Rajesh Kumar",
    token: "T-016",
    time: "11:00 AM",
  },
  {
    id: "3",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Amit Sharma",
      id: "GDID - 012",
      age: 42,
      gender: "M",
      phone: "+91 98765 43212",
      email: "amit.sharma@gooddoc.app",
    },
    summary: "Follow-up consultation for diabetes management.",
    specialty: "Endocrinology",
    doctor: "Dr. Priya Singh",
    token: "T-017",
    time: "11:30 AM",
  },
  // Inpatient Care
  {
    id: "4",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Lakshmi Devi",
      id: "GDID - 023",
      age: 58,
      gender: "F",
      phone: "+91 98765 43213",
      email: "lakshmi.devi@gooddoc.app",
    },
    summary: "Post-operative care - Hip replacement surgery.",
    specialty: "Orthopedics",
    doctor: "Dr. Vijay Mohan",
    token: "W-201",
    time: "09:00 AM",
  },
  {
    id: "5",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Ravi Krishnan",
      id: "GDID - 034",
      age: 45,
      gender: "M",
      phone: "+91 98765 43214",
      email: "ravi.krishnan@gooddoc.app",
    },
    summary: "Admitted for cardiac monitoring and treatment.",
    specialty: "Cardiology",
    doctor: "Dr. Meera Nair",
    token: "W-202",
    time: "09:30 AM",
  },
  {
    id: "6",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Deepa Menon",
      id: "GDID - 045",
      age: 32,
      gender: "F",
      phone: "+91 98765 43215",
      email: "deepa.menon@gooddoc.app",
    },
    summary: "Maternity care - Pre-delivery observation.",
    specialty: "Obstetrics",
    doctor: "Dr. Anita Desai",
    token: "W-203",
    time: "10:00 AM",
  },
  // Diagnostics
  {
    id: "7",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Suresh Babu",
      id: "GDID - 056",
      age: 52,
      gender: "M",
      phone: "+91 98765 43216",
      email: "suresh.babu@gooddoc.app",
    },
    summary: "Full body health checkup and blood tests.",
    specialty: "Laboratory",
    doctor: "Dr. Kavita Iyer",
    token: "D-101",
    time: "08:00 AM",
  },
  {
    id: "8",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Priya Nair",
      id: "GDID - 067",
      age: 29,
      gender: "F",
      phone: "+91 98765 43217",
      email: "priya.nair@gooddoc.app",
    },
    summary: "CT scan for abdominal pain investigation.",
    specialty: "Radiology",
    doctor: "Dr. Arun Kumar",
    token: "D-102",
    time: "08:30 AM",
  },
  {
    id: "9",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Karthik Raj",
      id: "GDID - 078",
      age: 38,
      gender: "M",
      phone: "+91 98765 43218",
      email: "karthik.raj@gooddoc.app",
    },
    summary: "MRI brain scan for persistent headaches.",
    specialty: "Neurology",
    doctor: "Dr. Sanjay Reddy",
    token: "D-103",
    time: "09:00 AM",
  },
  // Emergency
  {
    id: "10",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Anjali Verma",
      id: "GDID - 089",
      age: 24,
      gender: "F",
      phone: "+91 98765 43219",
      email: "anjali.verma@gooddoc.app",
    },
    summary: "Acute chest pain - Possible cardiac event.",
    specialty: "Emergency Medicine",
    doctor: "Dr. Ramesh Pillai",
    token: "E-501",
    time: "07:15 AM",
  },
  {
    id: "11",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Mahesh Kumar",
      id: "GDID - 090",
      age: 55,
      gender: "M",
      phone: "+91 98765 43220",
      email: "mahesh.kumar@gooddoc.app",
    },
    summary: "Severe allergic reaction - Anaphylaxis.",
    specialty: "Emergency Medicine",
    doctor: "Dr. Lakshmi Prasad",
    token: "E-502",
    time: "07:45 AM",
  },
  {
    id: "12",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Nisha Patel",
      id: "GDID - 091",
      age: 31,
      gender: "F",
      phone: "+91 98765 43221",
      email: "nisha.patel@gooddoc.app",
    },
    summary: "Road traffic accident - Multiple injuries.",
    specialty: "Trauma Surgery",
    doctor: "Dr. Anil Reddy",
    token: "E-503",
    time: "08:15 AM",
  },
];

interface AppointmentTableProps {
  category?: string;
}

export function AppointmentTable({ category = "outpatient-care" }: AppointmentTableProps) {
  const appointments = allAppointments.filter(apt => apt.category === category);
  const handleCheckIn = () => {
    toast({
      title: "Success",
      description: "Patient has been successfully checked in.",
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-[180px_220px_1fr_200px_150px_120px] gap-4 p-4 border-b border-border bg-muted/30">
        <div className="text-sm font-medium text-foreground">Patient Info</div>
        <div className="text-sm font-medium text-foreground">Contact Details</div>
        <div className="text-sm font-medium text-foreground">Appointment Summary</div>
        <div className="text-sm font-medium text-foreground">Specialty</div>
        <div className="text-sm font-medium text-foreground">Token & Time</div>
        <div className="text-sm font-medium text-foreground">Action</div>
      </div>

      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <div className="p-4 text-sm text-muted-foreground">{appointment.date}</div>
          <div className="grid grid-cols-[180px_220px_1fr_200px_150px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{appointment.patient.name}</div>
                <div className="text-xs text-muted-foreground">
                  {appointment.patient.id} • {appointment.patient.age} | {appointment.patient.gender}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{appointment.patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate">{appointment.patient.email}</span>
              </div>
            </div>

            <div className="text-sm text-foreground">{appointment.summary}</div>

            <div className="text-sm text-foreground">
              {appointment.doctor} – {appointment.specialty}
            </div>

            <div className="text-sm font-medium text-foreground">
              {appointment.token} | {appointment.time}
            </div>

            <div>
              <Button
                onClick={handleCheckIn}
                variant="outline"
                size="sm"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Check In
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
