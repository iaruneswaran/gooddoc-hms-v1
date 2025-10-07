import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "Outpatient Care",
  "Inpatient Care",
  "Diagnostics",
  "Emergency",
];

export function AppointmentTabs() {
  return (
    <Tabs defaultValue="outpatient" className="w-full">
      <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 w-full justify-start">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category.toLowerCase().replace(" ", "-")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
