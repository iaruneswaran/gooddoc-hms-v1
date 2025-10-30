import { useState } from "react";
import { Calendar as CalendarIcon, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export interface RadiologyTest {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface RadiologyData {
  radiologyType: string;
  ageGroup: "adults" | "kids";
  selectedTests: RadiologyTest[];
  date: Date;
  time: string;
}

interface RadiologyBookingFormProps {
  onRemove: () => void;
  onUpdate: (data: RadiologyData) => void;
}

const radiologyTests: RadiologyTest[] = [
  { id: "1", name: "Chest (PA View)", category: "Radiology", price: 500 },
  { id: "2", name: "Cervical Spine", category: "Radiology", price: 600 },
  { id: "3", name: "Lumbar Spine", category: "Radiology", price: 700 },
  { id: "4", name: "Abdomen (KUB)", category: "Radiology", price: 300 },
  { id: "5", name: "Hand / Wrist", category: "Radiology", price: 400 },
  { id: "6", name: "Knee Joint (Both)", category: "Radiology", price: 500 },
  { id: "7", name: "Chest (PA View)", category: "Radiology", price: 500 },
  { id: "8", name: "Cervical Spine", category: "Radiology", price: 600 },
];

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

export const RadiologyBookingForm = ({ onRemove, onUpdate }: RadiologyBookingFormProps) => {
  const [radiologyType, setRadiologyType] = useState("X-Ray");
  const [ageGroup, setAgeGroup] = useState<"adults" | "kids">("adults");
  const [selectedTests, setSelectedTests] = useState<RadiologyTest[]>([
    { id: "1", name: "Chest (PA View)", category: "Radiology", price: 500 },
    { id: "2", name: "Cervical Spine", category: "Radiology", price: 600 },
  ]);
  const [date, setDate] = useState<Date>(new Date(2025, 7, 5));
  const [selectedTime, setSelectedTime] = useState("07:30");

  const handleRadiologyTypeChange = (value: string) => {
    setRadiologyType(value);
    onUpdate({ radiologyType: value, ageGroup, selectedTests, date, time: selectedTime });
  };

  const handleAgeGroupChange = (value: "adults" | "kids") => {
    setAgeGroup(value);
    onUpdate({ radiologyType, ageGroup: value, selectedTests, date, time: selectedTime });
  };

  const handleTestToggle = (test: RadiologyTest) => {
    const isSelected = selectedTests.some(t => t.id === test.id);
    const newTests = isSelected
      ? selectedTests.filter(t => t.id !== test.id)
      : [...selectedTests, test];
    setSelectedTests(newTests);
    onUpdate({ radiologyType, ageGroup, selectedTests: newTests, date, time: selectedTime });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onUpdate({ radiologyType, ageGroup, selectedTests, date, time });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onUpdate({ radiologyType, ageGroup, selectedTests, date: newDate, time: selectedTime });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Radiology</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-primary hover:text-primary/80"
        >
          Remove
        </Button>
      </div>

      <div className="space-y-6">
        {/* Radiology Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Radiology Type
            </label>
            <Select value={radiologyType} onValueChange={handleRadiologyTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="X-Ray">X-Ray</SelectItem>
                <SelectItem value="CT Scan">CT Scan</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Radiology
            </label>
            <Tabs value={ageGroup} onValueChange={(v) => handleAgeGroupChange(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="adults">Adults</TabsTrigger>
                <TabsTrigger value="kids">Kids</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Radiology Tests */}
        <div>
          <Tabs value={ageGroup} onValueChange={(v) => handleAgeGroupChange(v as any)}>
            <TabsContent value="adults" className="grid grid-cols-2 gap-3 mt-0">
              {radiologyTests.map((test) => {
                const isSelected = selectedTests.some(t => t.id === test.id);
                return (
                  <Card
                    key={test.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary",
                      isSelected && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleTestToggle(test)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-primary flex-1 pr-2">{test.name}</h4>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-3 h-3 text-primary-foreground" /> : <Minus className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{test.category}</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(test.price)}</p>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="kids" className="grid grid-cols-2 gap-3 mt-0">
              {radiologyTests.map((test) => {
                const isSelected = selectedTests.some(t => t.id === test.id);
                return (
                  <Card
                    key={test.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary",
                      isSelected && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleTestToggle(test)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-primary flex-1 pr-2">{test.name}</h4>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-3 h-3 text-primary-foreground" /> : <Minus className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{test.category}</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(test.price)}</p>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
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
