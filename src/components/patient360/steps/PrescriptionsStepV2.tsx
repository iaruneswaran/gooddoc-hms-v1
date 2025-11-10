import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Patient } from "@/types/patient360";
import { Trash2, Plus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface PrescriptionItem {
  id: string;
  medicineName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface PrescriptionsStepV2Props {
  patient: Patient;
  onBack: () => void;
  onNext: () => void;
}

const FREQUENCIES = ["OD", "BD", "TID", "QID", "HS", "PRN"];
const DURATIONS = ["3 Days", "5 Days", "7 Days", "14 Days", "30 Days"];

// Mock medicine database
const MEDICINES = [
  { name: "Paracetamol", form: "Tablet", strengths: ["500mg", "650mg", "1000mg"] },
  { name: "Amoxicillin", form: "Capsule", strengths: ["250mg", "500mg"] },
  { name: "Ibuprofen", form: "Tablet", strengths: ["200mg", "400mg", "600mg"] },
  { name: "Metformin", form: "Tablet", strengths: ["500mg", "850mg", "1000mg"] },
  { name: "Aspirin", form: "Tablet", strengths: ["75mg", "150mg", "300mg"] },
];

export function PrescriptionsStepV2({ patient, onBack, onNext }: PrescriptionsStepV2Props) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { id: "1", medicineName: "", strength: "", dosage: "", frequency: "OD", duration: "7 Days", notes: "" },
  ]);

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { id: Date.now().toString(), medicineName: "", strength: "", dosage: "", frequency: "OD", duration: "7 Days", notes: "" },
    ]);
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const updatePrescription = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions(
      prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = () => {
    // Check for patient allergies
    if (patient.alerts?.allergies && patient.alerts.allergies.length > 0) {
      toast({
        title: "Allergy Warning",
        description: `Patient has allergies: ${patient.alerts.allergies.join(", ")}. Please verify prescriptions.`,
        variant: "destructive",
      });
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Prescriptions</h3>
            <p className="text-sm text-muted-foreground mt-1">Add medicines for the patient</p>
          </div>
        </div>

        {patient.alerts?.allergies && patient.alerts.allergies.length > 0 && (
          <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <AlertDescription className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ Patient Allergies: {patient.alerts.allergies.join(", ")}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_140px_120px_40px_40px] gap-3 text-xs font-medium text-muted-foreground pb-2 border-b">
            <div>Medicine Name</div>
            <div>Strength</div>
            <div>Dosage</div>
            <div>Frequency</div>
            <div>Duration</div>
            <div>Notes</div>
            <div></div>
          </div>

          {/* Prescription Rows */}
          {prescriptions.map((prescription) => {
            const selectedMedicine = MEDICINES.find((m) => m.name === prescription.medicineName);
            
            return (
              <div
                key={prescription.id}
                className="grid grid-cols-[2fr_1fr_1fr_140px_120px_40px_40px] gap-3 items-center"
              >
                {/* Medicine Name - Searchable Select */}
                <Select
                  value={prescription.medicineName}
                  onValueChange={(value) => updatePrescription(prescription.id, "medicineName", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Search medicine..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {MEDICINES.map((med) => (
                      <SelectItem key={med.name} value={med.name} className="text-sm">
                        {med.name} ({med.form})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Strength */}
                <Select
                  value={prescription.strength}
                  onValueChange={(value) => updatePrescription(prescription.id, "strength", value)}
                  disabled={!selectedMedicine}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {selectedMedicine?.strengths.map((strength) => (
                      <SelectItem key={strength} value={strength} className="text-sm">
                        {strength}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Dosage */}
                <Input
                  value={prescription.dosage}
                  onChange={(e) => updatePrescription(prescription.id, "dosage", e.target.value)}
                  placeholder="e.g., 1-0-1"
                  className="h-9 text-sm"
                />

                {/* Frequency - Segmented */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => updatePrescription(prescription.id, "frequency", freq)}
                      className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                        prescription.frequency === freq
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>

                {/* Duration */}
                <Select
                  value={prescription.duration}
                  onValueChange={(value) => updatePrescription(prescription.id, "duration", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration} className="text-sm">
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Notes */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 ${prescription.notes ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-card z-50">
                    <Label className="text-sm font-medium">Additional Notes</Label>
                    <Input
                      value={prescription.notes || ""}
                      onChange={(e) => updatePrescription(prescription.id, "notes", e.target.value)}
                      placeholder="Enter notes (optional)"
                      className="mt-2 text-sm"
                    />
                  </PopoverContent>
                </Popover>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePrescription(prescription.id)}
                  disabled={prescriptions.length === 1}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" onClick={addPrescription} className="gap-2">
            <Plus className="w-4 h-4" />
            Add More Medicines
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleSave}>Save & Continue</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
