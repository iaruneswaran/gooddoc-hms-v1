import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PricingItemFormData } from "@/types/pricing-item";
import { useDepartments, useCategories } from "@/api/pricingApi";
import { checkInternalCodeUnique } from "@/api/pricingApi";
import { generateInternalCode } from "@/lib/priceUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { calcNetPrice } from "@/lib/priceUtils";

export function BasicsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PricingItemFormData>();

  const { data: departments, isLoading: deptLoading } = useDepartments();
  const { data: categories, isLoading: catLoading } = useCategories();

  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const category = watch("category");
  const department = watch("department");
  const internalCode = watch("codes.internal");
  const unit = watch("unit");
  const basePrice = watch("pricing.basePrice");
  const markupPct = watch("pricing.markupPct") || 0;
  const discountPct = watch("pricing.discountPct") || 0;
  const taxPct = watch("pricing.taxPct") || 0;
  
  const debouncedCode = useDebounce(internalCode, 500);

  // Auto-generate internal code when category/department changes
  useEffect(() => {
    if (category && department && !internalCode) {
      const suggested = generateInternalCode(category, department);
      setValue("codes.internal", suggested);
    }
  }, [category, department, internalCode, setValue]);

  // Auto-calculate net price when base price changes
  useEffect(() => {
    if (basePrice !== undefined) {
      const net = calcNetPrice({
        basePrice: basePrice,
        markupPct,
        discountPct,
        taxPct,
      });
      setValue("pricing.netPrice", net);
    }
  }, [basePrice, markupPct, discountPct, taxPct, setValue]);

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Category */}
          <div>
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as any)}
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
              disabled={deptLoading}
            >
              <SelectTrigger id="department" className="mt-1">
                <SelectValue placeholder="Select department" />
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

          {/* Internal Code */}
          <div>
            <Label htmlFor="internal-code">
              Code <span className="text-destructive">*</span>
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
          </div>

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
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="package">Package</SelectItem>
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-xs text-destructive mt-1">{errors.unit.message}</p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <Label htmlFor="base-price">
              Base Price <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="base-price"
                type="number"
                step="0.01"
                min="0"
                {...register("pricing.basePrice", { valueAsNumber: true })}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
            {errors.pricing?.basePrice && (
              <p className="text-xs text-destructive mt-1">{errors.pricing.basePrice.message}</p>
            )}
          </div>

          {/* Net Price (Read-only, auto-calculated) */}
          <div>
            <Label htmlFor="net-price">Net Price</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="net-price"
                type="number"
                value={watch("pricing.netPrice")?.toFixed(2) || "0.00"}
                readOnly
                className="pl-7 bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Auto-calculated</p>
          </div>
        </div>
      </Card>
    </div>
  );
}