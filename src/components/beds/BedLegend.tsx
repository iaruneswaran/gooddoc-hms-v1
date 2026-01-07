import React from 'react';
import { cn } from '@/lib/utils';

interface LegendItem {
  status: string;
  label: string;
  bgClass: string;
  borderClass: string;
}

const legendItems: LegendItem[] = [
  { 
    status: 'available', 
    label: 'Available', 
    bgClass: 'bg-[hsl(var(--bed-available-bg))]',
    borderClass: 'border-[hsl(var(--bed-available-border))]',
  },
  { 
    status: 'occupied', 
    label: 'Occupied', 
    bgClass: 'bg-[hsl(var(--bed-occupied-bg))]',
    borderClass: 'border-[hsl(var(--bed-occupied-border))]',
  },
  { 
    status: 'reserved', 
    label: 'Reserved', 
    bgClass: 'bg-[hsl(var(--bed-reserved-bg))]',
    borderClass: 'border-[hsl(var(--bed-reserved-border))] border-dashed',
  },
  { 
    status: 'cleaning', 
    label: 'Cleaning', 
    bgClass: 'bg-[hsl(var(--bed-cleaning-bg))]',
    borderClass: 'border-[hsl(var(--bed-cleaning-border))] border-dotted',
  },
  { 
    status: 'maintenance', 
    label: 'Maintenance', 
    bgClass: 'bg-[hsl(var(--bed-maintenance-bg))]',
    borderClass: 'border-[hsl(var(--bed-maintenance-border))]',
  },
];

interface BedLegendProps {
  className?: string;
  compact?: boolean;
}

export function BedLegend({ className, compact = false }: BedLegendProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 flex-wrap',
      className
    )}>
      {legendItems.map((item) => (
        <div 
          key={item.status}
          className="flex items-center gap-1.5"
        >
          <span 
            className={cn(
              'rounded border',
              item.bgClass,
              item.borderClass,
              compact ? 'w-3 h-3' : 'w-4 h-4'
            )}
            aria-hidden="true"
          />
          <span className={cn(
            'text-muted-foreground',
            compact ? 'text-[10px]' : 'text-xs'
          )}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
