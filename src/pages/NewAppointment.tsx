import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { PatientSearchForm } from "@/components/PatientSearchForm";
import { PatientResultsList } from "@/components/PatientResultsList";
import { Button } from "@/components/ui/button";

// Mock data
const mockPatients = [
  {
    id: "1",
    name: "Harish Kalyan",
    gdid: "GDID - 001",
    age: 35,
    gender: "M",
  },
  {
    id: "2",
    name: "Sneha Reddy",
    gdid: "GDID - 004",
    age: 28,
    gender: "F",
  },
];

const NewAppointment = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<typeof mockPatients>([]);

  const handleSearch = (searchType: string, searchValue: string) => {
    // Mock search - in real app, this would call an API
    setSearchResults(mockPatients);
  };

  const handleBookAppointment = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    // Generate visit ID for new appointments (not from patient insights)
    const visitId = `VST-${Math.floor(100000 + Math.random() * 900000)}`;
    navigate("/book-appointment", { state: { patient, visitId } });
  };

  const handleCreateNewRegistration = () => {
    navigate("/registration");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Search"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Appointment List</span>
          </button>

          <BookingSteps currentStep="search" />

          <div className="max-w-4xl mx-auto space-y-6">
            <PatientSearchForm onSearch={handleSearch} />
            
            <PatientResultsList
              patients={searchResults}
              onBookAppointment={handleBookAppointment}
            />

            {searchResults.length > 0 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Select a patient or create a new registration.
                </p>
                <Button onClick={handleCreateNewRegistration}>
                  Create New Registration
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewAppointment;
