import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Patient, PrescriptionItem } from "@/types/patient360";
import { useToast } from "@/hooks/use-toast";

interface PrescriptionsStepProps {
  patient: Patient;
  onBack: () => void;
  onNext: () => void;
}

export function PrescriptionsStep({ patient, onBack, onNext }: PrescriptionsStepProps) {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Partial<PrescriptionItem>[]>([
    { id: "1", name: "", frequency: "OD", durationDays: 7 }
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now().toString(), name: "", frequency: "OD", durationDays: 7 }
    ]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const updateMedication = (id: string, field: keyof PrescriptionItem, value: any) => {
    setMedications(
      medications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const handleSave = () => {
    if (patient.alerts?.allergies && patient.alerts.allergies.length > 0) {
      toast({
        title: "Allergy Alert",
        description: `Patient has allergies: ${patient.alerts.allergies.join(", ")}. Please review medications carefully.`,
        variant: "destructive"
      });
    }
    onNext();
  };

  return (
    <Card className="p-6">
      {patient.alerts?.allergies && patient.alerts.allergies.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="destructive" className="text-xs">
              Allergy Alert
            </Badge>
          </div>
          <p className="text-sm text-foreground">
            Patient has allergies to: {patient.alerts.allergies.join(", ")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {medications.map((med, index) => (
          <div
            key={med.id}
            className="grid grid-cols-12 gap-3 p-4 border border-border rounded-lg"
          >
            <div className="col-span-3">
              <Input
                placeholder="Medicine Name"
                value={med.name || ""}
                onChange={(e) => updateMedication(med.id!, "name", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Strength"
                value={med.strength || ""}
                onChange={(e) => updateMedication(med.id!, "strength", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Dosage"
                value={med.dosage || ""}
                onChange={(e) => updateMedication(med.id!, "dosage", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Select
                value={med.frequency}
                onValueChange={(value) => updateMedication(med.id!, "frequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OD">OD</SelectItem>
                  <SelectItem value="BD">BD</SelectItem>
                  <SelectItem value="TID">TID</SelectItem>
                  <SelectItem value="QID">QID</SelectItem>
                  <SelectItem value="HS">HS</SelectItem>
                  <SelectItem value="PRN">PRN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Select
                value={med.durationDays?.toString()}
                onValueChange={(value) =>
                  updateMedication(med.id!, "durationDays", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              {medications.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedication(med.id!)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            {med.notes !== undefined && (
              <div className="col-span-12">
                <Input
                  placeholder="Notes / PRN instructions"
                  value={med.notes}
                  onChange={(e) => updateMedication(med.id!, "notes", e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={addMedication}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add More Medicines
      </Button>

      <div className="flex items-center justify-between mt-6">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost">Skip, Fill later</Button>
          <Button onClick={handleSave}>Save & Continue</Button>
        </div>
      </div>
    </Card>
  );
}
