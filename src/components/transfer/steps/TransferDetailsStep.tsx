import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, AlertTriangle, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { TransferRequest, TransferType, TransferPriority, TransferReason } from "@/types/transfer";
import { transferTypeLabels, priorityLabels, reasonLabels } from "@/data/transfer.mock";

interface TransferDetailsStepProps {
  data: Partial<TransferRequest>;
  onChange: (data: Partial<TransferRequest>) => void;
  currentTariff: number;
}

const priorityColors: Record<TransferPriority, string> = {
  stat: "bg-red-100 text-red-700 border-red-200",
  urgent: "bg-amber-100 text-amber-700 border-amber-200",
  routine: "bg-blue-100 text-blue-700 border-blue-200",
};

export function TransferDetailsStep({ data, onChange, currentTariff }: TransferDetailsStepProps) {
  // Auto-fill ordering clinician
  useEffect(() => {
    if (!data.orderingClinician) {
      onChange({ orderingClinician: "Dr. Meera Nair" });
    }
  }, []);

  const showPreAuthWarning = data.transferType === 'ward_to_icu' || data.insurancePreAuthRequired;

  return (
    <div className="space-y-6">
      {/* Transfer Type */}
      <div className="space-y-2">
        <Label htmlFor="transferType">Transfer Type</Label>
        <Select
          value={data.transferType}
          onValueChange={(value) => onChange({ transferType: value as TransferType })}
        >
          <SelectTrigger id="transferType">
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(transferTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose the type of bed transfer required
        </p>
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <Label>Priority</Label>
        <RadioGroup
          value={data.priority}
          onValueChange={(value) => onChange({ priority: value as TransferPriority })}
          className="flex gap-3"
        >
          {(Object.keys(priorityLabels) as TransferPriority[]).map((priority) => (
            <label
              key={priority}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                data.priority === priority
                  ? priorityColors[priority]
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <RadioGroupItem value={priority} className="sr-only" />
              <span className="font-medium text-sm">{priorityLabels[priority]}</span>
            </label>
          ))}
        </RadioGroup>
        {data.priority === 'stat' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>STAT transfers may bypass some checklist items but require documentation.</p>
          </div>
        )}
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Transfer</Label>
        <Select
          value={data.reason}
          onValueChange={(value) => onChange({ reason: value as TransferReason })}
        >
          <SelectTrigger id="reason">
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(reasonLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule */}
      <div className="space-y-3">
        <Label>Schedule</Label>
        <RadioGroup
          value={data.scheduleType}
          onValueChange={(value) => onChange({ scheduleType: value as 'now' | 'later' })}
          className="flex gap-3"
        >
          <label
            className={cn(
              "flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
              data.scheduleType === 'now'
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="now" className="sr-only" />
            <span className="font-medium text-sm">Transfer Now</span>
          </label>
          <label
            className={cn(
              "flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
              data.scheduleType === 'later'
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="later" className="sr-only" />
            <span className="font-medium text-sm">Schedule Later</span>
          </label>
        </RadioGroup>

        {data.scheduleType === 'later' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.scheduledAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.scheduledAt ? format(data.scheduledAt, "PPP p") : "Pick date and time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.scheduledAt}
                onSelect={(date) => date && onChange({ scheduledAt: date })}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions or considerations..."
          value={data.notes || ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={3}
        />
      </div>

      {/* Ordering Clinician */}
      <div className="space-y-2">
        <Label htmlFor="orderingClinician">Ordering Clinician</Label>
        <Input
          id="orderingClinician"
          value={data.orderingClinician || ""}
          onChange={(e) => onChange({ orderingClinician: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Auto-filled from current user</p>
      </div>

      {/* Insurance Pre-Auth Warning */}
      {showPreAuthWarning && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-800">Insurance Pre-Authorization Required</p>
            <p className="text-sm text-amber-700 mt-1">
              ICU/Private transfers may require insurance pre-authorization. Current tariff: ₹{currentTariff.toLocaleString()}/day
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                {data.insurancePreAuthStatus === 'approved' ? 'Approved' : 'Pending'}
              </Badge>
              <Button variant="link" size="sm" className="text-amber-700 p-0 h-auto">
                Request Pre-Auth
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cost Delta Estimate */}
      {data.costDelta !== undefined && data.costDelta !== 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Estimated Daily Cost Change</p>
            <p className="text-xs text-muted-foreground">Based on destination selection</p>
          </div>
          <p className={cn(
            "text-lg font-semibold",
            data.costDelta > 0 ? "text-red-600" : "text-green-600"
          )}>
            {data.costDelta > 0 ? "+" : ""}₹{data.costDelta.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
