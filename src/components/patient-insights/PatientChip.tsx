import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PatientChipProps {
  name: string;
  gdid: string;
  age: number;
  gender: string;
  onClick: () => void;
}

export function PatientChip({ name, gdid, age, gender, onClick }: PatientChipProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
      title="View profile details"
    >
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-primary text-primary-foreground text-base">
          {initials}
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
    </button>
  );
}
