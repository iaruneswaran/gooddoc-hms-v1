import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PricingItemFormData } from "@/types/pricing-item";

const RESULT_TYPES = [
  { value: "numeric", label: "Numeric", description: "Numbers with units (e.g., 5.2 mg/dL)" },
  { value: "text", label: "Text/Narrative", description: "Free text result" },
  { value: "categorical", label: "Categorical", description: "Predefined options (e.g., Positive/Negative)" },
  { value: "micro_panel", label: "Micro Panel", description: "Culture with antibiogram" },
];

export function OperationalStep() {
  const {
    register,
    watch,
    setValue,
  } = useFormContext<PricingItemFormData>();

  const requiresDoctorOrder = watch("requiresDoctorOrder");
  const availability = watch("availability");

  return (
    <div className="space-y-6">
      {/* Turnaround Time */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Turnaround Time (TAT)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tat-routine">Routine TAT (hours)</Label>
            <Input
              id="tat-routine"
              type="number"
              min="1"
              {...register("turnaroundTime")}
              placeholder="e.g., 24"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Standard processing time in hours
            </p>
          </div>

          <div>
            <Label htmlFor="tat-stat">STAT TAT (hours)</Label>
            <Input
              id="tat-stat"
              type="number"
              min="1"
              placeholder="e.g., 2"
              className="mt-1"
              onChange={(e) => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !t.startsWith("stat:"));
                if (e.target.value) {
                  setValue("tags", [...filteredTags, `stat:${e.target.value}h`]);
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Urgent processing time (if available)
            </p>
          </div>
        </div>
      </Card>

      {/* Result Configuration */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Result Configuration</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {RESULT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !t.startsWith("resultType:"));
                setValue("tags", [...filteredTags, `resultType:${type.value}`]);
              }}
              className={`p-3 rounded-lg border text-left transition-all ${
                (watch("tags") || []).some(t => t === `resultType:${type.value}`)
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-sm font-medium">{type.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="result-units">Result Units</Label>
            <Input
              id="result-units"
              placeholder="e.g., mg/dL, U/L, %"
              className="mt-1"
              onChange={(e) => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !t.startsWith("units:"));
                if (e.target.value) {
                  setValue("tags", [...filteredTags, `units:${e.target.value}`]);
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="decimal-precision">Decimal Precision</Label>
            <Select
              onValueChange={(value) => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !t.startsWith("precision:"));
                setValue("tags", [...filteredTags, `precision:${value}`]);
              }}
            >
              <SelectTrigger id="decimal-precision" className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 (Whole numbers)</SelectItem>
                <SelectItem value="1">1 decimal</SelectItem>
                <SelectItem value="2">2 decimals</SelectItem>
                <SelectItem value="3">3 decimals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="method">Analytical Method</Label>
            <Input
              id="method"
              placeholder="e.g., CLIA, HPLC, PCR"
              className="mt-1"
              onChange={(e) => {
                const currentTags = watch("tags") || [];
                const filteredTags = currentTags.filter(t => !t.startsWith("method:"));
                if (e.target.value) {
                  setValue("tags", [...filteredTags, `method:${e.target.value}`]);
                }
              }}
            />
          </div>
        </div>
      </Card>

      {/* Ordering & Availability */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Ordering & Availability</h3>

        <div className="space-y-6">
          {/* Requires Doctor Order */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requiresDoctorOrder">Requires Doctor Order?</Label>
              <p className="text-xs text-muted-foreground">
                Test requires a doctor's prescription to order
              </p>
            </div>
            <Switch
              id="requiresDoctorOrder"
              checked={requiresDoctorOrder}
              onCheckedChange={(checked) => setValue("requiresDoctorOrder", checked)}
            />
          </div>

          {/* Availability */}
          <div>
            <Label htmlFor="availability">Availability Status</Label>
            <Select
              value={availability}
              onValueChange={(value) => setValue("availability", value as any)}
            >
              <SelectTrigger id="availability" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">Available</SelectItem>
                <SelectItem value="Out of Stock">Temporarily Unavailable</SelectItem>
                <SelectItem value="N/A">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rejection Criteria */}
          <div>
            <Label htmlFor="slaNote">Rejection Criteria</Label>
            <Textarea
              id="slaNote"
              {...register("slaNote")}
              placeholder="e.g., Hemolysis, Lipemia, Insufficient sample, Wrong container"
              className="mt-1"
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Conditions that would cause sample rejection
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Quick Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Routine TAT is for standard processing; STAT is for urgent requests</li>
          <li>• Mark tests requiring doctor orders to prevent direct patient booking</li>
          <li>• Clear rejection criteria help reduce sample recollection rates</li>
        </ul>
      </Card>
    </div>
  );
}
