import { useState } from "react";
import { User, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TokenGenerationCard } from "./TokenGenerationCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    id: "5",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Priya Sharma",
      id: "GDID - 006",
      age: 42,
      gender: "F",
      phone: "+91 98765 43211",
      email: "9876543211@gooddoc.app",
    },
    summary: "Follow-up consultation for diabetes management.",
    specialty: "Endocrinology",
    doctor: "Dr. Rajesh Kumar",
    token: "T-016",
    time: "11:00 AM",
  },
  {
    id: "6",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Arun Patel",
      id: "GDID - 007",
      age: 55,
      gender: "M",
      phone: "+91 98765 43212",
      email: "9876543212@gooddoc.app",
    },
    summary: "Chronic back pain, needs physiotherapy consultation.",
    specialty: "Orthopedics",
    doctor: "Dr. Anita Singh",
    token: "T-017",
    time: "11:30 AM",
  },
  {
    id: "7",
    date: "05 AUG 2025",
    category: "outpatient-care",
    patient: {
      name: "Kavya Iyer",
      id: "GDID - 008",
      age: 29,
      gender: "F",
      phone: "+91 98765 43213",
      email: "9876543213@gooddoc.app",
    },
    summary: "Skin rash and allergic reaction.",
    specialty: "Dermatology",
    doctor: "Dr. Sunil Reddy",
    token: "T-018",
    time: "12:00 PM",
  },
  // Inpatient Care
  {
    id: "2",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Sneha Reddy",
      id: "GDID - 004",
      age: 28,
      gender: "F",
      phone: "+91 98765 43210",
      email: "9876543210@gooddoc.app",
    },
    summary: "Scheduled cataract surgery",
    specialty: "Ophthalmology",
    doctor: "Dr. A. Joseph",
    token: "T-015",
    time: "10:30 AM",
  },
  {
    id: "8",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Ramesh Gupta",
      id: "GDID - 009",
      age: 60,
      gender: "M",
      phone: "+91 98765 43214",
      email: "9876543214@gooddoc.app",
    },
    summary: "Post-operative care - Hip replacement surgery.",
    specialty: "Orthopedics Ward",
    doctor: "Dr. Prakash Nair",
    token: "T-019",
    time: "09:00 AM",
  },
  {
    id: "9",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Lakshmi Venkat",
      id: "GDID - 010",
      age: 45,
      gender: "F",
      phone: "+91 98765 43215",
      email: "9876543215@gooddoc.app",
    },
    summary: "Recovery from pneumonia, on IV antibiotics.",
    specialty: "General Medicine",
    doctor: "Dr. Meera Nair",
    token: "T-020",
    time: "02:00 PM",
  },
  {
    id: "10",
    date: "05 AUG 2025",
    category: "inpatient-care",
    patient: {
      name: "Sanjay Kumar",
      id: "GDID - 011",
      age: 52,
      gender: "M",
      phone: "+91 98765 43216",
      email: "9876543216@gooddoc.app",
    },
    summary: "Cardiac monitoring post angioplasty.",
    specialty: "Cardiology Ward",
    doctor: "Dr. Rajesh Kumar",
    token: "T-021",
    time: "03:30 PM",
  },
  // Diagnostics
  {
    id: "3",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Divya Menon",
      id: "GDID - 002",
      age: 30,
      gender: "F",
      phone: "+91 98765 43210",
      email: "9876543210@gooddoc.app",
    },
    summary: "Chest pain – referred for ECG",
    specialty: "ECG Room 2",
    doctor: "Radiology Dept",
    token: "T-015",
    time: "10:30 AM",
  },
  {
    id: "11",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Mohan Krishna",
      id: "GDID - 012",
      age: 38,
      gender: "M",
      phone: "+91 98765 43217",
      email: "9876543217@gooddoc.app",
    },
    summary: "Abdominal ultrasound for suspected gallstones.",
    specialty: "Ultrasound Room 1",
    doctor: "Dr. Anita Singh",
    token: "T-022",
    time: "01:00 PM",
  },
  {
    id: "12",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Anjali Desai",
      id: "GDID - 013",
      age: 33,
      gender: "F",
      phone: "+91 98765 43218",
      email: "9876543218@gooddoc.app",
    },
    summary: "MRI scan for persistent headaches.",
    specialty: "MRI Lab",
    doctor: "Radiology Dept",
    token: "T-023",
    time: "02:30 PM",
  },
  {
    id: "13",
    date: "05 AUG 2025",
    category: "diagnostics",
    patient: {
      name: "Ravi Bhat",
      id: "GDID - 014",
      age: 47,
      gender: "M",
      phone: "+91 98765 43219",
      email: "9876543219@gooddoc.app",
    },
    summary: "Blood tests - Complete Blood Count and Lipid Profile.",
    specialty: "Lab Room 3",
    doctor: "Laboratory Dept",
    token: "T-024",
    time: "09:30 AM",
  },
  // Emergency
  {
    id: "4",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Vikram Singh",
      id: "GDID - 005",
      age: 40,
      gender: "M",
      phone: "+91 98765 43210",
      email: "9876543210@gooddoc.app",
    },
    summary: "Accident injury – bleeding in leg",
    specialty: "Emergency Surgery Team",
    doctor: "ICU",
    token: "T-015",
    time: "10:30 AM",
  },
  {
    id: "14",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Meena Pillai",
      id: "GDID - 015",
      age: 65,
      gender: "F",
      phone: "+91 98765 43220",
      email: "9876543220@gooddoc.app",
    },
    summary: "Severe chest pain, suspected heart attack.",
    specialty: "Emergency Cardiology",
    doctor: "Dr. Meera Nair",
    token: "T-025",
    time: "08:15 AM",
  },
  {
    id: "15",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Suresh Nambiar",
      id: "GDID - 016",
      age: 48,
      gender: "M",
      phone: "+91 98765 43221",
      email: "9876543221@gooddoc.app",
    },
    summary: "High fever and seizures, needs immediate attention.",
    specialty: "Emergency Neurology",
    doctor: "ICU",
    token: "T-026",
    time: "07:45 AM",
  },
  {
    id: "16",
    date: "05 AUG 2025",
    category: "emergency",
    patient: {
      name: "Deepa Thomas",
      id: "GDID - 017",
      age: 31,
      gender: "F",
      phone: "+91 98765 43222",
      email: "9876543222@gooddoc.app",
    },
    summary: "Severe allergic reaction to medication.",
    specialty: "Emergency Medicine",
    doctor: "Dr. Sunil Reddy",
    token: "T-027",
    time: "11:45 AM",
  },
];

interface AppointmentTableProps {
  category?: string;
}

export function AppointmentTable({ category = "outpatient-care" }: AppointmentTableProps) {
  const navigate = useNavigate();
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set());
  const [tokenGeneratedIds, setTokenGeneratedIds] = useState<Set<string>>(new Set());
  const [activeTokenCard, setActiveTokenCard] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAppointmentId, setPendingAppointmentId] = useState<string | null>(null);
  const appointments = allAppointments.filter(apt => apt.category === category);
  
  const handleCheckInClick = (appointmentId: string) => {
    setPendingAppointmentId(appointmentId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmCheckIn = () => {
    if (pendingAppointmentId) {
      setCheckedInIds(prev => new Set(prev).add(pendingAppointmentId));
      setActiveTokenCard(pendingAppointmentId);
      setPendingAppointmentId(null);
    }
    setConfirmDialogOpen(false);
  };

  const handleTokenGenerationComplete = (appointmentId: string) => {
    setTokenGeneratedIds(prev => new Set(prev).add(appointmentId));
    setActiveTokenCard(null);
  };

  const getSpecialtyLabel = () => {
    switch (category) {
      case "inpatient-care":
        return "Inpatient Unit";
      case "diagnostics":
        return "Diagnostic Service";
      case "emergency":
        return "Emergency Unit";
      default:
        return "Specialty";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-[200px_180px_1fr_200px_150px_120px] gap-4 p-4 border-b border-border bg-muted/30">
        <div className="text-label text-muted-foreground">Patient Info</div>
        <div className="text-label text-muted-foreground">Contact Details</div>
        <div className="text-label text-muted-foreground">Appointment Summary</div>
        <div className="text-label text-muted-foreground">{getSpecialtyLabel()}</div>
        <div className="text-label text-muted-foreground">Token & Time</div>
        <div className="text-label text-muted-foreground">Action</div>
      </div>

      {appointments.map((appointment) => (
        <div key={appointment.id} className="grid grid-cols-[200px_180px_1fr_200px_150px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {appointment.patient.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {appointment.patient.id} • {appointment.patient.age} | {appointment.patient.gender}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>{appointment.patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{appointment.patient.email}</span>
              </div>
            </div>

            <div className="text-sm text-foreground">{appointment.summary}</div>

            <div className="text-sm text-foreground">
              {appointment.doctor} – {appointment.specialty}
            </div>

            <div className="text-sm text-foreground">
              {tokenGeneratedIds.has(appointment.id) ? appointment.token : "Pending"} | {appointment.time}
            </div>

            <div>
              <Button
                onClick={() => handleCheckInClick(appointment.id)}
                variant="default"
                size="sm"
                disabled={checkedInIds.has(appointment.id)}
                className={checkedInIds.has(appointment.id) 
                  ? "w-full cursor-not-allowed opacity-70" 
                  : "w-full"}
              >
                {checkedInIds.has(appointment.id) ? "Checked In" : "Check In"}
              </Button>
            </div>
        </div>
      ))}

      {activeTokenCard && (() => {
        const appointment = appointments.find(apt => apt.id === activeTokenCard);
        return appointment ? (
          <TokenGenerationCard
            token={appointment.token}
            patientName={appointment.patient.name}
            specialty={appointment.specialty}
            doctor={appointment.doctor}
            time={appointment.time}
            onComplete={() => handleTokenGenerationComplete(activeTokenCard)}
          />
        ) : null;
      })()}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="w-[320px] p-0 gap-0 fixed bottom-6 right-6 top-auto left-auto translate-x-0 translate-y-0">
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Confirm to Generate Token</h3>
            
            {pendingAppointmentId && (() => {
              const appointment = appointments.find(apt => apt.id === pendingAppointmentId);
              return appointment ? (
                <>
                  <div className="text-center py-2">
                    <div className="text-2xl font-semibold" style={{ color: '#7e0137' }}>
                      Pending
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{appointment.patient.name}</div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specialty:</span>
                      <span className="text-foreground font-medium">{appointment.doctor} – {appointment.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground font-medium">{appointment.time}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      onClick={handleConfirmCheckIn} 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Please Confirm
                    </Button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
