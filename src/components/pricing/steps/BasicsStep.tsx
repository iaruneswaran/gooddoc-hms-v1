import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle, Loader2, FlaskConical, Stethoscope, Scissors, Scan, BedDouble, Pill, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingItemFormData } from "@/types/pricing-item";
import { 
  checkInternalCodeUnique, 
  HOSPITAL_CATEGORIES,
  LAB_ITEM_TYPES, 
  IMAGING_ITEM_TYPES,
  PROCEDURE_TYPES,
  ROOM_TYPES,
  PHARMACY_ITEM_TYPES,
  CONSULTATION_TYPES,
  SPECIMEN_TYPES, 
  CONTAINER_TYPES,
  DEPARTMENTS_BY_CATEGORY,
  UNITS_BY_CATEGORY
} from "@/api/pricingApi";
import { generateInternalCode } from "@/lib/priceUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  "Lab Test": <FlaskConical className="w-5 h-5" />,
  "Doctor Fee": <Stethoscope className="w-5 h-5" />,
  "Procedure": <Scissors className="w-5 h-5" />,
  "Imaging": <Scan className="w-5 h-5" />,
  "Room": <BedDouble className="w-5 h-5" />,
  "Pharmacy": <Pill className="w-5 h-5" />,
  "Package": <Package className="w-5 h-5" />,
};

export function BasicsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PricingItemFormData>();

  const [tags, setTags] = useState<string[]>(watch("tags") || []);
  const [tagInput, setTagInput] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const category = watch("category");
  const department = watch("department");
  const visibility = watch("visibility");
  const internalCode = watch("codes.internal");
  
  const debouncedCode = useDebounce(internalCode, 500);

  // Get departments filtered by category
  const departments = category ? DEPARTMENTS_BY_CATEGORY[category] || [] : [];
  
  // Get units for the selected category
  const units = category ? UNITS_BY_CATEGORY[category] || [] : [];

  // Auto-set default unit when category changes
  useEffect(() => {
    if (category && units.length > 0) {
      setValue("unit", units[0].value as any);
    }
  }, [category, units, setValue]);

  // Auto-generate internal code when category/department changes
  useEffect(() => {
    if (category && department && !internalCode) {
      const suggested = generateInternalCode(category, department);
      setValue("codes.internal", suggested);
    }
  }, [category, department, internalCode, setValue]);

  // Check code uniqueness
  useEffect(() => {
    if (debouncedCode && debouncedCode.length >= 3) {
      setCheckingCode(true);
      setCodeError("");
      
      checkInternalCodeUnique(debouncedCode)
        .then((result) => {
          if (!result.unique) {
            setCodeError("This code is already in use");
          }
        })
        .catch(() => {
          setCodeError("Failed to check code availability");
        })
        .finally(() => {
          setCheckingCode(false);
        });
    }
  }, [debouncedCode]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue("tags", newTags);
  };

  // Get sub-type options based on category
  const getSubTypeOptions = () => {
    switch (category) {
      case "Lab Test":
        return LAB_ITEM_TYPES;
      case "Imaging":
        return IMAGING_ITEM_TYPES;
      case "Procedure":
        return PROCEDURE_TYPES;
      case "Room":
        return ROOM_TYPES;
      case "Pharmacy":
        return PHARMACY_ITEM_TYPES;
      case "Doctor Fee":
        return CONSULTATION_TYPES;
      default:
        return [];
    }
  };

  const subTypeOptions = getSubTypeOptions();
  const currentSubType = tags.find(t => subTypeOptions.some(opt => opt.value === t));

  // Get label text based on category
  const getCodeLabel = () => {
    switch (category) {
      case "Lab Test": return "Test Code";
      case "Doctor Fee": return "Fee Code";
      case "Procedure": return "Procedure Code";
      case "Imaging": return "Study Code";
      case "Room": return "Room Code";
      case "Pharmacy": return "Item Code";
      case "Package": return "Package Code";
      default: return "Item Code";
    }
  };

  const getNameLabel = () => {
    switch (category) {
      case "Lab Test": return "Test Name";
      case "Doctor Fee": return "Fee Description";
      case "Procedure": return "Procedure Name";
      case "Imaging": return "Study Name";
      case "Room": return "Room Type";
      case "Pharmacy": return "Item Name";
      case "Package": return "Package Name";
      default: return "Item Name";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Item Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {HOSPITAL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                setValue("category", cat.value as any);
                setValue("department", ""); // Reset department when category changes
                // Clear sub-type tags
                const filteredTags = tags.filter(t => !subTypeOptions.some(opt => opt.value === t));
                setTags(filteredTags);
                setValue("tags", filteredTags);
              }}
              className={cn(
                "p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-2",
                category === cat.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                category === cat.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {categoryIcons[cat.value]}
              </div>
              <div className="text-xs font-medium">{cat.label}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Sub-Type Selector (for categories with sub-types) */}
      {category && subTypeOptions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">
            {category === "Lab Test" ? "Test Type" : 
             category === "Imaging" ? "Modality" :
             category === "Doctor Fee" ? "Consultation Type" :
             category === "Room" ? "Room Class" :
             "Item Type"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {subTypeOptions.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  const filteredTags = tags.filter(t => !subTypeOptions.some(opt => opt.value === t));
                  const newTags = [...filteredTags, type.value];
                  setTags(newTags);
                  setValue("tags", newTags);
                }}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  currentSubType === type.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={department}
              onValueChange={(value) => setValue("department", value)}
              disabled={!category}
            >
              <SelectTrigger id="department" className="mt-1">
                <SelectValue placeholder={category ? "Select department" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-xs text-destructive mt-1">{errors.department.message}</p>
            )}
          </div>

          {/* Internal Code */}
          <div>
            <Label htmlFor="internal-code">
              {getCodeLabel()} <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="internal-code"
                {...register("codes.internal")}
                placeholder={category === "Lab Test" ? "e.g., HEM001, BIO010" : "e.g., CONS001, PROC001"}
                className="uppercase font-mono"
              />
              {checkingCode && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {codeError && (
              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{codeError}</span>
              </div>
            )}
            {errors.codes?.internal && (
              <p className="text-xs text-destructive mt-1">{errors.codes.internal.message}</p>
            )}
          </div>

          {/* Item Name */}
          <div>
            <Label htmlFor="name">
              {getNameLabel()} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={category === "Lab Test" ? "e.g., Complete Blood Count" : "Enter name"}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Short Name / Description */}
          <div>
            <Label htmlFor="shortName">
              {category === "Lab Test" ? "Short Name / Print Name" : "Short Description"}
            </Label>
            <Input
              id="shortName"
              {...register("description")}
              placeholder={category === "Lab Test" ? "e.g., CBC, LFT" : "Brief description"}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {category === "Lab Test" ? "Used on reports and labels" : "Displayed in lists and invoices"}
            </p>
          </div>

          {/* Unit Selection (for categories with multiple unit options) */}
          {units.length > 1 && (
            <div>
              <Label htmlFor="unit">Billing Unit</Label>
              <Select
                value={watch("unit")}
                onValueChange={(value) => setValue("unit", value as any)}
              >
                <SelectTrigger id="unit" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* CPT/LOINC Code based on category */}
          <div>
            <Label htmlFor="standard-code">
              {category === "Lab Test" ? "LOINC Code" : 
               category === "Procedure" || category === "Imaging" ? "CPT Code" :
               category === "Pharmacy" ? "Drug Code / NDC" :
               "Standard Code"}
            </Label>
            <Input
              id="standard-code"
              {...register("codes.cpt")}
              placeholder={category === "Lab Test" ? "e.g., 718-7" : "Optional"}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Lab-specific: Specimen & Collection */}
      {category === "Lab Test" && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Specimen & Collection</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Specimen Type */}
            <div>
              <Label htmlFor="specimen-type">Specimen Type</Label>
              <Select
                onValueChange={(value) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("specimen:"));
                  setValue("tags", [...filteredTags, `specimen:${value}`]);
                }}
              >
                <SelectTrigger id="specimen-type" className="mt-1">
                  <SelectValue placeholder="Select specimen" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIMEN_TYPES.map((specimen) => (
                    <SelectItem key={specimen} value={specimen}>
                      {specimen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Container Type */}
            <div>
              <Label htmlFor="container-type">Container</Label>
              <Select
                onValueChange={(value) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("container:"));
                  setValue("tags", [...filteredTags, `container:${value}`]);
                }}
              >
                <SelectTrigger id="container-type" className="mt-1">
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_TYPES.map((container) => (
                    <SelectItem key={container.value} value={container.value}>
                      {container.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Volume */}
            <div>
              <Label htmlFor="min-volume">Min Volume (mL)</Label>
              <Input
                id="min-volume"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 2.0"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("volume:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `volume:${e.target.value}mL`]);
                  }
                }}
              />
            </div>
          </div>

          {/* Patient Preparation */}
          <div className="mt-4">
            <Label htmlFor="patient-prep">Patient Preparation</Label>
            <Textarea
              id="patient-prep"
              {...register("prepInstructions")}
              placeholder="e.g., 10-12 hr fasting required, Avoid biotin supplements for 48 hrs"
              className="mt-1"
              rows={2}
            />
          </div>
        </Card>
      )}

      {/* Room-specific: Amenities */}
      {category === "Room" && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Room Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bed-count">Beds per Room</Label>
              <Input
                id="bed-count"
                type="number"
                min="1"
                placeholder="e.g., 1"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("beds:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `beds:${e.target.value}`]);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                placeholder="e.g., AC, TV, Attached Bathroom"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("amenities:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `amenities:${e.target.value}`]);
                  }
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Pharmacy-specific: Drug details */}
      {category === "Pharmacy" && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Drug/Item Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="generic-name">Generic Name</Label>
              <Input
                id="generic-name"
                placeholder="e.g., Paracetamol"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("generic:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `generic:${e.target.value}`]);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="strength">Strength/Dosage</Label>
              <Input
                id="strength"
                placeholder="e.g., 500mg"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("strength:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `strength:${e.target.value}`]);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                placeholder="e.g., Sun Pharma"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("mfr:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `mfr:${e.target.value}`]);
                  }
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Visibility & Ordering */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Visibility & Keywords</h3>

        <div className="space-y-4">
          {/* Visibility */}
          <div>
            <Label>Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) => setValue("visibility", value as any)}
              className="mt-2 flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staff" id="vis-staff" />
                <Label htmlFor="vis-staff" className="font-normal cursor-pointer">
                  Staff Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portal" id="vis-portal" />
                <Label htmlFor="vis-portal" className="font-normal cursor-pointer">
                  Patient Portal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Patient Description - shown only if visibility is portal */}
          {visibility === "portal" && (
            <div>
              <Label htmlFor="patient-description">
                Patient-Facing Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="patient-description"
                {...register("patientDescription")}
                placeholder="Clear, patient-friendly description (min 20 characters)"
                className="mt-1"
                rows={3}
              />
              {errors.patientDescription && (
                <p className="text-xs text-destructive mt-1">
                  {errors.patientDescription.message}
                </p>
              )}
            </div>
          )}

          {/* Keywords */}
          <div>
            <Label htmlFor="tags">Keywords / Synonyms</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add keywords for better search (press Enter)"
              />
            </div>
            {tags.filter(t => !t.includes(":") && !subTypeOptions.some(opt => opt.value === t)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.filter(t => !t.includes(":") && !subTypeOptions.some(opt => opt.value === t)).map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Add synonyms and keywords to improve searchability
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
