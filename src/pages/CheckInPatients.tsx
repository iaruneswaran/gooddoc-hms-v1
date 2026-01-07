import { useNavigate } from "react-router-dom";
import { BedMapView } from "@/components/beds";
import { MainLayout } from "@/components/MainLayout";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BedsAvailability = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Top Header with Breadcrumbs and Search */}
      <AppHeader breadcrumbs={["Overview", "Beds Availability"]} />
      
      <div className="p-6 space-y-4">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9"
              aria-label="Back to Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-h3 font-semibold text-foreground">Beds Availability</h1>
              <p className="text-sm text-muted-foreground">Live bed availability across all floors</p>
            </div>
          </div>
        </Card>
        
        {/* Map View */}
        <BedMapView />
      </div>
    </MainLayout>
  );
};

export default BedsAvailability;
