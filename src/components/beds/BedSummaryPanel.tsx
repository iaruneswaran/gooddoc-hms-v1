import { BedMapItem } from '@/data/bed-map.mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, UserPlus, CalendarCheck, ArrowRightLeft, Sparkles, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BedSummaryPanelProps {
  selectedBeds: BedMapItem[];
  onClear: () => void;
  onAssign: () => void;
  onReserve: () => void;
  onTransfer?: () => void;
  onMarkCleaning?: () => void;
  onRelease?: () => void;
}

export function BedSummaryPanel({
  selectedBeds,
  onClear,
  onAssign,
  onReserve,
  onTransfer,
  onMarkCleaning,
  onRelease,
}: BedSummaryPanelProps) {
  if (selectedBeds.length === 0) return null;

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
  const totalPerDay = selectedBeds.reduce((sum, bed) => sum + bed.pricePerDay, 0);
  
  const firstBed = selectedBeds[0];
  const isMultiple = selectedBeds.length > 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Selected beds info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Bed chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedBeds.slice(0, 3).map((bed) => (
                <Badge
                  key={bed.id}
                  variant="secondary"
                  className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {bed.floor} • {bed.wardName} • Bed {bed.bedNumber}
                </Badge>
              ))}
              {selectedBeds.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedBeds.length - 3} more
                </Badge>
              )}
            </div>
            
            {/* Details for single selection */}
            {!isMultiple && (
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground border-l border-border pl-4 ml-2">
                <span>{firstBed.type}</span>
                <span>{firstBed.roomNumber}</span>
                <span className="font-medium text-foreground">
                  {formatPrice(firstBed.pricePerDay)}/day
                </span>
                {firstBed.amenities.length > 0 && (
                  <span className="text-xs">
                    {firstBed.amenities.join(', ')}
                  </span>
                )}
              </div>
            )}
            
            {/* Total for multiple */}
            {isMultiple && (
              <div className="hidden md:block text-sm font-medium text-foreground border-l border-border pl-4 ml-2">
                Total: {formatPrice(totalPerDay)}/day
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Primary actions */}
            <Button 
              size="sm" 
              onClick={onAssign}
              className="gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Assign Patient</span>
              <span className="sm:hidden">Assign</span>
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={onReserve}
              className="gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Reserve</span>
            </Button>

            {/* Secondary actions */}
            <div className="hidden lg:flex items-center gap-2 border-l border-border pl-2 ml-1">
              {onTransfer && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onTransfer}
                  className="gap-1.5 text-muted-foreground"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Transfer
                </Button>
              )}
              
              {onMarkCleaning && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onMarkCleaning}
                  className="gap-1.5 text-muted-foreground"
                >
                  <Sparkles className="w-4 h-4" />
                  Cleaning
                </Button>
              )}
              
              {onRelease && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onRelease}
                  className="gap-1.5 text-muted-foreground"
                >
                  <Unlock className="w-4 h-4" />
                  Release
                </Button>
              )}
            </div>
            
            {/* Clear */}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
