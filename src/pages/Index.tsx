import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("outpatient-care");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Appointments"]} />
        
        <main className="p-6 pr-4">
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

          <div className="flex items-center justify-between mb-6">
            <AppointmentTabs onTabChange={setSelectedCategory} />
            <div className="flex items-center gap-3">
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  <SelectItem value="Dr. Meera Nair">Dr. Meera Nair</SelectItem>
                  <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                  <SelectItem value="Dr. Anita Singh">Dr. Anita Singh</SelectItem>
                  <SelectItem value="Dr. Sunil Reddy">Dr. Sunil Reddy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </div>

          <AppointmentTable 
            category={selectedCategory} 
            searchQuery={searchQuery}
            doctorFilter={doctorFilter}
            specialtyFilter={specialtyFilter}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
