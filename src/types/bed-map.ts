// Bed Map Types
export type BedMapStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';

export interface BedOccupant {
  id: string;
  name: string;
  since: string; // ISO date
  acuity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface BedMapItem {
  id: string;
  bedNumber: string;
  floor: string;
  wardId: string;
  wardName: string;
  type: 'ICU' | 'HDU' | 'Isolation' | 'Private' | 'General';
  pricePerDay: number;
  amenities: BedAmenity[];
  status: BedMapStatus;
  occupant: BedOccupant | null;
  lastCleanedAt: string | null;
  notes: string;
}

export type BedAmenity = 'O2' | 'Ventilator' | 'Negative Pressure' | 'Cardiac Monitor' | 'Telemetry' | 'Isolation';

export interface WardStats {
  wardId: string;
  wardName: string;
  floor: string;
  type: string;
  pricePerDay: number;
  totalBeds: number;
  occupiedBeds: number;
  beds: BedMapItem[];
}

export interface FloorData {
  floor: string;
  wards: WardStats[];
}

export interface BedFilters {
  floors: string[];
  wards: string[];
  statuses: BedMapStatus[];
  types: string[];
  priceRange: [number, number];
  amenities: BedAmenity[];
  search: string;
}

export interface BedSelection {
  bedId: string;
  bedNumber: string;
  floor: string;
  wardName: string;
  type: string;
  pricePerDay: number;
  status: BedMapStatus;
  amenities: BedAmenity[];
  lastCleanedAt: string | null;
  notes: string;
}
