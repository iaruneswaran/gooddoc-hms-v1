import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function PatientInsights() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [expandedAppointments, setExpandedAppointments] = useState<Record<string, boolean>>({});

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "GDID - 001",
    age: 35,
    gender: "M",
    patientType: "Outpatient",
    outstandingTotal: "₹6,600",
    advanceAmount: "₹3,200",
    fullName: "Harish Kalyan",
    dateOfBirth: "10/04/1980",
    mobileNumber: "+91 98765 43210",
    email: "name@example.com",
    nationalId: "9876 5432 1098",
    street: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    networks: "Male",
  };

  const appointments = [
    {
      id: "1",
      date: "Thu, Aug 05, 2025",
      visits: [
        {
          type: "Consultation",
          dateTime: "05 Aug 2025 | 05:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
          prescriptions: [
            "Azithromycin 500 mg OD × 3 days",
            "Paracetamol 500 mg Q6h PRN",
            "Dextromethorphan syrup 10 mL HS × 5 days",
          ],
        },
        {
          type: "Laboratory",
          dateTime: "05 Aug 2025 | 10:30 AM",
          visitId: "VST-102345",
          clinic: "Baines Healthcare",
          provider: "Dr. Sarah Khan",
          department: "Internal Medicine",
          opdClinic: "OPD Clinic 3",
        },
      ],
    },
    {
      id: "2",
      date: "Sun, Sep 28, 2024",
      visits: [
        {
          type: "Consultation",
          dateTime: "28 Sep 2024 | 10:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
          findings: "Patient presents with symptoms suggestive of upper respiratory tract infection. Mild throat congestion and cough noted, with low-grade fever. No signs of respiratory distress or chest involvement. Overall condition stable.",
        },
        {
          type: "Laboratory",
          dateTime: "28 Sep 2024 | 04:30 PM",
          clinic: "Baines Healthcare",
        },
        {
          type: "Radiology",
          dateTime: "28 Sep 2024 | 10:30 AM",
          center: "Baines Healthcare",
        },
      ],
    },
    {
      id: "3",
      date: "Mon, May 15, 2024",
      visits: [
        {
          type: "IPD Admission",
          dateTime: "15 May 2024 | 08:30 PM",
          doctor: "Dr. A. Joseph (Ophthalmology)",
        },
        {
          type: "Day-Care Admission",
          dateTime: "15 May 2024 | 10:30 AM",
          procedure: "Endoscopy",
        },
      ],
    },
  ];

  const toggleAppointment = (id: string) => {
    setExpandedAppointments(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights"]} />
          
          <main className="flex-1 overflow-auto bg-background p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2 text-foreground hover:bg-muted -ml-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Appointments
              </Button>

              {/* Patient Header & Financial Summary */}
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {patient.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">{patient.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {patient.gdid} • {patient.age} | {patient.gender}
                    </p>
                  </div>
                </div>

                {/* Action Buttons & Financial Summary */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      Book Appointments
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Discharge
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Payments
                    </Button>
                  </div>

                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Outstanding Total</div>
                      <div className="text-2xl font-semibold text-primary">{patient.outstandingTotal}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Advance Amount</div>
                      <div className="text-2xl font-semibold text-primary">{patient.advanceAmount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex gap-6">
                {/* Left Content */}
                <div className="flex-1 space-y-6">
                  {/* Tabs */}
                  <Tabs defaultValue="appointments" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="appointments">Appointments</TabsTrigger>
                      <TabsTrigger value="payment-history">Payment History</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="insurance">Insurance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appointments" className="space-y-6 mt-6">
                      {/* Appointment History Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-primary">Appointment History</h2>
                          <div className="flex items-center gap-4">
                            <select className="px-4 py-2 text-sm border border-border rounded-md bg-card">
                              <option>All Appointments</option>
                            </select>
                            <Input placeholder="Search" className="w-64" />
                          </div>
                        </div>

                        {/* Appointments List */}
                        <div className="space-y-3">
                          {appointments.map((appointment) => (
                            <div key={appointment.id} className="border border-border rounded-lg bg-card">
                              <button
                                onClick={() => toggleAppointment(appointment.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                              >
                                <span className="font-medium text-foreground">{appointment.date}</span>
                                {expandedAppointments[appointment.id] ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </button>

                              {expandedAppointments[appointment.id] && (
                                <div className="px-4 pb-4 space-y-4">
                                  {appointment.visits.map((visit, index) => (
                                    <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                                      <h3 className="font-medium text-primary">{visit.type}</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-muted-foreground">Date & Time:</span>
                                            <div className="text-foreground">{visit.dateTime}</div>
                                          </div>
                                          {visit.doctor && (
                                            <div>
                                              <span className="text-muted-foreground">Doctor:</span>
                                              <div className="text-foreground">{visit.doctor}</div>
                                            </div>
                                          )}
                                          {visit.visitId && (
                                            <div>
                                              <span className="text-muted-foreground">Visit ID:</span>
                                              <div className="text-foreground">{visit.visitId}</div>
                                            </div>
                                          )}
                                          {visit.clinic && (
                                            <div>
                                              <span className="text-muted-foreground">Clinic:</span>
                                              <div className="text-foreground">{visit.clinic}</div>
                                            </div>
                                          )}
                                          {visit.provider && (
                                            <div>
                                              <span className="text-muted-foreground">Provider:</span>
                                              <div className="text-foreground">{visit.provider}</div>
                                            </div>
                                          )}
                                          {visit.department && (
                                            <div>
                                              <span className="text-muted-foreground">Department:</span>
                                              <div className="text-foreground">{visit.department}</div>
                                            </div>
                                          )}
                                          {visit.opdClinic && (
                                            <div>
                                              <span className="text-muted-foreground">OPD Clinic:</span>
                                              <div className="text-foreground">{visit.opdClinic}</div>
                                            </div>
                                          )}
                                          {visit.center && (
                                            <div>
                                              <span className="text-muted-foreground">Center:</span>
                                              <div className="text-foreground">{visit.center}</div>
                                            </div>
                                          )}
                                          {visit.procedure && (
                                            <div>
                                              <span className="text-muted-foreground">Procedure:</span>
                                              <div className="text-foreground">{visit.procedure}</div>
                                            </div>
                                          )}
                                        </div>
                                        {visit.prescriptions && (
                                          <div>
                                            <span className="text-muted-foreground">Prescriptions:</span>
                                            <ul className="mt-1 space-y-1">
                                              {visit.prescriptions.map((prescription, i) => (
                                                <li key={i} className="text-foreground">{prescription}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {visit.findings && (
                                          <div>
                                            <span className="text-muted-foreground">Findings:</span>
                                            <p className="mt-1 text-foreground">{visit.findings}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="payment-history">
                      <div className="text-center py-12 text-muted-foreground">
                        No payment history available
                      </div>
                    </TabsContent>

                    <TabsContent value="documents">
                      <div className="text-center py-12 text-muted-foreground">
                        No documents available
                      </div>
                    </TabsContent>

                    <TabsContent value="insurance">
                      <div className="text-center py-12 text-muted-foreground">
                        No insurance information available
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Sidebar - Patient Information */}
                <div className="w-80 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary">Patient Information</h2>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground mb-1">Full Name</div>
                        <div className="text-foreground">{patient.fullName}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Gender</div>
                        <div className="text-foreground">{patient.gender === "M" ? "Male" : "Female"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground mb-1">Date of Birth</div>
                        <div className="text-foreground">{patient.dateOfBirth}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Mobile Number</div>
                        <div className="text-foreground">{patient.mobileNumber}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground mb-1">Email</div>
                        <div className="text-foreground">{patient.email}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">National ID</div>
                        <div className="text-foreground">{patient.nationalId}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground mb-1">Street, Apartment</div>
                        <div className="text-foreground">{patient.street}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Pin code</div>
                        <div className="text-foreground">{patient.pincode}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground mb-1">State</div>
                        <div className="text-foreground">{patient.state}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">City</div>
                        <div className="text-foreground">{patient.city}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground mb-1">Country</div>
                      <div className="text-foreground">{patient.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
