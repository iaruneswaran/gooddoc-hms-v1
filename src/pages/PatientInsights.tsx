import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, User, Pencil, Download, Printer, Trash2, FileText, Plus, CheckCircle2, Search, Calendar, CreditCard, Shield, TrendingUp, TrendingDown } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    return "text-foreground";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
        
        <main className="p-6 lg:p-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base font-medium">Back to Appointments</span>
          </button>

          {/* Patient Header with Enhanced Design */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{patientData.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{patientData.gdid}</span>
                  <span>•</span>
                  <span>{patientData.age} years</span>
                  <span>•</span>
                  <span>{patientData.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Button>
              <Button variant="outline" size="lg" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
                <CreditCard className="w-4 h-4" />
                Payments
              </Button>
            </div>
          </div>

          {/* Enhanced Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge variant="destructive" className="text-xs">Due</Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-3xl font-bold text-foreground">₹{patientData.totalOutstanding.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">Due Balance</p>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge className="text-xs bg-green-500">Available</Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Advance Balance</p>
                <p className="text-3xl font-bold text-foreground">₹{patientData.advanceBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">Prepaid Funds</p>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Insurance Coverage</p>
                <p className="text-3xl font-bold text-foreground">₹10,000</p>
                <p className="text-xs text-muted-foreground mt-2">Approved Amount</p>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
            {/* Left Column - Tabs */}
            <div className="min-w-0">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="w-full justify-start bg-muted/40 rounded-lg h-12 p-1">
                  <TabsTrigger 
                    value="appointments" 
                    className="rounded-md px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment-history"
                    className="rounded-md px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="rounded-md px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insurance"
                    className="rounded-md px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Insurance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Appointment History</h2>
                      <p className="text-sm text-muted-foreground mt-1">View and manage all appointments</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] border-2">
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search appointments..." className="pl-10 w-64 border-2" />
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-8 pr-4">
                      {appointmentHistory.map((group) => (
                        <div key={group.date} className="animate-fade-in">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-4 h-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">{group.date}</p>
                          </div>
                          <div className="space-y-3">
                            {group.appointments.map((appointment) => (
                              <Collapsible
                                key={appointment.id}
                                open={openAppointments[appointment.id]}
                                onOpenChange={() => toggleAppointment(appointment.id)}
                              >
                                <Card className="overflow-hidden border-2 shadow-sm hover:shadow-md transition-all duration-300">
                                  <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between px-6 py-5 hover:bg-muted/40 transition-colors">
                                      <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                          <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-base font-bold text-foreground">
                                            {appointment.type}
                                          </p>
                                          <p className="text-sm text-muted-foreground mt-0.5">{appointment.dateTime}</p>
                                        </div>
                                      </div>
                                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${openAppointments[appointment.id] ? 'rotate-180' : ''}`} />
                                    </div>
                                  </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-6 pb-6 border-t bg-muted/20 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                                      {/* Left Column */}
                                      <div className="space-y-4">
                                        <div>
                                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Date & Time</p>
                                          <p className="text-sm font-medium text-foreground">{appointment.dateTime}</p>
                                        </div>
                                        {appointment.doctor && (
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Doctor</p>
                                            <p className="text-sm font-medium text-foreground">{appointment.doctor}</p>
                                          </div>
                                        )}
                                        {appointment.clinic && (
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Clinic</p>
                                            <p className="text-sm font-medium text-foreground">{appointment.clinic}</p>
                                          </div>
                                        )}
                                        {appointment.center && (
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Center</p>
                                            <p className="text-sm font-medium text-foreground">{appointment.center}</p>
                                          </div>
                                        )}
                                        {appointment.procedure && (
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Procedure</p>
                                            <p className="text-sm font-medium text-foreground">{appointment.procedure}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Middle Column */}
                                      {(appointment.visitId || appointment.provider || appointment.department || appointment.opdClinic) && (
                                        <div className="space-y-4">
                                          {appointment.visitId && (
                                            <>
                                              <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visit ID</p>
                                                <p className="text-sm font-medium text-foreground">{appointment.visitId}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Provider</p>
                                                <p className="text-sm font-medium text-foreground">{appointment.provider}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Department</p>
                                                <p className="text-sm font-medium text-foreground">{appointment.department}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">OPD Clinic</p>
                                                <p className="text-sm font-medium text-foreground">{appointment.opdClinic}</p>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}

                                      {/* Right Column - Prescriptions */}
                                      {appointment.prescriptions && (
                                        <div className="space-y-4">
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Prescriptions</p>
                                            <div className="space-y-3">
                                              {appointment.prescriptions.map((prescription, idx) => (
                                                <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-background border">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                                  <p className="text-sm font-medium text-foreground flex-1">{prescription}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Findings - Full Width */}
                                    {appointment.findings && (
                                      <div className="mt-6 pt-6 border-t">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Findings</p>
                                        <div className="p-4 rounded-lg bg-background border">
                                          <p className="text-sm text-foreground leading-relaxed">{appointment.findings}</p>
                                        </div>
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
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="payment-history" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-primary">Patient Transactions</h2>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download statement
                      </Button>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Input placeholder="Search" className="pl-10 w-64" />
                      </div>
                    </div>
                  </div>

                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border">
                          <tr>
                            <th className="text-left text-sm font-medium text-foreground p-4">Invoice</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Method</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Amount</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Status</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">INV-2025-001</td>
                            <td className="p-4 text-sm text-foreground">Jun 15, 2025</td>
                            <td className="p-4 text-sm text-foreground">Consultation</td>
                            <td className="p-4 text-sm text-foreground">Card • ****1234</td>
                            <td className="p-4 text-sm text-foreground">₹1,500</td>
                            <td className="p-4">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Paid</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">INV-2025-002</td>
                            <td className="p-4 text-sm text-foreground">May 20, 2025</td>
                            <td className="p-4 text-sm text-foreground">Laboratory</td>
                            <td className="p-4 text-sm text-foreground">UPI</td>
                            <td className="p-4 text-sm text-foreground">₹650</td>
                            <td className="p-4">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Paid</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">INV-2025-003</td>
                            <td className="p-4 text-sm text-foreground">Apr 10, 2025</td>
                            <td className="p-4 text-sm text-foreground">Imaging</td>
                            <td className="p-4 text-sm text-foreground">Cash</td>
                            <td className="p-4 text-sm text-foreground">₹1,200</td>
                            <td className="p-4">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Paid</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View</Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-primary">Patient Documents</h2>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Documents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Documents</SelectItem>
                          <SelectItem value="prescription">Prescriptions</SelectItem>
                          <SelectItem value="lab">Lab Results</SelectItem>
                          <SelectItem value="imaging">Imaging</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Input placeholder="Search" className="pl-10 w-64" />
                      </div>
                    </div>
                  </div>

                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border">
                          <tr>
                            <th className="text-left text-sm font-medium text-foreground p-4">Name</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Source</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Size</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/20">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Prescription</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-foreground">Jun 15, 2025</td>
                            <td className="p-4 text-sm text-foreground">Consultation</td>
                            <td className="p-4 text-sm text-foreground">Hospital</td>
                            <td className="p-4 text-sm text-foreground">239.3 KB</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Lipid Panel Results</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-foreground">May 20, 2025</td>
                            <td className="p-4 text-sm text-foreground">Laboratory</td>
                            <td className="p-4 text-sm text-foreground">Clinic</td>
                            <td className="p-4 text-sm text-foreground">239.3 KB</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">ECG Report</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-foreground">Apr 10, 2025</td>
                            <td className="p-4 text-sm text-foreground">Imaging</td>
                            <td className="p-4 text-sm text-foreground">CT Center</td>
                            <td className="p-4 text-sm text-foreground">239.3 KB</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="insurance" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-primary">Insurance Policies</h2>
                    <div className="flex items-center gap-3">
                      <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Add policy
                      </Button>
                      <div className="relative">
                        <Input placeholder="Search" className="pl-10 w-64" />
                      </div>
                    </div>
                  </div>

                  {/* Insurance Policy Card */}
                  <Card className="p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">Star Health Insurance</h3>
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Family Health Optima Plan</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Member ID:</span> SH123456789
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Group:</span> GRP-2025-456
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Effective:</span> Jan 01, 2025 – Dec 31, 2025
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary/90">Verify Eligibility</Button>
                      <Button variant="outline">Update</Button>
                      <Button variant="outline">Replace</Button>
                      <Button variant="outline">View coverage</Button>
                    </div>
                  </Card>

                  {/* Claims Table */}
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border">
                          <tr>
                            <th className="text-left text-sm font-medium text-foreground p-4">Claim</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Billed</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Insurance paid</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Status</th>
                            <th className="text-left text-sm font-medium text-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">CLM-2025-789</td>
                            <td className="p-4 text-sm text-foreground">Jun 15, 2025</td>
                            <td className="p-4 text-sm text-foreground">Consultation</td>
                            <td className="p-4 text-sm text-foreground">₹3,000</td>
                            <td className="p-4 text-sm text-foreground">₹1,500</td>
                            <td className="p-4">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Paid</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">CLM-2025-790</td>
                            <td className="p-4 text-sm text-foreground">May 20, 2025</td>
                            <td className="p-4 text-sm text-foreground">Laboratory</td>
                            <td className="p-4 text-sm text-foreground">₹2,000</td>
                            <td className="p-4 text-sm text-foreground">₹650</td>
                            <td className="p-4">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Paid</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-4 text-sm text-foreground">CLM-2025-791</td>
                            <td className="p-4 text-sm text-foreground">Apr 10, 2025</td>
                            <td className="p-4 text-sm text-foreground">Imaging</td>
                            <td className="p-4 text-sm text-foreground">₹2,200</td>
                            <td className="p-4 text-sm text-foreground">₹1,200</td>
                            <td className="p-4">
                              <Badge className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">In Review</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="link" className="text-primary h-8 px-2">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Patient Information */}
            <Card className="p-6 h-fit border-2 shadow-lg sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Patient Information</h3>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-5 pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</p>
                      <p className="text-sm font-bold text-foreground">{patientData.name}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gender</p>
                      <p className="text-sm font-bold text-foreground">{patientData.gender}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Date of Birth</p>
                      <p className="text-sm font-bold text-foreground">{patientData.dob}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mobile</p>
                      <p className="text-sm font-bold text-foreground">{patientData.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email</p>
                      <p className="text-sm font-bold text-foreground break-all">{patientData.email}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">National ID</p>
                      <p className="text-sm font-bold text-foreground">{patientData.nationalId}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <p className="text-sm font-bold text-foreground mb-4">Address Information</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/40">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Street</p>
                          <p className="text-sm font-bold text-foreground">{patientData.street}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pincode</p>
                          <p className="text-sm font-bold text-foreground">{patientData.pincode}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/40">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">State</p>
                          <p className="text-sm font-bold text-foreground">{patientData.state}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">City</p>
                          <p className="text-sm font-bold text-foreground">{patientData.city}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Country</p>
                        <p className="text-sm font-bold text-foreground">{patientData.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientInsights;
