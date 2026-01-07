import React from 'react';
import { cn } from '@/lib/utils';
import { X, User, Calendar, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BedMapItem } from '@/types/bed-map';
import { formatDistanceToNow, format } from 'date-fns';

interface OccupiedBedSheetProps {
  bed: BedMapItem | null;
  open: boolean;
  onClose: () => void;
  onTransfer?: (bed: BedMapItem) => void;
  onRelease?: (bed: BedMapItem) => void;
}

export function OccupiedBedSheet({
  bed,
  open,
  onClose,
  onTransfer,
  onRelease,
}: OccupiedBedSheetProps) {
  if (!bed) return null;
  
  const acuityColors: Record<string, string> = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };
  
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>Bed {bed.bedNumber}</span>
            <Badge variant="secondary" className="bg-[hsl(var(--bed-occupied-bg))] text-[hsl(var(--bed-occupied))]">
              Occupied
            </Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Bed Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Bed Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Floor</span>
                <p className="font-medium">{bed.floor}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ward</span>
                <p className="font-medium">{bed.wardName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type</span>
                <p className="font-medium">{bed.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rate</span>
                <p className="font-medium">₹{bed.pricePerDay.toLocaleString()}/day</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Amenities</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bed.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Patient Info */}
          {bed.occupant && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground">Patient Information</h4>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{bed.occupant.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {bed.occupant.id}</p>
                  </div>
                  {bed.occupant.acuity && (
                    <Badge className={cn('text-xs', acuityColors[bed.occupant.acuity])}>
                      {bed.occupant.acuity.charAt(0).toUpperCase() + bed.occupant.acuity.slice(1)}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Admitted {formatDistanceToNow(new Date(bed.occupant.since), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(bed.occupant.since), 'PPP p')}
                </p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => bed && onTransfer?.(bed)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Transfer Patient
            </Button>
            <Button
              className="w-full justify-start text-destructive hover:text-destructive"
              variant="outline"
              onClick={() => bed && onRelease?.(bed)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Release & Mark for Cleaning
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
