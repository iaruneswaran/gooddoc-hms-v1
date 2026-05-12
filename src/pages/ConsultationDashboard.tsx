import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { PageContent } from "@/components/PageContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DentalConsultationProvider, useDentalConsultation } from "@/contexts/DentalConsultationContext";
import { AppHeader } from "@/components/AppHeader";
import { PatientBanner } from "@/components/dental/ConsultationHeader";
import { DentalChartTab } from "@/components/dental/tabs/DentalChartTab";
import { VisitNotesTab } from "@/components/dental/tabs/VisitNotesTab";
import { DiagnosisPlanTab } from "@/components/dental/tabs/DiagnosisPlanTab";
import { ImagingTab } from "@/components/dental/tabs/ImagingTab";
import { toast } from "sonner";
import { 
  Activity, 
  FileText, 
  ClipboardList, 
  Image as ImageIcon, 
  Pill 
} from "lucide-react";

const ConsultationDashboardContent = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chart");
  const { notes, saveConsultation } = useDentalConsultation();

  const handleTabChange = async (value: string) => {
    // Autosave on tab switch
    await saveConsultation();
    setActiveTab(value);
  };

  const handleFinalize = () => {
    navigate(`/dental/procedures/patients/${patientId}/finalize`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden p-0 gap-0">
        <AppHeader breadcrumbs={["Patient List", "Consultation"]} />
        
        <PatientBanner onFinalize={handleFinalize} />

        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b border-border bg-white flex-shrink-0 z-10 shadow-sm py-2.5">
              <TabsList className="h-11 bg-muted/50 p-1 gap-0.5 rounded-md justify-start w-auto inline-flex">
                {[
                  { value: 'chart', label: 'Dental Chart', icon: Activity },
                  { value: 'imaging', label: 'Imaging', icon: ImageIcon },
                ].map(tab => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="gap-2 text-sm px-4 h-9 rounded-sm data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden min-h-0 bg-[#F8FAFC]">
              <TabsContent value="chart" className="m-0 h-full overflow-hidden">
                <DentalChartTab />
              </TabsContent>
              <TabsContent value="imaging" className="m-0 h-full overflow-hidden">
                <ImagingTab />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </PageContent>
    </div>
  );
};

const ConsultationDashboard = () => {
  const { patientId } = useParams();
  return (
    <DentalConsultationProvider patientId={patientId || 'unknown'}>
      <ConsultationDashboardContent />
    </DentalConsultationProvider>
  );
};

export default ConsultationDashboard;
