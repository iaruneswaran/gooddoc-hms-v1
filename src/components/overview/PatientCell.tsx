import { User, UserRound } from "lucide-react";

interface PatientCellProps {
  name: string;
  gdid: string;
  ageSex?: string; // Format: "35/M" or "35/F" - optional
}

export function PatientCell({ name, gdid, ageSex }: PatientCellProps) {
  // Parse ageSex to extract age and gender (if provided)
  const [age, sex] = ageSex?.split("/") || [];
  const isFemale = sex?.toLowerCase().startsWith("f");

  // Format GDID - extract last 3 digits
  const formattedGdid = gdid.replace(/\D/g, "").slice(-3).padStart(3, "0");

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isFemale ? "bg-pink-500" : "bg-primary"
        }`}
      >
        {isFemale ? (
          <UserRound className="w-5 h-5 text-primary-foreground" />
        ) : (
          <User className="w-5 h-5 text-primary-foreground" />
        )}
      </div>
      <div>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">
          GDID - {formattedGdid}{ageSex ? ` • ${age} | ${sex}` : ""}
        </div>
      </div>
    </div>
  );
}
