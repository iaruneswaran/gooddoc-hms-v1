import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PatientHeader } from "@/components/patient360/PatientHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClinicalNotesStepper } from "@/components/patient360/ClinicalNotesStepper";
import { MedicalHistoryTimeline } from "@/components/patient360/MedicalHistoryTimeline";
import { PatientDetailsPanel } from "@/components/patient360/PatientDetailsPanel";
import { mockPatients, mockVitals, mockVisitHistory } from "@/data/patient360.mock";

export default function Patient360() {
  const { gdid } = useParams<{ gdid: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultView = searchParams.get("view") || "clinical-notes";
  const fromPage = searchParams.get("from");
  
  const [activeTab, setActiveTab] = useState(defaultView);

  // Find patient by gdid or id (for patients from registry)
  const patient = mockPatients.find((p) => p.gdid === gdid || p.id === gdid);
  const vitals = patient ? mockVitals[patient.id] : undefined;
  const visitHistory = patient ? mockVisitHistory[patient.id] || [] : [];

  const handleBack = () => {
    if (fromPage === "patients") {
      navigate("/patients");
    } else {
      navigate("/appointments/outpatient");
    }
  };

  const getBackLabel = () => {
    if (fromPage === "patients") return "Patients";
    return "Outpatient";
  };

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 ml-[196px]">
          <AppHeader breadcrumbs={["Outpatient", "Patient 360"]} />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Patient not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", value);
    setSearchParams(newParams);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Patient 360"]} />
        <main>
          {/* Back Navigation */}
          <div className="px-6 pt-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">{getBackLabel()}</span>
            </button>
          </div>
          <PatientHeader patient={patient} vitals={vitals} />
          
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start mb-6">
                <TabsTrigger value="clinical-notes" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  Clinical Notes
                </TabsTrigger>
                <TabsTrigger value="medical-history" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="patient-details" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  Patient Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clinical-notes">
                <ClinicalNotesStepper patient={patient} vitals={vitals} />
              </TabsContent>

              <TabsContent value="medical-history">
                <MedicalHistoryTimeline visits={visitHistory} />
              </TabsContent>

              <TabsContent value="patient-details">
                <PatientDetailsPanel patient={patient} vitals={vitals} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
