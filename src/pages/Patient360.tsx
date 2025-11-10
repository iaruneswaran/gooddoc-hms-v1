import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PatientHeader } from "@/components/patient360/PatientHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClinicalNotesStepper } from "@/components/patient360/ClinicalNotesStepper";
import { MedicalHistoryTimeline } from "@/components/patient360/MedicalHistoryTimeline";
import { PatientDetailsPanel } from "@/components/patient360/PatientDetailsPanel";
import { mockPatients, mockVitals, mockVisitHistory } from "@/data/patient360.mock";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { ChevronLeft } from "lucide-react";

export default function Patient360() {
  const { gdid } = useParams<{ gdid: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { flags } = useFeatureFlags();
  const defaultView = searchParams.get("view") || "clinical-notes";
  
  const [activeTab, setActiveTab] = useState(defaultView);

  const patient = mockPatients.find((p) => p.gdid === gdid);
  const vitals = patient ? mockVitals[patient.id] : undefined;
  const visitHistory = patient ? mockVisitHistory[patient.id] || [] : [];

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 ml-[196px]">
          <AppHeader breadcrumbs={["Appointments", "Patient 360"]} />
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
    setSearchParams({ view: value });
  };

  const headerClassName = flags.patient360_v2_layout ? "bg-transparent border-b-0 shadow-none" : "";

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        {flags.patient360_v2_layout ? (
          <header className={`h-16 border-b-0 bg-transparent flex items-center justify-between px-8 ${headerClassName}`}>
            <Button
              variant="ghost"
              onClick={() => navigate("/appointments/outpatient")}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Outpatient
            </Button>
          </header>
        ) : (
          <AppHeader breadcrumbs={["Appointments", "Patient 360", patient.name]} />
        )}
        <main>
          <div className={flags.patient360_v2_layout ? "bg-transparent" : ""}>
            <PatientHeader patient={patient} vitals={vitals} />
          </div>
          
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className={flags.patient360_v2_layout ? "bg-transparent border-b border-border rounded-none h-auto p-0 justify-start mb-6" : "mb-6"}>
                <TabsTrigger 
                  value="clinical-notes"
                  className={flags.patient360_v2_layout ? "tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3" : ""}
                >
                  Clinical Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="medical-history"
                  className={flags.patient360_v2_layout ? "tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3" : ""}
                >
                  Medical History
                </TabsTrigger>
                <TabsTrigger 
                  value="patient-details"
                  className={flags.patient360_v2_layout ? "tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3" : ""}
                >
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
