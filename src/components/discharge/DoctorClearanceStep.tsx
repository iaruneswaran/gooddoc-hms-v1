import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Pill, 
  Calendar,
  FileText,
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
  Ambulance,
  ShoppingCart,
  Package,
  Clock,
  ChevronRight
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
import { 
  MEDICATIONS_CATALOG, 
  MEDICATION_CATEGORIES,
  MedicationCatalogItem,
  MedicationCategory,
  STRENGTH_OPTIONS,
  DOSAGE_OPTIONS,
  FREQUENCY_OPTIONS,
  DURATION_OPTIONS,
  ROUTE_OPTIONS
} from "@/data/medications-catalog.mock";

interface DoctorClearanceStepProps {
  stepStatus: StepStatus;
  onStepComplete: () => void;
}

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

export default function DoctorClearanceStep({ stepStatus, onStepComplete }: DoctorClearanceStepProps) {
  const [data, setData] = useState<DoctorClearance>(SAMPLE_DOCTOR_CLEARANCE);
  const [activeTab, setActiveTab] = useState("clinical");
  const [medSearch, setMedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MedicationCategory | "all">("all");
  const [selectedMedForEdit, setSelectedMedForEdit] = useState<string | null>(null);
  
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

  // Filter medications from catalog
  const filteredCatalogMeds = useMemo(() => {
    return MEDICATIONS_CATALOG.filter(med => {
      const matchesSearch = medSearch === "" || 
        med.name.toLowerCase().includes(medSearch.toLowerCase()) ||
        med.genericName.toLowerCase().includes(medSearch.toLowerCase()) ||
        med.brandName.toLowerCase().includes(medSearch.toLowerCase()) ||
        med.tags.some(tag => tag.toLowerCase().includes(medSearch.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [medSearch, selectedCategory]);

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

  const handleAddMedicationFromCatalog = (catalogMed: MedicationCatalogItem) => {
    const medication: MedicationReconciliationItem = {
      medId: `med-${Date.now()}`,
      name: catalogMed.name,
      genericName: catalogMed.genericName,
      brandName: catalogMed.brandName,
      drugCode: catalogMed.drugCode,
      action: "Start" as MedicationAction,
      strength: catalogMed.defaultStrength,
      form: catalogMed.form,
      dose: catalogMed.defaultDose,
      route: catalogMed.route,
      frequency: catalogMed.defaultFrequency,
      duration: catalogMed.defaultDuration,
      instructions: "",
    };

    setData(prev => ({
      ...prev,
      medicationReconciliation: {
        ...prev.medicationReconciliation,
        items: [...prev.medicationReconciliation.items, medication]
      }
    }));
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

  const handleUpdateMedication = (medId: string, field: keyof MedicationReconciliationItem, value: string) => {
    setData(prev => ({
      ...prev,
      medicationReconciliation: {
        ...prev.medicationReconciliation,
        items: prev.medicationReconciliation.items.map(m => 
          m.medId === medId ? { ...m, [field]: value } : m
        )
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
  const medications = data.medicationReconciliation.items;

  // Check if a medication is already in the prescription
  const isMedicationInCart = (catalogMedId: string) => {
    const catalogMed = MEDICATIONS_CATALOG.find(m => m.id === catalogMedId);
    if (!catalogMed) return false;
    return medications.some(m => m.name === catalogMed.name);
  };

  // Derived stats for cards
  const newMedsCount = medications.filter(m => m.action === "Start").length;
  const continuedMedsCount = medications.filter(m => m.action === "Continue").length;
  const stoppedMedsCount = medications.filter(m => m.action === "Stop").length;
  
  const followUpDate = data.followUps.followUpDate;
  const daysUntilFollowUp = followUpDate 
    ? Math.ceil((new Date(followUpDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards Row - Enhanced Design */}
      <div className="grid grid-cols-4 gap-4">
        {/* Clinical Checklist Card */}
        <Card className={cn(
          "relative overflow-hidden border-0 shadow-sm transition-all duration-200",
          !checklistRequired && "opacity-50",
          checklistRequired && checklistProgress === 100 && "ring-1 ring-green-500/20"
        )}>
          <div className={cn(
            "absolute inset-0 opacity-[0.03]",
            checklistProgress === 100 ? "bg-green-500" : "bg-amber-500"
          )} />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                !checklistRequired ? "bg-muted" : checklistProgress === 100 ? "bg-green-500/10" : "bg-amber-500/10"
              )}>
                {!checklistRequired ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : checklistProgress === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              {checklistRequired && checklistProgress === 100 && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] font-medium">
                  Complete
                </Badge>
              )}
            </div>
            
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Clinical Checklist
            </p>
            
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-2xl font-semibold tabular-nums",
                !checklistRequired ? "text-muted-foreground" : checklistProgress === 100 ? "text-green-600" : "text-amber-600"
              )}>
                {checklistRequired ? completedChecks : "—"}
              </span>
              {checklistRequired && (
                <span className="text-sm text-muted-foreground">/ {totalChecks}</span>
              )}
            </div>
            
            {checklistRequired && (
              <>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      checklistProgress === 100 ? "bg-green-500" : "bg-amber-500"
                    )}
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {checklistProgress === 100 ? "All items verified" : `${totalChecks - completedChecks} items remaining`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Medications Card */}
        <Card className={cn(
          "relative overflow-hidden border-0 shadow-sm transition-all duration-200",
          !medsRequired && "opacity-50",
          medsRequired && medications.length > 0 && "ring-1 ring-primary/20"
        )}>
          <div className="absolute inset-0 bg-primary opacity-[0.02]" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                medsRequired ? "bg-primary/10" : "bg-muted"
              )}>
                <Pill className={cn("w-5 h-5", medsRequired ? "text-primary" : "text-muted-foreground")} />
              </div>
              {medsRequired && medications.length > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                  {medications.length} Rx
                </Badge>
              )}
            </div>
            
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Medications
            </p>
            
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-2xl font-semibold tabular-nums",
                medsRequired ? "text-foreground" : "text-muted-foreground"
              )}>
                {medsRequired ? medications.length : "—"}
              </span>
              {medsRequired && medications.length > 0 && (
                <span className="text-sm text-muted-foreground">prescribed</span>
              )}
            </div>
            
            {medsRequired && medications.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                {newMedsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-muted-foreground">{newMedsCount} new</span>
                  </div>
                )}
                {continuedMedsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-muted-foreground">{continuedMedsCount} cont.</span>
                  </div>
                )}
                {stoppedMedsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] text-muted-foreground">{stoppedMedsCount} stop</span>
                  </div>
                )}
              </div>
            )}
            
            {medsRequired && medications.length === 0 && (
              <p className="text-[10px] text-muted-foreground mt-1.5">No medications added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Follow-up Card */}
        <Card className={cn(
          "relative overflow-hidden border-0 shadow-sm transition-all duration-200",
          !followUpRequired && "opacity-50",
          followUpRequired && followUpDate && "ring-1 ring-blue-500/20"
        )}>
          <div className="absolute inset-0 bg-blue-500 opacity-[0.02]" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                followUpRequired ? "bg-blue-500/10" : "bg-muted"
              )}>
                <Calendar className={cn("w-5 h-5", followUpRequired ? "text-blue-600" : "text-muted-foreground")} />
              </div>
              {followUpRequired && daysUntilFollowUp !== null && daysUntilFollowUp > 0 && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-medium">
                  In {daysUntilFollowUp}d
                </Badge>
              )}
            </div>
            
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Follow-up
            </p>
            
            {followUpRequired ? (
              followUpDate ? (
                <>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(followUpDate).toLocaleDateString("en-IN", { 
                      day: "numeric",
                      month: "short"
                    })}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(followUpDate).toLocaleDateString("en-IN", { 
                      weekday: "long",
                      year: "numeric"
                    })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-muted-foreground">Not set</p>
                  <p className="text-[10px] text-amber-600 mt-1">Schedule recommended</p>
                </>
              )
            ) : (
              <>
                <p className="text-lg font-semibold text-muted-foreground">N/A</p>
                <p className="text-[10px] text-muted-foreground mt-1">Not required</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Condition & Destination Card */}
        <Card className="relative overflow-hidden border-0 shadow-sm ring-1 ring-green-500/20">
          <div className="absolute inset-0 bg-green-500 opacity-[0.02]" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] font-medium">
                Ready
              </Badge>
            </div>
            
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Discharge Status
            </p>
            
            <p className="text-lg font-semibold text-green-600">
              {data.clinicalStatus.conditionAtDischarge}
            </p>
            
            <div className="flex items-center gap-1.5 mt-2">
              <Home className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                To: <span className="font-medium text-foreground">{data.clinicalStatus.destination}</span>
              </span>
            </div>
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
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3",
                  !medsRequired && "opacity-50"
                )}
                disabled={!medsRequired}
              >
                <Pill className="w-4 h-4 mr-2" />
                Medications ({medications.length})
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

          <CardContent className="p-0">
            {/* Clinical Status Tab */}
            <TabsContent value="clinical" className="mt-0 p-6 space-y-6">
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

              {/* Discharge Reason Notes */}
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
                {/* Discharge Readiness Checklist */}
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

            {/* Medications Tab - New Pharmacy Style Layout */}
            <TabsContent value="medications" className="mt-0">
              <div className="flex h-[600px]">
                {/* Left Side - Medicine Catalog */}
                <div className="flex-1 border-r border-border flex flex-col">
                  {/* Search & Filter Header */}
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medications by name, generic, or category..."
                        value={medSearch}
                        onChange={(e) => setMedSearch(e.target.value)}
                        className="pl-9 bg-background"
                      />
                    </div>
                    
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedCategory === "all" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        All
                      </button>
                      {MEDICATION_CATEGORIES.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5",
                            selectedCategory === cat.value 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          <span>{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Medication List */}
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                      {filteredCatalogMeds.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">No medications found</p>
                          <p className="text-xs">Try a different search term or category</p>
                        </div>
                      ) : (
                        filteredCatalogMeds.map(med => {
                          const isInCart = isMedicationInCart(med.id);
                          return (
                            <div 
                              key={med.id}
                              className={cn(
                                "p-3 rounded-lg border transition-all cursor-pointer group",
                                isInCart 
                                  ? "bg-green-500/5 border-green-500/30" 
                                  : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                              )}
                              onClick={() => !isInCart && handleAddMedicationFromCatalog(med)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-foreground text-sm">{med.name}</h4>
                                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                      {med.defaultStrength}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {med.genericName} • {med.brandName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                      {med.category}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{med.form}</span>
                                  </div>
                                </div>
                                
                                {isInCart ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xs font-medium">Added</span>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddMedicationFromCatalog(med);
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Side - Prescription Cart */}
                <div className="w-[420px] flex flex-col bg-muted/20">
                  {/* Cart Header */}
                  <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Discharge Prescription</h3>
                        <p className="text-xs text-muted-foreground">{medications.length} medications</p>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-2">
                      {medications.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Pill className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm font-medium">No medications added</p>
                          <p className="text-xs">Click on medications from the left to add them</p>
                        </div>
                      ) : (
                        medications.map((med, index) => (
                          <Card key={med.medId} className="border-border bg-card shadow-sm">
                            <CardContent className="p-3">
                              {/* Med Header */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <h4 className="font-medium text-sm text-foreground">{med.name}</h4>
                                    {med.genericName && (
                                      <p className="text-[10px] text-muted-foreground">{med.genericName}</p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteMedication(med.medId)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>

                              {/* Quick Edit Fields */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Strength</label>
                                  <Select 
                                    value={med.strength || ""} 
                                    onValueChange={(v) => handleUpdateMedication(med.medId, 'strength', v)}
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {STRENGTH_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Dosage</label>
                                  <Select 
                                    value={med.dose} 
                                    onValueChange={(v) => handleUpdateMedication(med.medId, 'dose', v)}
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DOSAGE_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Frequency</label>
                                  <Select 
                                    value={med.frequency} 
                                    onValueChange={(v) => handleUpdateMedication(med.medId, 'frequency', v)}
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {FREQUENCY_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</label>
                                  <Select 
                                    value={med.duration} 
                                    onValueChange={(v) => handleUpdateMedication(med.medId, 'duration', v)}
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DURATION_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Route Badge */}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px]">
                                  Route: {med.route}
                                </Badge>
                                {med.drugCode && (
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    ATC: {med.drugCode}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Cart Footer Summary */}
                  {medications.length > 0 && (
                    <div className="p-4 border-t border-border bg-card">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Medications</span>
                        <span className="font-semibold">{medications.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>New medications</span>
                        <span>{medications.filter(m => m.action === "Start").length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Continued</span>
                        <span>{medications.filter(m => m.action === "Continue").length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Follow-up Tab */}
            <TabsContent value="followups" className="mt-0 p-6 space-y-4">
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
            <TabsContent value="notes" className="mt-0 p-6 space-y-4">
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
