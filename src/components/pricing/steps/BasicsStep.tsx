import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle, Loader2 } from "lucide-react";
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
import { useDepartments } from "@/api/pricingApi";
import { checkInternalCodeUnique, LAB_ITEM_TYPES, SPECIMEN_TYPES, CONTAINER_TYPES } from "@/api/pricingApi";
import { generateInternalCode } from "@/lib/priceUtils";
import { useDebounce } from "@/hooks/useDebounce";

export function BasicsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PricingItemFormData>();

  const { data: departments, isLoading: deptLoading } = useDepartments();

  const [tags, setTags] = useState<string[]>(watch("tags") || []);
  const [tagInput, setTagInput] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const category = watch("category");
  const department = watch("department");
  const visibility = watch("visibility");
  const internalCode = watch("codes.internal");
  
  const debouncedCode = useDebounce(internalCode, 500);

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

  // Filter departments based on category
  const labDepartments = departments?.filter(dept => 
    ["Hematology", "Biochemistry", "Microbiology", "Immunology", "Pathology", "Urinalysis", "Coagulation", "Endocrine", "Molecular Diagnostics", "Blood Bank"].includes(dept)
  );

  const isLabTest = category === "Lab Test";

  return (
    <div className="space-y-6">
      {/* Item Type Selector - Lab specific */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Item Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LAB_ITEM_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setValue("category", type.value === "package" ? "Package" : "Lab Test");
                // Store item type in tags for now
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !LAB_ITEM_TYPES.some(lt => lt.value === t));
                setValue("tags", [...filteredTags, type.value]);
              }}
              className={`p-3 rounded-lg border text-left transition-all ${
                (watch("tags") || []).includes(type.value)
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-sm font-medium">{type.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
            </button>
          ))}
        </div>
      </Card>

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
              disabled={deptLoading}
            >
              <SelectTrigger id="department" className="mt-1">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {(labDepartments || departments)?.map((dept) => (
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
              Test Code <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="internal-code"
                {...register("codes.internal")}
                placeholder="e.g., HEM001, BIO010"
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
              Test Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Complete Blood Count"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Short Name */}
          <div>
            <Label htmlFor="shortName">Short Name / Print Name</Label>
            <Input
              id="shortName"
              {...register("description")}
              placeholder="e.g., CBC, LFT"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Used on reports and labels</p>
          </div>

          {/* LOINC Code */}
          <div>
            <Label htmlFor="loinc-code">LOINC Code</Label>
            <Input
              id="loinc-code"
              {...register("codes.cpt")}
              placeholder="e.g., 718-7, 2345-7"
              className="mt-1"
            />
          </div>

          {/* Unit - Hidden, defaulting to test */}
          <input type="hidden" {...register("unit")} value="test" />
        </div>
      </Card>

      {/* Specimen & Collection */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Specimen & Collection</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Specimen Type */}
          <div>
            <Label htmlFor="specimen-type">Specimen Type</Label>
            <Select
              onValueChange={(value) => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !SPECIMEN_TYPES.includes(t));
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

      {/* Visibility & Ordering */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Visibility & Ordering</h3>

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

          {/* Clinical Keywords */}
          <div>
            <Label htmlFor="tags">Clinical Keywords / Synonyms</Label>
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
                placeholder="e.g., anemia, infection, blood count (press Enter)"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.filter(t => !t.includes(":") && !LAB_ITEM_TYPES.some(lt => lt.value === t)).map((tag) => (
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
              Add synonyms and clinical keywords to improve searchability
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
