import { useState, useEffect } from "react";
import { Search, FlaskConical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { DiagnosticsSlotPicker } from "@/components/booking/DiagnosticsSlotPicker";
import { LAB_MASTER_CATALOG, HEALTH_PACKAGES } from "@/data/lab-master-catalog";
import type { HealthPackage as CatalogHealthPackage } from "@/types/lab-catalog";

export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  department?: string;
}

export interface RadiologyTest {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
}

export interface HealthPackage {
  id: string;
  code: string;
  name: string;
  includes: string;
  includedCodes: string[];
  price: number;
  discountedPrice?: number;
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

// Convert catalog health packages to the booking form format
const healthPackages: HealthPackage[] = HEALTH_PACKAGES.map((pkg: CatalogHealthPackage) => ({
  id: pkg.code,
  code: pkg.code,
  name: pkg.name,
  includes: pkg.description,
  includedCodes: pkg.includedCodes,
  price: pkg.mrp,
  discountedPrice: pkg.discountPct ? Math.round(pkg.mrp * (1 - pkg.discountPct / 100)) : undefined,
}));

// Convert catalog tests to the booking form format (orderable tests only)
const individualTests: LabTest[] = LAB_MASTER_CATALOG
  .filter((test) => test.orderable && (test.type === "single_test" || test.type === "panel"))
  .map((test) => ({
    id: test.code,
    code: test.code,
    name: test.name,
    category: test.department,
    department: test.department,
    price: test.mrp,
  }));

// Radiology tests from hospital services catalog - X-Ray, Ultrasound, CT, MRI, Doppler
const radiologyTests: RadiologyTest[] = [
  // X-Ray
  { id: "XR001", code: "XR001", name: "Chest X-Ray – PA View", category: "X-Ray", price: 300 },
  { id: "XR002", code: "XR002", name: "Chest X-Ray – Lateral View", category: "X-Ray", price: 300 },
  { id: "XR030", code: "XR030", name: "Cervical Spine – AP + Lateral", category: "X-Ray", price: 500 },
  { id: "XR033", code: "XR033", name: "Lumbosacral Spine – AP + Lateral", category: "X-Ray", price: 500 },
  { id: "XR013", code: "XR013", name: "KUB (Kidney–Ureter–Bladder)", category: "X-Ray", price: 400 },
  { id: "XR040", code: "XR040", name: "Pelvis – AP", category: "X-Ray", price: 400 },
  { id: "XR052", code: "XR052", name: "Both Knees – Weight-bearing AP", category: "X-Ray", price: 600 },
  { id: "XR086", code: "XR086", name: "Shoulder – AP + Axillary", category: "X-Ray", price: 500 },
  // Ultrasound
  { id: "US006", code: "US006", name: "USG Abdomen + Pelvis", category: "Ultrasound", price: 1200 },
  { id: "US002", code: "US002", name: "USG Whole Abdomen", category: "Ultrasound", price: 1000 },
  { id: "US020", code: "US020", name: "USG Thyroid", category: "Ultrasound", price: 800 },
  { id: "US003", code: "US003", name: "USG KUB", category: "Ultrasound", price: 700 },
  // Cardiac
  { id: "CAR003", code: "CAR003", name: "2D Echo with Doppler", category: "Cardiac Imaging", price: 2500 },
  { id: "CAR001", code: "CAR001", name: "ECG 12-lead", category: "Cardiac Imaging", price: 300 },
  { id: "CAR002", code: "CAR002", name: "TMT (Stress Test)", category: "Cardiac Imaging", price: 1500 },
  // Doppler
  { id: "DOP001", code: "DOP001", name: "Carotid & Vertebral Doppler", category: "Doppler", price: 2500 },
  { id: "DOP003", code: "DOP003", name: "Lower Limb Venous Doppler – Bilateral", category: "Doppler", price: 2500 },
];


export const LaboratoryBookingForm = ({ onRemove, onUpdate, initialData, hideMode = false }: LaboratoryBookingFormProps) => {
  const [mode, setMode] = useState<"laboratory" | "radiology">(initialData?.mode || "laboratory");
  const [labTestType, setLabTestType] = useState<"health-packages" | "individual-tests">(
    initialData?.selectedTests && initialData.selectedTests.length > 0 ? "individual-tests" : "health-packages"
  );
  const [selectedTests, setSelectedTests] = useState<LabTest[]>(initialData?.selectedTests || []);
  const [selectedPackages, setSelectedPackages] = useState<HealthPackage[]>(initialData?.selectedPackages || []);
  const [selectedRadiologyTests, setSelectedRadiologyTests] = useState<RadiologyTest[]>(initialData?.selectedRadiologyTests || []);
  const [laboratoryDate, setLaboratoryDate] = useState<Date>(initialData?.laboratoryDate || new Date());
  const [laboratoryTime, setLaboratoryTime] = useState<string | null>(initialData?.laboratoryTime || null);
  const [radiologyDate, setRadiologyDate] = useState<Date>(initialData?.radiologyDate || new Date());
  const [radiologyTime, setRadiologyTime] = useState(initialData?.radiologyTime || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync state with initialData when it changes (for pre-filling from request data)
  useEffect(() => {
    if (initialData && !isInitialized) {
      if (initialData.mode) setMode(initialData.mode);
      if (initialData.selectedTests && initialData.selectedTests.length > 0) {
        setSelectedTests(initialData.selectedTests);
        setLabTestType("individual-tests");
      }
      if (initialData.selectedPackages) setSelectedPackages(initialData.selectedPackages);
      if (initialData.selectedRadiologyTests) setSelectedRadiologyTests(initialData.selectedRadiologyTests);
      if (initialData.laboratoryDate) setLaboratoryDate(initialData.laboratoryDate);
      if (initialData.laboratoryTime) setLaboratoryTime(initialData.laboratoryTime);
      if (initialData.radiologyDate) setRadiologyDate(initialData.radiologyDate);
      if (initialData.radiologyTime) setRadiologyTime(initialData.radiologyTime);
      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

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

  const handleLaboratoryDateSelect = (newDate: Date) => {
    setLaboratoryDate(newDate);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate: newDate, laboratoryTime, radiologyDate, radiologyTime });
  };

  const handleRadiologyTimeSelect = (time: string) => {
    setRadiologyTime(time);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate, radiologyTime: time });
  };

  const handleRadiologyDateSelect = (newDate: Date) => {
    setRadiologyDate(newDate);
    onUpdate({ mode, selectedTests, selectedPackages, selectedRadiologyTests, laboratoryDate, laboratoryTime, radiologyDate: newDate, radiologyTime });
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
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-700 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{hideMode ? "Laboratory" : "Diagnostics"}</h3>
            <p className="text-xs text-white/70">Lab Tests & Radiology</p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="p-5 space-y-5">
        {/* Diagnostics Type Toggle - Only show when not hideMode */}
        {!hideMode && (
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
        )}

        {/* Lab Tests Content */}
        {mode === "laboratory" && (
          <div>
            {/* Search and Inline Tabs */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lab tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setLabTestType("health-packages")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-normal rounded-md transition-colors",
                    labTestType === "health-packages" 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Health Packages
                </button>
                <button
                  onClick={() => setLabTestType("individual-tests")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-normal rounded-md transition-colors",
                    labTestType === "individual-tests" 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Individual Tests
                </button>
              </div>
            </div>
            
            <Tabs value={labTestType} onValueChange={(v) => setLabTestType(v as any)}>
              <TabsContent value="health-packages" className="space-y-3 mt-0 max-h-[340px] overflow-y-auto pr-1">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pkg.code}</span>
                      <h4 className="text-sm font-semibold text-primary flex-1">{pkg.name}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {pkg.discountedPrice ? (
                          <>
                            <p className="text-sm font-semibold text-foreground">{formatCurrency(pkg.discountedPrice)}</p>
                            <p className="text-xs text-muted-foreground line-through">{formatCurrency(pkg.price)}</p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(pkg.price)}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.includes}</p>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="individual-tests" className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">{test.code}</span>
                      <h4 className="text-sm font-semibold text-primary flex-1">{test.name}</h4>
                      <p className="text-sm font-semibold text-foreground shrink-0">{formatCurrency(test.price)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{test.category}</p>
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
            
            <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">{test.code}</span>
                      <h4 className="text-sm font-semibold text-primary flex-1">{test.name}</h4>
                      <p className="text-sm font-semibold text-foreground shrink-0">{formatCurrency(test.price)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{test.category}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Date & Time for Laboratory */}
        {mode === "laboratory" && (selectedTests.length > 0 || selectedPackages.length > 0) && (
          <DiagnosticsSlotPicker
            selectedDate={laboratoryDate}
            selectedTime={laboratoryTime}
            onDateSelect={handleLaboratoryDateSelect}
            onTimeSelect={handleLaboratoryTimeSelect}
            label="Laboratory Date & Time"
            locationName="Main Lab"
          />
        )}

        {/* Date & Time for Radiology */}
        {mode === "radiology" && selectedRadiologyTests.length > 0 && (
          <DiagnosticsSlotPicker
            selectedDate={radiologyDate}
            selectedTime={radiologyTime}
            onDateSelect={handleRadiologyDateSelect}
            onTimeSelect={handleRadiologyTimeSelect}
            label="Radiology Date & Time"
            locationName="Radiology Center"
          />
        )}
      </div>
    </Card>
  );
};
