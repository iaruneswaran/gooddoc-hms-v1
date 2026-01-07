import { BedMapView } from "@/components/beds";
import { MainLayout } from "@/components/MainLayout";

const BedsAvailability = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Overview / Beds
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Beds Availability
            </h1>
          </div>
        </div>
        
        {/* Map View */}
        <BedMapView />
      </div>
    </MainLayout>
  );
};

export default BedsAvailability;
