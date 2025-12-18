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

  const renderAppointmentTable = (appointments: typeof mockAppointments, title: string) => (
    <div className="mb-6">
      <div className="px-6 py-3">
        <h3 className="text-label font-semibold text-foreground">
          {title} ({appointments.length})
        </h3>
      </div>
      
      <div className="border rounded-lg overflow-hidden mx-6">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Patient</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Visit ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Doctor</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Token/Queue No.</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t hover:bg-muted/20 transition-colors">
                  {/* Patient Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        appointment.gender === "M" ? "bg-blue-100" : "bg-pink-100"
                      }`}>
                        {appointment.gender === "M" ? (
                          <User className="w-4 h-4 text-blue-600" />
                        ) : (
                          <UserRound className="w-4 h-4 text-pink-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{appointment.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          GDID - {appointment.gdid} • {appointment.age} | {appointment.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Visit ID */}
                  <td className="p-4">
                    <p className="text-sm font-mono text-foreground">{appointment.visitId}</p>
                    <p className="text-xs text-muted-foreground">{appointment.checkInTime}</p>
                    <p className="text-xs text-muted-foreground">{appointment.checkInDate}</p>
                  </td>
                  
                  {/* Doctor & Department */}
                  <td className="p-4">
                    <p className="text-sm text-foreground">{appointment.doctor}</p>
                    <p className="text-xs text-muted-foreground">{appointment.department}</p>
                  </td>
                  
                  {/* Status */}
                  <td className="p-4">
                    <Badge className={getStatusBadgeVariant(appointment.status)} variant="secondary">
                      {appointment.status}
                    </Badge>
                  </td>
                  
                  {/* Token/Queue No. */}
                  <td className="p-4">
                    {appointment.token ? (
                      <div>
                        <p className="text-xs text-muted-foreground">{appointment.tokenTime}</p>
                        <p className="text-xs text-muted-foreground">{appointment.tokenDate}</p>
                        <p className="text-sm font-mono font-medium text-foreground">{appointment.token}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="p-4">
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No {title.toLowerCase()} appointments</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-auto py-4">
      {renderAppointmentTable(upcomingAppointments, "Upcoming")}
      {renderAppointmentTable(completedAppointments, "Completed")}
    </div>
  );
}
