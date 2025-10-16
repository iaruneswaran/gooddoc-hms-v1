import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, User, Pencil, Download, Printer, Trash2, FileText, Plus, CheckCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

                  <div className="space-y-8">
                    {appointmentHistory.map((group) => (
                      <div key={group.date}>
                        <p className="text-sm font-medium text-muted-foreground mb-4">{group.date}</p>
                        <div className="space-y-2">
                          {group.appointments.map((appointment) => (
                            <Collapsible
                              key={appointment.id}
                              open={openAppointments[appointment.id]}
                              onOpenChange={() => toggleAppointment(appointment.id)}
                            >
                              <Card className="overflow-hidden border-border shadow-sm">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                                    <p className="text-base font-semibold text-foreground">
                                      {appointment.type}
                                    </p>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openAppointments[appointment.id] ? 'rotate-180' : ''}`} />
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-6 pb-6 border-t border-border pt-6">
                                    <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                                      {/* Left Column */}
                                      <div className="space-y-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">Date & Time:</p>
                                          <p className="text-sm text-foreground">{appointment.dateTime}</p>
                                        </div>
                                        {appointment.doctor && (
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Doctor:</p>
                                            <p className="text-sm text-foreground">{appointment.doctor}</p>
                                          </div>
                                        )}
                                        {appointment.clinic && (
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Clinic:</p>
                                            <p className="text-sm text-foreground">{appointment.clinic}</p>
                                          </div>
                                        )}
                                        {appointment.center && (
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Center:</p>
                                            <p className="text-sm text-foreground">{appointment.center}</p>
                                          </div>
                                        )}
                                        {appointment.procedure && (
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Procedure:</p>
                                            <p className="text-sm text-foreground">{appointment.procedure}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Middle Column */}
                                      {(appointment.visitId || appointment.provider || appointment.department || appointment.opdClinic) && (
                                        <div className="space-y-4">
                                          {appointment.visitId && (
                                            <>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Visit ID:</p>
                                                <p className="text-sm text-foreground">{appointment.visitId}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Provider:</p>
                                                <p className="text-sm text-foreground">{appointment.provider}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Department:</p>
                                                <p className="text-sm text-foreground">{appointment.department}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground mb-1">Provider:</p>
                                                <p className="text-sm text-foreground">{appointment.opdClinic}</p>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}

                                      {/* Right Column - Prescriptions */}
                                      {appointment.prescriptions && (
                                        <div className="space-y-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-3">Prescriptions</p>
                                            <div className="space-y-2">
                                              {appointment.prescriptions.map((prescription, idx) => (
                                                <p key={idx} className="text-sm text-foreground">{prescription}</p>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Findings - Full Width */}
                                    {appointment.findings && (
                                      <div className="mt-6 pt-6 border-t border-border">
                                        <p className="text-sm text-muted-foreground mb-2">Findings</p>
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
