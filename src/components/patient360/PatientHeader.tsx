import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { PatientChip } from "@/components/patient-insights/PatientChip";
import { Patient, Vitals } from "@/types/patient360";

interface PatientHeaderProps {
  patient: Patient;
  vitals?: Vitals;
}

export function PatientHeader({ patient, vitals }: PatientHeaderProps) {
  const navigate = useNavigate();

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dob).getTime()) / 
    (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="bg-background border-b border-border flex-shrink-0">
      <div className="px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/appointments/outpatient")}
          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-semibold">Outpatient</span>
        </button>

        {/* Header Content */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: Patient Info */}
          <div className="flex items-center gap-3">
            <PatientChip
              name={patient.name}
              gdid={patient.gdid}
              age={age}
              gender={patient.sex}
            />
          </div>

          {/* Right: Badges for allergies and conditions */}
          <div className="flex flex-wrap gap-2">
            {patient.alerts?.allergies && patient.alerts.allergies.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                Allergies: {patient.alerts.allergies.join(", ")}
              </Badge>
            )}
            {patient.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
