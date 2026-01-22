import { BedMapItem } from '@/data/bed-map.mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Calendar, 
  ArrowRightLeft, 
  BedDouble
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface OccupiedBedSheetProps {
  bed: BedMapItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransfer?: () => void;
  onRelease?: () => void;
}

export function OccupiedBedSheet({
  bed,
  open,
  onOpenChange,
  onTransfer,
}: OccupiedBedSheetProps) {
  if (!bed || !bed.occupant) return null;

  const { occupant } = bed;
  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
  const admittedDate = new Date(occupant.since);
  const stayDuration = formatDistanceToNow(admittedDate, { addSuffix: false });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-red-600" />
            </div>
            <span>Occupied Bed Details</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Bed Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                Bed {bed.bedNumber}
              </span>
              <Badge variant="destructive" className="text-xs">
                Occupied
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{bed.floorName}</span>
              <span>•</span>
              <span>{bed.wardName}</span>
              <span>•</span>
              <span>{bed.type}</span>
            </div>
            <div className="text-sm font-medium">
              {formatPrice(bed.pricePerDay)}/day
            </div>
          </div>

          <Separator />

          {/* Patient Info */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" alt="Priya Sharma" />
                  <AvatarFallback className="bg-pink-100 text-pink-700">PS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">GDID - 001 • 61 | F</p>
                </div>
              </div>

              {/* Attending Doctor */}
              {occupant.attendingDoctor && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Attending:</span>
                  <span className="text-sm font-medium">{occupant.attendingDoctor}</span>
                </div>
              )}

              {/* Admission Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Admitted:</span>
                <span className="text-sm font-medium">
                  {format(admittedDate, 'dd MMM yyyy, HH:mm')}
                </span>
              </div>

              {/* Length of Stay */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  <span className="font-semibold">{stayDuration}</span> stay so far
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={onTransfer}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transfer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
