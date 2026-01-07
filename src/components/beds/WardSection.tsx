import React from 'react';
import { cn } from '@/lib/utils';
import { BedMapItem, WardStats } from '@/types/bed-map';
import { BedTile } from './BedTile';
import { Progress } from '@/components/ui/progress';

interface WardSectionProps {
  ward: WardStats;
  selectedBeds: string[];
  onSelectBed: (bed: BedMapItem) => void;
  onClickOccupied: (bed: BedMapItem) => void;
  searchHighlight?: string;
  className?: string;
}

export function WardSection({
  ward,
  selectedBeds,
  onSelectBed,
  onClickOccupied,
  searchHighlight,
  className,
}: WardSectionProps) {
  const occupancyPercent = (ward.occupiedBeds / ward.totalBeds) * 100;
  
  // Group beds into rows of ~8 beds with gaps to simulate aisles
  const bedsPerRow = 8;
  const bedRows: BedMapItem[][] = [];
  
  for (let i = 0; i < ward.beds.length; i += bedsPerRow) {
    bedRows.push(ward.beds.slice(i, i + bedsPerRow));
  }
  
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      {/* Ward Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {ward.wardName}
            </h3>
            <p className="text-xs text-muted-foreground">
              ₹{ward.pricePerDay.toLocaleString()}/day • {ward.occupiedBeds}/{ward.totalBeds} occupied
            </p>
          </div>
        </div>
        
        {/* Occupancy mini bar */}
        <div className="flex items-center gap-2">
          <Progress 
            value={occupancyPercent} 
            className="w-20 h-1.5"
          />
          <span className={cn(
            'text-xs font-medium tabular-nums',
            occupancyPercent > 80 ? 'text-[hsl(var(--bed-occupied))]' : 
            occupancyPercent > 50 ? 'text-[hsl(var(--bed-reserved))]' : 
            'text-[hsl(var(--bed-available))]'
          )}>
            {Math.round(occupancyPercent)}%
          </span>
        </div>
      </div>
      
      {/* Bed Grid - Theater seat style */}
      <div className="space-y-2">
        {bedRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="flex items-center gap-1.5"
            role="row"
          >
            {/* Left half */}
            <div className="flex items-center gap-1">
              {row.slice(0, 4).map((bed) => (
                <BedTile
                  key={bed.id}
                  bed={bed}
                  isSelected={selectedBeds.includes(bed.id)}
                  onSelect={onSelectBed}
                  onClick={onClickOccupied}
                  size="md"
                  className={cn(
                    searchHighlight && 
                    bed.bedNumber.toLowerCase().includes(searchHighlight.toLowerCase()) &&
                    'ring-2 ring-primary animate-pulse'
                  )}
                />
              ))}
            </div>
            
            {/* Aisle gap */}
            {row.length > 4 && (
              <div className="w-4" aria-hidden="true" />
            )}
            
            {/* Right half */}
            {row.length > 4 && (
              <div className="flex items-center gap-1">
                {row.slice(4).map((bed) => (
                  <BedTile
                    key={bed.id}
                    bed={bed}
                    isSelected={selectedBeds.includes(bed.id)}
                    onSelect={onSelectBed}
                    onClick={onClickOccupied}
                    size="md"
                    className={cn(
                      searchHighlight && 
                      bed.bedNumber.toLowerCase().includes(searchHighlight.toLowerCase()) &&
                      'ring-2 ring-primary animate-pulse'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
