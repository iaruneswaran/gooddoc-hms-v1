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
  token?: string;
  reason?: string;
}

// Mock appointments for the current patient - sorted with Scheduled first
const getPatientAppointments = (gdid: string): Appointment[] => {
  const appointments: Appointment[] = [
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
      token: "T056",
      reason: "Back pain consultation",
    },
  ];

  // Sort: Scheduled first, then by date descending
  return appointments.sort((a, b) => {
    if (a.status === "Scheduled" && b.status !== "Scheduled") return -1;
    if (a.status !== "Scheduled" && b.status === "Scheduled") return 1;
    return 0;
  });
};

const getStatusBadge = (status: Appointment["status"]) => {
  switch (status) {
    case "Completed":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Completed</Badge>;
    case "Scheduled":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Scheduled</Badge>;
    case "Checked-in":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Checked-in</Badge>;
    case "Cancelled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Cancelled</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

export function AppointmentsTab({ selectedVisit, patient }: AppointmentsTabProps) {
  const appointments = getPatientAppointments(patient.gdid);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-[14px] font-semibold text-foreground">Appointments</h3>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Visit ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Date & Time</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Doctor / Dept</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Reason</th>
                <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Status</th>
                <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Token</th>
                <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className={`hover:bg-muted/20 transition-colors ${
                      appointment.status === "Scheduled" ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="p-3">
                      <p className="text-sm font-medium text-primary">{appointment.visitId}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-foreground">{appointment.date}</p>
                      <p className="text-xs text-muted-foreground">{appointment.time}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-foreground">{appointment.doctor}</p>
                      <p className="text-xs text-muted-foreground">{appointment.department}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-foreground">{appointment.reason || "—"}</p>
                    </td>
                    <td className="p-3 text-center">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="p-3 text-center">
                      {appointment.token ? (
                        <div>
                          <p className="text-sm font-mono font-medium text-foreground">{appointment.token}</p>
                          <p className="text-xs text-muted-foreground">{appointment.tokenTime}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No appointments found</p>
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
