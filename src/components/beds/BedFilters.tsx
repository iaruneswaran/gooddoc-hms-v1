import React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { BedMapStatus, BedAmenity } from '@/types/bed-map';

interface BedFiltersProps {
  floors: string[];
  wards: string[];
  selectedFloor: string;
  selectedWard: string;
  selectedStatuses: BedMapStatus[];
  selectedTypes: string[];
  selectedAmenities: BedAmenity[];
  priceRange: [number, number];
  maxPrice: number;
  searchQuery: string;
  onFloorChange: (floor: string) => void;
  onWardChange: (ward: string) => void;
  onStatusToggle: (status: BedMapStatus) => void;
  onTypeToggle: (type: string) => void;
  onAmenityToggle: (amenity: BedAmenity) => void;
  onPriceChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const statuses: { value: BedMapStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
];

const bedTypes = ['ICU', 'HDU', 'Isolation', 'Private', 'General'];

const amenities: BedAmenity[] = ['O2', 'Ventilator', 'Negative Pressure', 'Cardiac Monitor', 'Telemetry'];

export function BedFilters({
  floors,
  wards,
  selectedFloor,
  selectedWard,
  selectedStatuses,
  selectedTypes,
  selectedAmenities,
  priceRange,
  maxPrice,
  searchQuery,
  onFloorChange,
  onWardChange,
  onStatusToggle,
  onTypeToggle,
  onAmenityToggle,
  onPriceChange,
  onSearchChange,
  onClearFilters,
  className,
}: BedFiltersProps) {
  const hasActiveFilters = 
    selectedFloor !== 'all' ||
    selectedWard !== 'all' ||
    selectedStatuses.length > 0 ||
    selectedTypes.length > 0 ||
    selectedAmenities.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    searchQuery.length > 0;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search and primary filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bed, ward, patient..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {/* Floor dropdown */}
        <Select value={selectedFloor} onValueChange={onFloorChange}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor}>{floor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Ward dropdown */}
        <Select value={selectedWard} onValueChange={onWardChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Ward" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {wards.map((ward) => (
              <SelectItem key={ward} value={ward}>{ward}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Status chips */}
        <div className="flex items-center gap-1">
          {statuses.slice(0, 3).map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatuses.includes(status.value) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors h-7',
                selectedStatuses.includes(status.value) && 'bg-primary'
              )}
              onClick={() => onStatusToggle(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
        
        {/* More filters popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              More
              {(selectedTypes.length > 0 || selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {selectedTypes.length + selectedAmenities.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              {/* Status (remaining) */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">More Status</h4>
                <div className="flex flex-wrap gap-1">
                  {statuses.slice(3).map((status) => (
                    <Badge
                      key={status.value}
                      variant={selectedStatuses.includes(status.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => onStatusToggle(status.value)}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Bed Type */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Bed Type</h4>
                <div className="flex flex-wrap gap-1">
                  {bedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => onTypeToggle(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Amenities */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Amenities</h4>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => onAmenityToggle(amenity)}
                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </h4>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={1000}
                  onValueChange={(v) => onPriceChange(v as [number, number])}
                  className="mt-2"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Clear filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-9 text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
