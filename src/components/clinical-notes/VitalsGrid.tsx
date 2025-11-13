import { Activity, Droplet, Heart, Ruler, Scale, Thermometer, Wind } from "lucide-react";

interface VitalCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}

function VitalCard({ icon, label, value, unit }: VitalCardProps) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{unit}</p>
        </div>
      </div>
    </div>
  );
}

export function VitalsGrid() {
  const vitals = [
    { icon: <Activity className="w-5 h-5" />, label: "Blood Pressure", value: "120/80", unit: "mmHg" },
    { icon: <Droplet className="w-5 h-5" />, label: "SpO₂", value: "98", unit: "%" },
    { icon: <Heart className="w-5 h-5" />, label: "Heart Rate", value: "72", unit: "bpm" },
    { icon: <Wind className="w-5 h-5" />, label: "Respiratory Rate", value: "16", unit: "bpm" },
    { icon: <Thermometer className="w-5 h-5" />, label: "Temperature", value: "37", unit: "°C" },
    { icon: <Scale className="w-5 h-5" />, label: "Weight", value: "70", unit: "kg" },
    { icon: <Ruler className="w-5 h-5" />, label: "Height", value: "175", unit: "cm" },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-3">Vitals</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vitals.map((vital) => (
          <VitalCard key={vital.label} {...vital} />
        ))}
      </div>
    </div>
  );
}
