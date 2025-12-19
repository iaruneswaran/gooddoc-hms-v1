import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, UserRound } from "lucide-react";

interface PatientChipProps {
  name: string;
  gdid: string;
  age: number;
  gender: string;
  onClick?: () => void;
}

export function PatientChip({ name, gdid, age, gender, onClick }: PatientChipProps) {
  const isMale = gender.toLowerCase().startsWith("m");
  const isFemale = gender.toLowerCase().startsWith("f");

  // Gender-based styling
  const avatarBgClass = isFemale 
    ? "bg-pink-500" 
    : isMale 
      ? "bg-primary" 
      : "bg-muted";

  const content = (
    <>
      <Avatar className="h-12 w-12">
        <AvatarFallback className={`${avatarBgClass} text-primary-foreground`}>
          {isFemale ? (
            <UserRound className="h-6 w-6" />
          ) : (
            <User className="h-6 w-6" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="text-left">
        <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </p>
        <p className="text-xs text-muted-foreground">
          GDID-{gdid} • {age} | {gender[0]}
        </p>
      </div>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex items-center gap-3 pr-4 py-2 rounded-lg">
        {content}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 pr-4 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
      title="View profile details"
    >
      {content}
    </button>
  );
}
