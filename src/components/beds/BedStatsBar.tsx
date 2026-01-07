import React from 'react';
import { cn } from '@/lib/utils';

interface BedStatsBarProps {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning?: number;
  maintenance?: number;
  className?: string;
}

export function BedStatsBar({
  total,
  available,
  occupied,
  reserved,
  cleaning = 0,
  maintenance = 0,
  className,
}: BedStatsBarProps) {
  const stats = [
    { label: 'Total', value: total, colorClass: 'text-foreground' },
    { label: 'Available', value: available, colorClass: 'text-[hsl(var(--bed-available))]' },
    { label: 'Occupied', value: occupied, colorClass: 'text-[hsl(var(--bed-occupied))]' },
    { label: 'Reserved', value: reserved, colorClass: 'text-[hsl(var(--bed-reserved))]' },
  ];
  
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50"
        >
          <span className={cn('text-sm font-semibold tabular-nums', stat.colorClass)}>
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
