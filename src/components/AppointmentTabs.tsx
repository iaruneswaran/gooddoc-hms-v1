import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "Outpatient Care",
  "Inpatient Care",
  "Diagnostics",
  "Emergency",
];

interface AppointmentTabsProps {
  onTabChange?: (value: string) => void;
}

export function AppointmentTabs({ onTabChange }: AppointmentTabsProps) {
  return (
    <Tabs defaultValue="outpatient-care" className="w-full" onValueChange={onTabChange}>
      <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category.toLowerCase().replace(/ /g, "-")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
