import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PatientInsights = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "001",
    age: 35,
    gender: "Male",
    dob: "10/04/1980",
    mobile: "+91 98765 43210",
    email: "name@example.com",
    nationalId: "9876 5432 1098",
    address: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    outstandingTotal: "6,600",
    advanceAmount: "3,200",
  };

  const appointments = [
    {
      id: "1",
      date: "Thu, Aug 05, 2025",
      items: [
        {
          type: "Consultation",
          datetime: "05 Aug 2025 | 05:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
        },
        {
          type: "Laboratory",
          datetime: "05 Aug 2025 | 10:30 AM",
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
      ],
    },
    {
      id: "2",
      date: "Sun, Sep 28, 2024",
      items: [
        {
          type: "Consultation",
          datetime: "28 Sep 2024 | 10:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
        },
        {
          type: "Laboratory",
          datetime: "28 Sep 2024 | 04:30 PM",
          clinic: "Baines Healthcare",
        },
        {
          type: "Radiology",
          datetime: "28 Sep 2024 | 10:30 AM",
          center: "Baines Healthcare",
        },
      ],
    },
    {
      id: "3",
      date: "Mon, May 15, 2024",
      items: [
        {
          type: "IPD Admission",
          datetime: "15 May 2024 | 08:30 PM",
          doctor: "Dr. A. Joseph (Ophthalmology)",
        },
        {
          type: "Day-Care Admission",
          datetime: "15 May 2024 | 10:30 AM",
          procedure: "Endoscopy",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
        
        <main className="p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary mb-6 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Appointments
            </button>

            {/* Patient Header */}
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {patient.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{patient.name}</h1>
                <p className="text-sm text-muted-foreground">
                  GDID - {patient.gdid} • {patient.age} | {patient.gender[0]}
                </p>
              </div>
            </div>

            {/* Action Buttons and Financial Summary */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Book Appointments
                </Button>
                <Button variant="outline" size="sm">
                  Discharge
                </Button>
                <Button variant="outline" size="sm">
                  Payments
                </Button>
              </div>

              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Outstanding Total</p>
                  <p className="text-2xl font-semibold text-primary">₹{patient.outstandingTotal}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Advance Amount</p>
                  <p className="text-2xl font-semibold text-primary">₹{patient.advanceAmount}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Left Side - Tabs */}
              <div className="flex-1">
                <Tabs defaultValue="appointments" className="w-full">
                  <div className="w-full border-b border-border">
                    <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0">
                      <TabsTrigger 
                        value="appointments"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                      >
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payment-history"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                      >
                        Payment History
                      </TabsTrigger>
                      <TabsTrigger 
                        value="documents"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger 
                        value="insurance"
                        className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                      >
                        Insurance
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="appointments" className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-primary">Appointment History</h2>
                      <div className="flex gap-3">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Appointments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Appointments</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="search"
                          placeholder="Search"
                          className="w-[200px]"
                        />
                      </div>
                    </div>

                    {/* Appointment List */}
                    <div className="space-y-4">
                      {appointments.map((appointmentGroup) => (
                        <div key={appointmentGroup.id} className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            {appointmentGroup.date}
                          </p>
                          {appointmentGroup.items.map((item, idx) => (
                            <Collapsible
                              key={idx}
                              open={expandedAppointment === `${appointmentGroup.id}-${idx}`}
                              onOpenChange={(open) =>
                                setExpandedAppointment(open ? `${appointmentGroup.id}-${idx}` : null)
                              }
                            >
                              <Card className="overflow-hidden">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex-1 text-left">
                                      <p className="font-medium text-primary mb-1">{item.type}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Date & Time: {item.datetime}
                                      </p>
                                      {item.doctor && (
                                        <p className="text-sm text-muted-foreground">
                                          Doctor: {item.doctor}
                                        </p>
                                      )}
                                      {item.clinic && !item.doctor && (
                                        <p className="text-sm text-muted-foreground">
                                          Clinic: {item.clinic}
                                        </p>
                                      )}
                                      {item.center && (
                                        <p className="text-sm text-muted-foreground">
                                          Center: {item.center}
                                        </p>
                                      )}
                                      {item.procedure && (
                                        <p className="text-sm text-muted-foreground">
                                          Procedure: {item.procedure}
                                        </p>
                                      )}
                                    </div>
                                    <ChevronDown
                                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                                        expandedAppointment === `${appointmentGroup.id}-${idx}`
                                          ? "transform rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="border-t p-4 space-y-3 bg-muted/30">
                                    {item.visitId && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                          Visit ID:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.visitId}</p>
                                      </div>
                                    )}
                                    {item.clinic && item.doctor && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                          Clinic:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.clinic}</p>
                                      </div>
                                    )}
                                    {item.provider && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                          Provider:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.provider}</p>
                                      </div>
                                    )}
                                    {item.department && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                          Department:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.department}</p>
                                      </div>
                                    )}
                                    {item.opdClinic && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                          Provider:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.opdClinic}</p>
                                      </div>
                                    )}
                                    {item.prescriptions && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-2">
                                          Prescriptions
                                        </p>
                                        <ul className="space-y-1">
                                          {item.prescriptions.map((prescription, pIdx) => (
                                            <li key={pIdx} className="text-sm text-muted-foreground">
                                              {prescription}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {item.findings && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-2">
                                          Findings
                                        </p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                          {item.findings}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="payment-history" className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-primary">Patient Transactions</h2>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download statement
                        </Button>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="search"
                          placeholder="Search"
                          className="w-[200px]"
                        />
                      </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Method</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background">
                          <tr className="border-t">
                            <td className="p-4 text-sm">INV-2025-001</td>
                            <td className="p-4 text-sm">15 Jun 2025</td>
                            <td className="p-4 text-sm">Bill Payment</td>
                            <td className="p-4 text-sm">Consultation</td>
                            <td className="p-4 text-sm">Card</td>
                            <td className="p-4 text-sm">Harish Kalyan</td>
                            <td className="p-4 text-sm text-primary font-medium">₹1,500</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm">INV-2025-002</td>
                            <td className="p-4 text-sm">20 May 2025</td>
                            <td className="p-4 text-sm">Bill Payment</td>
                            <td className="p-4 text-sm">Laboratory</td>
                            <td className="p-4 text-sm">UPI</td>
                            <td className="p-4 text-sm">Harish Kalyan</td>
                            <td className="p-4 text-sm text-primary font-medium">₹650</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm">INV-2025-003</td>
                            <td className="p-4 text-sm">10 Apr 2025</td>
                            <td className="p-4 text-sm">Bill Payment</td>
                            <td className="p-4 text-sm">Imaging</td>
                            <td className="p-4 text-sm">Cash</td>
                            <td className="p-4 text-sm">Harish Kalyan</td>
                            <td className="p-4 text-sm text-primary font-medium">₹1,200</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View</Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-primary">Patient Documents</h2>
                      <div className="flex gap-3">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Documents" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Documents</SelectItem>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="results">Lab Results</SelectItem>
                            <SelectItem value="reports">Reports</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="search"
                          placeholder="Search"
                          className="w-[200px]"
                        />
                      </div>
                    </div>

                    {/* Documents Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Source</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Size</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background">
                          <tr className="border-t">
                            <td className="p-4 text-sm flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                              Prescription
                            </td>
                            <td className="p-4 text-sm">Jun 15, 2025</td>
                            <td className="p-4 text-sm">Consultation</td>
                            <td className="p-4 text-sm">Hospital</td>
                            <td className="p-4 text-sm">239.3 KB</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <button className="text-red-500 hover:text-red-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                              Lipid Panel Results
                            </td>
                            <td className="p-4 text-sm">May 20, 2025</td>
                            <td className="p-4 text-sm">Laboratory</td>
                            <td className="p-4 text-sm">Clinic</td>
                            <td className="p-4 text-sm">239.3 KB</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <button className="text-red-500 hover:text-red-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                              ECG Report
                            </td>
                            <td className="p-4 text-sm">Apr 10, 2025</td>
                            <td className="p-4 text-sm">Imaging</td>
                            <td className="p-4 text-sm">CT Center</td>
                            <td className="p-4 text-sm">239.3 KB</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <button className="text-red-500 hover:text-red-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="insurance" className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-primary">Insurance Policies</h2>
                      <div className="flex gap-3">
                        <Button className="gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add policy
                        </Button>
                        <Input
                          type="search"
                          placeholder="Search"
                          className="w-[200px]"
                        />
                      </div>
                    </div>

                    {/* Insurance Policy Card */}
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">Star Health Insurance</h3>
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              Verified
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">Family Health Optima Plan</p>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Member ID: SH123456789</p>
                            <p>Group: GRP-2025-456</p>
                            <p>Effective: Jan 01, 2025 – Dec 31, 2025</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-primary">Verify Eligibility</Button>
                        <Button variant="outline">Update</Button>
                        <Button variant="outline">Replace</Button>
                        <Button variant="outline">View coverage</Button>
                      </div>
                    </Card>

                    {/* Claims Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Claim No</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Billed Amount</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Insurance paid</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                            <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background">
                          <tr className="border-t">
                            <td className="p-4 text-sm">CLM-2025-789</td>
                            <td className="p-4 text-sm">15 Jun 2025</td>
                            <td className="p-4 text-sm">Consultation</td>
                            <td className="p-4 text-sm">₹3,000</td>
                            <td className="p-4 text-sm">₹1,500</td>
                            <td className="p-4 text-sm"><span className="text-green-600 font-medium">Paid</span></td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm">CLM-2025-790</td>
                            <td className="p-4 text-sm">20 May 2025</td>
                            <td className="p-4 text-sm">Laboratory</td>
                            <td className="p-4 text-sm">₹2,000</td>
                            <td className="p-4 text-sm">₹650</td>
                            <td className="p-4 text-sm"><span className="text-green-600 font-medium">Paid</span></td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-4 text-sm">CLM-2025-791</td>
                            <td className="p-4 text-sm">10 Apr 2025</td>
                            <td className="p-4 text-sm">Imaging</td>
                            <td className="p-4 text-sm">₹2,200</td>
                            <td className="p-4 text-sm">₹1,200</td>
                            <td className="p-4 text-sm"><span className="text-orange-600 font-medium">In Review</span></td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </button>
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">View EOB</Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Side - Patient Information */}
              <Card className="w-[350px] h-fit p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Patient Information</h3>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                      <p className="text-sm font-medium">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Gender</p>
                      <p className="text-sm font-medium">{patient.gender}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                      <p className="text-sm font-medium">{patient.dob}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mobile Number</p>
                      <p className="text-sm font-medium">{patient.mobile}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <p className="text-sm font-medium">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">National ID</p>
                      <p className="text-sm font-medium">{patient.nationalId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Street, Apartment</p>
                      <p className="text-sm font-medium">{patient.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pin code</p>
                      <p className="text-sm font-medium">{patient.pincode}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">State</p>
                      <p className="text-sm font-medium">{patient.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">City</p>
                      <p className="text-sm font-medium">{patient.city}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Country</p>
                    <p className="text-sm font-medium">{patient.country}</p>
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
