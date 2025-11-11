import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from "lucide-react";

interface PendingAppointment {
  id: string;
  patientName: string;
  patientGDID: string;
  patientAge: number;
  patientGender: string;
  purpose: string;
  serviceType: "Consultation" | "Laboratory";
  doctor?: string;
  requestedDateTime?: string;
}

const mockAppointments: PendingAppointment[] = [
  {
    id: "APT-001",
    patientName: "Sarah Johnson",
    patientGDID: "445821",
    patientAge: 45,
    patientGender: "F",
    purpose: "Follow-up for chronic back pain; medication review",
    serviceType: "Consultation",
    requestedDateTime: "15 Jan 2025, 10:00 AM",
  },
  {
    id: "APT-002",
    patientName: "Michael Chen",
    patientGDID: "332109",
    patientAge: 38,
    patientGender: "M",
    purpose: "Routine labs: CBC and Lipid Panel",
    serviceType: "Laboratory",
    requestedDateTime: "16 Jan 2025, 8:00 AM",
  },
];

export default function Inbox() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointment");

  const handleSchedule = (appointment: PendingAppointment) => {
    navigate(`/book-appointment?id=${appointment.id}&type=${appointment.serviceType.toLowerCase()}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-[196px]">
        <AppHeader breadcrumbs={["Inbox"]} />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Inbox</h1>
              <CalendarWidget />
            </div>
          </Card>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start mb-6">
              <TabsTrigger 
                value="appointment" 
                className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
              >
                Appointment
              </TabsTrigger>
              <TabsTrigger 
                value="scheduled" 
                className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
              >
                Scheduled
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointment">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[220px_1fr_140px_120px_200px_120px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-sm font-medium text-foreground">Patient Details</div>
                  <div className="text-sm font-medium text-foreground">Purpose</div>
                  <div className="text-sm font-medium text-foreground">Service Type</div>
                  <div className="text-sm font-medium text-foreground">Doctor</div>
                  <div className="text-sm font-medium text-foreground">Requested Date & Time</div>
                  <div className="text-sm font-medium text-foreground">Action</div>
                </div>

                {mockAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No appointments to schedule
                  </div>
                ) : (
                  mockAppointments.map((appointment) => (
                    <div key={appointment.id} className="grid grid-cols-[220px_1fr_140px_120px_200px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                      {/* Patient Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {appointment.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            GDID - {appointment.patientGDID} • {appointment.patientAge} | {appointment.patientGender}
                          </div>
                        </div>
                      </div>

                      {/* Purpose */}
                      <div className="text-sm text-foreground">
                        {appointment.purpose}
                      </div>

                      {/* Service Type */}
                      <div className="text-sm text-foreground">
                        {appointment.serviceType}
                      </div>

                      {/* Doctor */}
                      <div className="text-sm text-muted-foreground">
                        {appointment.doctor || "—"}
                      </div>

                      {/* Requested Date & Time */}
                      <div className="text-sm text-foreground">
                        {appointment.requestedDateTime || "—"}
                      </div>

                      {/* Action */}
                      <div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSchedule(appointment)}
                          className="w-full"
                        >
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No items
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
}
