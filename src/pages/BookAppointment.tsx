import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, FlaskConical, Scan, Bed, Syringe } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const appointmentTypes = [
  { icon: Calendar, label: "Consultation", value: "consultation" },
  { icon: FlaskConical, label: "Laboratory", value: "laboratory" },
  { icon: Scan, label: "Radiology", value: "radiology" },
  { icon: Bed, label: "IPD Admission", value: "ipd" },
  { icon: Syringe, label: "DC Procedure", value: "dc" },
];

const BookAppointment = () => {
  const navigate = useNavigate();

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

          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 justify-center">
              {/* Main Content */}
              <div className="w-full lg:max-w-2xl">
                <h2 className="text-lg font-semibold text-primary mb-6">Book Appointments</h2>
                
                {/* Appointment Type Buttons */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-sm font-medium text-foreground">Appointment Type</h3>
                  <div className="flex gap-3 overflow-x-auto">
                    {appointmentTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant="outline"
                          className="h-auto py-2.5 px-4 flex items-center gap-2 hover:bg-accent hover:border-primary transition-colors whitespace-nowrap"
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Empty State */}
                <Card className="border-dashed min-h-[400px] flex flex-col items-center justify-center p-8">
                  <p className="text-sm font-medium text-muted-foreground mb-1">No Appointments</p>
                  <p className="text-xs text-muted-foreground">Booking appointments will appear here</p>
                </Card>

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
              <Card className="w-full lg:w-80 p-6 h-fit">
                <h3 className="text-sm font-semibold text-foreground mb-6">Appointment Summary</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Patient</p>
                    <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                    <p className="text-xs text-muted-foreground mt-1">GDID - 009 • 35 | M</p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">No Summary</p>
                    <p className="text-xs text-muted-foreground">Booking summary will appear here</p>
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

export default BookAppointment;
