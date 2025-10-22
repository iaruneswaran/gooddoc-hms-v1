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
      ],
    },
    {
      id: "2",
      date: "Sun, Aug 07, 2025",
      items: [
        {
          type: "Laboratory",
          datetime: "07 Aug 2025 | 10:15 AM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-102678",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Complete Blood Count (CBC)",
            "Liver Function Test (LFT)",
            "Fasting Blood Sugar (FBS)",
          ],
          findings: "Blood samples collected successfully. No complications noted during procedure. Preliminary results indicate mild elevation in liver enzymes; remaining parameters within normal limits. Further review scheduled upon report finalization.",
        },
        {
          type: "Consultation",
          datetime: "07 Aug 2025 | 03:45 PM",
          doctor: "Dr. Priya Sharma – General Medicine",
          visitId: "VST-102679",
          provider: "Dr. Priya Sharma",
          department: "General Medicine",
          opdClinic: "OPD Clinic 1",
          prescriptions: [
            "Atorvastatin 10 mg OD",
            "Vitamin D3 60K once weekly × 8 weeks",
          ],
          findings: "Follow-up consultation for lab results. Advised lifestyle modifications and supplementation. Patient counseled on dietary changes and regular exercise.",
        },
      ],
    },
    {
      id: "3",
      date: "Sat, Aug 09, 2025",
      items: [
        {
          type: "Radiology",
          datetime: "09 Aug 2025 | 03:00 PM",
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
        {
          type: "Consultation",
          datetime: "09 Aug 2025 | 05:20 PM",
          doctor: "Dr. Suresh Kumar – Gastroenterology",
          visitId: "VST-102913",
          provider: "Dr. Suresh Kumar",
          department: "Gastroenterology",
          opdClinic: "OPD Clinic 5",
          prescriptions: [
            "Ursodeoxycholic Acid 300 mg BD",
            "Silymarin 140 mg TDS",
          ],
          findings: "Reviewed ultrasound findings. Fatty liver changes noted. Advised weight reduction, dietary modifications, and regular monitoring. Prescription provided for hepatoprotective agents.",
        },
      ],
    },
    {
      id: "4",
      date: "Tue, Aug 12, 2025",
      items: [
        {
          type: "IPD Admission",
          datetime: "12 Aug 2025 | 11:00 AM",
          doctor: "Dr. Karthik Reddy – General Medicine",
          admissionId: "IPD-205431",
          admittingDiagnosis: "Acute Gastroenteritis",
          roomType: "Private Room – 204",
          provider: "Inpatient Wing A",
          department: "General Medicine",
          findings: "Patient admitted for IV fluid therapy and symptomatic management. Vital signs stable; mild dehydration noted on admission. Responding well to treatment. Daily monitoring of electrolytes and hydration status advised.",
        },
        {
          type: "Laboratory",
          datetime: "12 Aug 2025 | 02:30 PM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-102915",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Serum Electrolytes",
            "Renal Function Test",
            "Stool Culture",
          ],
          findings: "Post-admission baseline labs collected. Mild electrolyte imbalance detected. Sodium and potassium levels being monitored. Stool culture sent for bacterial analysis.",
        },
      ],
    },
    {
      id: "5",
      date: "Thu, Aug 14, 2025",
      items: [
        {
          type: "Day-Care Admission",
          datetime: "14 Aug 2025 | 09:30 AM",
          doctor: "Dr. Sneha Iyer – Oncology",
          visitId: "DC-308972",
          procedure: "Chemotherapy Cycle 3 – Doxorubicin + Cyclophosphamide",
          provider: "Day-Care Unit B",
          department: "Oncology",
          findings: "Patient tolerated chemotherapy well with no immediate adverse reactions. Vital parameters remained stable throughout infusion. Advised oral hydration and antiemetic medication post-session. Next cycle scheduled in 21 days.",
        },
        {
          type: "Laboratory",
          datetime: "14 Aug 2025 | 08:15 AM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-102920",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Complete Blood Count (CBC)",
            "Liver Function Test (LFT)",
            "Renal Function Test (RFT)",
          ],
          findings: "Pre-chemotherapy baseline labs collected. All parameters within acceptable range for chemotherapy administration. Blood counts adequate. Renal and hepatic functions normal.",
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
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">Outstanding Total</p>
                    <p className="text-2xl font-semibold text-primary">₹{patient.outstandingTotal}</p>
                  </div>
                  <div className="text-right">
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
                                      <p className="font-medium text-foreground mb-1">{item.type}</p>
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
