import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PricingItemFormData, PricingCategory } from "@/types/pricing-item";

export function PricingStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PricingItemFormData>();

  const currency = watch("pricing.currency");
  const basePrice = watch("pricing.basePrice") || 0;
  const discountPct = watch("pricing.discountPct") || 0;
  const category = watch("category") as PricingCategory;
  const packageComponents = watch("attributes.inclusions") || [];

  // Calculate standard price (final price after discount)
  const standardPrice = basePrice - (basePrice * discountPct / 100);

  // Auto-update net price when standard price changes
  useEffect(() => {
    setValue("pricing.netPrice", standardPrice);
  }, [standardPrice, setValue]);

  // Calculate package items total
  const packageTotal = packageComponents.reduce((sum, item) => {
    return sum + ((item.unitPrice || 0) * (item.quantity || 1));
  }, 0);

  // Form data for review section
  const formData = watch();
  const hasErrors = Object.keys(errors).length > 0;

  const errorList = Object.entries(errors).flatMap(([key, value]) => {
    if (typeof value === "object" && value !== null && "message" in value) {
      return [`${key}: ${value.message}`];
    }
    return [];
  });

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Currency */}
          <div>
            <Label htmlFor="currency">
              Currency <span className="text-destructive">*</span>
            </Label>
            <Select
              value={currency}
              onValueChange={(value) => setValue("pricing.currency", value as any)}
            >
              <SelectTrigger id="currency" className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
            {errors.pricing?.currency && (
              <p className="text-xs text-destructive mt-1">{errors.pricing.currency.message}</p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <Label htmlFor="basePrice">
              Base Price <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                {...register("pricing.basePrice", { valueAsNumber: true })}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
            {errors.pricing?.basePrice && (
              <p className="text-xs text-destructive mt-1">{errors.pricing.basePrice.message}</p>
            )}
          </div>

          {/* Discount % */}
          <div>
            <Label htmlFor="discountPct" className="flex items-center gap-1">
              Discount %
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Percentage discount applied to base price</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative mt-1">
              <Input
                id="discountPct"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("pricing.discountPct", { valueAsNumber: true })}
                placeholder="0"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>

          {/* Standard Price (calculated - read only) */}
          <div>
            <Label className="flex items-center gap-1">
              Standard Price
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Final price after discount (Base - Discount)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                type="text"
                value={standardPrice.toFixed(2)}
                readOnly
                disabled
                className="pl-7 bg-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Package Items Pricing - only show for Package category */}
      {category === "Package" && packageComponents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Package Items Pricing</h3>
          <div className="space-y-3">
            {packageComponents.map((item, index) => (
              <div key={item.itemId || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">{item.itemName}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    × {item.quantity || 1}
                  </span>
                </div>
                <span className="font-medium">
                  {currencySymbol}{((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Package Total:</span>
              <span className="text-primary">{currencySymbol}{packageTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Review Summary */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Review Summary</h3>
        
        {/* Validation Status */}
        {hasErrors ? (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {errorList.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">All required fields are complete!</span>
            </div>
          </div>
        )}

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-3 text-sm">
            <h4 className="font-medium text-muted-foreground">Basic Information</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Name:</span>
              <span className="font-medium">{formData.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="secondary">{formData.category || "-"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium">{formData.department || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Internal Code:</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {formData.codes?.internal || "-"}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit:</span>
              <span className="font-medium capitalize">{formData.unit || "-"}</span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="space-y-3 text-sm">
            <h4 className="font-medium text-muted-foreground">Pricing Details</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price:</span>
              <span className="font-medium">{currencySymbol}{basePrice.toFixed(2)}</span>
            </div>
            {discountPct > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium">{discountPct}%</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Standard Price:</span>
              <span className="font-bold text-primary">{currencySymbol}{standardPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
