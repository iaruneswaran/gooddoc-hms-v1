import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTab } from "./tabs/AppointmentsTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { InsuranceTab } from "./tabs/InsuranceTab";
import { Visit } from "./VisitListItem";

interface VisitDetailsTabsProps {
  selectedVisit: Visit | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function VisitDetailsTabs({ selectedVisit, activeTab, onTabChange }: VisitDetailsTabsProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        {/* Sticky Tab Bar */}
        <div className="sticky top-0 bg-background z-10 border-b border-border">
          <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0 px-6">
            <TabsTrigger
              value="appointments"
              className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="insurance"
              className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
            >
              Insurance
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="appointments" className="mt-0">
            <AppointmentsTab selectedVisit={selectedVisit} />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <PaymentsTab selectedVisit={selectedVisit} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentsTab selectedVisit={selectedVisit} />
          </TabsContent>

          <TabsContent value="insurance" className="mt-0">
            <InsuranceTab selectedVisit={selectedVisit} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
