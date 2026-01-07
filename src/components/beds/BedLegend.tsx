import { cn } from '@/lib/utils';

interface LegendItem {
  status: string;
  label: string;
  bgClass: string;
  borderClass: string;
}

const legendItems: LegendItem[] = [
  { status: 'available', label: 'Available', bgClass: 'bg-white', borderClass: 'border-emerald-500' },
  { status: 'occupied', label: 'Occupied', bgClass: 'bg-red-50', borderClass: 'border-red-400' },
  { status: 'reserved', label: 'Reserved', bgClass: 'bg-amber-50', borderClass: 'border-amber-400' },
  { status: 'cleaning', label: 'Cleaning', bgClass: 'bg-blue-50', borderClass: 'border-blue-400 border-dashed' },
  { status: 'maintenance', label: 'Maintenance', bgClass: 'bg-gray-100', borderClass: 'border-gray-400' },
];

export function BedLegend() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {legendItems.map((item) => (
        <div key={item.status} className="flex items-center gap-1.5">
          <div 
            className={cn(
              'w-4 h-4 rounded border-2',
              item.bgClass,
              item.borderClass
            )} 
          />
          <span className="text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
