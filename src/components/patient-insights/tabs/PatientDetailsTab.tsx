import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  nationalId: string;
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
  // Split name into first and surname if not provided
  const nameParts = patient.name.split(" ");
  const firstName = patient.firstName || nameParts[0] || "";
  const surname = patient.surname || nameParts.slice(1).join(" ") || "";

  return (
    <div className="p-6 space-y-6">
      {/* GDID Display */}
      <div className="text-sm font-medium text-foreground">
        #GDID - {patient.gdid}
      </div>

      {/* Patient Information */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Patient Information</h3>
        <div className="space-y-4">
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
            <Label className="text-sm text-foreground">National ID</Label>
            <Input 
              defaultValue={patient.nationalId}
              placeholder="9876 5432 1098"
              className="mt-2"
            />
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
        </div>
      </Card>
    </div>
  );
}
