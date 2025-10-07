import { User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: string;
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

const appointments: Appointment[] = [
  {
    id: "1",
    date: "05 AUG 2025",
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
];

export function AppointmentTable() {
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
