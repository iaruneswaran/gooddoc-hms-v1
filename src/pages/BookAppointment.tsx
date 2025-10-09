import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, TestTube, Activity, Bed, Scissors } from "lucide-react";

export default function BookAppointment() {
  const navigate = useNavigate();

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
          
          <div className="p-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 -ml-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Appointments
            </Button>

            <div className="mb-8">
              <BookingSteps currentStep="appointment" />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-destructive mb-6">Book Appointments</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-medium mb-4">Appointment Type</h3>
                  <div className="flex gap-3">
                    {appointmentTypes.map((type) => (
                      <Button
                        key={type.label}
                        variant="outline"
                        className="flex items-center gap-2 h-auto py-3 px-4"
                      >
                        <type.icon className={`w-4 h-4 ${type.color}`} />
                        <span className="text-sm">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Card className="min-h-[400px] flex items-center justify-center">
                  <CardContent className="text-center py-20">
                    <p className="text-muted-foreground font-medium mb-1">No Appointments</p>
                    <p className="text-sm text-muted-foreground">Booking appointments will appear here</p>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-6">
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

              <div className="w-80">
                <h3 className="text-sm font-medium mb-4">Appointment Summary</h3>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Patient</p>
                      <p className="font-medium">Siva Karthikeyan</p>
                      <p className="text-xs text-muted-foreground">GDID - 009 • 35 | M</p>
                    </div>
                  </CardContent>
                </Card>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
