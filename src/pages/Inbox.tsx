import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { SidebarProvider } from "@/components/ui/sidebar";
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
  serviceType: "Consultation" | "Laboratory";
  doctor?: string;
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
    purpose: "Follow-up for chronic back pain; medication review",
    serviceType: "Consultation",
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
    purpose: "Routine labs: CBC and Lipid Panel",
    serviceType: "Laboratory",
    requestedDateTime: "16 Jan 2025, 8:00 AM",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
  },
];

export default function Inbox() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointment");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
                <div className="grid grid-cols-[220px_180px_1fr_120px_100px_180px_100px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-xs font-medium text-muted-foreground">Patient Details</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact Details</div>
                  <div className="text-xs font-medium text-muted-foreground">Appointment Summary</div>
                  <div className="text-xs font-medium text-muted-foreground">Service Type</div>
                  <div className="text-xs font-medium text-muted-foreground">Status</div>
                  <div className="text-xs font-medium text-muted-foreground">Requested Date & Time</div>
                  <div className="text-xs font-medium text-muted-foreground text-center">Action</div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No appointments found matching your search" : "No appointments to schedule"}
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="grid grid-cols-[220px_180px_1fr_120px_100px_180px_100px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
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

                      {/* Contact Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-foreground">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span>{appointment.email}</span>
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

                      {/* Status */}
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                          Pending
                        </Badge>
                      </div>

                      {/* Requested Date & Time */}
                      <div className="text-sm text-foreground">
                        {appointment.requestedDateTime || "—"}
                      </div>

                      {/* Action */}
                      <div className="flex justify-center">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSchedule(appointment)}
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
