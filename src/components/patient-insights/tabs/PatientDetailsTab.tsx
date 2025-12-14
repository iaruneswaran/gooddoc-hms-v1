import { useState } from "react";
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

interface Patient {
  name: string;
  gdid: string;
  title: string;
  firstName?: string;
  surname?: string;
  age: number;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  bloodGroup: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
}

interface PatientDetailsTabProps {
  patient: Patient;
}

export function PatientDetailsTab({ patient }: PatientDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Split name into first and surname if not provided
  const nameParts = patient.name.split(" ");
  const firstName = patient.firstName || nameParts[0] || "";
  const surname = patient.surname || nameParts.slice(1).join(" ") || "";

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with GDID and Edit Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">
          #GDID - {patient.gdid}
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline" size="sm">
            Edit
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Patient Information */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Patient Information</h3>
        <div className="space-y-4">
          {!isEditing ? (
            // View Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <p className="text-sm text-foreground mt-1">{patient.title}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">First Name</Label>
                  <p className="text-sm text-foreground mt-1">{firstName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Surname</Label>
                  <p className="text-sm text-foreground mt-1">{surname}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="text-sm text-foreground mt-1">{patient.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                  <p className="text-sm text-foreground mt-1">{patient.dob}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Age</Label>
                  <p className="text-sm text-foreground mt-1">{patient.age}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Mobile Number</Label>
                  <p className="text-sm text-foreground mt-1">{patient.mobile}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm text-foreground mt-1">{patient.email}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Blood Group</Label>
                <p className="text-sm text-foreground mt-1">{patient.bloodGroup}</p>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Title</Label>
                  <Select defaultValue={patient.title.toLowerCase()}>
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
                    defaultValue={firstName}
                    placeholder="First name"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Surname</Label>
                  <Input 
                    defaultValue={surname}
                    placeholder="Surname"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Gender</Label>
                  <Select defaultValue={patient.gender.toLowerCase()}>
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
                    defaultValue={patient.dob}
                    placeholder="dd/mm/yyyy"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Age</Label>
                  <Input 
                    value={patient.age}
                    placeholder="Calculated from DOB"
                    disabled
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Mobile Number</Label>
                  <Input 
                    defaultValue={patient.mobile}
                    placeholder="10 digits"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Email</Label>
                  <Input 
                    defaultValue={patient.email}
                    placeholder="name@example.com"
                    type="email"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-foreground">Blood Group</Label>
                <Select defaultValue={patient.bloodGroup}>
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
            </>
          )}
        </div>
      </Card>

      {/* Address Details */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Address Details</h3>
        <div className="space-y-4">
          {!isEditing ? (
            // View Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Street, Apartment</Label>
                  <p className="text-sm text-foreground mt-1">{patient.address}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pin code</Label>
                  <p className="text-sm text-foreground mt-1">{patient.pincode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <p className="text-sm text-foreground mt-1">{patient.city}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">State</Label>
                  <p className="text-sm text-foreground mt-1">{patient.state}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Country</Label>
                <p className="text-sm text-foreground mt-1">{patient.country}</p>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Street, Apartment</Label>
                  <Input 
                    defaultValue={patient.address}
                    placeholder="Anna Nagar"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Pin code</Label>
                  <Input 
                    defaultValue={patient.pincode}
                    placeholder="012 345"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">City</Label>
                  <Input 
                    defaultValue={patient.city}
                    placeholder="Chennai"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">State</Label>
                  <Input 
                    defaultValue={patient.state}
                    placeholder="Tamil Nadu"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-foreground">Country</Label>
                <Input 
                  defaultValue={patient.country}
                  placeholder="India"
                  className="mt-2"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
