import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Appointments", "Patient 360", patient.name]} />
        <main>
          <PatientHeader patient={patient} vitals={vitals} />
          
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
                <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                <TabsTrigger value="patient-details">Patient Details</TabsTrigger>
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
