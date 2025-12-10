import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, User, Calendar, MapPin, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientLabHeaderProps {
  name: string;
  mrn: string;
  age: number;
  sex: string;
  encounterId: string;
  encounterType: string;
  allergies: string[];
  physician: string;
  location?: string;
  orderId: string;
  priority: string;
  className?: string;
}

export function PatientLabHeader({
  name,
  mrn,
  age,
  sex,
  encounterId,
  encounterType,
  allergies,
  physician,
  location,
  orderId,
  priority,
  className,
}: PatientLabHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const priorityStyles: Record<string, string> = {
    STAT: "bg-destructive text-destructive-foreground animate-pulse",
    Urgent: "bg-amber-500 text-white",
    Routine: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "bg-card border rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-6">
        {/* Patient Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{name}</h2>
              <Badge variant="outline" className="text-xs">
                {encounterType}
              </Badge>
              <Badge className={cn("text-xs", priorityStyles[priority])}>
                {priority}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono">{mrn}</span>
              <span>•</span>
              <span>{age}y {sex}</span>
              <span>•</span>
              <span>Encounter: {encounterId}</span>
            </div>
            {allergies.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs text-destructive font-medium">Allergies:</span>
                <div className="flex gap-1">
                  {allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="destructive"
                      className="text-xs px-1.5 py-0"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="flex items-start gap-6 text-sm">
          <div className="text-right">
            <div className="text-muted-foreground text-xs mb-1">Order ID</div>
            <div className="font-mono font-medium">{orderId}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1 justify-end">
              <Stethoscope className="h-3 w-3" />
              Ordering Physician
            </div>
            <div className="font-medium">{physician}</div>
          </div>
          {location && (
            <div className="text-right">
              <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1 justify-end">
                <MapPin className="h-3 w-3" />
                Location
              </div>
              <div className="font-medium">{location}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
