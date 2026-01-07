import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BedMapItem, BedMapStatus } from '@/types/bed-map';
import { Check, User, Clock, Wrench, Sparkles, Wind, Heart, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface BedTileProps {
  bed: BedMapItem;
  isSelected?: boolean;
  onSelect?: (bed: BedMapItem) => void;
  onClick?: (bed: BedMapItem) => void;
  size?: 'sm' | 'md';
  className?: string;
  tabIndex?: number;
}

const statusConfig: Record<BedMapStatus, {
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverClass: string;
  icon?: React.ReactNode;
  label: string;
}> = {
  available: {
    bgClass: 'bg-[hsl(var(--bed-available-bg))]',
    borderClass: 'border-transparent',
    textClass: 'text-foreground',
    hoverClass: 'hover:border-[hsl(var(--bed-available-border))] hover:shadow-sm',
    label: 'Available',
  },
  occupied: {
    bgClass: 'bg-[hsl(var(--bed-occupied-bg))]',
    borderClass: 'border-[hsl(var(--bed-occupied-border))]/30',
    textClass: 'text-[hsl(var(--bed-occupied))]',
    hoverClass: 'hover:border-[hsl(var(--bed-occupied-border))]',
    icon: <User className="w-2.5 h-2.5" />,
    label: 'Occupied',
  },
  reserved: {
    bgClass: 'bg-[hsl(var(--bed-reserved-bg))]',
    borderClass: 'border-[hsl(var(--bed-reserved-border))]/30 border-dashed',
    textClass: 'text-[hsl(var(--bed-reserved))]',
    hoverClass: 'hover:border-[hsl(var(--bed-reserved-border))]',
    icon: <Clock className="w-2.5 h-2.5" />,
    label: 'Reserved',
  },
  cleaning: {
    bgClass: 'bg-[hsl(var(--bed-cleaning-bg))]',
    borderClass: 'border-[hsl(var(--bed-cleaning-border))]/30 border-dotted',
    textClass: 'text-[hsl(var(--bed-cleaning))]',
    hoverClass: '',
    icon: <Sparkles className="w-2.5 h-2.5" />,
    label: 'Cleaning',
  },
  maintenance: {
    bgClass: 'bg-[hsl(var(--bed-maintenance-bg))]',
    borderClass: 'border-[hsl(var(--bed-maintenance-border))]/30',
    textClass: 'text-[hsl(var(--bed-maintenance))]',
    hoverClass: '',
    icon: <Wrench className="w-2.5 h-2.5" />,
    label: 'Maintenance',
  },
};

const amenityIcons: Record<string, React.ReactNode> = {
  'O2': <Wind className="w-2 h-2" />,
  'Ventilator': <Wind className="w-2 h-2" />,
  'Cardiac Monitor': <Heart className="w-2 h-2" />,
  'Isolation': <AlertTriangle className="w-2 h-2" />,
};

export const BedTile = forwardRef<HTMLButtonElement, BedTileProps>(({
  bed,
  isSelected = false,
  onSelect,
  onClick,
  size = 'md',
  className,
  tabIndex = 0,
}, ref) => {
  const config = statusConfig[bed.status];
  const isSelectable = bed.status === 'available' || bed.status === 'reserved';
  const isDisabled = bed.status === 'cleaning' || bed.status === 'maintenance';
  
  const sizeClasses = size === 'sm' 
    ? 'w-9 h-9 text-[10px]' 
    : 'w-11 h-11 text-xs';
  
  const handleClick = () => {
    if (bed.status === 'occupied') {
      onClick?.(bed);
    } else if (isSelectable) {
      onSelect?.(bed);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  const getTooltipContent = () => (
    <div className="space-y-1 text-xs max-w-[200px]">
      <div className="font-semibold">Bed {bed.bedNumber}</div>
      <div className="text-muted-foreground">
        {bed.wardName} • {bed.floor}
      </div>
      <div className="font-medium">₹{bed.pricePerDay.toLocaleString()}/day</div>
      <div className="flex items-center gap-1">
        <span className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
          config.bgClass,
          config.textClass
        )}>
          {config.icon}
          {config.label}
        </span>
      </div>
      {bed.amenities.length > 0 && (
        <div className="text-muted-foreground">
          {bed.amenities.join(', ')}
        </div>
      )}
      {bed.occupant && (
        <div className="text-muted-foreground pt-1 border-t border-border">
          Patient: {bed.occupant.name}
          <br />
          Since: {formatDistanceToNow(new Date(bed.occupant.since), { addSuffix: true })}
        </div>
      )}
      {bed.lastCleanedAt && (
        <div className="text-muted-foreground">
          Last cleaned: {formatDistanceToNow(new Date(bed.lastCleanedAt), { addSuffix: true })}
        </div>
      )}
      {bed.notes && (
        <div className="text-muted-foreground italic">{bed.notes}</div>
      )}
    </div>
  );
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          tabIndex={isDisabled ? -1 : tabIndex}
          aria-pressed={isSelected}
          aria-label={`Bed ${bed.bedNumber}, ${bed.wardName}, ${bed.floor}, ${bed.type}, ₹${bed.pricePerDay} per day, ${config.label}`}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border transition-all duration-150',
            sizeClasses,
            config.bgClass,
            config.borderClass,
            config.textClass,
            !isDisabled && config.hoverClass,
            !isDisabled && 'cursor-pointer',
            isDisabled && 'opacity-60 cursor-not-allowed',
            isSelected && 'border-2 border-[hsl(var(--bed-selected-border))] bg-[hsl(var(--bed-selected-bg))] ring-2 ring-[hsl(var(--bed-focus-ring))]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--bed-focus-ring))] focus-visible:ring-offset-2',
            className
          )}
        >
          {/* Bed number */}
          <span className="font-semibold leading-none">
            {bed.bedNumber.slice(-3)}
          </span>
          
          {/* Status icon for occupied/reserved/cleaning/maintenance */}
          {config.icon && (
            <span className="absolute -top-0.5 -right-0.5">
              {config.icon}
            </span>
          )}
          
          {/* Type badge for ICU */}
          {bed.type === 'ICU' && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[hsl(var(--bed-occupied))]">
              I
            </span>
          )}
          
          {/* Selected check overlay */}
          {isSelected && (
            <span className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--bed-selected))]/10 rounded-lg">
              <Check className="w-4 h-4 text-[hsl(var(--bed-selected))]" />
            </span>
          )}
          
          {/* Occupant initials dot for occupied beds */}
          {bed.status === 'occupied' && bed.occupant && (
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[hsl(var(--bed-occupied))] text-white text-[6px] font-bold flex items-center justify-center">
              {bed.occupant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-2">
        {getTooltipContent()}
      </TooltipContent>
    </Tooltip>
  );
});

BedTile.displayName = 'BedTile';
