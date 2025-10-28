import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Pencil } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    title: "Mr",
    age: 44,
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
          visitId: "VST-102345",
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
          type: "Laboratory",
          datetime: "05 Aug 2025 | 02:15 PM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-102346",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Complete Blood Count (CBC)",
            "C-Reactive Protein (CRP)",
          ],
          findings: "Blood samples collected for infection markers. CRP levels slightly elevated, consistent with acute infection. WBC count within acceptable range.",
        },
        {
          type: "Radiology",
          datetime: "05 Aug 2025 | 03:00 PM",
          doctor: "Dr. Anjali Verma – Radiology",
          visitId: "VST-102912",
          provider: "Imaging Suite 2",
          department: "Radiology",
          investigations: [
            "Chest X-ray (PA View)",
            "Ultrasound Abdomen",
          ],
          findings: "Chest X-ray shows clear lung fields with no evidence of consolidation. Ultrasound abdomen reveals mild fatty liver changes. No structural abnormalities detected. Reports shared with referring physician for correlation.",
        },
      ],
    },
    {
      id: "2",
      date: "Sun, Aug 07, 2025",
      items: [
        {
          type: "IPD Admission",
          datetime: "07 Aug 2025 | 11:00 AM",
          doctor: "Dr. Karthik Reddy – General Medicine",
          admissionId: "IPD-205431",
          admittingDiagnosis: "Acute Gastroenteritis",
          roomType: "Private Room – 204",
          provider: "Inpatient Wing A",
          department: "General Medicine",
          findings: "Patient admitted for IV fluid therapy and symptomatic management. Vital signs stable; mild dehydration noted on admission. Responding well to treatment. Daily monitoring of electrolytes and hydration status advised.",
        },
        {
          type: "Day-Care Admission",
          datetime: "07 Aug 2025 | 09:30 AM",
          doctor: "Dr. Sneha Iyer – Oncology",
          visitId: "DC-308972",
          procedure: "Chemotherapy Cycle 3 – Doxorubicin + Cyclophosphamide",
          provider: "Day-Care Unit B",
          department: "Oncology",
          findings: "Patient tolerated chemotherapy well with no immediate adverse reactions. Vital parameters remained stable throughout infusion. Advised oral hydration and antiemetic medication post-session. Next cycle scheduled in 21 days.",
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
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Appointments</span>
            </button>

            {/* Patient Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between gap-6">
                {/* Left side - Patient info and actions */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
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
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/book-appointment", { 
                        state: { fromPatientInsights: true, patientId } 
                      })}
                    >
                      Book Appointments
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/patient-insights/${patientId}/discharge`)}
                    >
                      Discharge
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/patient-insights/${patientId}/payments`)}
                    >
                      Payments
                    </Button>
                  </div>
                </div>

                {/* Right side - Financial info */}
                <div className="flex gap-4">
                  <div className="border border-border rounded-lg p-4 min-w-[200px]">
                    <p className="text-sm text-muted-foreground mb-2">Outstanding Total</p>
                    <p className="text-2xl font-semibold text-primary">₹{patient.outstandingTotal}</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 min-w-[200px]">
                    <p className="text-sm text-muted-foreground mb-2">Advance Amount</p>
                    <p className="text-2xl font-semibold text-primary">₹{patient.advanceAmount}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Left Side - Tabs */}
              <div className="flex-1">
                <Tabs defaultValue="appointments" className="w-full">
                  <div className="w-full">
                    <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0 border-b border-border">
                      <TabsTrigger 
                        value="appointments"
                        className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                      >
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payment-history"
                        className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                      >
                        Payment History
                      </TabsTrigger>
                      <TabsTrigger 
                        value="documents"
                        className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger 
                        value="insurance"
                        className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
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
                    <div className="border rounded-lg overflow-hidden bg-white p-4">
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
                              <Card className="overflow-hidden bg-[#F1F2F4]">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between p-4 transition-colors">
                                    <div className="flex-1 text-left">
                                      <p className="font-medium text-foreground mb-1">{item.type}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Date & Time: {item.datetime}
                                      </p>
                                      {item.clinic && (
                                        <p className="text-sm text-muted-foreground">
                                          Clinic: {item.clinic}
                                        </p>
                                      )}
                                      {item.center && (
                                        <p className="text-sm text-muted-foreground">
                                          Center: {item.center}
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
                                  <div className="border-t p-4 space-y-4 bg-muted/30">
                                    <div className="grid grid-cols-2 gap-4">
                                      {/* Left Column - Provider Information */}
                                      <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-foreground">Provider Information</h3>
                                        
                                        {item.visitId && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Visit ID:
                                            </p>
                                            <p className="text-sm text-foreground">{item.visitId}</p>
                                          </div>
                                        )}
                                        
                                        {item.admissionId && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Admission ID:
                                            </p>
                                            <p className="text-sm text-foreground">{item.admissionId}</p>
                                          </div>
                                        )}
                                        
                                        {item.admittingDiagnosis && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Admitting Diagnosis:
                                            </p>
                                            <p className="text-sm text-foreground">{item.admittingDiagnosis}</p>
                                          </div>
                                        )}
                                        
                                        {item.roomType && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Room Type:
                                            </p>
                                            <p className="text-sm text-foreground">{item.roomType}</p>
                                          </div>
                                        )}
                                        
                                        {item.testsOrdered && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Tests Ordered:
                                            </p>
                                            <ul className="space-y-1 mt-1">
                                              {item.testsOrdered.map((test, tIdx) => (
                                                <li key={tIdx} className="text-sm text-foreground flex items-start">
                                                  <span className="mr-2">•</span>
                                                  <span>{test}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {item.investigations && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Investigations:
                                            </p>
                                            <ul className="space-y-1 mt-1">
                                              {item.investigations.map((investigation, iIdx) => (
                                                <li key={iIdx} className="text-sm text-foreground flex items-start">
                                                  <span className="mr-2">•</span>
                                                  <span>{investigation}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {item.procedure && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Procedure:
                                            </p>
                                            <p className="text-sm text-foreground">{item.procedure}</p>
                                          </div>
                                        )}
                                        
                                        {item.provider && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Provider:
                                            </p>
                                            <p className="text-sm text-foreground">{item.provider}</p>
                                          </div>
                                        )}
                                        
                                        {item.department && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Department:
                                            </p>
                                            <p className="text-sm text-foreground">{item.department}</p>
                                          </div>
                                        )}
                                        
                                        {item.opdClinic && (
                                          <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                              Provider:
                                            </p>
                                            <p className="text-sm text-foreground">{item.opdClinic}</p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Right Column - Prescriptions (for Consultation) */}
                                      {item.prescriptions && (
                                        <div className="space-y-3">
                                          <h3 className="text-sm font-semibold text-foreground">Prescriptions</h3>
                                          <ul className="space-y-2">
                                            {item.prescriptions.map((prescription, pIdx) => (
                                              <li key={pIdx} className="text-sm text-foreground flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{prescription}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Findings Section */}
                                    {item.findings && (
                                      <div>
                                        <h3 className="text-sm font-semibold text-foreground mb-2">
                                          Findings
                                        </h3>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
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
              <div className="w-[400px] space-y-6">
                {/* Edit Button */}
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <Pencil className="h-4 w-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>

                {/* Patient Information Section */}
                <Card className="rounded-lg border border-border p-6">
                  <h3 className="text-base font-semibold text-foreground mb-6">Patient Information</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Title</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.title}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Full Name</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Gender</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.gender}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.dob}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Age</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.age}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Mobile Number</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.mobile}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">National ID</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.nationalId}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Address Details Section */}
                <Card className="rounded-lg border border-border p-6">
                  <h3 className="text-base font-semibold text-foreground mb-6">Address Details</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Street, Apartment</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.address}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Pin code</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.pincode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">State</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.state}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">City</Label>
                        <p className="text-sm font-medium text-foreground mt-1">{patient.city}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Country</Label>
                      <p className="text-sm font-medium text-foreground mt-1">{patient.country}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default PatientInsights;
