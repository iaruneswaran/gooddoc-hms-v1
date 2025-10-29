import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTab } from "./tabs/AppointmentsTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
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
      <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
        <TabsTrigger
          value="appointments"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Appointments
        </TabsTrigger>
        <TabsTrigger
          value="payments"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Payment History
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Documents
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
    </div>
      </Tabs>
    </div>
  );
}
