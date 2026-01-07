import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, User, Calendar, Sparkles, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BedMapItem, BedSelection } from '@/types/bed-map';
import { formatDistanceToNow } from 'date-fns';

interface BedSummaryPanelProps {
  selectedBeds: BedMapItem[];
  onRemoveBed: (bedId: string) => void;
  onClearSelection: () => void;
  onAssign: () => void;
  onReserve: () => void;
  onTransfer?: () => void;
  onMarkCleaning?: () => void;
  className?: string;
}

export function BedSummaryPanel({
  selectedBeds,
  onRemoveBed,
  onClearSelection,
  onAssign,
  onReserve,
  onTransfer,
  onMarkCleaning,
  className,
}: BedSummaryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (selectedBeds.length === 0) return null;
  
  const totalPricePerDay = selectedBeds.reduce((sum, bed) => sum + bed.pricePerDay, 0);
  const firstBed = selectedBeds[0];
  
  return (
    <div 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-card/95 backdrop-blur-lg border-t border-border shadow-lg',
        'transition-all duration-200 ease-out',
        isExpanded ? 'py-4' : 'py-2',
        className
      )}
    >
      <div className="container max-w-7xl mx-auto px-4">
        {/* Collapsed bar */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between py-1 group"
          >
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedBeds.length} bed{selectedBeds.length > 1 ? 's' : ''} selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                ₹{totalPricePerDay.toLocaleString()}/day
              </span>
            </div>
            <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        )}
        
        {/* Expanded panel */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {selectedBeds.length} bed{selectedBeds.length > 1 ? 's' : ''} selected
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </Button>
            </div>
            
            <div className="flex items-start gap-6">
              {/* Selected beds chips */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  {selectedBeds.map((bed) => (
                    <Badge
                      key={bed.id}
                      variant="secondary"
                      className="gap-1.5 py-1.5 px-2.5 bg-muted"
                    >
                      <span className="font-mono text-xs">{bed.floor}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{bed.wardName}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-semibold">Bed {bed.bedNumber}</span>
                      <button
                        onClick={() => onRemoveBed(bed.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {/* Details for single selection */}
                {selectedBeds.length === 1 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Floor</span>
                      <p className="font-medium">{firstBed.floor}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ward</span>
                      <p className="font-medium">{firstBed.wardName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type</span>
                      <p className="font-medium">{firstBed.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amenities</span>
                      <p className="font-medium">{firstBed.amenities.join(', ') || 'None'}</p>
                    </div>
                    {firstBed.lastCleanedAt && (
                      <div>
                        <span className="text-muted-foreground">Last Cleaned</span>
                        <p className="font-medium">
                          {formatDistanceToNow(new Date(firstBed.lastCleanedAt), { addSuffix: true })}
                        </p>
                      </div>
                    )}
                    {firstBed.notes && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Notes</span>
                        <p className="font-medium">{firstBed.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Price and actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl font-semibold tabular-nums">
                    ₹{totalPricePerDay.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {onTransfer && (
                    <Button variant="outline" size="sm" onClick={onTransfer}>
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Transfer
                    </Button>
                  )}
                  {onMarkCleaning && (
                    <Button variant="outline" size="sm" onClick={onMarkCleaning}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Cleaning
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={onReserve}>
                    <Calendar className="w-4 h-4 mr-1" />
                    Reserve
                  </Button>
                  <Button size="sm" onClick={onAssign}>
                    <User className="w-4 h-4 mr-1" />
                    Assign Patient
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
