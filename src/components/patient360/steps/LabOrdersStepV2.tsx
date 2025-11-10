import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types/patient360";
import { Check, Printer, Share2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LabOrdersStepV2Props {
  patient: Patient;
  onBack: () => void;
}

interface HealthPackage {
  id: string;
  name: string;
  price: number;
  includes: string[];
}

interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
}

const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: "pkg1",
    name: "Full Body Health Check",
    price: 1999,
    includes: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile"],
  },
  {
    id: "pkg2",
    name: "Diabetic Care Panel",
    price: 899,
    includes: ["HbA1c", "Fasting Glucose", "Post Meal Glucose", "Lipid Profile"],
  },
  {
    id: "pkg3",
    name: "Heart Health Package",
    price: 2499,
    includes: ["ECG", "Echo Cardiography", "Lipid Profile", "CRP", "Troponin"],
  },
];

const LAB_TESTS: LabTest[] = [
  { id: "test1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
  { id: "test2", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
  { id: "test3", name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 450 },
  { id: "test4", name: "Thyroid Profile", category: "Endocrinology", price: 600 },
  { id: "test5", name: "HbA1c", category: "Diabetes", price: 350 },
  { id: "test6", name: "Lipid Profile", category: "Biochemistry", price: 500 },
];

const RADIOLOGY_TESTS: LabTest[] = [
  { id: "rad1", name: "X-Ray Chest PA View", category: "Radiology", price: 400 },
  { id: "rad2", name: "Ultrasound Abdomen", category: "Radiology", price: 800 },
  { id: "rad3", name: "ECG", category: "Cardiology", price: 150 },
  { id: "rad4", name: "Echo Cardiography", category: "Cardiology", price: 1200 },
];

const TIME_SLOTS = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];

export function LabOrdersStepV2({ patient, onBack }: LabOrdersStepV2Props) {
  const [appointmentType, setAppointmentType] = useState<"laboratory" | "radiology">("laboratory");
  const [collectionMode, setCollectionMode] = useState<"in-clinic" | "home">("in-clinic");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const patientAge = calculateAge(patient.dob);

  const togglePackage = (pkgId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const calculateTotal = () => {
    const packagesTotal = HEALTH_PACKAGES
      .filter((pkg) => selectedPackages.includes(pkg.id))
      .reduce((sum, pkg) => sum + pkg.price, 0);

    const testsTotal = (appointmentType === "laboratory" ? LAB_TESTS : RADIOLOGY_TESTS)
      .filter((test) => selectedTests.includes(test.id))
      .reduce((sum, test) => sum + test.price, 0);

    const subtotal = packagesTotal + testsTotal;
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const netPayable = subtotal + cgst + sgst;

    return { subtotal, cgst, sgst, netPayable };
  };

  const handleOrderNow = () => {
    if (selectedPackages.length === 0 && selectedTests.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one package or test.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Time not selected",
        description: "Please select a time slot.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order placed",
      description: `${appointmentType === "laboratory" ? "Laboratory" : "Radiology"} order has been placed successfully.`,
    });
  };

  const totals = calculateTotal();

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-6">Lab Orders</h3>

          {/* Appointment Type */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Appointment Type</Label>
            <Tabs value={appointmentType} onValueChange={(v) => setAppointmentType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
                <TabsTrigger value="radiology">Radiology</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Collection Mode */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Mode of Sample Collection</Label>
            <Tabs value={collectionMode} onValueChange={(v) => setCollectionMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="in-clinic">In-Clinic</TabsTrigger>
                <TabsTrigger value="home">Home Collection</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Health Packages */}
          {appointmentType === "laboratory" && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Health Packages</Label>
              <div className="grid gap-3">
                {HEALTH_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackages.includes(pkg.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-foreground">{pkg.name}</h4>
                          {selectedPackages.includes(pkg.id) && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Includes: {pkg.includes.join(", ")}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-foreground">₹{pkg.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Tests */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Individual Tests</Label>
            <div className="grid gap-2">
              {(appointmentType === "laboratory" ? LAB_TESTS : RADIOLOGY_TESTS).map((test) => (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTests.includes(test.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedTests.includes(test.id) && <Check className="w-4 h-4 text-primary" />}
                    <div>
                      <div className="text-sm font-medium text-foreground">{test.name}</div>
                      <div className="text-xs text-muted-foreground">{test.category}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">₹{test.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Select Date & Time</Label>
            <div className="flex items-center gap-2 mb-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print Requisition
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={handleOrderNow} className="ml-auto">
              Order Now
            </Button>
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <div>
        <Card className="p-6 sticky top-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Appointment Summary</h3>

          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm font-medium text-foreground">{patient.name}</div>
              <div className="text-xs text-muted-foreground">
                GDID-{patient.gdid} • {patientAge}y | {patient.sex}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Mode</div>
              <Badge variant="secondary" className="text-xs">
                {collectionMode === "in-clinic" ? "In-Clinic" : "Home Collection"}
              </Badge>
            </div>

            {(selectedPackages.length > 0 || selectedTests.length > 0) && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Selected Items</div>
                <div className="space-y-1">
                  {HEALTH_PACKAGES.filter((pkg) => selectedPackages.includes(pkg.id)).map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{pkg.name}</span>
                      <span className="text-muted-foreground">₹{pkg.price}</span>
                    </div>
                  ))}
                  {(appointmentType === "laboratory" ? LAB_TESTS : RADIOLOGY_TESTS)
                    .filter((test) => selectedTests.includes(test.id))
                    .map((test) => (
                      <div key={test.id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground">{test.name}</span>
                        <span className="text-muted-foreground">₹{test.price}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CGST (9%)</span>
              <span className="text-foreground">₹{totals.cgst.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">SGST (9%)</span>
              <span className="text-foreground">₹{totals.sgst.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t">
              <span className="text-foreground">Net Payable</span>
              <span className="text-primary">₹{totals.netPayable.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
