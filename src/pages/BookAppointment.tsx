import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, TestTube, Activity, Bed, Scissors, Trash2 } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationData, setConsultationData] = useState<any>(null);

  const appointmentTypes = [
    { icon: Calendar, label: "Consultation", color: "text-primary" },
    { icon: TestTube, label: "Laboratory", color: "text-blue-500" },
    { icon: Activity, label: "Radiology", color: "text-green-500" },
    { icon: Bed, label: "IPD Admission", color: "text-orange-500" },
    { icon: Scissors, label: "DC Procedure", color: "text-purple-500" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <AppHeader 
            breadcrumbs={["GoodDoc", "Appointments", "Appointment"]}
          />
          
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-3 -ml-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Appointments
            </Button>

            <div className="mb-4">
              <BookingSteps currentStep="appointment" />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="flex-1 min-w-0 w-full lg:w-auto">
                <h2 className="text-xl font-semibold text-destructive mb-3">Book Appointments</h2>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Appointment Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {appointmentTypes.map((type) => (
                      <Button
                        key={type.label}
                        variant={type.label === "Consultation" && showConsultationForm ? "default" : "outline"}
                        className="flex items-center gap-2 h-auto py-2 px-3"
                        onClick={() => {
                          if (type.label === "Consultation") {
                            setShowConsultationForm(true);
                          }
                        }}
                      >
                        <type.icon className={`w-4 h-4 ${type.color}`} />
                        <span className="text-sm">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {showConsultationForm ? (
                  <ConsultationForm 
                    onRemove={() => {
                      setShowConsultationForm(false);
                      setConsultationData(null);
                    }}
                    onUpdate={(data) => setConsultationData(data)}
                  />
                ) : (
                  <Card className="min-h-[200px] flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground font-medium mb-1">No Appointments</p>
                      <p className="text-sm text-muted-foreground">Booking appointments will appear here</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <Button className="bg-destructive hover:bg-destructive/90">
                    Generate Invoice
                  </Button>
                </div>
              </div>

              <div className="w-full lg:w-80 flex-shrink-0">
                <h3 className="text-sm font-medium mb-3">Appointment Summary</h3>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Patient</p>
                      <p className="font-medium">Siva Karthikeyan</p>
                      <p className="text-xs text-muted-foreground">GDID - 009 • 35 | M</p>
                    </div>
                  </CardContent>
                </Card>

{consultationData ? (
                  <>
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Consultation</h4>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => {
                              setShowConsultationForm(false);
                              setConsultationData(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">When</p>
                            <p className="font-medium">
                              {consultationData.date ? new Date(consultationData.date).toLocaleDateString('en-GB') : '05/08/2025'} {consultationData.time} AM
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Doctor</p>
                            <p className="font-medium">Dr. Meera Nair – Cardiology</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span>Consultation</span>
                            <span className="font-semibold">₹{consultationData.amount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹900</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CGST (9%)</span>
                            <span>₹50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">SGST (9%)</span>
                            <span>₹50</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t font-semibold">
                            <span>Net Payable</span>
                            <span>₹{consultationData.amount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="mb-4">
                      <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground font-medium mb-1">No Summary</p>
                        <p className="text-xs text-muted-foreground">Booking summary will appear here</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground font-medium mb-1">No Appointments</p>
                        <p className="text-xs text-muted-foreground">Booking appointments will appear here</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
