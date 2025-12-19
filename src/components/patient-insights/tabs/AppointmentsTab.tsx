import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Visit } from "../VisitListItem";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Patient {
  name: string;
  gdid: string;
  age: number;
  gender: string;
}

interface AppointmentsTabProps {
  selectedVisit: Visit | null;
  patient: Patient;
}

interface Appointment {
  id: string;
  visitId: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  status: "Completed" | "Scheduled" | "Checked-in" | "Cancelled";
  tokenTime?: string;
  tokenDate?: string;
  token?: string;
  reason?: string;
}

// Mock appointments for the current patient only
const getPatientAppointments = (gdid: string): Appointment[] => {
  // Return appointments specific to this patient
  return [
    {
      id: "apt-1",
      visitId: "V25-004",
      date: "20-Dec-2025",
      time: "10:00",
      doctor: "Dr. Meera Nair",
      department: "Cardiology",
      status: "Scheduled",
      reason: "Follow-up consultation",
    },
    {
      id: "apt-2",
      visitId: "V25-002",
      date: "15-Dec-2025",
      time: "09:30",
      doctor: "Dr. Priya Menon",
      department: "General Medicine",
      status: "Completed",
      tokenTime: "09:15",
      tokenDate: "15-Dec-2025",
      token: "T042",
      reason: "Annual health checkup",
    },
    {
      id: "apt-3",
      visitId: "V25-001",
      date: "01-Dec-2025",
      time: "11:00",
      doctor: "Dr. Meera Nair",
      department: "Cardiology",
      status: "Completed",
      tokenTime: "10:45",
      tokenDate: "01-Dec-2025",
      token: "T018",
      reason: "Chest pain evaluation",
    },
    {
      id: "apt-4",
      visitId: "V24-089",
      date: "15-Nov-2025",
      time: "14:30",
      doctor: "Dr. Arun Kumar",
      department: "Orthopedics",
      status: "Completed",
      tokenTime: "14:20",
      tokenDate: "15-Nov-2025",
      token: "T056",
      reason: "Back pain consultation",
    },
  ];
};

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "checked-in":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function AppointmentsTab({ selectedVisit, patient }: AppointmentsTabProps) {
  const appointments = getPatientAppointments(patient.gdid);

  return (
    <div className="h-full overflow-auto py-4">
    <div className="mb-6">
        <div className="px-6 pt-6">
          <h3 className="text-[14px] font-semibold text-foreground">
            Appointments
          </h3>
        </div>
        
        <div className="border rounded-lg overflow-hidden mx-6 bg-white dark:bg-card">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Visit ID</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Date & Time</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Doctor</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Reason</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Token</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-card">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t hover:bg-muted/20 transition-colors">
                    {/* Visit ID */}
                    <td className="p-4">
                      <p className="text-sm font-mono font-medium text-foreground">{appointment.visitId}</p>
                    </td>
                    
                    {/* Date & Time */}
                    <td className="p-4">
                      <p className="text-sm text-foreground">{appointment.time}</p>
                      <p className="text-xs text-muted-foreground">{appointment.date}</p>
                    </td>
                    
                    {/* Doctor & Department */}
                    <td className="p-4">
                      <p className="text-sm text-foreground">{appointment.doctor}</p>
                      <p className="text-xs text-muted-foreground">{appointment.department}</p>
                    </td>
                    
                    {/* Reason */}
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">{appointment.reason || "—"}</p>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <Badge className={getStatusBadgeVariant(appointment.status)} variant="secondary">
                        {appointment.status}
                      </Badge>
                    </td>
                    
                    {/* Token */}
                    <td className="p-4">
                      {appointment.token ? (
                        <div>
                          <p className="text-sm font-mono font-medium text-foreground">{appointment.token}</p>
                          <p className="text-xs text-muted-foreground">{appointment.tokenTime}</p>
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
                          <DropdownMenuItem>View Notes</DropdownMenuItem>
                          {appointment.status === "Scheduled" && (
                            <DropdownMenuItem>Check In</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No appointments</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
