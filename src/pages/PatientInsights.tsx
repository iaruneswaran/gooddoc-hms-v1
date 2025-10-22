import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
          <main className="flex-1 bg-background p-6">
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
            <div className="flex flex-col gap-4 mb-6">
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

              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Outstanding Total</p>
                  <p className="text-2xl font-semibold text-primary">₹{patient.outstandingTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Advance Amount</p>
                  <p className="text-2xl font-semibold text-primary">₹{patient.advanceAmount}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Left Side - Tabs */}
              <div className="flex-1">
                <Tabs defaultValue="appointments">
                  <TabsList>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="payment-history">Payment History</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  </TabsList>

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

                  <TabsContent value="payment-history">
                    <p className="text-muted-foreground">Payment history will be displayed here.</p>
                  </TabsContent>

                  <TabsContent value="documents">
                    <p className="text-muted-foreground">Documents will be displayed here.</p>
                  </TabsContent>

                  <TabsContent value="insurance">
                    <p className="text-muted-foreground">Insurance information will be displayed here.</p>
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
    </SidebarProvider>
  );
};

export default PatientInsights;
