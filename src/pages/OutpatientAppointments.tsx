import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MessageCircle, Video } from "lucide-react";
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
        className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
      >
        <div className="text-sm font-medium text-muted-foreground min-w-[60px]">
          {appointment.time}
        </div>

        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">
              {appointment.patientName}
            </h3>
            <Badge variant="outline" className="text-xs">
              {appointment.type}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {appointment.mode === "In-Clinic" ? "In-Clinic" : "Virtual"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            GDID-{appointment.gdid} • {appointment.age}y | {appointment.sex}
          </div>
          {appointment.chiefComplaint && (
            <div className="text-sm text-foreground mt-1">
              {appointment.chiefComplaint}
            </div>
          )}
          {appointment.vitalsPreview && (
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
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
          <Button
            variant="default"
            onClick={() => handlePatient360Click(appointment)}
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
        <AppHeader breadcrumbs={["Appointments", "Outpatient"]} />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Today's Appointments
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="visited">Visited</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="space-y-3">
              {scheduledAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No scheduled appointments for today
                </div>
              ) : (
                scheduledAppointments.map(renderAppointmentCard)
              )}
            </TabsContent>

            <TabsContent value="visited" className="space-y-3">
              {visitedAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No visited appointments yet
                </div>
              ) : (
                visitedAppointments.map(renderAppointmentCard)
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
