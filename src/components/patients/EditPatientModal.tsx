import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
    if (patient) {
      setFormData({ ...patient });
    }
  }, [patient]);

  if (!formData) return null;

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const nameParts = formData.name.split(" ");
  const firstName = nameParts[0] || "";
  const surname = nameParts.slice(1).join(" ") || "";

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
                    onChange={(e) => {
                      const newName = `${e.target.value} ${surname}`.trim();
                      setFormData({ ...formData, name: newName });
                    }}
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
                    onChange={(e) => {
                      const newName = `${firstName} ${e.target.value}`.trim();
                      setFormData({ ...formData, name: newName });
                    }}
                    placeholder="Surname"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Gender</Label>
                  <Select
                    value={formData.gender.toLowerCase()}
                    onValueChange={(value) => setFormData({ ...formData, gender: value.charAt(0).toUpperCase() + value.slice(1) })}
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
                  <Label className="text-sm text-foreground">Age</Label>
                  <Input
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    placeholder="Age"
                    type="number"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A−">A−</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B−">B−</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB−">AB−</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O−">O−</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    type="email"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Status</Label>
                  <Select
                    value={formData.status.toLowerCase()}
                    onValueChange={(value) => setFormData({ ...formData, status: value === "active" ? "Active" : "Inactive" })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Address Details */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Address Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">Address / City</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="City name"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
