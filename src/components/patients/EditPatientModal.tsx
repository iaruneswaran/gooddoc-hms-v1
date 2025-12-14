import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  registeredDate: string;
  status: "Active" | "Inactive";
}

interface EditPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSave: (patient: Patient) => void;
}

export function EditPatientModal({ open, onOpenChange, patient, onSave }: EditPatientModalProps) {
  const [formData, setFormData] = useState<Patient | null>(null);

  // Initialize form data when patient changes
  useState(() => {
    if (patient) {
      setFormData(patient);
    }
  });

  // Update form data when modal opens with new patient
  if (patient && formData?.id !== patient.id) {
    setFormData(patient);
  }

  if (!formData) return null;

  // Split name into first and surname
  const nameParts = formData.name.split(" ");
  const firstName = nameParts[0] || "";
  const surname = nameParts.slice(1).join(" ") || "";

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      toast({
        title: "Patient updated",
        description: "Patient information has been updated successfully.",
      });
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof Patient, value: string) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const updateName = (first: string, last: string) => {
    setFormData((prev) => prev ? { ...prev, name: `${first} ${last}`.trim() } : null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Patient Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient ID */}
          <div className="text-sm font-medium text-foreground">
            #{formData.id}
          </div>

          {/* Patient Information */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Patient Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Title</Label>
                  <Select defaultValue="mr">
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr</SelectItem>
                      <SelectItem value="mrs">Mrs</SelectItem>
                      <SelectItem value="ms">Ms</SelectItem>
                      <SelectItem value="dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-foreground">First Name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => updateName(e.target.value, surname)}
                    placeholder="First name"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Surname</Label>
                  <Input
                    value={surname}
                    onChange={(e) => updateName(firstName, e.target.value)}
                    placeholder="Surname"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Gender</Label>
                  <Select
                    value={formData.gender.toLowerCase()}
                    onValueChange={(value) => updateField("gender", value.charAt(0).toUpperCase() + value.slice(1))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Date of Birth</Label>
                  <Input
                    placeholder="dd/mm/yyyy"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Age</Label>
                  <Input
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="Age"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Mobile Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="10 digits"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@example.com"
                    type="email"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-foreground">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) => updateField("bloodGroup", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A−</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B−</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB−</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O−</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Address Details */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Address Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Street, Apartment</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Street address"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Pin code</Label>
                  <Input
                    placeholder="012 345"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">City</Label>
                  <Input
                    placeholder="City"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">State</Label>
                  <Input
                    placeholder="State"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-foreground">Country</Label>
                <Input
                  placeholder="Country"
                  defaultValue="India"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
