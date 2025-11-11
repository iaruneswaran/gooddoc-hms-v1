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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("appointment");

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
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between gap-6">
              <h1 className="text-lg font-semibold text-foreground">Inbox</h1>
              <CalendarWidget />
            </div>
          </Card>

          {/* Navigation Tabs with Search */}
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b border-border h-auto p-0 justify-start rounded-none">
                <TabsTrigger 
                  value="appointment" 
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-6 py-3"
                >
                  Appointment
                </TabsTrigger>
                <TabsTrigger 
                  value="scheduled" 
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-6 py-3"
                >
                  Scheduled
                </TabsTrigger>
              </TabsList>
            </Tabs>
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

          {/* Content based on active tab */}
          {activeTab === "appointment" && (
            <>
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
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-[200px_1fr_180px_140px_120px] gap-4 p-4 border-b border-border bg-muted/30">
                <div className="text-sm font-medium text-foreground">Patient Info</div>
                <div className="text-sm font-medium text-foreground">Appointment Details</div>
                <div className="text-sm font-medium text-foreground">Type</div>
                <div className="text-sm font-medium text-foreground">Requested Time</div>
                <div className="text-sm font-medium text-foreground">Action</div>
              </div>

              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="grid grid-cols-[200px_1fr_180px_140px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={appointment.patientAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {appointment.patientName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.patientMRN}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-foreground line-clamp-2 mb-1">
                      {appointment.reason}
                    </p>
                    {appointment.mode && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{appointment.mode}</span>
                        {appointment.location && (
                          <span>• {appointment.location}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-sm text-foreground">
                      {appointment.appointmentType === "consultation"
                        ? "Consultation"
                        : "Lab"}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {appointment.requestedDateTime || "Not specified"}
                  </div>

                  <div>
                    <Button
                      onClick={() => handleSchedule(appointment)}
                      size="sm"
                      className="w-full"
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
            </>
          )}

          {activeTab === "scheduled" && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Scheduled Appointments
                </h3>
                <p className="text-muted-foreground">
                  View all scheduled appointments here.
                </p>
              </div>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
