import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Reports"]} />

        <main className="p-6">
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Reports</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Clock className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Analytics, dashboards, and operational reports for your healthcare facility. This feature is currently under development.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
