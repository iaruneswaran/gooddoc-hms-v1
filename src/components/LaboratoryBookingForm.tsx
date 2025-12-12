import { useState } from "react";
import { Trash2, Calendar as CalendarIcon, Check, Minus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface RadiologyTest {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface HealthPackage {
  id: string;
  name: string;
  includes: string;
  price: number;
}

export interface LaboratoryData {
  mode: "laboratory" | "radiology";
  selectedTests: LabTest[];
  selectedPackages: HealthPackage[];
  selectedRadiologyTests?: RadiologyTest[];
  laboratoryDate: Date;
  laboratoryTime: string;
  radiologyDate: Date;
  radiologyTime: string;
}

interface LaboratoryBookingFormProps {
  onRemove?: () => void;
  onUpdate: (data: LaboratoryData) => void;
  initialData?: LaboratoryData;
  hideMode?: boolean;
}

const healthPackages: HealthPackage[] = [
  {
    id: "1",
    name: "Full Body Health Check",
    includes: "Complete Blood Count, Lipid Profile, Liver Function Test, Kidney Function Test, Thyroid Profile",
    price: 1999,
  },
  {
    id: "2",
    name: "Diabetic Care Panel",
    includes: "HbA1c, Fasting Glucose, Post Meal Glucose, Lipid Profile",
    price: 899,
  },
  {
    id: "3",
    name: "Heart Health Package",
    includes: "ECG, Echo Cardiography, Lipid Profile, CRP, Troponin",
    price: 2799,
  },
  {
    id: "4",
    name: "Full Body Health Check",
    includes: "Complete Blood Count, Lipid Profile, Liver Function Test, Kidney Function Test, Thyroid Profile",
    price: 1999,
  },
];

const individualTests: LabTest[] = [
  { id: "1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
  { id: "2", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
  { id: "3", name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 350 },
  { id: "4", name: "Lipid Profile", category: "Biochemistry", price: 300 },
  { id: "5", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
  { id: "6", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
  { id: "7", name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 350 },
  { id: "8", name: "Lipid Profile", category: "Biochemistry", price: 300 },
];

const radiologyTests: RadiologyTest[] = [
  { id: "r1", name: "Chest (PA View)", category: "Radiology", price: 500 },
  { id: "r2", name: "Cervical Spine", category: "Radiology", price: 600 },
  { id: "r3", name: "Lumbar Spine", category: "Radiology", price: 700 },
  { id: "r4", name: "Abdomen (KUB)", category: "Radiology", price: 300 },
  { id: "r5", name: "Hand / Wrist", category: "Radiology", price: 400 },
  { id: "r6", name: "Knee Joint (Both)", category: "Radiology", price: 500 },
  { id: "r7", name: "Chest (Lateral View)", category: "Radiology", price: 500 },
  { id: "r8", name: "Pelvis", category: "Radiology", price: 600 },
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

export const LaboratoryBookingForm = ({ onRemove, onUpdate, initialData, hideMode = false }: LaboratoryBookingFormProps) => {
  const [mode, setMode] = useState<"laboratory" | "radiology">(initialData?.mode || "laboratory");
  const [labTestType, setLabTestType] = useState<"health-packages" | "individual-tests">("health-packages");
  const [selectedTests, setSelectedTests] = useState<LabTest[]>(initialData?.selectedTests || [
    { id: "1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
    { id: "2", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
  ]);
  const [selectedPackages, setSelectedPackages] = useState<HealthPackage[]>(initialData?.selectedPackages || []);
  const [selectedRadiologyTests, setSelectedRadiologyTests] = useState<RadiologyTest[]>(initialData?.selectedRadiologyTests || []);
  const [laboratoryDate, setLaboratoryDate] = useState<Date>(initialData?.laboratoryDate || new Date(2025, 7, 5));
  const [laboratoryTime, setLaboratoryTime] = useState(initialData?.laboratoryTime || "07:30");
  const [radiologyDate, setRadiologyDate] = useState<Date>(initialData?.radiologyDate || new Date(2025, 7, 5));
  const [radiologyTime, setRadiologyTime] = useState(initialData?.radiologyTime || "07:30");
  const [searchQuery, setSearchQuery] = useState("");

  const handleModeChange = (newMode: "laboratory" | "radiology") => {
    setMode(newMode);
    onUpdate({ mode: newMode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime });
  };

  const handleTestToggle = (test: LabTest) => {
    const isSelected = selectedTests.some(t => t.id === test.id);
    const newTests = isSelected
      ? selectedTests.filter(t => t.id !== test.id)
      : [...selectedTests, test];
    setSelectedTests(newTests);
    onUpdate({ mode, selectedTests: newTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime });
  };

  const handleRadiologyTestToggle = (test: RadiologyTest) => {
    const isSelected = selectedRadiologyTests.some(t => t.id === test.id);
    const newTests = isSelected
      ? selectedRadiologyTests.filter(t => t.id !== test.id)
      : [...selectedRadiologyTests, test];
    setSelectedRadiologyTests(newTests);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests: newTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime });
  };

  const handlePackageToggle = (pkg: HealthPackage) => {
    const isSelected = selectedPackages.some(p => p.id === pkg.id);
    const newPackages = isSelected
      ? selectedPackages.filter(p => p.id !== pkg.id)
      : [...selectedPackages, pkg];
    setSelectedPackages(newPackages);
    onUpdate({ mode, selectedTests, selectedPackages: newPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime });
  };

  const handleLaboratoryTimeSelect = (time: string) => {
    setLaboratoryTime(time);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime: time, radiologyDate, radiologyTime });
  };

  const handleLaboratoryDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setLaboratoryDate(newDate);
      onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate: newDate, laboratoryTime, radiologyDate, radiologyTime });
    }
  };

  const handleRadiologyTimeSelect = (time: string) => {
    setRadiologyTime(time);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime: time });
  };

  const handleRadiologyDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setRadiologyDate(newDate);
      onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate: newDate, radiologyTime });
    }
  };

  const filteredPackages = healthPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.includes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTests = individualTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRadiologyTests = radiologyTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Diagnostics</h3>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-primary"
          >
            Remove
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Diagnostics Type and Lab Tests */}
        {!hideMode ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Diagnostics Type
              </label>
              <Tabs value={mode} onValueChange={(v) => handleModeChange(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
                  <TabsTrigger value="radiology">Radiology</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {mode === "laboratory" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Lab Tests
                </label>
                <Tabs value={labTestType} onValueChange={(v) => setLabTestType(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="health-packages">Health Packages</TabsTrigger>
                    <TabsTrigger value="individual-tests">Individual Tests</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
        ) : mode === "laboratory" ? (
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Lab Tests
            </label>
            <Tabs value={labTestType} onValueChange={(v) => setLabTestType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="health-packages">Health Packages</TabsTrigger>
                <TabsTrigger value="individual-tests">Individual Tests</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        ) : null}

        {/* Lab Tests Content */}
        {mode === "laboratory" && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lab tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs value={labTestType} onValueChange={(v) => setLabTestType(v as any)}>
              <TabsContent value="health-packages" className="space-y-3 mt-0">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackages.some(p => p.id === pkg.id);
                return (
                  <Card
                    key={pkg.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary",
                      isSelected && "border-primary bg-primary/5"
                    )}
                    onClick={() => handlePackageToggle(pkg)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-primary">{pkg.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Includes: {pkg.includes}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(pkg.price)}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-3 h-3 text-primary-foreground" /> : <Minus className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="individual-tests" className="grid grid-cols-2 gap-3">
              {filteredTests.map((test) => {
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
                      <h4 className="text-sm font-semibold text-foreground flex-1 pr-2">{test.name}</h4>
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
        )}

        {/* Radiology Tests Content */}
        {mode === "radiology" && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search radiology tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="space-y-3">
              {filteredRadiologyTests.map((test) => {
                const isSelected = selectedRadiologyTests.some(t => t.id === test.id);
                return (
                  <Card
                    key={test.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary",
                      isSelected && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleRadiologyTestToggle(test)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-primary">{test.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {test.category}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(test.price)}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-3 h-3 text-primary-foreground" /> : <Minus className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Date & Time for Laboratory */}
        {mode === "laboratory" && (selectedTests.length > 0 || selectedPackages.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Laboratory Date & Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(laboratoryDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={laboratoryDate} onSelect={handleLaboratoryDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-10 gap-2 p-4 border rounded-md">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={laboratoryTime === time ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => handleLaboratoryTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time for Radiology */}
        {mode === "radiology" && selectedRadiologyTests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Radiology Date & Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(radiologyDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={radiologyDate} onSelect={handleRadiologyDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-10 gap-2 p-4 border rounded-md">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={radiologyTime === time ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => handleRadiologyTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
