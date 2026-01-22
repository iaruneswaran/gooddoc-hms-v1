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

  const category = watch("category");
  const requiresDoctorOrder = watch("requiresDoctorOrder");
  const availability = watch("availability");

  const isLabTest = category === "Lab Test";
  const isImaging = category === "Imaging";
  const isProcedure = category === "Procedure";
  const isDoctorFee = category === "Doctor Fee";
  const isRoom = category === "Room";
  const isPharmacy = category === "Pharmacy";

  return (
    <div className="space-y-6">
      {/* Turnaround Time - For Lab/Imaging */}
      {(isLabTest || isImaging) && (
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
      )}

      {/* Result Configuration - Lab only */}
      {isLabTest && (
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
      )}

      {/* Duration & Scheduling - For Doctor Fee, Procedure, Imaging */}
      {(isDoctorFee || isProcedure || isImaging) && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Duration & Scheduling</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">
                {isDoctorFee ? "Consultation Duration (minutes)" : 
                 isProcedure ? "Procedure Duration (minutes)" :
                 "Study Duration (minutes)"}
              </Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                placeholder={isDoctorFee ? "e.g., 15" : "e.g., 30"}
                className="mt-1"
                {...register("turnaroundTime")}
              />
            </div>

            {isProcedure && (
              <div>
                <Label htmlFor="anesthesia">Anesthesia Required</Label>
                <Select
                  onValueChange={(value) => {
                    const currentTags = watch("tags") || [];
                    const filteredTags = currentTags.filter(t => !t.startsWith("anesthesia:"));
                    setValue("tags", [...filteredTags, `anesthesia:${value}`]);
                  }}
                >
                  <SelectTrigger id="anesthesia" className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="local">Local Anesthesia</SelectItem>
                    <SelectItem value="sedation">Sedation</SelectItem>
                    <SelectItem value="general">General Anesthesia</SelectItem>
                    <SelectItem value="regional">Regional/Spinal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isImaging && (
              <div>
                <Label htmlFor="contrast">Contrast Required</Label>
                <Select
                  onValueChange={(value) => {
                    const currentTags = watch("tags") || [];
                    const filteredTags = currentTags.filter(t => !t.startsWith("contrast:"));
                    setValue("tags", [...filteredTags, `contrast:${value}`]);
                  }}
                >
                  <SelectTrigger id="contrast" className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Contrast</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="required">Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Room Specific - Timing */}
      {isRoom && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Room Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkout-time">Standard Checkout Time</Label>
              <Input
                id="checkout-time"
                type="time"
                defaultValue="11:00"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("checkout:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `checkout:${e.target.value}`]);
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="grace-period">Grace Period (hours)</Label>
              <Input
                id="grace-period"
                type="number"
                min="0"
                max="6"
                placeholder="e.g., 2"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("grace:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `grace:${e.target.value}h`]);
                  }
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Pharmacy Specific */}
      {isPharmacy && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Inventory & Dispensing</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reorder-level">Reorder Level</Label>
              <Input
                id="reorder-level"
                type="number"
                min="0"
                placeholder="e.g., 100"
                className="mt-1"
                onChange={(e) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("reorder:"));
                  if (e.target.value) {
                    setValue("tags", [...filteredTags, `reorder:${e.target.value}`]);
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="storage">Storage Conditions</Label>
              <Select
                onValueChange={(value) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("storage:"));
                  setValue("tags", [...filteredTags, `storage:${value}`]);
                }}
              >
                <SelectTrigger id="storage" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">Room Temperature</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated (2-8°C)</SelectItem>
                  <SelectItem value="frozen">Frozen (-20°C)</SelectItem>
                  <SelectItem value="controlled">Controlled Substance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="schedule">Drug Schedule</Label>
              <Select
                onValueChange={(value) => {
                  const currentTags = watch("tags") || [];
                  const filteredTags = currentTags.filter(t => !t.startsWith("schedule:"));
                  setValue("tags", [...filteredTags, `schedule:${value}`]);
                }}
              >
                <SelectTrigger id="schedule" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otc">OTC (Over the Counter)</SelectItem>
                  <SelectItem value="h">Schedule H</SelectItem>
                  <SelectItem value="h1">Schedule H1</SelectItem>
                  <SelectItem value="x">Schedule X</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Ordering & Availability - Common to all */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Ordering & Availability</h3>

        <div className="space-y-6">
          {/* Requires Doctor Order */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requiresDoctorOrder">
                {isPharmacy ? "Prescription Required?" : "Requires Doctor Order?"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPharmacy 
                  ? "Item requires a valid prescription to dispense" 
                  : "Service requires a doctor's order to book"}
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

          {/* Notes/Criteria - different labels by category */}
          <div>
            <Label htmlFor="slaNote">
              {isLabTest ? "Rejection Criteria" : 
               isProcedure ? "Pre-procedure Requirements" :
               isImaging ? "Preparation Instructions" :
               isPharmacy ? "Dispensing Notes" :
               "Additional Notes"}
            </Label>
            <Textarea
              id="slaNote"
              {...register("slaNote")}
              placeholder={
                isLabTest ? "e.g., Hemolysis, Lipemia, Insufficient sample" :
                isProcedure ? "e.g., NPO for 8 hours, Stop blood thinners" :
                isImaging ? "e.g., Full bladder required, Remove metal objects" :
                isPharmacy ? "e.g., Take with food, Store in refrigerator" :
                "Additional notes or instructions"
              }
              className="mt-1"
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isLabTest ? "Conditions that would cause sample rejection" :
               isProcedure ? "Requirements before the procedure" :
               isImaging ? "Patient preparation before the study" :
               "Special instructions or notes"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Quick Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          {isLabTest && (
            <>
              <li>• Routine TAT is for standard processing; STAT is for urgent requests</li>
              <li>• Mark tests requiring doctor orders to prevent direct patient booking</li>
              <li>• Clear rejection criteria help reduce sample recollection rates</li>
            </>
          )}
          {isDoctorFee && (
            <>
              <li>• Set consultation duration to help with scheduling</li>
              <li>• New consultations typically take longer than follow-ups</li>
            </>
          )}
          {isProcedure && (
            <>
              <li>• Specify anesthesia type to ensure proper OT scheduling</li>
              <li>• Clear pre-procedure requirements reduce cancellations</li>
            </>
          )}
          {isImaging && (
            <>
              <li>• TAT helps patients know when to expect results</li>
              <li>• Contrast studies may require additional preparation</li>
            </>
          )}
          {isRoom && (
            <>
              <li>• Standard checkout time helps with room turnover planning</li>
              <li>• Grace period defines free late checkout window</li>
            </>
          )}
          {isPharmacy && (
            <>
              <li>• Set reorder levels to prevent stockouts</li>
              <li>• Drug schedule determines prescription requirements</li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
}
