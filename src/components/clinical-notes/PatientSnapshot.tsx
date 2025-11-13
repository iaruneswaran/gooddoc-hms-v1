import { AlertTriangle } from "lucide-react";
import { VitalsGrid } from "./VitalsGrid";

export function PatientSnapshot() {
  const allergies = ["Penicillin", "Sulfa drugs"];

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold text-foreground">Harish Kalyan</h1>
          <span className="text-muted-foreground">GDID - 001 • 45 | M</span>
        </div>
        <p className="text-sm text-muted-foreground">Last Update: 05 Aug 2025</p>
      </div>

      {/* Allergy Alert */}
      {allergies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span>Allergy Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <div
                key={allergy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "#FDECEC",
                  border: "1px solid #F8D2D2",
                  color: "#B91C1C",
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {allergy}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vitals Grid */}
      <VitalsGrid />
    </div>
  );
}
