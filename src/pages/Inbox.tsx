import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface PendingAppointment {
  id: string;
  patientName: string;
  patientMRN: string;
  patientAvatar?: string;
  appointmentType: "consultation" | "lab";
  requestedDateTime?: string;
  status: string;
  mode?: string;
  location?: string;
  reason: string;
}

const mockAppointments: PendingAppointment[] = [
  {
    id: "APT-001",
    patientName: "Sarah Johnson",
    patientMRN: "MRN-445821",
    appointmentType: "consultation",
    requestedDateTime: "Jan 15, 2025 at 10:00 AM",
    status: "Needs scheduling",
    mode: "In-person",
    location: "Main Clinic",
    reason: "Follow-up consultation for chronic back pain management and medication review",
  },
  {
    id: "APT-002",
    patientName: "Michael Chen",
    patientMRN: "MRN-332109",
    appointmentType: "lab",
    requestedDateTime: "Jan 16, 2025 at 8:00 AM",
    status: "Needs scheduling",
    mode: "Home collection",
    reason: "Routine blood work - Complete blood count and lipid panel",
  },
  {
    id: "APT-003",
    patientName: "Emily Davis",
    patientMRN: "MRN-778934",
    appointmentType: "consultation",
    status: "Needs scheduling",
    mode: "Virtual",
    reason: "New patient consultation for anxiety and stress management",
  },
  {
    id: "APT-004",
    patientName: "Robert Martinez",
    patientMRN: "MRN-556782",
    appointmentType: "lab",
    requestedDateTime: "Jan 17, 2025 at 2:00 PM",
    status: "Needs scheduling",
    mode: "In-lab",
    location: "Diagnostic Center",
    reason: "Pre-operative screening - ECG and chest X-ray",
  },
];

export default function Inbox() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientMRN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.appointmentType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleSchedule = (appointment: PendingAppointment) => {
    navigate(`/book-appointment?id=${appointment.id}&type=${appointment.appointmentType}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-[196px]">
        <AppHeader breadcrumbs={["Inbox"]} />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <h1 className="text-lg font-semibold text-foreground">Inbox</h1>
                <CalendarWidget />
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, MRN, or appointment type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </Card>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  No appointments to schedule
                </h3>
                <p className="text-muted-foreground">
                  You're all caught up. New requests will appear here.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Patient Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.patientAvatar} />
                      <AvatarFallback>
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {appointment.patientName}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {appointment.patientMRN}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                appointment.appointmentType === "consultation"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {appointment.appointmentType === "consultation"
                                ? "Consultation"
                                : "Lab"}
                            </Badge>
                            {appointment.mode && (
                              <span className="text-sm text-muted-foreground">
                                {appointment.mode}
                              </span>
                            )}
                            {appointment.location && (
                              <span className="text-sm text-muted-foreground">
                                • {appointment.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {appointment.requestedDateTime && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Requested: {appointment.requestedDateTime}
                        </p>
                      )}

                      <p className="text-sm text-foreground line-clamp-2 mb-3">
                        {appointment.reason}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleSchedule(appointment)}
                          size="sm"
                        >
                          Schedule
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Contact patient</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
