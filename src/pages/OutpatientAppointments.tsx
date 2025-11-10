import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarWidget } from "@/components/CalendarWidget";
import { User, Phone, MessageCircle, MoreVertical } from "lucide-react";
import { mockAppointments } from "@/data/patient360.mock";
import { Appointment } from "@/types/patient360";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export default function OutpatientAppointments() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { flags } = useFeatureFlags();
  
  const defaultTab = searchParams.get("tab") || "outpatient-care";
  const searchQuery = searchParams.get("search") || "";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const debouncedSearch = useDebounce(localSearchQuery, 300);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value, ...(debouncedSearch && { search: debouncedSearch }) });
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    setSearchParams({ tab: activeTab, ...(value && { search: value }) });
  };

  const filteredAppointments = useMemo(() => {
    let filtered = mockAppointments;

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(query) ||
          apt.gdid.toLowerCase().includes(query) ||
          (apt.phone && apt.phone.includes(query)) ||
          (apt.email && apt.email.toLowerCase().includes(query))
      );
    }

    if (activeTab === "outpatient-care") {
      return filtered.filter((apt) => apt.status === "Scheduled" || apt.status === "InProgress");
    }

    return filtered;
  }, [activeTab, debouncedSearch]);

  const handlePatient360Click = (appointment: Appointment) => {
    navigate(`/patients/${appointment.gdid}/360`);
  };

  const handleCheckIn = (appointment: Appointment) => {
    toast({
      title: "Patient checked in",
      description: `${appointment.patientName} has been checked in successfully.`,
    });
  };

  const renderAppointmentRow = (appointment: Appointment) => {
    return (
      <div
        key={appointment.id}
        className="grid grid-cols-[1fr_200px_2fr_220px_140px_180px] gap-4 p-3 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0 text-sm"
      >
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <button
              onClick={() => handlePatient360Click(appointment)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left truncate block w-full"
            >
              {appointment.patientName}
            </button>
            <div className="text-xs text-muted-foreground">
              GDID-{appointment.gdid} • {appointment.age}y | {appointment.sex}
            </div>
          </div>
        </div>

        <div className="space-y-0.5 text-xs">
          {appointment.phone && (
            <a href={`tel:${appointment.phone}`} className="text-foreground hover:text-primary block">
              {appointment.phone}
            </a>
          )}
          {appointment.email && (
            <a href={`mailto:${appointment.email}`} className="text-muted-foreground hover:text-primary block truncate">
              {appointment.email}
            </a>
          )}
        </div>

        <div className="space-y-1">
          {appointment.chiefComplaint && (
            <div className="text-sm text-foreground line-clamp-2">
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

        <div className="text-sm">
          <div className="text-foreground">Dr. Meera Nair — Cardiology</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={appointment.status === "Scheduled" ? "secondary" : "default"} className="text-xs">
              {appointment.status}
            </Badge>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs font-medium text-foreground">{appointment.time}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {appointment.mode === "In-Clinic" ? "In-Clinic" : "Virtual"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleCheckIn(appointment)}
            className="flex-1"
          >
            Check In
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card z-50">
              <DropdownMenuItem onClick={() => handlePatient360Click(appointment)}>
                Patient 360
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`tel:${appointment.phone}`)}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "WhatsApp", description: "Opening WhatsApp..." })}>
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Marked as No-Show" })}>
                Mark No-Show
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-foreground">Today's Appointments</h1>
              <CalendarWidget />
            </div>
          </Card>

          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
                <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
                  <TabsTrigger
                    value="outpatient-care"
                    className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Outpatient Care
                  </TabsTrigger>
                  <TabsTrigger
                    value="inpatient-care"
                    className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Inpatient Care
                  </TabsTrigger>
                  <TabsTrigger
                    value="diagnostics"
                    className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Diagnostics
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="w-80">
                <Input
                  placeholder="Search by name, GDID, phone, email..."
                  value={localSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_200px_2fr_220px_140px_180px] gap-4 p-3 border-b border-border bg-muted/30 text-xs font-medium text-foreground">
              <div>Patient Info</div>
              <div>Contact Details</div>
              <div>Appointment Summary</div>
              <div>Specialty</div>
              <div>Token & Time</div>
              <div>Action</div>
            </div>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No appointments found
              </div>
            ) : (
              filteredAppointments.map(renderAppointmentRow)
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
