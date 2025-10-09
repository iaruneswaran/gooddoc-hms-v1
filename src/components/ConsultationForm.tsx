import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ConsultationFormProps {
  onRemove: () => void;
  onUpdate: (data: any) => void;
}

export function ConsultationForm({ onRemove, onUpdate }: ConsultationFormProps) {
  const [mode, setMode] = useState<"in-person" | "telehealth">("in-person");
  const [consultationType, setConsultationType] = useState("first-visit");
  const [department, setDepartment] = useState("cardiology");
  const [doctor, setDoctor] = useState("dr-meera-nair");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 7, 5));
  const [selectedTime, setSelectedTime] = useState("07:30");
  const [clinicalInfo, setClinicalInfo] = useState("");

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

  const handleUpdate = () => {
    onUpdate({
      mode,
      consultationType,
      department,
      doctor,
      date: selectedDate,
      time: selectedTime,
      clinicalInfo,
      amount: 1000
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Consultation</h3>
          <Button variant="ghost" onClick={onRemove} className="text-destructive hover:text-destructive">
            Remove
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Mode of Consultation</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === "in-person" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setMode("in-person");
                    handleUpdate();
                  }}
                >
                  In-Person
                </Button>
                <Button
                  type="button"
                  variant={mode === "telehealth" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setMode("telehealth");
                    handleUpdate();
                  }}
                >
                  Telehealth
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Consultation Type</Label>
              <Select value={consultationType} onValueChange={(value) => {
                setConsultationType(value);
                handleUpdate();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-visit">First Visit</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Department/Specialty</Label>
              <Select value={department} onValueChange={(value) => {
                setDepartment(value);
                handleUpdate();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Doctor</Label>
              <Select value={doctor} onValueChange={(value) => {
                setDoctor(value);
                handleUpdate();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-meera-nair">Dr. Meera Nair – Cardiology</SelectItem>
                  <SelectItem value="dr-rajesh-kumar">Dr. Rajesh Kumar – Cardiology</SelectItem>
                  <SelectItem value="dr-priya-sharma">Dr. Priya Sharma – Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Clinical Information</Label>
            <Textarea
              placeholder="Write patient clinical information"
              value={clinicalInfo}
              onChange={(e) => {
                setClinicalInfo(e.target.value);
                handleUpdate();
              }}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Date & Time</Label>
              <div className="flex items-center gap-2 text-sm">
                <span>{format(selectedDate, "dd/MM/yyyy")}</span>
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setSelectedTime(time);
                    handleUpdate();
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
