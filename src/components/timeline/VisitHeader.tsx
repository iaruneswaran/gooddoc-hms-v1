import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VisitHeaderProps {
  visitId: string;
  status: "active" | "completed";
  patient: {
    name: string;
    mrn: string;
    age: number;
    sex: string;
  };
  patientId?: string;
}

export function VisitHeader({ visitId, status, patient, patientId }: VisitHeaderProps) {
  const navigate = useNavigate();
  const isActive = status === "active";

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border">
      <div className="px-6 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/patient-insights/${patientId}`)}
          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-semibold">Back to Patient Insights</span>
        </button>

        {/* Header Content */}
        <div className="flex items-center justify-between">
          {/* Left: Visit Info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {isActive ? "Active Visit" : "Completed Visit"}: {visitId}
                </h1>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Active" : "Completed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {patient.name} • MRN-{patient.mrn} • {patient.age}y | {patient.sex}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
                <Button variant="destructive" size="sm">
                  Mark as Discharged
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
