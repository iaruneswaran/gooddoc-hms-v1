import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Pill, 
  Calendar,
  FileText,
  Edit3,
  Plus,
  Trash2,
  Check,
  X,
  ArrowRight,
  Heart,
  Thermometer,
  Droplets,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DoctorClearance, 
  StepStatus, 
  ClinicalChecklist,
  MedicationReconciliationItem,
  ConditionAtDischarge,
  DischargeDestination,
  MedicationAction
} from "@/types/discharge-flow";
import { SAMPLE_DOCTOR_CLEARANCE } from "@/data/discharge-flow.mock";

interface DoctorClearanceStepProps {
  stepStatus: StepStatus;
  onStepComplete: () => void;
}

interface NewMedicationForm {
  name: string;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
}

const MEDICATION_SUGGESTIONS = [
  "Aspirin", "Atorvastatin", "Metoprolol", "Clopidogrel", "Pantoprazole",
  "Metformin", "Amlodipine", "Lisinopril", "Losartan", "Omeprazole",
  "Paracetamol", "Ibuprofen", "Ciprofloxacin", "Amoxicillin", "Azithromycin"
];

const STRENGTH_OPTIONS = ["5mg", "10mg", "20mg", "25mg", "40mg", "50mg", "75mg", "100mg", "250mg", "500mg", "1g"];
const DOSAGE_OPTIONS = ["1 tablet", "2 tablets", "1/2 tablet", "1 capsule", "5ml", "10ml", "15ml"];
const FREQUENCY_OPTIONS = ["Morning", "Night", "Morning & Night", "Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner", "Three times a day", "Four times a day", "As needed"];
const DURATION_OPTIONS = ["3 days", "5 days", "7 days", "10 days", "14 days", "1 month", "2 months", "3 months", "6 months", "Lifelong"];

const checklistItems: { key: keyof ClinicalChecklist; label: string }[] = [
  { key: "stableVitals", label: "Vitals stable for discharge" },
  { key: "afebrile", label: "Afebrile (>24 hours)" },
  { key: "painControlled", label: "Pain adequately controlled" },
  { key: "oxygenBaseline", label: "Oxygen at baseline/room air" },
  { key: "toleratingDiet", label: "Tolerating oral diet" },
  { key: "mobilitySafe", label: "Mobility/ambulation safe" },
  { key: "anticoagPlan", label: "Anticoagulation plan documented" },
  { key: "ivRemovedOrPlan", label: "IV access removed/plan documented" },
  { key: "drainsSafe", label: "Drains/devices safe for discharge" },
  { key: "criticalLabsReviewed", label: "Critical labs reviewed" },
  { key: "imagingReviewed", label: "Imaging results reviewed" },
  { key: "returnPrecautionsGiven", label: "Return precautions provided" },
];

const medicationActionColors: Record<string, string> = {
  Continue: "bg-green-500/10 text-green-600 border-green-500/30",
  Start: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  Change: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Stop: "bg-red-500/10 text-red-600 border-red-500/30",
};

export default function DoctorClearanceStep({ stepStatus, onStepComplete }: DoctorClearanceStepProps) {
  const [data, setData] = useState<DoctorClearance>(SAMPLE_DOCTOR_CLEARANCE);
  const [activeTab, setActiveTab] = useState("clinical");
  const [medSearch, setMedSearch] = useState("");
  const [newMed, setNewMed] = useState<NewMedicationForm>({
    name: "",
    strength: "",
    dose: "",
    frequency: "",
    duration: ""
  });
  
  const checklist = data.clinicalStatus.checklist;
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const totalChecks = checklistItems.length;
  const checklistProgress = Math.round((completedChecks / totalChecks) * 100);

  const filteredSuggestions = MEDICATION_SUGGESTIONS.filter(med => 
    med.toLowerCase().includes(medSearch.toLowerCase())
  );

  const handleChecklistChange = (key: keyof ClinicalChecklist, checked: boolean) => {
    setData(prev => ({
      ...prev,
      clinicalStatus: {
        ...prev.clinicalStatus,
        checklist: {
          ...prev.clinicalStatus.checklist,
          [key]: checked
        }
      }
    }));
  };

  const handleConditionChange = (value: ConditionAtDischarge) => {
    setData(prev => ({
      ...prev,
      clinicalStatus: {
        ...prev.clinicalStatus,
        conditionAtDischarge: value
      }
    }));
  };

  const handleDestinationChange = (value: DischargeDestination) => {
    setData(prev => ({
      ...prev,
      clinicalStatus: {
        ...prev.clinicalStatus,
        destination: value
      }
    }));
  };

  const handleAddMedication = () => {
    if (!newMed.name) return;
    
    const medication: MedicationReconciliationItem = {
      medId: `med-${Date.now()}`,
      name: `${newMed.name} ${newMed.strength}`.trim(),
      action: "Start" as MedicationAction,
      dose: newMed.dose || newMed.strength,
      route: "PO",
      frequency: newMed.frequency,
      duration: newMed.duration,
      instructions: "",
    };

    setData(prev => ({
      ...prev,
      medicationReconciliation: {
        ...prev.medicationReconciliation,
        items: [...prev.medicationReconciliation.items, medication]
      }
    }));

    setNewMed({ name: "", strength: "", dose: "", frequency: "", duration: "" });
    setMedSearch("");
  };

  const handleDeleteMedication = (medId: string) => {
    setData(prev => ({
      ...prev,
      medicationReconciliation: {
        ...prev.medicationReconciliation,
        items: prev.medicationReconciliation.items.filter(m => m.medId !== medId)
      }
    }));
  };

  const handleSignoff = () => {
    setData(prev => ({
      ...prev,
      signoff: {
        ...prev.signoff,
        confirmFitForDischarge: true,
        eSign: {
          byUserId: "user-001",
          signedAt: new Date().toISOString()
        }
      }
    }));
    onStepComplete();
  };

  const vitals = data.clinicalStatus.vitalsSnapshot;
  const labs = data.clinicalStatus.labsSummary || [];
  const imaging = data.clinicalStatus.imagingSummary || [];
  const medications = data.medicationReconciliation.items;

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Clinical Checklist</p>
                <p className="text-2xl font-bold text-foreground">{completedChecks}/{totalChecks}</p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                checklistProgress === 100 ? "bg-green-500/10" : "bg-amber-500/10"
              )}>
                {checklistProgress === 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
              </div>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all", checklistProgress === 100 ? "bg-green-500" : "bg-amber-500")}
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Medications</p>
                <p className="text-2xl font-bold text-foreground">{medications.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {medications.filter(m => m.action === "Start").length} new, {medications.filter(m => m.action === "Stop").length} stopped
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Follow-up</p>
                <p className="text-lg font-bold text-foreground">
                  {data.followUps.followUpDate || "Not set"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Condition</p>
                <p className="text-xl font-bold text-green-600">{data.clinicalStatus.conditionAtDischarge}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Destination: {data.clinicalStatus.destination}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0 border-b border-border">
            <TabsList className="bg-transparent p-0 h-auto gap-0">
              <TabsTrigger 
                value="clinical" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Activity className="w-4 h-4 mr-2" />
                Clinical Status
              </TabsTrigger>
              <TabsTrigger 
                value="medications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Pill className="w-4 h-4 mr-2" />
                Medications ({medications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="followups" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Follow-up
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            {/* Clinical Status Tab */}
            <TabsContent value="clinical" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Discharge Readiness Checklist */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Discharge Readiness Checklist</h3>
                  <div className="space-y-2">
                    {checklistItems.map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox 
                          id={item.key}
                          checked={checklist[item.key] === true}
                          onCheckedChange={(checked) => handleChecklistChange(item.key, checked as boolean)}
                        />
                        <label htmlFor={item.key} className="text-sm cursor-pointer flex-1">
                          {item.label}
                        </label>
                        {checklist[item.key] && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vitals & Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Latest Vitals</h3>
                  {vitals && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Heart className="w-3 h-3" /> Blood Pressure
                        </div>
                        <p className="font-semibold text-foreground">{vitals.bp} mmHg</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Activity className="w-3 h-3" /> Pulse
                        </div>
                        <p className="font-semibold text-foreground">{vitals.pulse} bpm</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Thermometer className="w-3 h-3" /> Temperature
                        </div>
                        <p className="font-semibold text-foreground">{vitals.temp}°F</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Droplets className="w-3 h-3" /> SpO2
                        </div>
                        <p className="font-semibold text-foreground">{vitals.spo2}%</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Discharge Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Condition at Discharge</label>
                        <Select value={data.clinicalStatus.conditionAtDischarge} onValueChange={handleConditionChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Stable">Stable</SelectItem>
                            <SelectItem value="Improved">Improved</SelectItem>
                            <SelectItem value="Unchanged">Unchanged</SelectItem>
                            <SelectItem value="Guarded">Guarded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Discharge Destination</label>
                        <Select value={data.clinicalStatus.destination} onValueChange={handleDestinationChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Rehab">Rehab Facility</SelectItem>
                            <SelectItem value="SNF">Skilled Nursing Facility</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Recent Labs</h3>
                    <div className="space-y-2">
                      {labs.map((lab, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {lab.critical && <AlertCircle className="w-4 h-4 text-red-500" />}
                            <span className="text-sm font-medium">{lab.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{lab.value}</p>
                            <p className="text-xs text-muted-foreground">{lab.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="mt-0 space-y-4">
              {/* Add Medication Form - Always visible at top */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Medication Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medication..."
                        value={medSearch}
                        onChange={(e) => {
                          setMedSearch(e.target.value);
                          setNewMed(prev => ({ ...prev, name: e.target.value }));
                        }}
                        className="pl-9"
                      />
                      {medSearch && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 max-h-40 overflow-auto">
                          {filteredSuggestions.map(suggestion => (
                            <button
                              key={suggestion}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => {
                                setNewMed(prev => ({ ...prev, name: suggestion }));
                                setMedSearch(suggestion);
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Strength */}
                    <Select value={newMed.strength} onValueChange={(v) => setNewMed(prev => ({ ...prev, strength: v }))}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Strength" />
                      </SelectTrigger>
                      <SelectContent>
                        {STRENGTH_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Dosage */}
                    <Select value={newMed.dose} onValueChange={(v) => setNewMed(prev => ({ ...prev, dose: v }))}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Dosage" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOSAGE_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Frequency */}
                    <Select value={newMed.frequency} onValueChange={(v) => setNewMed(prev => ({ ...prev, frequency: v }))}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Morning & Night" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Duration */}
                    <Select value={newMed.duration} onValueChange={(v) => setNewMed(prev => ({ ...prev, duration: v }))}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="7d" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Add Button */}
                    <Button size="sm" onClick={handleAddMedication} disabled={!newMed.name}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Medications Table */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Discharge Medications</h3>
                  <p className="text-xs text-muted-foreground">{medications.length} medications prescribed</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {medications.map((med, index) => (
                  <Card key={med.medId} className="border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Serial Number */}
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary">{index + 1}</span>
                          </div>
                          
                          {/* Medication Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-foreground">{med.name}</h4>
                              <Badge variant="outline" className="text-xs font-mono">
                                {med.strength}
                              </Badge>
                              {med.form && (
                                <span className="text-xs text-muted-foreground">({med.form})</span>
                              )}
                            </div>
                            
                            {med.genericName && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {med.genericName}
                                {med.brandName && <span className="text-primary"> • {med.brandName}</span>}
                              </p>
                            )}
                            
                            {med.drugCode && (
                              <Badge variant="secondary" className="text-[10px] font-mono mt-1 bg-muted">
                                ATC: {med.drugCode}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Dosage Info Grid */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dosage</p>
                            <p className="font-medium">{med.dose}</p>
                          </div>
                          <div className="text-center min-w-[120px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Frequency</p>
                            <p className="font-medium text-primary">{med.frequency}</p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</p>
                            <p className="font-medium">{med.duration}</p>
                          </div>
                          <div className="text-center min-w-[50px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Route</p>
                            <Badge variant="secondary" className="text-xs">{med.route}</Badge>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1 ml-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteMedication(med.medId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Instructions Row */}
                      {med.instructions && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Instructions:</span> {med.instructions}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Follow-up Tab */}
            <TabsContent value="followups" className="mt-0 space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Note:</span> The doctor can only recommend a follow-up date. 
                    The patient or front desk staff will need to book the actual appointment.
                  </p>
                </div>
              </div>
              
              <div className="max-w-md">
                <label className="text-sm font-medium mb-2 block">Recommended Follow-up Date</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Suggest when the patient should return for follow-up. This recommendation will appear on the discharge summary.
                </p>
                <input
                  type="date"
                  value={data.followUps.followUpDate || ""}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    followUps: { ...prev.followUps, followUpDate: e.target.value }
                  }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {data.followUps.followUpDate && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Recommendation:</span> Patient should schedule a follow-up appointment on or around{" "}
                      <span className="font-semibold text-primary">
                        {new Date(data.followUps.followUpDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Patient will be advised to contact the front desk to book this appointment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-0 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Doctor's Notes</label>
                <Textarea 
                  value={data.notesAttachments.doctorNote}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    notesAttachments: { ...prev.notesAttachments, doctorNote: e.target.value }
                  }))}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Sign-off Section */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox 
                id="confirm-discharge"
                checked={data.signoff.confirmFitForDischarge}
                onCheckedChange={(checked) => setData(prev => ({
                  ...prev,
                  signoff: { ...prev.signoff, confirmFitForDischarge: checked as boolean }
                }))}
              />
              <label htmlFor="confirm-discharge" className="text-sm font-medium cursor-pointer">
                I confirm this patient is fit for discharge and all clinical requirements have been met
              </label>
            </div>
            <Button 
              onClick={handleSignoff}
              disabled={!data.signoff.confirmFitForDischarge || checklistProgress < 100}
              className="gap-2"
            >
              Sign & Clear
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {checklistProgress < 100 && (
            <p className="text-sm text-amber-600 mt-2">
              Complete all checklist items to proceed with sign-off
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
