import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vitals } from "@/types/patient360";
import { Plus } from "lucide-react";

interface VitalsCardProps {
  vitals?: Vitals;
}

export function VitalsCard({ vitals }: VitalsCardProps) {
  const [unit, setUnit] = useState<"metric" | "us">("metric");

  if (!vitals) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">No vitals recorded</p>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Vitals
          </Button>
        </div>
      </Card>
    );
  }

  const convertTemp = (celsius: number) => {
    return unit === "metric" ? celsius : (celsius * 9) / 5 + 32;
  };

  const convertWeight = (kg: number) => {
    return unit === "metric" ? kg : kg * 2.20462;
  };

  const convertHeight = (cm: number) => {
    if (unit === "metric") return cm;
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}′${remainingInches}″`;
  };

  return (
    <Card className="p-8 sticky top-24 border-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Vitals Overview</h3>
          <p className="text-sm text-muted-foreground">
            Last Update: {new Date(vitals.recordedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUnit(unit === "metric" ? "us" : "metric")}
        >
          <Badge variant="secondary" className="text-xs font-medium">
            {unit === "metric" ? "Metric" : "US"}
          </Badge>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {vitals.bpSystolic && vitals.bpDiastolic && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Blood Pressure
            </p>
            <p className="text-2xl font-bold text-foreground">
              {vitals.bpSystolic}/{vitals.bpDiastolic}
            </p>
            <p className="text-xs text-muted-foreground mt-1">mmHg</p>
          </div>
        )}

        {vitals.spo2 && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              SpO₂
            </p>
            <p className="text-2xl font-bold text-foreground">
              {vitals.spo2}
            </p>
            <p className="text-xs text-muted-foreground mt-1">%</p>
          </div>
        )}

        {vitals.heartRate && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Heart Rate
            </p>
            <p className="text-2xl font-bold text-foreground">
              {vitals.heartRate}
            </p>
            <p className="text-xs text-muted-foreground mt-1">bpm</p>
          </div>
        )}

        {vitals.respiratoryRate && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Respiratory Rate
            </p>
            <p className="text-2xl font-bold text-foreground">
              {vitals.respiratoryRate}
            </p>
            <p className="text-xs text-muted-foreground mt-1">bpm</p>
          </div>
        )}

        {vitals.temperatureC && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Temperature
            </p>
            <p className="text-2xl font-bold text-foreground">
              {unit === "metric"
                ? vitals.temperatureC
                : convertTemp(vitals.temperatureC).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {unit === "metric" ? "°C" : "°F"}
            </p>
          </div>
        )}

        {vitals.weightKg && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Weight
            </p>
            <p className="text-2xl font-bold text-foreground">
              {unit === "metric"
                ? vitals.weightKg
                : convertWeight(vitals.weightKg).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {unit === "metric" ? "kg" : "lb"}
            </p>
          </div>
        )}

        {vitals.heightCm && (
          <div className="border-l-4 border-foreground/10 pl-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Height
            </p>
            <p className="text-2xl font-bold text-foreground">
              {unit === "metric"
                ? vitals.heightCm
                : convertHeight(vitals.heightCm)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {unit === "metric" ? "cm" : ""}
            </p>
          </div>
        )}
      </div>

      <Button variant="outline" size="default" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Vitals
      </Button>
    </Card>
  );
}
