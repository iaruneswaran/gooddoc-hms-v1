import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3;

export default function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [advancedOpen1, setAdvancedOpen1] = useState(false);
  const [advancedOpen2, setAdvancedOpen2] = useState(false);

  // Form state - Step 1
  const [displayName, setDisplayName] = useState("");
  const [department, setDepartment] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degrees, setDegrees] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState("");
  const [acceptingPatients, setAcceptingPatients] = useState(true);

  // Form state - Step 2
  const [duration, setDuration] = useState("20");
  const [scheduleType, setScheduleType] = useState("preset-a");
  const [clinic, setClinic] = useState("");
  const [telemedicine, setTelemedicine] = useState(false);

  // Form state - Step 3
  const [fee, setFee] = useState("");
  const [telemedicineFee, setTelemedicineFee] = useState("");
  const [sameFee, setSameFee] = useState(true);
  const [licenseNo, setLicenseNo] = useState("");

  // Handle step parameter from URL
  useEffect(() => {
    const step = searchParams.get("step");
    if (step === "availability") {
      setCurrentStep(2);
    }
  }, [searchParams]);

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!displayName || !department || !specialty || !email || !phone) {
        toast({ title: "Please fill all required fields", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2) {
      if (scheduleType !== "by-appointment" && !clinic && !telemedicine) {
        toast({ title: "Please select at least one location", variant: "destructive" });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3) as Step);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSaveDraft = () => {
    // Validation
    if (!displayName || !department || !specialty || !email || !phone || !fee) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Doctor saved as draft." });
    navigate("/doctors");
  };

  const handleSaveAndActivate = () => {
    // Validation
    if (!displayName || !department || !specialty || !email || !phone || !fee) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (!licenseNo) {
      toast({ title: "License is required to activate", variant: "destructive" });
      return;
    }
    toast({ title: "Doctor activated." });
    navigate("/doctors");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <PageContent>
        <AppHeader breadcrumbs={["Doctors", id ? "Edit Doctor" : "Add New Doctor"]} />
        
        <main className="p-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Doctors
          </button>

          {/* Stepper */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm font-medium">
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Availability"}
                  {step === 3 && "Fees"}
                </span>
                {step < 3 && (
                  <div className="w-12 h-[2px] bg-muted mx-2" />
                )}
              </div>
            ))}
          </div>

          <Card className="p-6">
            {/* Step 1 - Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      placeholder="e.g., Dr. Meera Nair"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Display name appears to patients.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="endocrinology">Endocrinology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interventional">Interventional Cardiology</SelectItem>
                          <SelectItem value="diabetes">Diabetes & Metabolism</SelectItem>
                          <SelectItem value="joint">Joint Replacement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <Collapsible open={advancedOpen1} onOpenChange={setAdvancedOpen1}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        Advanced Options
                        <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen1 ? "rotate-180" : ""}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="degrees">Degrees</Label>
                        <Input
                          id="degrees"
                          placeholder="e.g., MBBS, MD"
                          value={degrees}
                          onChange={(e) => setDegrees(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="e.g., 15"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="languages">Languages</Label>
                        <Input
                          id="languages"
                          placeholder="e.g., English, Hindi, Tamil"
                          value={languages}
                          onChange={(e) => setLanguages(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="acceptingPatients">Accepting new patients</Label>
                        <Switch
                          id="acceptingPatients"
                          checked={acceptingPatients}
                          onCheckedChange={setAcceptingPatients}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            )}

            {/* Step 2 - Availability */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Availability & Location</h2>
                
                <div>
                  <Label>Appointment Duration *</Label>
                  <RadioGroup value={duration} onValueChange={setDuration} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15" id="15min" />
                      <Label htmlFor="15min" className="font-normal cursor-pointer">15 min</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="20" id="20min" />
                      <Label htmlFor="20min" className="font-normal cursor-pointer">20 min</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="30min" />
                      <Label htmlFor="30min" className="font-normal cursor-pointer">30 min</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Schedule *</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Presets create slots automatically; choose Custom for full control.
                  </p>
                  <RadioGroup value={scheduleType} onValueChange={setScheduleType} className="space-y-3">
                    <Card className="p-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="preset-a" id="preset-a" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="preset-a" className="font-normal cursor-pointer">
                            <div className="font-medium">Preset A</div>
                            <div className="text-sm text-muted-foreground">
                              Weekdays 10:00–13:00, 16:00–19:00
                            </div>
                          </Label>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="preset-b" id="preset-b" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="preset-b" className="font-normal cursor-pointer">
                            <div className="font-medium">Preset B</div>
                            <div className="text-sm text-muted-foreground">
                              Tue/Thu/Sat 11:00–16:00
                            </div>
                          </Label>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="by-appointment" id="by-appointment" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="by-appointment" className="font-normal cursor-pointer">
                            <div className="font-medium">By appointment only</div>
                            <div className="text-sm text-muted-foreground">
                              No slots, manual scheduling
                            </div>
                          </Label>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="custom" id="custom" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="custom" className="font-normal cursor-pointer">
                            <div className="font-medium">Custom</div>
                            <div className="text-sm text-muted-foreground">
                              Pick your own days and hours
                            </div>
                          </Label>
                        </div>
                      </div>
                    </Card>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Location *</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="clinic" className="text-sm font-normal">Clinic</Label>
                      <Select value={clinic} onValueChange={setClinic}>
                        <SelectTrigger id="clinic" className="mt-1">
                          <SelectValue placeholder="Select clinic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Campus</SelectItem>
                          <SelectItem value="branch-a">Branch A</SelectItem>
                          <SelectItem value="branch-b">Branch B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="telemedicine"
                        checked={telemedicine}
                        onCheckedChange={(checked) => setTelemedicine(checked as boolean)}
                      />
                      <Label htmlFor="telemedicine" className="font-normal cursor-pointer">
                        Telemedicine
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <Collapsible open={advancedOpen2} onOpenChange={setAdvancedOpen2}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      Advanced Options
                      <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen2 ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="buffer">Buffer before/after (minutes)</Label>
                      <Input
                        id="buffer"
                        type="number"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPatients">Max patients per slot</Label>
                      <Input
                        id="maxPatients"
                        type="number"
                        placeholder="1"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* Step 3 - Fees */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Fees & Publish</h2>
                
                <div>
                  <Label htmlFor="fee">Fee (in-person) *</Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="1,500"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="sameFee"
                      checked={sameFee}
                      onCheckedChange={(checked) => setSameFee(checked as boolean)}
                    />
                    <Label htmlFor="sameFee" className="font-normal cursor-pointer">
                      Telemedicine fee same as in-person
                    </Label>
                  </div>
                  {!sameFee && (
                    <div>
                      <Label htmlFor="telemedicineFee">Telemedicine Fee</Label>
                      <Input
                        id="telemedicineFee"
                        type="number"
                        placeholder="1,200"
                        value={telemedicineFee}
                        onChange={(e) => setTelemedicineFee(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="licenseNo">License/Registration No.</Label>
                  <Input
                    id="licenseNo"
                    placeholder="MCI-XXXXXXX"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    License is required to activate.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button onClick={handleNext} className="ml-auto">
                  Next
                </Button>
              ) : (
                <div className="flex gap-3 ml-auto">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleSaveAndActivate}>
                    Save & Activate
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </main>
      </PageContent>
    </div>
  );
}
