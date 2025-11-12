import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Patient } from "@/types/patient360";
import { labPackages, labTests } from "@/data/patient360.mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LabOrdersStepProps {
  patient: Patient;
  onBack: () => void;
}

export function LabOrdersStep({ patient, onBack }: LabOrdersStepProps) {
  const { toast } = useToast();
  const [appointmentType, setAppointmentType] = useState<"Laboratory" | "Radiology">("Laboratory");
  const [collectionMode, setCollectionMode] = useState<"In-Clinic" | "Home Collection">("In-Clinic");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedDate] = useState("2025-08-05");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const filteredTests = labTests.filter((test) => test.type === appointmentType);

  const togglePackage = (code: string) => {
    setSelectedPackages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleTest = (code: string) => {
    setSelectedTests((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const selectedPackageObjects = labPackages.filter((pkg) =>
    selectedPackages.includes(pkg.code)
  );
  const selectedTestObjects = filteredTests.filter((test) =>
    selectedTests.includes(test.code)
  );

  const subtotal =
    selectedPackageObjects.reduce((sum, pkg) => sum + pkg.price, 0) +
    selectedTestObjects.reduce((sum, test) => sum + test.price, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const net = subtotal + cgst + sgst;

  const timeSlots = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const handleOrderNow = () => {
    if (!selectedTime) {
      toast({
        title: "Select Time Slot",
        description: "Please select a time slot for the appointment",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Order Placed",
      description: "Lab order has been successfully placed"
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Appointment Type</Label>
              <Tabs value={appointmentType} onValueChange={(v) => setAppointmentType(v as any)}>
                <TabsList>
                  <TabsTrigger value="Laboratory">Laboratory</TabsTrigger>
                  <TabsTrigger value="Radiology">Radiology</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Mode of Sample Collection</Label>
              <RadioGroup value={collectionMode} onValueChange={(v) => setCollectionMode(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="In-Clinic" id="in-clinic" />
                  <Label htmlFor="in-clinic" className="cursor-pointer">In-Clinic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Home Collection" id="home" />
                  <Label htmlFor="home" className="cursor-pointer">Home Collection</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Health Packages</Label>
              <div className="space-y-2">
                {labPackages.map((pkg) => (
                  <div
                    key={pkg.code}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedPackages.includes(pkg.code)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => togglePackage(pkg.code)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedPackages.includes(pkg.code)} />
                        <div>
                          <h4 className="font-medium text-foreground">{pkg.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Includes: {pkg.includes.join(", ")}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        ₹{pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Individual Tests</Label>
              <div className="grid grid-cols-2 gap-3">
                {filteredTests.map((test) => (
                  <div
                    key={test.code}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      selectedTests.includes(test.code)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleTest(test.code)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Checkbox checked={selectedTests.includes(test.code)} />
                        <span className="text-sm text-foreground">{test.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                        ₹{test.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Date & Time</Label>
              <div className="mb-3">
                <Input
                  type="date"
                  value={selectedDate}
                  className="w-auto"
                />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "px-3 py-2 text-xs rounded border transition-colors",
                      selectedTime === slot
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Print Requisition</Button>
              <Button variant="outline">Share to patient</Button>
              <Button onClick={handleOrderNow}>Order Now</Button>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 sticky top-24">
          <h3 className="text-sm font-semibold text-foreground mb-4">Appointment Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {patient.name} — GDID-{patient.gdid} • {Math.floor(
                  (new Date().getTime() - new Date(patient.dob).getTime()) / 
                  (365.25 * 24 * 60 * 60 * 1000)
                )}y | {patient.sex}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mode</p>
              <p className="text-sm text-foreground">{collectionMode}</p>
            </div>
          </div>

          {(selectedPackageObjects.length > 0 || selectedTestObjects.length > 0) && (
            <>
              <div className="border-t border-border pt-4 mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">Selected</p>
                <div className="space-y-2">
                  {selectedPackageObjects.map((pkg) => (
                    <div key={pkg.code} className="flex justify-between text-sm">
                      <span className="text-foreground">{pkg.name}</span>
                      <span className="text-foreground">₹{pkg.price.toLocaleString()}</span>
                    </div>
                  ))}
                  {selectedTestObjects.map((test) => (
                    <div key={test.code} className="flex justify-between text-sm">
                      <span className="text-foreground">{test.name}</span>
                      <span className="text-foreground">₹{test.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CGST (9%)</span>
                  <span className="text-foreground">₹{Math.round(cgst).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SGST (9%)</span>
                  <span className="text-foreground">₹{Math.round(sgst).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span className="text-foreground">Net Payable</span>
                  <span className="text-foreground">₹{Math.round(net).toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
