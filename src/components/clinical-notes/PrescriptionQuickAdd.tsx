import { useState } from "react";
import { Plus, Search, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Medication {
  id: string;
  name: string;
  strength: string;
  route: string;
  frequency: string;
  duration: string;
  hasAllergy?: boolean;
}

export function PrescriptionQuickAdd() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [frequency, setFrequency] = useState("OD");
  const [route, setRoute] = useState("PO");

  const handleAddMedication = () => {
    if (!searchQuery.trim()) return;

    const newMed: Medication = {
      id: Date.now().toString(),
      name: searchQuery,
      strength: "500 mg",
      route,
      frequency,
      duration: "7 days",
      hasAllergy: searchQuery.toLowerCase().includes("penicillin") || searchQuery.toLowerCase().includes("sulfa"),
    };

    setMedications([...medications, newMed]);
    setSearchQuery("");
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const frequencyOptions = ["OD", "BD", "TID", "QID", "PRN"];
  const routeOptions = ["PO", "IV", "IM", "SC", "Topical"];

  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      }}
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Prescription</h2>

      {/* Search Input */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines… (⌘K)"
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddMedication();
            }}
          />
        </div>

        {/* Quick Selectors */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Frequency</Label>
            <div className="flex gap-2">
              {frequencyOptions.map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                    frequency === freq
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Route</Label>
            <div className="flex gap-2">
              {routeOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoute(r)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                    route === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleAddMedication} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add to Rx
        </Button>
      </div>

      {/* Active Medications List */}
      {medications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">💊</div>
          <p className="text-sm">No medications added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Medications</h3>
          {medications.map((med) => (
            <div
              key={med.id}
              className="rounded-lg border p-3 space-y-2"
              style={{
                backgroundColor: med.hasAllergy ? "#FDECEC" : "#F9FAFB",
                borderColor: med.hasAllergy ? "#F8D2D2" : "#E5E7EB",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{med.name}</p>
                    {med.hasAllergy && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: "#B91C1C",
                          color: "#FFFFFF",
                        }}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Allergy
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {med.strength} • {med.route} • {med.frequency} • {med.duration}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveMedication(med.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t">
        <Button variant="ghost" size="sm">
          Skip, Fill later
        </Button>
        <Button size="sm">Save & Continue</Button>
      </div>
    </div>
  );
}
