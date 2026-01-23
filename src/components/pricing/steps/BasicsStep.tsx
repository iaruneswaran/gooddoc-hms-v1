import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle, Loader2, Info } from "lucide-react";
import { PackageBuilder } from "../PackageBuilder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PricingItemFormData, PricingCategory } from "@/types/pricing-item";
import { useDepartments, useCategories } from "@/api/pricingApi";
import { checkInternalCodeUnique } from "@/api/pricingApi";
import {
  CATEGORY_CONFIG,
  ALL_UNITS,
  SPECIMEN_TYPES,
  MODALITIES,
  ANESTHESIA_TYPES,
  PROCEDURE_LOCATIONS,
  BILLING_BASIS,
  PROVIDER_TYPES,
  WARD_CLASSES,
  PACKAGE_TYPES,
  LATERALITY_OPTIONS,
  generateCategoryCode,
  PricingCategory as ConfigCategory,
} from "@/config/pricing-categories";
import { useDebounce } from "@/hooks/useDebounce";

export function BasicsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PricingItemFormData>();

  const category = watch("category") as PricingCategory;
  const { data: departments, isLoading: deptLoading } = useDepartments(category);
  const { data: categories, isLoading: catLoading } = useCategories();

  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const department = watch("department");
  const visibility = watch("visibility");
  const internalCode = watch("codes.internal");
  const unit = watch("unit");

  const debouncedCode = useDebounce(internalCode, 500);

  // Get config for selected category
  const categoryConfig = category ? CATEGORY_CONFIG[category as ConfigCategory] : null;

  // Auto-set unit when category changes
  useEffect(() => {
    if (categoryConfig && !unit) {
      setValue("unit", categoryConfig.defaultUnit);
    }
  }, [category, categoryConfig, setValue, unit]);

  // Reset department when category changes
  useEffect(() => {
    if (category && department) {
      const allowedDepts = CATEGORY_CONFIG[category as ConfigCategory]?.departments || [];
      if (!allowedDepts.includes(department)) {
        setValue("department", "");
      }
    }
  }, [category, department, setValue]);

  // Auto-generate internal code when category/department changes
  useEffect(() => {
    if (category && department && !internalCode) {
      const suggested = generateCategoryCode(category as ConfigCategory, department);
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


  // Get available units based on category
  const getAvailableUnits = () => {
    if (!categoryConfig) return ALL_UNITS;
    
    // Filter to show default unit and related units
    const defaultUnit = categoryConfig.defaultUnit;
    const relatedUnits = ALL_UNITS.filter(u => 
      u.value === defaultUnit || 
      (category === "Nursing Service" && (u.value === "event" || u.value === "hour"))
    );
    
    return relatedUnits.length > 0 ? relatedUnits : [ALL_UNITS.find(u => u.value === defaultUnit)!];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setValue("category", value as PricingCategory);
                // Reset unit to default for new category
                const config = CATEGORY_CONFIG[value as ConfigCategory];
                if (config) {
                  setValue("unit", config.defaultUnit);
                }
              }}
              disabled={catLoading}
            >
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={department}
              onValueChange={(value) => setValue("department", value)}
              disabled={deptLoading || !category}
            >
              <SelectTrigger id="department" className="mt-1">
                <SelectValue placeholder={category ? "Select department" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept) => (
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

          {/* Item Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Complete Blood Count (CBC)"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the service or item"
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold">Codes & Classification</h3>
          {categoryConfig?.helperText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{categoryConfig.helperText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Internal Code */}
          <div>
            <Label htmlFor="internal-code">
              Internal Code <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="internal-code"
                {...register("codes.internal")}
                placeholder="AUTO-GENERATED"
                className="uppercase"
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
            <p className="text-xs text-muted-foreground mt-1">
              Auto-generated, can be edited
            </p>
          </div>

          {/* LOINC Code - Lab Test only */}
          {categoryConfig?.fields.showLoinc && (
            <div>
              <Label htmlFor="loinc-code">LOINC Code</Label>
              <Input
                id="loinc-code"
                {...register("codes.loinc")}
                placeholder="e.g., 789-8"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Standard lab test code (optional)
              </p>
            </div>
          )}

          {/* CPT Code */}
          {categoryConfig?.fields.showCpt && (
            <div>
              <Label htmlFor="cpt-code">
                CPT Code {categoryConfig.fields.requireCpt && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="cpt-code"
                {...register("codes.cpt")}
                placeholder="e.g., 85025"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Billing code (if applicable)
              </p>
            </div>
          )}

          {/* ICD Code - only show when needed */}
          {categoryConfig?.fields.showIcd && (
            <div>
              <Label htmlFor="icd-code">ICD Code</Label>
              <Input
                id="icd-code"
                {...register("codes.icd")}
                placeholder="e.g., Z00.00"
                className="mt-1"
              />
            </div>
          )}

          {/* HCPCS Code */}
          {categoryConfig?.fields.showHcpcs && (
            <div>
              <Label htmlFor="hcpcs-code">HCPCS Code</Label>
              <Input
                id="hcpcs-code"
                {...register("codes.hcpcs")}
                placeholder="e.g., G0001"
                className="mt-1"
              />
            </div>
          )}

          {/* Unit */}
          <div>
            <Label htmlFor="unit">
              Unit <span className="text-destructive">*</span>
            </Label>
            <Select
              value={unit}
              onValueChange={(value) => setValue("unit", value as any)}
            >
              <SelectTrigger id="unit" className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUnits().map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-xs text-destructive mt-1">{errors.unit.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              How billing happens (per {categoryConfig?.defaultUnit || "unit"})
            </p>
          </div>

        </div>
      </Card>

      {/* Category-Specific Fields */}
      {categoryConfig && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">
            {category === "Lab Test" && "Lab Test Details"}
            {category === "Radiology/Imaging" && "Imaging Details"}
            {category === "Procedure/OT" && "Procedure Details"}
            {category === "Nursing Service" && "Service Details"}
            {category === "Room/Bed" && "Room Details"}
            {category === "Consultation" && "Consultation Details"}
            {category === "Package" && "Package Details"}
            {category === "Service/Consumable" && "Service Details"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lab Test Fields */}
            {categoryConfig.fields.showSpecimenType && (
              <div>
                <Label htmlFor="specimen-type">Specimen Type</Label>
                <Select
                  value={watch("attributes.specimenType") || ""}
                  onValueChange={(value) => setValue("attributes.specimenType", value)}
                >
                  <SelectTrigger id="specimen-type" className="mt-1">
                    <SelectValue placeholder="Select specimen type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIMEN_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showFastingRequired && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fasting-required">Fasting Required?</Label>
                  <p className="text-xs text-muted-foreground">
                    Patient needs to fast before this test
                  </p>
                </div>
                <Switch
                  id="fasting-required"
                  checked={watch("attributes.fastingRequired") || false}
                  onCheckedChange={(checked) => setValue("attributes.fastingRequired", checked)}
                />
              </div>
            )}

            {categoryConfig.fields.showTat && (
              <div>
                <Label htmlFor="tat">Turnaround Time (TAT)</Label>
                <Input
                  id="tat"
                  {...register("attributes.tat")}
                  placeholder="e.g., 2 hours, Same day"
                  className="mt-1"
                />
              </div>
            )}

            {categoryConfig.fields.showMethod && (
              <div>
                <Label htmlFor="method">Method</Label>
                <Input
                  id="method"
                  {...register("attributes.method")}
                  placeholder="e.g., ELISA, PCR, Manual"
                  className="mt-1"
                />
              </div>
            )}

            {/* Radiology Fields */}
            {categoryConfig.fields.showModality && (
              <div>
                <Label htmlFor="modality">Modality</Label>
                <Select
                  value={watch("attributes.modality") || ""}
                  onValueChange={(value) => setValue("attributes.modality", value)}
                >
                  <SelectTrigger id="modality" className="mt-1">
                    <SelectValue placeholder="Select modality" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALITIES.map((mod) => (
                      <SelectItem key={mod} value={mod}>
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showBodyPart && (
              <div>
                <Label htmlFor="body-part">Body Part / Region</Label>
                <Input
                  id="body-part"
                  {...register("attributes.bodyPart")}
                  placeholder="e.g., Chest, Abdomen, Brain"
                  className="mt-1"
                />
              </div>
            )}

            {categoryConfig.fields.showContrast && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="contrast">Contrast Required?</Label>
                  <p className="text-xs text-muted-foreground">
                    Contrast agent needed for imaging
                  </p>
                </div>
                <Switch
                  id="contrast"
                  checked={watch("attributes.contrast") || false}
                  onCheckedChange={(checked) => setValue("attributes.contrast", checked)}
                />
              </div>
            )}

            {categoryConfig.fields.showLaterality && (
              <div>
                <Label htmlFor="laterality">Laterality</Label>
                <Select
                  value={watch("attributes.laterality") || ""}
                  onValueChange={(value) => setValue("attributes.laterality", value)}
                >
                  <SelectTrigger id="laterality" className="mt-1">
                    <SelectValue placeholder="Select laterality" />
                  </SelectTrigger>
                  <SelectContent>
                    {LATERALITY_OPTIONS.map((lat) => (
                      <SelectItem key={lat} value={lat}>
                        {lat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Procedure Fields */}
            {categoryConfig.fields.showAnesthesiaType && (
              <div>
                <Label htmlFor="anesthesia-type">Anesthesia Type</Label>
                <Select
                  value={watch("attributes.anesthesiaType") || ""}
                  onValueChange={(value) => setValue("attributes.anesthesiaType", value)}
                >
                  <SelectTrigger id="anesthesia-type" className="mt-1">
                    <SelectValue placeholder="Select anesthesia type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANESTHESIA_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showEstimatedDuration && (
              <div>
                <Label htmlFor="estimated-duration">Estimated Duration</Label>
                <Input
                  id="estimated-duration"
                  {...register("attributes.estimatedDuration")}
                  placeholder="e.g., 30 mins, 2 hours"
                  className="mt-1"
                />
              </div>
            )}

            {categoryConfig.fields.showLocation && (
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={watch("attributes.location") || ""}
                  onValueChange={(value) => setValue("attributes.location", value)}
                >
                  <SelectTrigger id="location" className="mt-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROCEDURE_LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Nursing Service Fields */}
            {categoryConfig.fields.showBillingBasis && (
              <div>
                <Label htmlFor="billing-basis">Billing Basis</Label>
                <Select
                  value={watch("attributes.billingBasis") || ""}
                  onValueChange={(value) => setValue("attributes.billingBasis", value as "event" | "hour")}
                >
                  <SelectTrigger id="billing-basis" className="mt-1">
                    <SelectValue placeholder="Select billing basis" />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_BASIS.map((basis) => (
                      <SelectItem key={basis.value} value={basis.value}>
                        {basis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showStaffLevel && (
              <div>
                <Label htmlFor="staff-level">Staff Level</Label>
                <Input
                  id="staff-level"
                  {...register("attributes.staffLevel")}
                  placeholder="e.g., RN, LPN, Aide"
                  className="mt-1"
                />
              </div>
            )}

            {/* Room/Bed Fields */}
            {categoryConfig.fields.showWardClass && (
              <div>
                <Label htmlFor="ward-class">Ward Class</Label>
                <Select
                  value={watch("attributes.wardClass") || ""}
                  onValueChange={(value) => setValue("attributes.wardClass", value)}
                >
                  <SelectTrigger id="ward-class" className="mt-1">
                    <SelectValue placeholder="Select ward class" />
                  </SelectTrigger>
                  <SelectContent>
                    {WARD_CLASSES.map((wc) => (
                      <SelectItem key={wc} value={wc}>
                        {wc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showMealsIncluded && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="meals-included">Meals Included?</Label>
                  <p className="text-xs text-muted-foreground">
                    Room rate includes meals
                  </p>
                </div>
                <Switch
                  id="meals-included"
                  checked={watch("attributes.mealsIncluded") || false}
                  onCheckedChange={(checked) => setValue("attributes.mealsIncluded", checked)}
                />
              </div>
            )}

            {categoryConfig.fields.showMaxOccupancy && (
              <div>
                <Label htmlFor="max-occupancy">Max Occupancy</Label>
                <Input
                  id="max-occupancy"
                  type="number"
                  min={1}
                  {...register("attributes.maxOccupancy", { valueAsNumber: true })}
                  placeholder="e.g., 1, 2, 4"
                  className="mt-1"
                />
              </div>
            )}

            {/* Consultation Fields */}
            {categoryConfig.fields.showProviderType && (
              <div>
                <Label htmlFor="provider-type">Provider Type</Label>
                <Select
                  value={watch("attributes.providerType") || ""}
                  onValueChange={(value) => setValue("attributes.providerType", value)}
                >
                  <SelectTrigger id="provider-type" className="mt-1">
                    <SelectValue placeholder="Select provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPES.map((pt) => (
                      <SelectItem key={pt} value={pt}>
                        {pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showFollowUpWindow && (
              <div>
                <Label htmlFor="follow-up-window">Follow-up Window (days)</Label>
                <Input
                  id="follow-up-window"
                  type="number"
                  min={0}
                  {...register("attributes.followUpWindowDays", { valueAsNumber: true })}
                  placeholder="e.g., 7, 14, 30"
                  className="mt-1"
                />
              </div>
            )}

            {/* Package Fields */}
            {categoryConfig.fields.showPackageType && (
              <div>
                <Label htmlFor="package-type">Package Type</Label>
                <Select
                  value={watch("attributes.packageType") || ""}
                  onValueChange={(value) => setValue("attributes.packageType", value)}
                >
                  <SelectTrigger id="package-type" className="mt-1">
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_TYPES.map((pt) => (
                      <SelectItem key={pt} value={pt}>
                        {pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {categoryConfig.fields.showMultiVisit && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multi-visit">Multi-Visit Allowed?</Label>
                  <p className="text-xs text-muted-foreground">
                    Package can be used across multiple visits
                  </p>
                </div>
                <Switch
                  id="multi-visit"
                  checked={watch("attributes.multiVisitAllowed") || false}
                  onCheckedChange={(checked) => setValue("attributes.multiVisitAllowed", checked)}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Visibility & Patient Information</h3>

        <div className="space-y-4">
          {/* Visibility */}
          <div>
            <Label>
              Visibility <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) => setValue("visibility", value as any)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="vis-admin" />
                <Label htmlFor="vis-admin" className="font-normal cursor-pointer">
                  Admin Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staff" id="vis-staff" />
                <Label htmlFor="vis-staff" className="font-normal cursor-pointer">
                  Staff (Internal)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portal" id="vis-portal" />
                <Label htmlFor="vis-portal" className="font-normal cursor-pointer">
                  Patient Portal (Public)
                </Label>
              </div>
            </RadioGroup>
            {errors.visibility && (
              <p className="text-xs text-destructive mt-1">{errors.visibility.message}</p>
            )}
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
                rows={4}
              />
              {errors.patientDescription && (
                <p className="text-xs text-destructive mt-1">
                  {errors.patientDescription.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                This will be visible to patients on the portal
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Package Builder - shown only for Package category */}
      {category === "Package" && <PackageBuilder />}
    </div>
  );
}
