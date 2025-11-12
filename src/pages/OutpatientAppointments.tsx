import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarWidget } from "@/components/CalendarWidget";
import { User, Phone, MessageCircle, Video, Search } from "lucide-react";
import { mockAppointments } from "@/data/patient360.mock";
import { Appointment } from "@/types/patient360";

export default function OutpatientAppointments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "scheduled";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");

  const filterAppointments = (appointments: Appointment[]) => {
    if (!searchQuery) return appointments;
    return appointments.filter(
      (apt) =>
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.gdid.includes(searchQuery) ||
        apt.chiefComplaint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const scheduledAppointments = filterAppointments(
    mockAppointments.filter(
      (apt) => apt.status === "Scheduled" || apt.status === "InProgress"
    )
  );
  
  const visitedAppointments = filterAppointments(
    mockAppointments.filter(
      (apt) => apt.status === "Visited"
    )
  );

  const handlePatient360Click = (appointment: Appointment) => {
    navigate(`/patients/${appointment.gdid}/360`);
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    return (
      <div
        key={appointment.id}
        className="grid grid-cols-[200px_120px_1fr_240px_80px_140px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
      >
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
              GDID - {appointment.gdid} • {appointment.age} | {appointment.sex}
            </div>
          </div>
        </div>

        {/* Consultation Type */}
        <div>
          <Badge variant="outline" className="text-xs">
            {appointment.type}
          </Badge>
        </div>

        {/* Appointment Details */}
        <div>
          {appointment.chiefComplaint && (
            <div className="text-sm text-foreground">
              {appointment.chiefComplaint}
            </div>
          )}
        </div>

        {/* Vitals */}
        <div>
          {appointment.vitalsPreview && (
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              <span>Temp {appointment.vitalsPreview.temp}°C | HR {appointment.vitalsPreview.hr} | RR {appointment.vitalsPreview.rr} | SpO₂ {appointment.vitalsPreview.spo2}%</span>
              <span>BP {appointment.vitalsPreview.bp} mmHg | BG {appointment.vitalsPreview.bg} mg/dL</span>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="text-sm font-medium text-foreground">
          {appointment.time}
        </div>

        {/* Action - Patient 360 */}
        <div className="px-4">
          <Button
            variant="default"
            onClick={() => handlePatient360Click(appointment)}
            className="h-9 w-full"
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
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
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
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, GDID, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="scheduled">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[200px_120px_1fr_240px_80px_140px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-sm font-medium text-foreground">Patient Info</div>
                  <div className="text-sm font-medium text-foreground">Consultation Type</div>
                  <div className="text-sm font-medium text-foreground">Appointment Details</div>
                  <div className="text-sm font-medium text-foreground">Vitals</div>
                  <div className="text-sm font-medium text-foreground">Time</div>
                  <div className="text-sm font-medium text-foreground pl-4">
                    Action
                  </div>
                </div>
                {scheduledAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No appointments found matching your search" : "No scheduled appointments for today"}
                  </div>
                ) : (
                  scheduledAppointments.map(renderAppointmentCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="visited">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[200px_120px_1fr_240px_80px_140px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-sm font-medium text-foreground">Patient Info</div>
                  <div className="text-sm font-medium text-foreground">Consultation Type</div>
                  <div className="text-sm font-medium text-foreground">Appointment Details</div>
                  <div className="text-sm font-medium text-foreground">Vitals</div>
                  <div className="text-sm font-medium text-foreground">Time</div>
                  <div className="text-sm font-medium text-foreground pl-4">
                    Action
                  </div>
                </div>
                {visitedAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No appointments found matching your search" : "No visited appointments yet"}
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
