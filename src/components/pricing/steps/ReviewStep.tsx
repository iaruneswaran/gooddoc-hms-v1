import { useFormContext } from "react-hook-form";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingItemFormData } from "@/types/pricing-item";

export function ReviewStep() {
  const { watch, formState: { errors } } = useFormContext<PricingItemFormData>();

  const formData = watch();
  const hasErrors = Object.keys(errors).length > 0;

  const errorList = Object.entries(errors).flatMap(([key, value]) => {
    if (typeof value === "object" && value !== null && "message" in value) {
      return [`${key}: ${value.message}`];
    }
    return [];
  });

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {hasErrors ? (
        <Card className="p-4 border-destructive bg-destructive/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                {errorList.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border-primary/50 bg-primary/10">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Ready to submit!</span>
          </div>
        </Card>
      )}

      {/* Summary Table */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Item Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-muted-foreground">Field</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 text-muted-foreground">Item Name</td>
                <td className="py-3 font-medium">{formData.name || "-"}</td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Category</td>
                <td className="py-3">
                  <Badge variant="secondary">{formData.category || "-"}</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Department</td>
                <td className="py-3 font-medium">{formData.department || "-"}</td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Code</td>
                <td className="py-3">
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {formData.codes?.internal || "-"}
                  </code>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Unit</td>
                <td className="py-3 font-medium capitalize">{formData.unit || "-"}</td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Base Price</td>
                <td className="py-3 font-medium">
                  ₹{formData.pricing?.basePrice?.toFixed(2) || "0.00"}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Net Price</td>
                <td className="py-3 font-bold text-primary">
                  ₹{formData.pricing?.netPrice?.toFixed(2) || "0.00"}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Status</td>
                <td className="py-3">
                  <Badge variant="outline">{formData.status || "Draft"}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}