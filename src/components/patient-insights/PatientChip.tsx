import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientChipProps {
  name: string;
  gdid: string;
  age: number;
  gender: string;
  onClick?: () => void;
  showBackButton?: boolean;
  backPath?: string;
}

export function PatientChip({ name, gdid, age, gender, onClick, showBackButton, backPath }: PatientChipProps) {
  const navigate = useNavigate();
  const isMale = gender.toLowerCase().startsWith("m");
  const isFemale = gender.toLowerCase().startsWith("f");

  // Gender-based styling
  const avatarBgClass = isFemale 
    ? "bg-pink-500" 
    : isMale 
      ? "bg-primary" 
      : "bg-muted";

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const content = (
    <>
      {showBackButton && (
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-background border border-border shadow-sm hover:bg-accent/50 hover:border-primary/30 transition-all mr-2"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
        <AvatarFallback className={`${avatarBgClass} text-primary-foreground`}>
          {isFemale ? (
            <UserRound className="h-5 w-5" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="text-left ml-1">
        <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
          {name}
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          <span className="text-foreground/70">GDID-{gdid}</span>
          <span className="mx-1.5 text-border">•</span>
          <span>{age}</span>
          <span className="mx-1 text-muted-foreground/50">|</span>
          <span>{gender[0]}</span>
        </p>
      </div>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex items-center">
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
