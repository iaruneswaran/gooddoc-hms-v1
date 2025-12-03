import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { panelsCatalog } from "@/data/tests-catalog";

interface LabResultsPanelTabsProps {
  selectedPanel: string;
  onPanelChange: (panel: string) => void;
  testCounts?: Record<string, number>;
}

export function LabResultsPanelTabs({
  selectedPanel,
  onPanelChange,
  testCounts,
}: LabResultsPanelTabsProps) {
  return (
    <Tabs value={selectedPanel} onValueChange={onPanelChange} className="w-full">
      <div className="border-b border-border w-full">
        <TabsList className="bg-transparent rounded-none h-auto p-0 justify-start">
          {panelsCatalog.map((panel) => (
            <TabsTrigger
              key={panel.id}
              value={panel.id}
              className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3 relative"
            >
              {panel.name}
              {testCounts && testCounts[panel.id] !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({testCounts[panel.id]})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
