import { useEffect, useMemo } from "react";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransferRequest, TransferReason, BedLocation, Bed } from "@/types/transfer";
import { reasonLabels, mockUnits, mockBeds } from "@/data/transfer.mock";

interface TransferDetailsStepProps {
  data: Partial<TransferRequest>;
  onChange: (data: Partial<TransferRequest>) => void;
  currentTariff: number;
  fromLocation: BedLocation;
  onSelectBed: (bed: Bed) => void;
}

export function TransferDetailsStep({ data, onChange, fromLocation, onSelectBed }: TransferDetailsStepProps) {
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

      {/* Ordering Clinician & Reason - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Ordering Clinician */}
        <div className="space-y-2">
          <Label htmlFor="orderingClinician">Ordering Clinician</Label>
          <Select
            value={data.orderingClinician || ""}
            onValueChange={(value) => onChange({ orderingClinician: value })}
          >
            <SelectTrigger id="orderingClinician">
              <SelectValue placeholder="Select clinician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Meera Nair">Dr. Meera Nair</SelectItem>
              <SelectItem value="Dr. Arun Sharma">Dr. Arun Sharma</SelectItem>
              <SelectItem value="Dr. Priya Patel">Dr. Priya Patel</SelectItem>
              <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
              <SelectItem value="Dr. Sunita Reddy">Dr. Sunita Reddy</SelectItem>
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
    </div>
  );
}