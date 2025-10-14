import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, FlaskConical, Scan, Bed, Syringe, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConsultationBookingForm, ConsultationData } from "@/components/ConsultationBookingForm";
import { format } from "date-fns";

const appointmentTypes = [
  { icon: Calendar, label: "Consultation", value: "consultation" },
  { icon: FlaskConical, label: "Laboratory", value: "laboratory" },
  { icon: Scan, label: "Radiology", value: "radiology" },
  { icon: Bed, label: "IPD Admission", value: "ipd" },
  { icon: Syringe, label: "DC Procedure", value: "dc" },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);

  const handleTypeClick = (type: string) => {
    if (type === "consultation") {
      setSelectedType(type);
      // Initialize with default data
      setConsultationData({
        mode: "in-person",
        type: "First Visit",
        department: "Cardiology",
        doctor: "Dr. Meera Nair – Cardiology",
        clinicalInfo: "",
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    }
  };

  const handleRemoveConsultation = () => {
    setSelectedType(null);
    setConsultationData(null);
  };

  const handleConsultationUpdate = (data: ConsultationData) => {
    setConsultationData(data);
  };

  const calculateTotal = () => {
    const subtotal = 900;
    const cgst = 50;
    const sgst = 50;
    return { subtotal, cgst, sgst, total: subtotal + cgst + sgst };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Appointment"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/registration")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-lg font-semibold">Appointments</span>
          </button>

          <BookingSteps currentStep="appointment" />

          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-6">Book Appointments</h2>
            
            {/* Appointment Type Buttons */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-foreground">Appointment Type</h3>
              <div className="flex gap-3">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.value;
                  return (
                    <Button
                      key={type.value}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-9 px-4 flex items-center gap-2 hover:bg-accent hover:border-primary transition-colors whitespace-nowrap",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleTypeClick(type.value)}
                    >
                      <Icon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : "text-primary")} />
                      <span className="text-sm">{type.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Main Content */}
              <div className="w-full flex-1">
                {/* Consultation Form or Empty State */}
                {selectedType === "consultation" && consultationData ? (
                  <ConsultationBookingForm
                    onRemove={handleRemoveConsultation}
                    onUpdate={handleConsultationUpdate}
                  />
                ) : (
                  <Card className="border-dashed min-h-[400px] flex flex-col items-center justify-center p-8">
                    <p className="text-sm font-medium text-muted-foreground mb-1">No Appointments</p>
                    <p className="text-xs text-muted-foreground">Booking appointments will appear here</p>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/registration")}
                  >
                    Back
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Generate Invoice
                  </Button>
                </div>
              </div>

              {/* Appointment Summary Sidebar */}
              <Card className="w-full lg:w-[380px] p-6 h-fit shrink-0">
                <h3 className="text-sm font-semibold text-foreground mb-6">Appointment Summary</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Patient</p>
                    <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                    <p className="text-xs text-muted-foreground mt-1">GDID - 009 • 35 | M</p>
                  </div>

                  {consultationData ? (
                    <div className="pt-6 border-t border-border space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Consultation</p>
                          <button
                            onClick={handleRemoveConsultation}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">When</p>
                          <p className="text-foreground font-medium">
                            {format(consultationData.date, "dd/MM/yyyy")} {consultationData.time} AM
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Doctor</p>
                          <p className="text-foreground font-medium">{consultationData.doctor}</p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <p className="text-foreground">Consultation</p>
                          <p className="text-foreground font-semibold">₹1,000</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-2 text-xs">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="text-foreground">₹{calculateTotal().subtotal}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">CGST (9%)</p>
                          <p className="text-foreground">₹{calculateTotal().cgst}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">SGST (9%)</p>
                          <p className="text-foreground">₹{calculateTotal().sgst}</p>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-border">
                          <p className="text-foreground font-semibold">Net Payable</p>
                          <p className="text-foreground font-bold">₹{calculateTotal().total}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-2">No Summary</p>
                      <p className="text-xs text-muted-foreground">Booking summary will appear here</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
