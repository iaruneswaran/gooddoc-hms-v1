import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface Visit {
  id: string;
  visitId: string;
  datetime: Date;
  type: string;
  status: string;
  location: string;
  doctor?: string;
  items?: any[];
}

interface VisitListItemProps {
  visit: Visit;
  isSelected: boolean;
  onClick: () => void;
}

export function VisitListItem({ visit, isSelected, onClick }: VisitListItemProps) {
  const statusColors: Record<string, string> = {
    Completed: "bg-green-100 text-green-800",
    Scheduled: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-sm ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-foreground">{visit.visitId}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(visit.datetime, "dd MMM yyyy | hh:mm a")}
          </p>
        </div>
        <Badge
          className={`${statusColors[visit.status] || "bg-gray-100 text-gray-800"} text-xs`}
          variant="outline"
        >
          {visit.status}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Type:</span> {visit.type}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Location:</span> {visit.location}
        </p>
      </div>
    </button>
  );
}
