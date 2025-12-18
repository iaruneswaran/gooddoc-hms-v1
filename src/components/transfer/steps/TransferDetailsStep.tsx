import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { TransferRequest, TransferType, TransferReason, BedLocation, Bed } from "@/types/transfer";
import { transferTypeLabels, reasonLabels, mockUnits, mockBeds } from "@/data/transfer.mock";

interface TransferDetailsStepProps {
  data: Partial<TransferRequest>;
  onChange: (data: Partial<TransferRequest>) => void;
  currentTariff: number;
  fromLocation: BedLocation;
  onSelectBed: (bed: Bed) => void;
}

export function TransferDetailsStep({ data, onChange, currentTariff, fromLocation, onSelectBed }: TransferDetailsStepProps) {
  // Auto-fill ordering clinician
  useEffect(() => {
    if (!data.orderingClinician) {
      onChange({ orderingClinician: "Dr. Meera Nair" });
    }
  }, []);

  // Get available units for destination
  const availableUnits = useMemo(() => {
    return mockUnits.filter(unit => unit.availableBeds > 0);
  }, []);

  // Get available beds for selected unit
  const availableBeds = useMemo(() => {
    if (!data.toLocation?.unitId) return [];
    return mockBeds.filter(
      bed => bed.unitId === data.toLocation?.unitId && bed.status === 'available'
    );
  }, [data.toLocation?.unitId]);

  const handleUnitChange = (unitId: string) => {
    const unit = mockUnits.find(u => u.id === unitId);
    if (unit) {
      onChange({
        toLocation: {
          unitId: unit.id,
          unitName: unit.name,
          roomId: "",
          roomName: "",
          bedId: "",
          bedName: "",
        },
        costDelta: undefined,
      });
    }
  };

  const handleBedChange = (bedId: string) => {
    const bed = mockBeds.find(b => b.id === bedId);
    if (bed) {
      onChange({
        toLocation: {
          unitId: bed.unitId,
          unitName: bed.unitName,
          roomId: bed.roomId,
          roomName: bed.roomName,
          bedId: bed.id,
          bedName: bed.bedName,
        },
        costDelta: bed.tariff - currentTariff,
      });
      onSelectBed(bed);
    }
  };

  return (
    <div className="space-y-6">
      {/* From & To Location */}
      <div className="grid grid-cols-2 gap-6">
        {/* From Location (Read-only) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            From Location
          </Label>
          <div className="h-10 px-3 py-2 rounded-md border border-border bg-muted/50 flex items-center text-sm text-foreground">
            {fromLocation.unitName} • {fromLocation.roomName} • {fromLocation.bedName}
          </div>
          <p className="text-xs text-muted-foreground">Patient's current location</p>
        </div>

        {/* To Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            To Location
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {/* Ward Select */}
            <Select
              value={data.toLocation?.unitId || ""}
              onValueChange={handleUnitChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.availableBeds} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Bed Select */}
            <Select
              value={data.toLocation?.bedId || ""}
              onValueChange={handleBedChange}
              disabled={!data.toLocation?.unitId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bed" />
              </SelectTrigger>
              <SelectContent>
                {availableBeds.map((bed) => (
                  <SelectItem key={bed.id} value={bed.id}>
                    {bed.bedName} • {bed.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {data.toLocation?.bedId && (
            <p className="text-xs text-muted-foreground">
              {data.toLocation.unitName} • {data.toLocation.roomName} • {data.toLocation.bedName}
            </p>
          )}
        </div>
      </div>

      {/* Transfer Type & Reason - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
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