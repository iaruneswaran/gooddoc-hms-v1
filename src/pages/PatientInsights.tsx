import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, User, Pencil } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PatientInsights = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [openAppointments, setOpenAppointments] = useState<{ [key: string]: boolean }>({});

  // Mock patient data
  const patientData = {
    name: "Harish Kalyan",
    gdid: "GDID - 001",
    age: 35,
    gender: "Male",
    dob: "10/04/1980",
    phone: "+91 98765 43210",
    email: "name@example.com",
    nationalId: "9876 5432 1098",
    street: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    totalOutstanding: 15000,
    advanceBalance: 10000,
  };

  const appointmentHistory = [
    {
      date: "Thu, Aug 05, 2025",
      appointments: [
        {
          id: "1",
          type: "Consultation",
          dateTime: "05 Aug 2025 | 05:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
          visitId: "VST-102345",
          clinic: "Baines Healthcare",
          provider: "Dr. Sarah Khan",
          department: "Internal Medicine",
          opdClinic: "OPD Clinic 3",
          prescriptions: [
            "Azithromycin 500 mg OD × 3 days",
            "Paracetamol 500 mg Q6h PRN",
            "Dextromethorphan syrup 10 mL HS × 5 days",
            "Azithromycin 500 mg OD × 3 days",
          ],
          findings: "Patient presents with symptoms suggestive of upper respiratory tract infection. Mild throat congestion and cough noted, with low-grade fever. No signs of respiratory distress or chest involvement. Overall condition stable.",
        },
        {
          id: "2",
          type: "Laboratory",
          dateTime: "05 Aug 2025 | 10:30 AM",
          clinic: "Baines Healthcare",
        },
      ],
    },
    {
      date: "Sun, Sep 28, 2024",
      appointments: [
        {
          id: "3",
          type: "Consultation",
          dateTime: "28 Sep 2024 | 10:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
        },
        {
          id: "4",
          type: "Laboratory",
          dateTime: "28 Sep 2024 | 04:30 PM",
        },
        {
          id: "5",
          type: "Radiology",
          dateTime: "28 Sep 2024 | 10:30 AM",
          center: "Baines Healthcare",
        },
      ],
    },
    {
      date: "Mon, May 15, 2024",
      appointments: [
        {
          id: "6",
          type: "IPD Admission",
          dateTime: "15 May 2024 | 08:30 PM",
          doctor: "Dr. A. Joseph (Ophthalmology)",
        },
        {
          id: "7",
          type: "Day-Care Admission",
          dateTime: "15 May 2024 | 10:30 AM",
          procedure: "Endoscopy",
        },
      ],
    },
  ];

  const toggleAppointment = (id: string) => {
    setOpenAppointments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "text-primary";
      case "Laboratory":
        return "text-blue-600";
      case "Radiology":
        return "text-purple-600";
      case "IPD Admission":
        return "text-orange-600";
      case "Day-Care Admission":
        return "text-green-600";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-lg font-semibold">Appointments</span>
          </button>

          {/* Patient Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{patientData.name}</h1>
              <p className="text-sm text-muted-foreground">
                {patientData.gdid} • {patientData.age} | {patientData.gender.charAt(0)}
              </p>
            </div>
          </div>

          {/* Financial Summary & Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
                  <p className="text-xs text-muted-foreground">Due Balance</p>
                  <p className="text-3xl font-bold text-primary mt-2">₹{patientData.totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Advance Balance</p>
                  <p className="text-xs text-muted-foreground">Prepaid Funds</p>
                  <p className="text-3xl font-bold text-primary mt-2">₹{patientData.advanceBalance.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                Book Appointments
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                Discharge
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                Payments
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-[1fr_400px] gap-6">
            {/* Left Column - Tabs */}
            <div>
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="appointments" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment-history"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Payment History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insurance"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Insurance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-primary">Appointment History</h2>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Appointments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Appointments</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                          <SelectItem value="radiology">Radiology</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Input placeholder="Search" className="pl-10 w-64" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {appointmentHistory.map((group) => (
                      <div key={group.date}>
                        <p className="text-sm font-medium text-foreground mb-3">{group.date}</p>
                        <div className="space-y-3">
                          {group.appointments.map((appointment) => (
                            <Collapsible
                              key={appointment.id}
                              open={openAppointments[appointment.id]}
                              onOpenChange={() => toggleAppointment(appointment.id)}
                            >
                              <Card className="overflow-hidden">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <p className={`text-base font-semibold ${getAppointmentColor(appointment.type)}`}>
                                        {appointment.type}
                                      </p>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openAppointments[appointment.id] ? 'rotate-180' : ''}`} />
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-muted-foreground mb-1">Date & Time:</p>
                                        <p className="text-foreground font-medium">{appointment.dateTime}</p>
                                      </div>
                                      {appointment.doctor && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Doctor:</p>
                                          <p className="text-foreground font-medium">{appointment.doctor}</p>
                                        </div>
                                      )}
                                      {appointment.clinic && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Clinic:</p>
                                          <p className="text-foreground font-medium">{appointment.clinic}</p>
                                        </div>
                                      )}
                                      {appointment.center && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Center:</p>
                                          <p className="text-foreground font-medium">{appointment.center}</p>
                                        </div>
                                      )}
                                      {appointment.procedure && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Procedure:</p>
                                          <p className="text-foreground font-medium">{appointment.procedure}</p>
                                        </div>
                                      )}
                                      {appointment.visitId && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Visit ID:</p>
                                          <p className="text-foreground font-medium">{appointment.visitId}</p>
                                        </div>
                                      )}
                                      {appointment.provider && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Provider:</p>
                                          <p className="text-foreground font-medium">{appointment.provider}</p>
                                        </div>
                                      )}
                                      {appointment.department && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Department:</p>
                                          <p className="text-foreground font-medium">{appointment.department}</p>
                                        </div>
                                      )}
                                      {appointment.opdClinic && (
                                        <div>
                                          <p className="text-muted-foreground mb-1">Provider:</p>
                                          <p className="text-foreground font-medium">{appointment.opdClinic}</p>
                                        </div>
                                      )}
                                    </div>

                                    {appointment.prescriptions && (
                                      <div className="pt-3 border-t border-border">
                                        <p className="text-sm font-semibold text-foreground mb-2">Prescriptions</p>
                                        <ul className="space-y-1">
                                          {appointment.prescriptions.map((prescription, idx) => (
                                            <li key={idx} className="text-sm text-foreground">{prescription}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {appointment.findings && (
                                      <div className="pt-3 border-t border-border">
                                        <p className="text-sm font-semibold text-foreground mb-2">Findings</p>
                                        <p className="text-sm text-foreground leading-relaxed">{appointment.findings}</p>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="payment-history" className="mt-6">
                  <p className="text-muted-foreground">Payment history will be displayed here.</p>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <p className="text-muted-foreground">Documents will be displayed here.</p>
                </TabsContent>

                <TabsContent value="insurance" className="mt-6">
                  <p className="text-muted-foreground">Insurance information will be displayed here.</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Patient Information */}
            <Card className="p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-primary">Patient Information</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                    <p className="text-sm font-medium text-foreground">{patientData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="text-sm font-medium text-foreground">{patientData.gender}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{patientData.dob}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mobile Number</p>
                    <p className="text-sm font-medium text-foreground">{patientData.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium text-foreground">{patientData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">National ID</p>
                    <p className="text-sm font-medium text-foreground">{patientData.nationalId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Street, Apartment</p>
                    <p className="text-sm font-medium text-foreground">{patientData.street}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pin code</p>
                    <p className="text-sm font-medium text-foreground">{patientData.pincode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">State</p>
                    <p className="text-sm font-medium text-foreground">{patientData.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">City</p>
                    <p className="text-sm font-medium text-foreground">{patientData.city}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Country</p>
                  <p className="text-sm font-medium text-foreground">{patientData.country}</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientInsights;
