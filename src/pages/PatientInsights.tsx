import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium"
          >
            ← Back to Appointments
          </button>

          {/* Patient Header */}
          <div className="mb-8 pb-8 border-b border-border">
            <h1 className="text-3xl font-semibold text-foreground mb-2">{patientData.name}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{patientData.gdid}</span>
              <span>{patientData.age} years</span>
              <span>{patientData.gender}</span>
            </div>
          </div>

          {/* Financial Summary & Actions */}
          <div className="grid grid-cols-[2fr_1fr] gap-6 mb-8">
            <Card className="p-8">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="pr-8">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Outstanding</p>
                  <p className="text-4xl font-light text-foreground">₹{patientData.totalOutstanding.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Due Balance</p>
                </div>
                <div className="pl-8">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Advance Balance</p>
                  <p className="text-4xl font-light text-foreground">₹{patientData.advanceBalance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Prepaid Funds</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="h-full text-sm font-medium">
                Book Appointments
              </Button>
              <Button variant="outline" className="h-full text-sm font-medium">
                Discharge
              </Button>
              <Button variant="outline" className="h-full text-sm font-medium">
                Payments
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-[1fr_400px] gap-6">
            {/* Left Column - Tabs */}
            <div>
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
                  <TabsTrigger 
                    value="appointments" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-sm font-medium"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment-history"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-sm font-medium"
                  >
                    Payment History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-sm font-medium"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insurance"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-sm font-medium"
                  >
                    Insurance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-foreground">Appointment History</h2>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] text-sm">
                          <SelectValue placeholder="All Appointments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Appointments</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                          <SelectItem value="radiology">Radiology</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Search appointments..." className="w-64 text-sm" />
                    </div>
                  </div>

                  <div className="space-y-12">
                    {appointmentHistory.map((group) => (
                      <div key={group.date}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-6">{group.date}</p>
                        <div className="space-y-3">
                          {group.appointments.map((appointment) => (
                            <Collapsible
                              key={appointment.id}
                              open={openAppointments[appointment.id]}
                              onOpenChange={() => toggleAppointment(appointment.id)}
                            >
                              <Card className="overflow-hidden border-border hover:shadow-sm transition-shadow">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between px-8 py-5 hover:bg-muted/20 transition-colors">
                                    <div className="text-left">
                                      <p className="text-base font-medium text-foreground mb-1">
                                        {appointment.type}
                                      </p>
                                      <p className="text-sm text-muted-foreground">{appointment.dateTime}</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{openAppointments[appointment.id] ? '−' : '+'}</span>
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-8 pb-8 border-t border-border pt-8 bg-muted/10">
                                    <div className="grid grid-cols-3 gap-x-16 gap-y-8">
                                      {/* Left Column */}
                                      <div className="space-y-6">
                                        {appointment.doctor && (
                                          <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Doctor</p>
                                            <p className="text-sm text-foreground">{appointment.doctor}</p>
                                          </div>
                                        )}
                                        {appointment.clinic && (
                                          <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Clinic</p>
                                            <p className="text-sm text-foreground">{appointment.clinic}</p>
                                          </div>
                                        )}
                                        {appointment.center && (
                                          <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Center</p>
                                            <p className="text-sm text-foreground">{appointment.center}</p>
                                          </div>
                                        )}
                                        {appointment.procedure && (
                                          <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Procedure</p>
                                            <p className="text-sm text-foreground">{appointment.procedure}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Middle Column */}
                                      {(appointment.visitId || appointment.provider || appointment.department || appointment.opdClinic) && (
                                        <div className="space-y-6">
                                          {appointment.visitId && (
                                            <>
                                              <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Visit ID</p>
                                                <p className="text-sm text-foreground">{appointment.visitId}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Provider</p>
                                                <p className="text-sm text-foreground">{appointment.provider}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Department</p>
                                                <p className="text-sm text-foreground">{appointment.department}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">OPD Clinic</p>
                                                <p className="text-sm text-foreground">{appointment.opdClinic}</p>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}

                                      {/* Right Column - Prescriptions */}
                                      {appointment.prescriptions && (
                                        <div>
                                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Prescriptions</p>
                                          <div className="space-y-3">
                                            {appointment.prescriptions.map((prescription, idx) => (
                                              <p key={idx} className="text-sm text-foreground leading-relaxed">{prescription}</p>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Findings - Full Width */}
                                    {appointment.findings && (
                                      <div className="mt-8 pt-8 border-t border-border">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Findings</p>
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

                <TabsContent value="payment-history" className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-foreground">Patient Transactions</h2>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="text-sm font-medium">
                        Download statement
                      </Button>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px] text-sm">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Search transactions..." className="w-64 text-sm" />
                    </div>
                  </div>

                  <Card className="overflow-hidden border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/20 border-b border-border">
                          <tr>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Invoice</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Service</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Method</th>
                            <th className="text-right px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">INV-2025-001</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Jun 15, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Consultation</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Card • ****1234</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹1,500</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">Paid</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">INV-2025-002</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">May 20, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Laboratory</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">UPI</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹650</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">Paid</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">INV-2025-003</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Apr 10, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Imaging</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Cash</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹1,200</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">Paid</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-foreground">Patient Documents</h2>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] text-sm">
                          <SelectValue placeholder="All Documents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Documents</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="reports">Reports</SelectItem>
                          <SelectItem value="imaging">Imaging</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Search documents..." className="w-64 text-sm" />
                    </div>
                  </div>

                  <Card className="overflow-hidden border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/20 border-b border-border">
                          <tr>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Name</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Service</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Source</th>
                            <th className="text-right px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Size</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">Prescription</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Jun 15, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Consultation</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Hospital</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">239.3 KB</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Download
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Print
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8 text-destructive hover:text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">Lipid Panel Results</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">May 20, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Laboratory</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Clinic</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">239.3 KB</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Download
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Print
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8 text-destructive hover:text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">ECG Report</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Apr 10, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Imaging</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">CT Center</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">239.3 KB</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Download
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                  Print
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm font-medium h-8 text-destructive hover:text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="insurance" className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-foreground">Insurance Policies</h2>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="text-sm font-medium">
                        Add policy
                      </Button>
                      <Input placeholder="Search policies..." className="w-64 text-sm" />
                    </div>
                  </div>

                  <Card className="p-8 mb-8 border-border">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-medium text-foreground">Star Health Insurance</h3>
                          <Badge variant="outline" className="text-xs font-normal">Verified</Badge>
                        </div>
                        <p className="text-base text-foreground mb-1">Family Health Optima Plan</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Member ID</p>
                        <p className="text-sm text-foreground">SH123456789</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Group</p>
                        <p className="text-sm text-foreground">GRP-2025-456</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Effective Period</p>
                        <p className="text-sm text-foreground">Jan 01, 2025 – Dec 31, 2025</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-border">
                      <Button variant="outline" size="sm" className="text-sm font-medium">Verify Eligibility</Button>
                      <Button variant="outline" size="sm" className="text-sm font-medium">Update</Button>
                      <Button variant="outline" size="sm" className="text-sm font-medium">Replace</Button>
                      <Button variant="outline" size="sm" className="text-sm font-medium">View coverage</Button>
                    </div>
                  </Card>

                  <Card className="overflow-hidden border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/20 border-b border-border">
                          <tr>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Claim</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Service</th>
                            <th className="text-right px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Billed</th>
                            <th className="text-right px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Insurance paid</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                            <th className="text-left px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">CLM-2025-789</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Jun 15, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Consultation</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹3,000</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹1,500</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">Paid</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View EOB
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">CLM-2025-790</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">May 20, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Laboratory</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹2,000</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹650</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">Paid</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View EOB
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5 text-sm text-foreground font-medium">CLM-2025-791</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground">Apr 10, 2025</td>
                            <td className="px-8 py-5 text-sm text-foreground">Imaging</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹2,200</td>
                            <td className="px-8 py-5 text-sm text-foreground text-right">₹1,200</td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="text-xs font-normal">In Review</Badge>
                            </td>
                            <td className="px-8 py-5">
                              <Button variant="ghost" size="sm" className="text-sm font-medium h-8">
                                View EOB
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Patient Info */}
            <Card className="p-8 h-fit border-border">
              <h3 className="text-base font-medium text-foreground mb-6 pb-4 border-b border-border">Patient Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Full Name</p>
                  <p className="text-sm text-foreground">{patientData.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Gender</p>
                    <p className="text-sm text-foreground">{patientData.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Date of Birth</p>
                    <p className="text-sm text-foreground">{patientData.dob}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mobile Number</p>
                  <p className="text-sm text-foreground">{patientData.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Email</p>
                  <p className="text-sm text-foreground">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">National ID</p>
                  <p className="text-sm text-foreground">{patientData.nationalId}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Address</p>
                  <div className="space-y-3 text-sm text-foreground">
                    <p>{patientData.street}</p>
                    <p>{patientData.city}, {patientData.state} {patientData.pincode}</p>
                    <p>{patientData.country}</p>
                  </div>
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