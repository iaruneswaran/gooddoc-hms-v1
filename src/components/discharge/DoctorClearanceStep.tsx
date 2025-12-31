import { useState, useMemo } from "react";
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
  Search,
  AlertTriangle,
  Skull,
  LogOut,
  Building2,
  Home,
  Ambulance
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DoctorClearance, 
  StepStatus, 
  ClinicalChecklist,
  MedicationReconciliationItem,
  ConditionAtDischarge,
  DischargeDestination,
  MedicationAction,
  DischargeReason,
  DISCHARGE_REASON_CONFIG
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

const getDischargeReasonIcon = (reason: DischargeReason) => {
  switch (reason) {
    case 'death':
    case 'brought_dead':
      return Skull;
    case 'lama':
    case 'dama':
    case 'absconded':
      return LogOut;
    case 'referred_higher_center':
    case 'transferred_other_hospital':
      return Ambulance;
    case 'palliative_home':
      return Home;
    default:
      return CheckCircle2;
  }
};

const getDischargeReasonColor = (reason: DischargeReason) => {
  switch (reason) {
    case 'death':
    case 'brought_dead':
      return 'bg-gray-900 text-white';
    case 'lama':
    case 'dama':
    case 'absconded':
      return 'bg-red-500/10 text-red-600';
    case 'referred_higher_center':
    case 'transferred_other_hospital':
      return 'bg-blue-500/10 text-blue-600';
    case 'palliative_home':
      return 'bg-purple-500/10 text-purple-600';
    case 'treatment_completed':
    case 'improved':
      return 'bg-green-500/10 text-green-600';
    default:
      return 'bg-muted text-foreground';
  }
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
  
  // Get current discharge reason config
  const dischargeReason = data.clinicalStatus.dischargeReason || 'improved';
  const reasonConfig = DISCHARGE_REASON_CONFIG[dischargeReason];
  
  const checklist = data.clinicalStatus.checklist;
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const totalChecks = checklistItems.length;
  const checklistProgress = Math.round((completedChecks / totalChecks) * 100);

  // Determine if checklist is required based on discharge reason
  const checklistRequired = reasonConfig.requiresChecklist;
  const medsRequired = reasonConfig.requiresMedications;
  const followUpRequired = reasonConfig.requiresFollowUp;

  const filteredSuggestions = MEDICATION_SUGGESTIONS.filter(med => 
    med.toLowerCase().includes(medSearch.toLowerCase())
  );

  const handleDischargeReasonChange = (value: DischargeReason) => {
    setData(prev => ({
      ...prev,
      clinicalStatus: {
        ...prev.clinicalStatus,
        dischargeReason: value
      }
    }));
  };

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

  // Calculate if sign-off is allowed based on discharge reason requirements
  const canSignOff = useMemo(() => {
    if (!data.signoff.confirmFitForDischarge) return false;
    if (checklistRequired && checklistProgress < 100) return false;
    return true;
  }, [data.signoff.confirmFitForDischarge, checklistRequired, checklistProgress]);

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
  const ReasonIcon = getDischargeReasonIcon(dischargeReason);

  return (
    <div className="space-y-6">
      {/* Discharge Reason Banner - Shows prominently at top */}
      <Card className={cn("border-2", getDischargeReasonColor(dischargeReason))}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", getDischargeReasonColor(dischargeReason))}>
              <ReasonIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reason for Discharge</p>
              <p className="text-lg font-bold">{reasonConfig.label}</p>
              <p className="text-xs mt-0.5">{reasonConfig.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className={cn("border-border", !checklistRequired && "opacity-50")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Clinical Checklist</p>
                <p className="text-2xl font-bold text-foreground">
                  {checklistRequired ? `${completedChecks}/${totalChecks}` : "N/A"}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                !checklistRequired ? "bg-muted" : checklistProgress === 100 ? "bg-green-500/10" : "bg-amber-500/10"
              )}>
                {!checklistRequired ? (
                  <X className="w-6 h-6 text-muted-foreground" />
                ) : checklistProgress === 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
              </div>
            </div>
            {checklistRequired && (
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all", checklistProgress === 100 ? "bg-green-500" : "bg-amber-500")}
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cn("border-border", !medsRequired && "opacity-50")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Medications</p>
                <p className="text-2xl font-bold text-foreground">
                  {medsRequired ? medications.length : "N/A"}
                </p>
              </div>
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", medsRequired ? "bg-primary/10" : "bg-muted")}>
                <Pill className={cn("w-6 h-6", medsRequired ? "text-primary" : "text-muted-foreground")} />
              </div>
            </div>
            {medsRequired && (
              <p className="text-xs text-muted-foreground mt-2">
                {medications.filter(m => m.action === "Start").length} new, {medications.filter(m => m.action === "Stop").length} stopped
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={cn("border-border", !followUpRequired && "opacity-50")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Follow-up</p>
                <p className="text-lg font-bold text-foreground">
                  {followUpRequired ? (data.followUps.followUpDate || "Not set") : "N/A"}
                </p>
              </div>
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", followUpRequired ? "bg-blue-500/10" : "bg-muted")}>
                <Calendar className={cn("w-6 h-6", followUpRequired ? "text-blue-600" : "text-muted-foreground")} />
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
                {checklistRequired && (
                  <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">Required</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="medications" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3",
                  !medsRequired && "opacity-50"
                )}
                disabled={!medsRequired}
              >
                <Pill className="w-4 h-4 mr-2" />
                Medications ({medications.length})
                {medsRequired && (
                  <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">Required</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="followups" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3",
                  !followUpRequired && "opacity-50"
                )}
                disabled={!followUpRequired}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Follow-up
                {followUpRequired && (
                  <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">Required</Badge>
                )}
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
              {/* Discharge Reason Selector */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Discharge Reason</h3>
                <Select value={dischargeReason} onValueChange={handleDischargeReasonChange}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treatment_completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Treatment Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="improved">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Condition Improved
                      </div>
                    </SelectItem>
                    <SelectItem value="not_improved">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Not Improved
                      </div>
                    </SelectItem>
                    <SelectItem value="referred_higher_center">
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4 text-blue-600" />
                        Referred to Higher Center
                      </div>
                    </SelectItem>
                    <SelectItem value="transferred_other_hospital">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Transferred to Other Hospital
                      </div>
                    </SelectItem>
                    <SelectItem value="lama">
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-red-600" />
                        Left Against Medical Advice (LAMA)
                      </div>
                    </SelectItem>
                    <SelectItem value="dama">
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-red-600" />
                        Discharge Against Medical Advice (DAMA)
                      </div>
                    </SelectItem>
                    <SelectItem value="absconded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Absconded
                      </div>
                    </SelectItem>
                    <SelectItem value="death">
                      <div className="flex items-center gap-2">
                        <Skull className="w-4 h-4 text-gray-600" />
                        Death
                      </div>
                    </SelectItem>
                    <SelectItem value="brought_dead">
                      <div className="flex items-center gap-2">
                        <Skull className="w-4 h-4 text-gray-600" />
                        Brought Dead
                      </div>
                    </SelectItem>
                    <SelectItem value="palliative_home">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-600" />
                        Palliative/Terminal Care at Home
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        Other
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discharge Reason Notes - shown for all discharge types */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Discharge Notes</h3>
                <Textarea
                  placeholder={`Notes for ${reasonConfig.label}...`}
                  value={data.clinicalStatus.dischargeReasonNotes || ""}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    clinicalStatus: { ...prev.clinicalStatus, dischargeReasonNotes: e.target.value }
                  }))}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Discharge Readiness Checklist - Only shown when required */}
                {checklistRequired ? (
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
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Checklist Not Required</h3>
                    <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        Clinical checklist is not required for <span className="font-medium">{reasonConfig.label}</span> discharges.
                      </p>
                    </div>
                  </div>
                )}

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
              {/* Add Medication Form - Redesigned */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Add New Medication</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Medication Search - Improved */}
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search medication..."
                      value={newMed.name || medSearch}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMedSearch(value);
                        setNewMed(prev => ({ ...prev, name: value }));
                      }}
                      className="pl-9 bg-background border-border/60 focus:border-primary shadow-sm"
                    />
                    {medSearch && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-auto">
                        {filteredSuggestions.map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                            onClick={() => {
                              setNewMed(prev => ({ ...prev, name: suggestion }));
                              setMedSearch("");
                            }}
                          >
                            <Pill className="w-3.5 h-3.5 text-primary" />
                            <span className="text-foreground">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Strength */}
                  <Select value={newMed.strength} onValueChange={(v) => setNewMed(prev => ({ ...prev, strength: v }))}>
                    <SelectTrigger className="w-[110px] bg-background shadow-sm">
                      <SelectValue placeholder="Strength" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {STRENGTH_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Dosage */}
                  <Select value={newMed.dose} onValueChange={(v) => setNewMed(prev => ({ ...prev, dose: v }))}>
                    <SelectTrigger className="w-[110px] bg-background shadow-sm">
                      <SelectValue placeholder="Dosage" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {DOSAGE_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Frequency */}
                  <Select value={newMed.frequency} onValueChange={(v) => setNewMed(prev => ({ ...prev, frequency: v }))}>
                    <SelectTrigger className="w-[150px] bg-background shadow-sm">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {FREQUENCY_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Duration */}
                  <Select value={newMed.duration} onValueChange={(v) => setNewMed(prev => ({ ...prev, duration: v }))}>
                    <SelectTrigger className="w-[100px] bg-background shadow-sm">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {DURATION_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Add Button */}
                  <Button onClick={handleAddMedication} disabled={!newMed.name} className="gap-1.5 shadow-sm">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

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
                              <p className="text-[10px] font-mono text-muted-foreground mt-1">
                                ATC: {med.drugCode}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Dosage Info Grid */}
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center w-24">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dosage</p>
                            <p className="font-medium">{med.dose}</p>
                          </div>
                          <div className="text-center w-40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Frequency</p>
                            <p className="font-medium text-primary">{med.frequency}</p>
                          </div>
                          <div className="text-center w-24">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</p>
                            <p className="font-medium">{med.duration}</p>
                          </div>
                          <div className="text-center w-24">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Route</p>
                            <p className="font-medium">{med.route}</p>
                          </div>
                        </div>
                          
                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-4">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Follow-up Tab */}
            <TabsContent value="followups" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Recommended Follow-up Date</label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Suggest when the patient should return for follow-up.
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
                        <span className="font-medium text-foreground">Recommendation:</span> Patient should schedule a follow-up on{" "}
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
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Reason for Follow-up</label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Specify the purpose of the follow-up visit.
                  </p>
                  <Textarea
                    placeholder="e.g., Review blood test results, wound check, medication adjustment..."
                    value={data.followUps.followUpReason || ""}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      followUps: { ...prev.followUps, followUpReason: e.target.value }
                    }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
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
                {reasonConfig.confirmationText}
              </label>
            </div>
            <Button 
              onClick={handleSignoff}
              disabled={!canSignOff}
              className="gap-2"
            >
              Sign & Clear
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {checklistRequired && checklistProgress < 100 && (
            <p className="text-sm text-amber-600 mt-2">
              Complete all checklist items to proceed with sign-off
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
