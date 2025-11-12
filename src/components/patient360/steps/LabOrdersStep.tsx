import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Patient } from "@/types/patient360";
import { labPackages, labTests } from "@/data/patient360.mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Search, Calendar as CalendarIcon, Check, Minus } from "lucide-react";
import { format } from "date-fns";

interface LabOrdersStepProps {
  patient: Patient;
  onBack: () => void;
}

export function LabOrdersStep({ patient, onBack }: LabOrdersStepProps) {
  const { toast } = useToast();
  const [appointmentType, setAppointmentType] = useState<"Laboratory" | "Radiology">("Laboratory");
  const [labTestType, setLabTestType] = useState<"health-packages" | "individual-tests">("health-packages");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 7, 5));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPackages = labPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.includes.join(", ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTestsList = filteredTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {/* Appointment Type and Lab Tests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Appointment Type
                </label>
                <Tabs value={appointmentType} onValueChange={(v) => setAppointmentType(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Laboratory">Laboratory</TabsTrigger>
                    <TabsTrigger value="Radiology">Radiology</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

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
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lab tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Health Packages / Individual Tests */}
            <Tabs value={labTestType} onValueChange={(v) => setLabTestType(v as any)}>
              <TabsContent value="health-packages" className="space-y-3 mt-0">
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPackages.includes(pkg.code);
                  return (
                    <Card
                      key={pkg.code}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:border-primary",
                        isSelected && "border-primary bg-primary/5"
                      )}
                      onClick={() => togglePackage(pkg.code)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-primary mb-1">{pkg.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            Includes: {pkg.includes.join(", ")}
                          </p>
                          <p className="text-sm font-semibold text-foreground">₹{pkg.price.toLocaleString()}</p>
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

              <TabsContent value="individual-tests" className="grid grid-cols-2 gap-3 mt-0">
                {filteredTestsList.map((test) => {
                  const isSelected = selectedTests.includes(test.code);
                  return (
                    <Card
                      key={test.code}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:border-primary",
                        isSelected && "border-primary bg-primary/5"
                      )}
                      onClick={() => toggleTest(test.code)}
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
                      <p className="text-sm font-semibold text-foreground">₹{test.price}</p>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>

            {/* Date & Time */}
            {(selectedPackages.length > 0 || selectedTests.length > 0) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Laboratory Date & Time</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "dd/MM/yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
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
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
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
          
          <div className="space-y-3 mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Patient</p>
              <p className="text-sm font-medium text-foreground">{patient.name}</p>
              <p className="text-xs text-muted-foreground">
                GDID - {patient.gdid} • {Math.floor(
                  (new Date().getTime() - new Date(patient.dob).getTime()) / 
                  (365.25 * 24 * 60 * 60 * 1000)
                )} | {patient.sex}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{appointmentType}</p>
            </div>
            {selectedTime && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">When</p>
                <p className="text-sm text-foreground">
                  {format(selectedDate, "dd/MM/yyyy")} {selectedTime} | {appointmentType}
                </p>
              </div>
            )}
          </div>

          {(selectedPackageObjects.length > 0 || selectedTestObjects.length > 0) && (
            <div className="space-y-3">
              {selectedPackageObjects.map((pkg, index) => (
                <div key={pkg.code} className="pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-foreground">{pkg.name}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Package</span>
                    <span className="text-sm font-semibold text-foreground">₹{pkg.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {selectedTestObjects.map((test, index) => (
                <div key={test.code} className="pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-foreground">{test.name}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Test</span>
                    <span className="text-sm font-semibold text-foreground">₹{test.price}</span>
                  </div>
                </div>
              ))}

              <div className="pt-3 space-y-2 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-foreground">Global Discount</span>
                  <span className="text-xs text-muted-foreground">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span className="text-foreground">Net Payable</span>
                  <span className="text-foreground">{Math.round(net).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
