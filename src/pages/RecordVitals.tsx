import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function RecordVitals() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const visitId = searchParams.get("visitId");

  // Mock patient data
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    if (patientId) {
      // Mock fetch patient
      setSelectedPatient({
        id: patientId,
        name: "Harish Kalyan",
        gdid: "001",
        age: 35,
        gender: "M",
        visitId: visitId || "VST-205431",
        ward: "Cardiology Ward 3B",
        room: "312",
        bed: "12",
      });
    }
  }, [patientId, visitId]);

  // Form state - Body Measurements
  const [heightValue, setHeightValue] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [bmi, setBmi] = useState<number | null>(null);

  // Form state - Vital Signs
  const [temperature, setTemperature] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F">("C");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [map, setMap] = useState<number | null>(null);
  const [glucose, setGlucose] = useState("");
  const [painScore, setPainScore] = useState([0]);

  // Form state - Context
  const [position, setPosition] = useState("");
  const [device, setDevice] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [oxygenTherapy, setOxygenTherapy] = useState(false);
  const [oxygenDevice, setOxygenDevice] = useState("");
  const [oxygenFlow, setOxygenFlow] = useState("");
  const [fio2, setFio2] = useState("");
  const [consciousness, setConsciousness] = useState("");

  // Form state - Notes
  const [notes, setNotes] = useState("");

  // Auto-calculate BMI
  useEffect(() => {
    if (heightValue && weightValue) {
      let heightInM = parseFloat(heightValue);
      let weightInKg = parseFloat(weightValue);

      if (heightUnit === "in") {
        heightInM = heightInM * 0.0254;
      } else {
        heightInM = heightInM / 100;
      }

      if (weightUnit === "lb") {
        weightInKg = weightInKg * 0.453592;
      }

      if (heightInM > 0 && weightInKg > 0) {
        const calculatedBmi = weightInKg / (heightInM * heightInM);
        setBmi(parseFloat(calculatedBmi.toFixed(1)));
      }
    } else {
      setBmi(null);
    }
  }, [heightValue, heightUnit, weightValue, weightUnit]);

  // Auto-calculate MAP
  useEffect(() => {
    if (systolic && diastolic) {
      const sys = parseFloat(systolic);
      const dia = parseFloat(diastolic);
      if (sys > 0 && dia > 0) {
        const calculatedMap = (sys + 2 * dia) / 3;
        setMap(parseFloat(calculatedMap.toFixed(1)));
      }
    } else {
      setMap(null);
    }
  }, [systolic, diastolic]);

  const handleSaveAndSubmit = () => {
    // Validation
    if (!selectedPatient) {
      toast({
        title: "Patient Required",
        description: "Please select a patient before recording vitals.",
        variant: "destructive",
      });
      return;
    }

    if (!heightValue || !weightValue) {
      toast({
        title: "Missing Required Fields",
        description: "Height and Weight are required.",
        variant: "destructive",
      });
      return;
    }

    // Show warnings for missing vital signs
    if (!systolic || !heartRate || !temperature || !spo2) {
      toast({
        title: "Incomplete Vitals",
        description: "Some vital signs are missing. Consider adding BP, HR, Temp, and SpO₂.",
      });
    }

    // Mock save
    toast({
      title: "Vitals Recorded",
      description: `Vitals have been recorded for ${selectedPatient.name}.`,
    });

    // Navigate to Patient Insight
    navigate(`/patient-insights/${selectedPatient.id}`);
  };

  const handleCancel = () => {
    navigate("/patients");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Patients", "Record Vitals"]} />

        <main className="p-6 max-w-7xl">
          <h1 className="text-lg font-semibold text-foreground mb-6">Record Vitals</h1>

          {/* Patient Context Bar */}
          <Card className="p-4 mb-6">
            {selectedPatient ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {selectedPatient.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      GDID-{selectedPatient.gdid} • {selectedPatient.age} | {selectedPatient.gender}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active Visit: {selectedPatient.visitId}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {selectedPatient.ward} • Room {selectedPatient.room} • Bed{" "}
                    {selectedPatient.bed}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`/patient-insights/${selectedPatient.id}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Patient Insight
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a patient to record vitals
              </div>
            )}
          </Card>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body Measurements */}
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Body Measurements</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Height <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Enter height"
                      value={heightValue}
                      onChange={(e) => setHeightValue(e.target.value)}
                      className="flex-1"
                    />
                    <Tabs value={heightUnit} onValueChange={(v) => setHeightUnit(v as any)}>
                      <TabsList>
                        <TabsTrigger value="cm">cm</TabsTrigger>
                        <TabsTrigger value="in">in</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Range: 30–250 cm</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Weight <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Enter weight"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                      className="flex-1"
                    />
                    <Tabs value={weightUnit} onValueChange={(v) => setWeightUnit(v as any)}>
                      <TabsList>
                        <TabsTrigger value="kg">kg</TabsTrigger>
                        <TabsTrigger value="lb">lb</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Range: 1–350 kg</p>
                </div>

                {bmi !== null && (
                  <div>
                    <Label className="text-sm font-medium text-foreground">BMI</Label>
                    <Badge variant="secondary" className="mt-2">
                      {bmi}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Vital Signs */}
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Vital Signs</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Temperature</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Enter temperature"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="flex-1"
                    />
                    <Tabs value={temperatureUnit} onValueChange={(v) => setTemperatureUnit(v as any)}>
                      <TabsList>
                        <TabsTrigger value="C">°C</TabsTrigger>
                        <TabsTrigger value="F">°F</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Heart Rate (bpm)</Label>
                    <Input
                      type="number"
                      placeholder="HR"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Respiratory Rate (breaths/min)
                    </Label>
                    <Input
                      type="number"
                      placeholder="RR"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">SpO₂ (%)</Label>
                  <Input
                    type="number"
                    placeholder="Enter SpO₂"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Blood Pressure (mmHg)
                  </Label>
                  <div className="flex gap-2 mt-2 items-center">
                    <Input
                      type="number"
                      placeholder="Systolic"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                    />
                    <span className="text-muted-foreground">/</span>
                    <Input
                      type="number"
                      placeholder="Diastolic"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                    />
                  </div>
                  {map !== null && (
                    <Badge variant="secondary" className="mt-2">
                      MAP: {map}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Blood Glucose (mg/dL)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Pain Score (0–10): {painScore[0]}
                  </Label>
                  <div className="flex gap-4 items-center mt-2">
                    <Slider
                      value={painScore}
                      onValueChange={setPainScore}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={painScore[0]}
                      onChange={(e) => setPainScore([parseInt(e.target.value) || 0])}
                      className="w-16"
                      min={0}
                      max={10}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Level of Consciousness
                  </Label>
                  <Select value={consciousness} onValueChange={setConsciousness}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select consciousness level" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="alert">Alert (A)</SelectItem>
                      <SelectItem value="verbal">Verbal (V)</SelectItem>
                      <SelectItem value="pain">Pain (P)</SelectItem>
                      <SelectItem value="unresponsive">Unresponsive (U)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Measurement Context */}
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Measurement Context
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="sitting">Sitting</SelectItem>
                      <SelectItem value="lying">Lying</SelectItem>
                      <SelectItem value="standing">Standing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">Device</Label>
                  <Select value={device} onValueChange={setDevice}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="automated">Automated BP Monitor</SelectItem>
                      <SelectItem value="manual">Manual Sphygmomanometer</SelectItem>
                      <SelectItem value="pulse-ox">Pulse Oximeter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">Device ID (Optional)</Label>
                  <Input
                    placeholder="Enter device ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label className="text-sm font-medium text-foreground">Oxygen Therapy</Label>
                  <Switch checked={oxygenTherapy} onCheckedChange={setOxygenTherapy} />
                </div>

                {oxygenTherapy && (
                  <div className="space-y-4 pl-4 border-l-2 border-border">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Oxygen Device</Label>
                      <Select value={oxygenDevice} onValueChange={setOxygenDevice}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent className="bg-card z-50">
                          <SelectItem value="nasal-cannula">Nasal Cannula</SelectItem>
                          <SelectItem value="face-mask">Face Mask</SelectItem>
                          <SelectItem value="non-rebreather">Non-Rebreather Mask</SelectItem>
                          <SelectItem value="ventilator">Ventilator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Flow (L/min)</Label>
                        <Input
                          type="number"
                          placeholder="Flow rate"
                          value={oxygenFlow}
                          onChange={(e) => setOxygenFlow(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">FiO₂ (%)</Label>
                        <Input
                          type="number"
                          placeholder="Fraction"
                          value={fio2}
                          onChange={(e) => setFio2(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Notes & Attribution */}
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Notes & Attribution
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Clinical Notes</Label>
                  <Textarea
                    placeholder="Add any additional observations or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Nurse Name</Label>
                    <Input value="Nurse Sarah" disabled className="mt-2 bg-muted" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Ward</Label>
                    <Input
                      value={selectedPatient?.ward || "N/A"}
                      disabled
                      className="mt-2 bg-muted"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSaveAndSubmit}>Save & Submit</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
