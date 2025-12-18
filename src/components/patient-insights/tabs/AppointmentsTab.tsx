import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Visit } from "../VisitListItem";
import { User, UserRound, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentsTabProps {
  selectedVisit: Visit | null;
}

// Mock appointments data
const mockAppointments = [
  {
    id: "apt-1",
    patientName: "Anjali Sharma",
    gdid: "005",
    age: 22,
    gender: "F",
    visitId: "V25-006",
    checkInDate: "18-Dec-2025",
    checkInTime: "08:35",
    doctor: "Dr. Priya Menon",
    department: "Oncology",
    status: "Completed",
    tokenTime: "08:26",
    tokenDate: "18-Dec-2025",
    token: "T006",
  },
  {
    id: "apt-2",
    patientName: "Kavitha Sharma",
    gdid: "013",
    age: 57,
    gender: "F",
    visitId: "V25-014",
    checkInDate: "18-Dec-2025",
    checkInTime: "08:31",
    doctor: "Dr. Priya Menon",
    department: "General Medicine",
    status: "Completed",
    tokenTime: "08:18",
    tokenDate: "18-Dec-2025",
    token: "T014",
  },
  {
    id: "apt-3",
    patientName: "Karthik Patel",
    gdid: "021",
    age: 73,
    gender: "M",
    visitId: "V25-022",
    checkInDate: "18-Dec-2025",
    checkInTime: "08:27",
    doctor: "Dr. Priya Menon",
    department: "Orthopedics",
    status: "Completed",
    tokenTime: "08:26",
    tokenDate: "18-Dec-2025",
    token: "T022",
  },
  {
    id: "apt-4",
    patientName: "Sanjay Patel",
    gdid: "029",
    age: 38,
    gender: "M",
    visitId: "V25-030",
    checkInDate: "18-Dec-2025",
    checkInTime: "08:23",
    doctor: "Dr. Priya Menon",
    department: "Pulmonology",
    status: "Completed",
    tokenTime: "08:20",
    tokenDate: "18-Dec-2025",
    token: "T030",
  },
  {
    id: "apt-5",
    patientName: "Ravi Kumar",
    gdid: "035",
    age: 45,
    gender: "M",
    visitId: "V25-036",
    checkInDate: "19-Dec-2025",
    checkInTime: "09:00",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    status: "Scheduled",
    tokenTime: "",
    tokenDate: "",
    token: "",
  },
  {
    id: "apt-6",
    patientName: "Priya Krishnan",
    gdid: "041",
    age: 32,
    gender: "F",
    visitId: "V25-042",
    checkInDate: "19-Dec-2025",
    checkInTime: "10:30",
    doctor: "Dr. Ravi Menon",
    department: "Dermatology",
    status: "Scheduled",
    tokenTime: "",
    tokenDate: "",
    token: "",
  },
];

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "checked-in":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function AppointmentsTab({ selectedVisit }: AppointmentsTabProps) {
  const completedAppointments = mockAppointments.filter(apt => apt.status === "Completed");
  const upcomingAppointments = mockAppointments.filter(apt => apt.status !== "Completed");

  const renderAppointmentRow = (appointment: typeof mockAppointments[0]) => (
    <div
      key={appointment.id}
      className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors items-center"
    >
      {/* Patient Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          appointment.gender === "M" ? "bg-blue-100" : "bg-pink-100"
        }`}>
          {appointment.gender === "M" ? (
            <User className="w-4 h-4 text-blue-600" />
          ) : (
            <UserRound className="w-4 h-4 text-pink-600" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-small font-medium text-foreground truncate">{appointment.patientName}</p>
          <p className="text-caption text-muted-foreground">
            GDID - {appointment.gdid} • {appointment.age} | {appointment.gender}
          </p>
        </div>
      </div>

      {/* Visit ID */}
      <div className="min-w-0">
        <p className="text-small font-mono text-foreground">{appointment.visitId}</p>
        <p className="text-caption text-muted-foreground">
          {appointment.checkInTime}
        </p>
        <p className="text-caption text-muted-foreground">
          {appointment.checkInDate}
        </p>
      </div>

      {/* Doctor & Department */}
      <div className="min-w-0">
        <p className="text-small text-foreground truncate">{appointment.doctor}</p>
        <p className="text-caption text-muted-foreground">{appointment.department}</p>
      </div>

      {/* Status */}
      <div>
        <Badge className={getStatusBadgeVariant(appointment.status)} variant="secondary">
          {appointment.status}
        </Badge>
      </div>

      {/* Token/Queue No. */}
      <div className="min-w-0">
        {appointment.token ? (
          <>
            <p className="text-caption text-muted-foreground">{appointment.tokenTime}</p>
            <p className="text-caption text-muted-foreground">{appointment.tokenDate}</p>
            <p className="text-small font-mono font-medium text-foreground">{appointment.token}</p>
          </>
        ) : (
          <span className="text-caption text-muted-foreground">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Patient 360</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-auto">
      {/* Completed Appointments */}
      <div className="mb-6">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <h3 className="text-label font-semibold text-foreground">
            Completed ({completedAppointments.length})
          </h3>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-4 py-2 border-b border-border bg-muted/20">
          <span className="text-label text-muted-foreground">Patient</span>
          <span className="text-label text-muted-foreground">Visit ID</span>
          <span className="text-label text-muted-foreground">Doctor</span>
          <span className="text-label text-muted-foreground">Status</span>
          <span className="text-label text-muted-foreground">Token/Queue No.</span>
          <span className="text-label text-muted-foreground text-right">Actions</span>
        </div>

        {/* Completed Rows */}
        {completedAppointments.map(renderAppointmentRow)}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <h3 className="text-label font-semibold text-foreground">
            Upcoming ({upcomingAppointments.length})
          </h3>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-4 py-2 border-b border-border bg-muted/20">
          <span className="text-label text-muted-foreground">Patient</span>
          <span className="text-label text-muted-foreground">Visit ID</span>
          <span className="text-label text-muted-foreground">Doctor</span>
          <span className="text-label text-muted-foreground">Status</span>
          <span className="text-label text-muted-foreground">Token/Queue No.</span>
          <span className="text-label text-muted-foreground text-right">Actions</span>
        </div>

        {/* Upcoming Rows */}
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(renderAppointmentRow)
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-small text-muted-foreground">No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}
