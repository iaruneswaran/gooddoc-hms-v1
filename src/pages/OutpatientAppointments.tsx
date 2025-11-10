import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarWidget } from "@/components/CalendarWidget";
import { User, Phone, MessageCircle, Video } from "lucide-react";
import { mockAppointments } from "@/data/patient360.mock";
import { Appointment } from "@/types/patient360";

export default function OutpatientAppointments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "scheduled";
  
  const [activeTab, setActiveTab] = useState(defaultTab);

  const scheduledAppointments = mockAppointments.filter(
    (apt) => apt.status === "Scheduled" || apt.status === "InProgress"
  );
  
  const visitedAppointments = mockAppointments.filter(
    (apt) => apt.status === "Visited"
  );

  const handlePatient360Click = (appointment: Appointment) => {
    navigate(`/patients/${appointment.gdid}/360`);
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const initials = appointment.patientName
      .split(" ")
      .map((n) => n[0])
      .join("");

    return (
      <div
        key={appointment.id}
        className="grid grid-cols-[60px_200px_1fr_200px_140px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
      >
        <div className="text-sm font-medium text-muted-foreground">
          {appointment.time}
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <button
              onClick={() => handlePatient360Click(appointment)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
            >
              {appointment.patientName}
            </button>
            <div className="text-xs text-muted-foreground">
              GDID-{appointment.gdid} • {appointment.age}y | {appointment.sex}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {appointment.type}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {appointment.mode === "In-Clinic" ? "In-Clinic" : "Virtual"}
            </Badge>
          </div>
          {appointment.chiefComplaint && (
            <div className="text-sm text-foreground">
              {appointment.chiefComplaint}
            </div>
          )}
          {appointment.vitalsPreview && (
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>BP: {appointment.vitalsPreview.bp}</span>
              <span>HR: {appointment.vitalsPreview.hr} bpm</span>
              <span>Temp: {appointment.vitalsPreview.temp}°C</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Call">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="WhatsApp">
            <MessageCircle className="w-4 h-4" />
          </Button>
          {appointment.mode === "Virtual" && (
            <Button variant="ghost" size="icon" title="Video Call">
              <Video className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div>
          <Button
            variant="default"
            size="sm"
            onClick={() => handlePatient360Click(appointment)}
            className="w-full"
          >
            Patient 360
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Outpatient"]} />
        <main className="p-6">
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Today's Appointments</h1>
              <CalendarWidget />
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start mb-6">
              <TabsTrigger
                value="scheduled"
                className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
              >
                Scheduled
              </TabsTrigger>
              <TabsTrigger
                value="visited"
                className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
              >
                Visited
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[60px_200px_1fr_200px_140px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-sm font-medium text-foreground">Time</div>
                  <div className="text-sm font-medium text-foreground">Patient Info</div>
                  <div className="text-sm font-medium text-foreground">Appointment Details</div>
                  <div className="text-sm font-medium text-foreground">Quick Actions</div>
                  <div className="text-sm font-medium text-foreground">Action</div>
                </div>
                {scheduledAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No scheduled appointments for today
                  </div>
                ) : (
                  scheduledAppointments.map(renderAppointmentCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="visited">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[60px_200px_1fr_200px_140px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-sm font-medium text-foreground">Time</div>
                  <div className="text-sm font-medium text-foreground">Patient Info</div>
                  <div className="text-sm font-medium text-foreground">Appointment Details</div>
                  <div className="text-sm font-medium text-foreground">Quick Actions</div>
                  <div className="text-sm font-medium text-foreground">Action</div>
                </div>
                {visitedAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No visited appointments yet
                  </div>
                ) : (
                  visitedAppointments.map(renderAppointmentCard)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
