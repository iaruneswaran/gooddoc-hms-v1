import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { CalendarWidget } from "@/components/CalendarWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { User, Search, Phone, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PendingAppointment {
  id: string;
  patientName: string;
  patientGDID: string;
  patientAge: number;
  patientGender: string;
  purpose: string;
  serviceType: "Consultation" | "Laboratory" | "Radiology";
  // Provider roles
  consultingDoctor?: { id: string; name: string } | null;
  referringDoctor?: { id: string; name: string; external?: boolean } | null;
  department?: { id: string; name: string } | null;
  performingDepartment?: { id: string; name: string } | null;
  requestedDateTime?: string;
  phone: string;
  email: string;
}

const mockAppointments: PendingAppointment[] = [
  {
    id: "APT-001",
    patientName: "Sarah Johnson",
    patientGDID: "445821",
    patientAge: 45,
    patientGender: "F",
    purpose: "Patient presents with recurring chest pain, described as a dull ache in the left side of the chest, worsening with physical exertion. Symptoms began two weeks ago and have gradually increased in frequency. No associated shortness of breath or palpitations noted.",
    serviceType: "Consultation",
    consultingDoctor: { id: "DR-001", name: "Dr. Meera Nair" },
    department: { id: "DEPT-CARDIO", name: "Cardiology" },
    requestedDateTime: "15 Jan 2025, 10:00 AM",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
  },
  {
    id: "APT-002",
    patientName: "Michael Chen",
    patientGDID: "332109",
    patientAge: 38,
    patientGender: "M",
    purpose: "Annual health screening and routine laboratory workup requested. Patient has no acute complaints but wishes to monitor cholesterol levels and blood sugar as part of preventive care. Family history of diabetes and cardiovascular disease.",
    serviceType: "Laboratory",
    referringDoctor: { id: "DR-002", name: "Dr. Rajesh Kumar" },
    performingDepartment: { id: "DEPT-LAB", name: "Laboratory Dept" },
    requestedDateTime: "16 Jan 2025, 8:00 AM",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
  },
  {
    id: "APT-003",
    patientName: "Priya Sharma",
    patientGDID: "556789",
    patientAge: 52,
    patientGender: "F",
    purpose: "MRI scan requested for persistent lower back pain. Patient has tried conservative treatment for 3 months with limited improvement. Need to rule out disc herniation.",
    serviceType: "Radiology",
    referringDoctor: null, // Self-requested
    performingDepartment: { id: "DEPT-RAD", name: "Radiology Dept" },
    requestedDateTime: "17 Jan 2025, 2:00 PM",
    phone: "+91 98765 43211",
    email: "9876543211@gooddoc.app",
  },
];

// Helper to determine if appointment is diagnostics type
function isDiagnosticsType(serviceType: string): boolean {
  return serviceType === "Laboratory" || serviceType === "Radiology";
}

export default function Inbox() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointment");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patientGDID.includes(searchQuery) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesServiceType = serviceTypeFilter === "all" || appointment.serviceType === serviceTypeFilter;
    const matchesStatus = statusFilter === "all" || statusFilter === "pending"; // All are pending in mock
    
    return matchesSearch && matchesServiceType && matchesStatus;
  });

  const handleSchedule = (appointment: PendingAppointment) => {
    navigate(`/book-appointment?id=${appointment.id}&type=${appointment.serviceType.toLowerCase()}`);
  };

  // Get provider display value based on appointment type
  const getProviderDisplay = (appointment: PendingAppointment): string => {
    if (isDiagnosticsType(appointment.serviceType)) {
      if (appointment.referringDoctor) {
        return appointment.referringDoctor.external 
          ? `External: ${appointment.referringDoctor.name}`
          : appointment.referringDoctor.name;
      }
      return "Self";
    }
    return appointment.consultingDoctor?.name || "—";
  };

  // Get department display value based on appointment type
  const getDeptDisplay = (appointment: PendingAppointment): string => {
    if (isDiagnosticsType(appointment.serviceType)) {
      return appointment.performingDepartment?.name || 
        (appointment.serviceType === "Laboratory" ? "Laboratory Team" : "Radiology Team");
    }
    return appointment.department?.name || "—";
  };

  // Get column labels based on whether we're showing mixed content
  const getProviderLabel = (appointment: PendingAppointment): string => {
    return isDiagnosticsType(appointment.serviceType) ? "Referring Doctor" : "Consulting Doctor";
  };

  const getDeptLabel = (appointment: PendingAppointment): string => {
    return isDiagnosticsType(appointment.serviceType) ? "Performing Dept" : "Department";
  };

  const gridClasses = "grid grid-cols-[minmax(200px,1.5fr)_minmax(180px,1.5fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(100px,1fr)_minmax(90px,0.8fr)_minmax(150px,1fr)_minmax(100px,0.8fr)] gap-4 p-4";

  const renderAppointmentCard = (appointment: PendingAppointment) => {
    const isDiag = isDiagnosticsType(appointment.serviceType);
    const isExpanded = expandedRows.has(appointment.id);
    
    return (
      <div key={appointment.id} className="border-b border-border last:border-b-0">
        {/* Main Row */}
        <div 
          className={`${gridClasses} items-center hover:bg-muted/20 transition-colors cursor-pointer`}
          onClick={() => toggleRowExpansion(appointment.id)}
        >
          {/* Patient Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {appointment.patientName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                GDID - {appointment.patientGDID} • {appointment.patientAge} | {appointment.patientGender}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{appointment.email}</span>
            </div>
          </div>

          {/* Provider - Context-aware */}
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground mb-0.5">
              {isDiag ? "Referring Doctor" : "Consulting Doctor"}
            </div>
            <div className="text-sm text-foreground truncate">
              {getProviderDisplay(appointment)}
            </div>
          </div>

          {/* Department - Context-aware */}
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground mb-0.5">
              {isDiag ? "Performing Dept" : "Department"}
            </div>
            <div className="text-sm text-foreground truncate">
              {getDeptDisplay(appointment)}
            </div>
          </div>

          {/* Service Type */}
          <div className="text-sm text-foreground min-w-0 truncate">
            {appointment.serviceType}
          </div>

          {/* Status */}
          <div>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              Pending
            </Badge>
          </div>

          {/* Requested Date & Time */}
          <div className="text-sm text-foreground whitespace-nowrap">
            {appointment.requestedDateTime || "—"}
          </div>

          {/* Action */}
          <div className="flex justify-start" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSchedule(appointment)}
            >
              Schedule
            </Button>
          </div>
        </div>

        {/* Appointment Summary Row - Collapsible */}
        {appointment.purpose && isExpanded && (
          <div className="px-4 pb-4 pt-0">
            <div className="border-t border-border pt-4">
              <div className="space-y-1">
                <div className="text-[12px] font-medium text-muted-foreground">Appointment Summary</div>
                <div className="text-sm text-foreground">{appointment.purpose}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <PageContent className="flex flex-col min-h-screen">
        <AppHeader breadcrumbs={["Schedule Request"]} />
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
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
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
              <div className="flex items-center gap-3">
                <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, GDID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="appointment">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className={`${gridClasses} border-b border-border bg-muted/30`}>
                  <div className="text-xs font-medium text-muted-foreground">Patient Info</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact Details</div>
                  <div className="text-xs font-medium text-muted-foreground">Provider</div>
                  <div className="text-xs font-medium text-muted-foreground">Department</div>
                  <div className="text-xs font-medium text-muted-foreground">Service Type</div>
                  <div className="text-xs font-medium text-muted-foreground">Status</div>
                  <div className="text-xs font-medium text-muted-foreground">Requested Date & Time</div>
                  <div className="text-xs font-medium text-muted-foreground">Action</div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No appointments found matching your search" : "No appointments to schedule"}
                  </div>
                ) : (
                  filteredAppointments.map(renderAppointmentCard)
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
      </PageContent>
    </div>
  );
}
