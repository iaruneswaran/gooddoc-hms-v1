import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface IPDAdmissionData {
  department: string;
  attendingDoctor: string;
  ward: string;
  bed: string;
  reasonForAdmission: string;
  date: Date;
  time: string;
  emergencyContactName: string;
  relationship: string;
  contactNumber: string;
  address: string;
}

interface IPDAdmissionBookingFormProps {
  onRemove: () => void;
  onUpdate: (data: IPDAdmissionData) => void;
}

const timeSlots = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30",
  "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

export const IPDAdmissionBookingForm = ({ onRemove, onUpdate }: IPDAdmissionBookingFormProps) => {
  const [department, setDepartment] = useState("General Medicine");
  const [attendingDoctor, setAttendingDoctor] = useState("Dr. A. Joseph (Ophthalmology)");
  const [ward, setWard] = useState("General Ward - 01A");
  const [bed, setBed] = useState("Bed - 35A");
  const [reasonForAdmission, setReasonForAdmission] = useState("");
  const [date, setDate] = useState<Date>(new Date(2025, 7, 5));
  const [selectedTime, setSelectedTime] = useState("07:30");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    onUpdate({ department: value, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
  };

  const handleAttendingDoctorChange = (value: string) => {
    setAttendingDoctor(value);
    onUpdate({ department, attendingDoctor: value, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
  };

  const handleWardChange = (value: string) => {
    setWard(value);
    onUpdate({ department, attendingDoctor, ward: value, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
  };

  const handleBedChange = (value: string) => {
    setBed(value);
    onUpdate({ department, attendingDoctor, ward, bed: value, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasonForAdmission(e.target.value);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission: e.target.value, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time, emergencyContactName, relationship, contactNumber, address });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date: newDate, time: selectedTime, emergencyContactName, relationship, contactNumber, address });
    }
  };

  const handleEmergencyContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmergencyContactName(e.target.value);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName: e.target.value, relationship, contactNumber, address });
  };

  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship: value, contactNumber, address });
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(e.target.value);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber: e.target.value, address });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address: e.target.value });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">IPD Admission</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-primary"
        >
          Remove
        </Button>
      </div>

      <div className="space-y-6">
        {/* Department and Attending Doctor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Department
            </label>
            <Select value={department} onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Medicine">General Medicine</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Attending Doctor
            </label>
            <Select value={attendingDoctor} onValueChange={handleAttendingDoctorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. A. Joseph (Ophthalmology)">Dr. A. Joseph (Ophthalmology)</SelectItem>
                <SelectItem value="Dr. Meera Nair (Cardiology)">Dr. Meera Nair (Cardiology)</SelectItem>
                <SelectItem value="Dr. Rajesh Kumar (Neurology)">Dr. Rajesh Kumar (Neurology)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ward and Bed */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Select Ward
            </label>
            <Select value={ward} onValueChange={handleWardChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Ward - 01A">General Ward - 01A</SelectItem>
                <SelectItem value="General Ward - 01B">General Ward - 01B</SelectItem>
                <SelectItem value="Private Ward - 02A">Private Ward - 02A</SelectItem>
                <SelectItem value="ICU - 03A">ICU - 03A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Select Bed
            </label>
            <Select value={bed} onValueChange={handleBedChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select bed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bed - 35A">Bed - 35A</SelectItem>
                <SelectItem value="Bed - 35B">Bed - 35B</SelectItem>
                <SelectItem value="Bed - 36A">Bed - 36A</SelectItem>
                <SelectItem value="Bed - 36B">Bed - 36B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Emergency Contact Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Emergency Contact Name
            </label>
            <Input
              placeholder="John Doe"
              value={emergencyContactName}
              onChange={handleEmergencyContactNameChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Relationship
            </label>
            <Select value={relationship} onValueChange={handleRelationshipChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Contact Number
            </label>
            <Input
              placeholder="+91 98765 43210"
              value={contactNumber}
              onChange={handleContactNumberChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Address
            </label>
            <Input
              placeholder="House No, Street, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => onUpdate({ department, attendingDoctor, ward, bed, reasonForAdmission, date, time: selectedTime, emergencyContactName, relationship, contactNumber, address })}
            />
          </div>
        </div>

        {/* Reason for Admission */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Reason for Admission
          </label>
          <Textarea
            placeholder="Write reason for admission"
            value={reasonForAdmission}
            onChange={handleReasonChange}
            className="min-h-[100px]"
          />
        </div>

        {/* Date & Time */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-10 gap-2 p-4 border rounded-md">
            {timeSlots.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                className="h-9 text-xs"
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
