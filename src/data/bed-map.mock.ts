import { BedMapItem, FloorData, WardStats } from '@/types/bed-map';

// Generate comprehensive mock bed data
export const generateMockBeds = (): BedMapItem[] => {
  const beds: BedMapItem[] = [];
  
  const floors = ['F1', 'F2', 'F3', 'F4'];
  const wardConfigs = [
    { id: 'ICU', name: 'ICU', type: 'ICU' as const, price: 15000, bedsPerRoom: 4, rooms: 3 },
    { id: 'HDU', name: 'HDU', type: 'HDU' as const, price: 10000, bedsPerRoom: 4, rooms: 2 },
    { id: 'GEN-A', name: 'General Ward A', type: 'General' as const, price: 3000, bedsPerRoom: 6, rooms: 4 },
    { id: 'GEN-B', name: 'General Ward B', type: 'General' as const, price: 3000, bedsPerRoom: 6, rooms: 4 },
    { id: 'ISO', name: 'Isolation Ward', type: 'Isolation' as const, price: 8000, bedsPerRoom: 2, rooms: 4 },
    { id: 'PVT', name: 'Private Wing', type: 'Private' as const, price: 12000, bedsPerRoom: 1, rooms: 8 },
  ];
  
  const statuses: BedMapItem['status'][] = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'];
  const statusWeights = [0.35, 0.45, 0.08, 0.08, 0.04];
  
  const amenitiesByType: Record<string, BedMapItem['amenities']> = {
    ICU: ['O2', 'Ventilator', 'Cardiac Monitor'],
    HDU: ['O2', 'Cardiac Monitor', 'Telemetry'],
    Isolation: ['O2', 'Negative Pressure', 'Isolation'],
    Private: ['O2', 'Telemetry'],
    General: ['O2'],
  };
  
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Anjali Mehta', 'Rajesh Verma', 'Pooja Reddy'];
  
  const getRandomStatus = (): BedMapItem['status'] => {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < statusWeights.length; i++) {
      cumulative += statusWeights[i];
      if (rand < cumulative) return statuses[i];
    }
    return 'available';
  };
  
  floors.forEach((floor) => {
    const floorWards = floor === 'F1' 
      ? wardConfigs.filter(w => ['GEN-A', 'GEN-B'].includes(w.id))
      : floor === 'F2'
      ? wardConfigs.filter(w => ['GEN-A', 'GEN-B', 'ISO'].includes(w.id))
      : floor === 'F3'
      ? wardConfigs.filter(w => ['ICU', 'HDU'].includes(w.id))
      : wardConfigs.filter(w => ['PVT', 'ISO'].includes(w.id));
    
    floorWards.forEach((ward) => {
      let bedCounter = 1;
      for (let room = 1; room <= ward.rooms; room++) {
        for (let bed = 1; bed <= ward.bedsPerRoom; bed++) {
          const bedNumber = `${floor.substring(1)}${ward.id.substring(0, 2).toUpperCase()}${String(bedCounter).padStart(3, '0')}`;
          const status = getRandomStatus();
          
          const bedItem: BedMapItem = {
            id: `${floor}-${ward.id}-${bedNumber}`,
            bedNumber,
            floor,
            wardId: ward.id,
            wardName: ward.name,
            type: ward.type,
            pricePerDay: ward.price + (Math.random() > 0.7 ? 2000 : 0),
            amenities: amenitiesByType[ward.type] || ['O2'],
            status,
            occupant: status === 'occupied' ? {
              id: `P${Math.floor(Math.random() * 10000)}`,
              name: names[Math.floor(Math.random() * names.length)],
              since: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              acuity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
            } : null,
            lastCleanedAt: status === 'cleaning' || status === 'available' 
              ? new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString() 
              : null,
            notes: status === 'maintenance' ? 'Scheduled maintenance - bed repair' : '',
          };
          
          beds.push(bedItem);
          bedCounter++;
        }
      }
    });
  });
  
  return beds;
};

export const mockBeds = generateMockBeds();

export const getFloorData = (beds: BedMapItem[]): FloorData[] => {
  const floorsMap = new Map<string, Map<string, BedMapItem[]>>();
  
  beds.forEach((bed) => {
    if (!floorsMap.has(bed.floor)) {
      floorsMap.set(bed.floor, new Map());
    }
    const wardMap = floorsMap.get(bed.floor)!;
    if (!wardMap.has(bed.wardId)) {
      wardMap.set(bed.wardId, []);
    }
    wardMap.get(bed.wardId)!.push(bed);
  });
  
  const floorData: FloorData[] = [];
  
  floorsMap.forEach((wardsMap, floor) => {
    const wards: WardStats[] = [];
    wardsMap.forEach((wardBeds, wardId) => {
      const firstBed = wardBeds[0];
      wards.push({
        wardId,
        wardName: firstBed.wardName,
        floor,
        type: firstBed.type,
        pricePerDay: Math.min(...wardBeds.map(b => b.pricePerDay)),
        totalBeds: wardBeds.length,
        occupiedBeds: wardBeds.filter(b => b.status === 'occupied').length,
        beds: wardBeds.sort((a, b) => a.bedNumber.localeCompare(b.bedNumber)),
      });
    });
    floorData.push({
      floor,
      wards: wards.sort((a, b) => a.wardName.localeCompare(b.wardName)),
    });
  });
  
  return floorData.sort((a, b) => a.floor.localeCompare(b.floor));
};

export const filterBeds = (beds: BedMapItem[], filters: {
  floors?: string[];
  wards?: string[];
  statuses?: string[];
  types?: string[];
  priceRange?: [number, number];
  amenities?: string[];
  search?: string;
}): BedMapItem[] => {
  return beds.filter((bed) => {
    if (filters.floors?.length && !filters.floors.includes(bed.floor)) return false;
    if (filters.wards?.length && !filters.wards.includes(bed.wardId)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(bed.status)) return false;
    if (filters.types?.length && !filters.types.includes(bed.type)) return false;
    if (filters.priceRange) {
      if (bed.pricePerDay < filters.priceRange[0] || bed.pricePerDay > filters.priceRange[1]) return false;
    }
    if (filters.amenities?.length) {
      if (!filters.amenities.some(a => bed.amenities.includes(a as any))) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        bed.bedNumber.toLowerCase().includes(searchLower) ||
        bed.wardName.toLowerCase().includes(searchLower) ||
        bed.floor.toLowerCase().includes(searchLower) ||
        bed.occupant?.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

export const getBedStats = (beds: BedMapItem[]) => {
  return {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    reserved: beds.filter(b => b.status === 'reserved').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };
};
