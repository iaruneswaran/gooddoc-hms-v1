import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { AppointmentTabs } from "@/components/AppointmentTabs";
import { AppointmentTable } from "@/components/AppointmentTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("outpatient-care");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments"]} />
        
        <main className="p-8">
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Appointments List</h1>
              <div className="flex items-center gap-4">
                <CalendarWidget />
                <Button 
                  onClick={() => navigate("/new-appointment")}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  New Appointment
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <AppointmentTabs onTabChange={setSelectedCategory} />
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-10"
                />
              </div>
            </div>
          </Card>

          <AppointmentTable category={selectedCategory} />
        </main>
      </div>
    </div>
  );
};

export default Index;
