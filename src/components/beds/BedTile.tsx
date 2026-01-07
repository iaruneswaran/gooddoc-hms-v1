import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { BedMapItem, BedStatus } from '@/data/bed-map.mock';
import { Check, Clock, Wrench, Sparkles, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface BedTileProps {
  bed: BedMapItem;
  isSelected: boolean;
  onClick: () => void;
  onRightClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const statusConfig: Record<BedStatus, {
  bg: string;
  border: string;
  hoverBorder: string;
  text: string;
  icon?: React.ReactNode;
}> = {
  available: {
    bg: 'bg-white',
    border: 'border-border',
    hoverBorder: 'hover:border-emerald-500',
    text: 'text-foreground',
  },
  occupied: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    hoverBorder: 'hover:border-red-400',
    text: 'text-red-700',
    icon: <User className="w-2.5 h-2.5" />,
  },
  reserved: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    hoverBorder: 'hover:border-amber-400',
    text: 'text-amber-700',
    icon: <Clock className="w-2.5 h-2.5" />,
  },
  cleaning: {
    bg: 'bg-blue-50',
    border: 'border-blue-300 border-dashed',
    hoverBorder: 'hover:border-blue-400',
    text: 'text-blue-700',
    icon: <Sparkles className="w-2.5 h-2.5" />,
  },
  maintenance: {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    hoverBorder: '',
    text: 'text-gray-500',
    icon: <Wrench className="w-2.5 h-2.5" />,
  },
};

const typeAbbrev: Record<string, string> = {
  ICU: 'I',
  HDU: 'H',
  Ward: 'W',
  Private: 'P',
  Isolation: 'Is',
};

export const BedTile = forwardRef<HTMLButtonElement, BedTileProps>(
  ({ bed, isSelected, onClick, onRightClick, disabled }, ref) => {
    const config = statusConfig[bed.status];
    const isDisabled = disabled || bed.status === 'maintenance';
    const isSelectable = bed.status === 'available' || bed.status === 'reserved';
    
    const formatPrice = (price: number) => 
      `₹${price.toLocaleString('en-IN')}`;
    
    const getTooltipContent = () => {
      const lines = [
        `Bed ${bed.bedNumber} — ${bed.wardName}`,
        `${bed.type} • ${formatPrice(bed.pricePerDay)}/day`,
        `Status: ${bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}`,
      ];
      
      if (bed.amenities.length > 0) {
        lines.push(`Amenities: ${bed.amenities.join(', ')}`);
      }
      
      if (bed.lastCleanedAt) {
        lines.push(`Last cleaned: ${formatDistanceToNow(new Date(bed.lastCleanedAt), { addSuffix: true })}`);
      }
      
      if (bed.occupant) {
        lines.push(`Patient: ${bed.occupant.name}`);
        if (bed.occupant.diagnosis) {
          lines.push(`Diagnosis: ${bed.occupant.diagnosis}`);
        }
      }
      
      if (bed.notes) {
        lines.push(`Note: ${bed.notes}`);
      }
      
      return lines;
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            onClick={onClick}
            onContextMenu={onRightClick}
            disabled={isDisabled}
            aria-pressed={isSelected}
            aria-label={`Bed ${bed.bedNumber}, ${bed.wardName}, ${bed.floorName}, ${bed.type}, ${formatPrice(bed.pricePerDay)} per day, ${bed.status}`}
            className={cn(
              'relative w-10 h-10 md:w-11 md:h-11 rounded-lg border-2 transition-all duration-200 ease-out',
              'flex flex-col items-center justify-center gap-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
              config.bg,
              config.border,
              config.text,
              !isDisabled && config.hoverBorder,
              isSelected && 'border-blue-600 bg-blue-50 ring-2 ring-blue-200',
              isDisabled && 'cursor-not-allowed opacity-60',
              !isDisabled && isSelectable && 'cursor-pointer hover:shadow-sm',
              !isDisabled && !isSelectable && 'cursor-pointer',
            )}
          >
            {/* Bed number */}
            <span className="text-[10px] md:text-xs font-semibold leading-none">
              {bed.bedNumber.slice(-2)}
            </span>
            
            {/* Status icon or type badge */}
            <span className="flex items-center gap-0.5">
              {config.icon || (
                <span className="text-[8px] font-medium opacity-60">
                  {typeAbbrev[bed.type]}
                </span>
              )}
              {bed.amenities.includes('O2') && (
                <span className="text-[6px] font-bold text-blue-600">O₂</span>
              )}
            </span>
            
            {/* Selected checkmark overlay */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
            
            {/* Occupant initials for occupied beds */}
            {bed.status === 'occupied' && bed.occupant && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">
                  {bed.occupant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 space-y-1"
        >
          {getTooltipContent().map((line, i) => (
            <p key={i} className={cn(
              'text-xs',
              i === 0 && 'font-semibold text-sm'
            )}>
              {line}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    );
  }
);

BedTile.displayName = 'BedTile';
