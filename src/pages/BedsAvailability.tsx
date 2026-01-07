import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Table as TableIcon, Download, Printer } from 'lucide-react';
import { BedFilters, BedLegend, BedStatsBar, WardSection, BedSummaryPanel, OccupiedBedSheet } from '@/components/beds';
import { mockBeds, getFloorData, filterBeds, getBedStats } from '@/data/bed-map.mock';
import { BedMapItem, BedMapStatus, BedAmenity } from '@/types/bed-map';
import { toast } from 'sonner';

type ViewMode = 'map' | 'table';

export default function BedsAvailability() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState<BedMapStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<BedAmenity[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBedIds, setSelectedBedIds] = useState<string[]>([]);
  const [occupiedBedSheet, setOccupiedBedSheet] = useState<BedMapItem | null>(null);
  
  const floors = useMemo(() => [...new Set(mockBeds.map(b => b.floor))].sort(), []);
  const wards = useMemo(() => [...new Set(mockBeds.map(b => b.wardId))].sort(), []);
  
  const filteredBeds = useMemo(() => filterBeds(mockBeds, {
    floors: selectedFloor !== 'all' ? [selectedFloor] : undefined,
    wards: selectedWard !== 'all' ? [selectedWard] : undefined,
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    types: selectedTypes.length > 0 ? selectedTypes : undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    priceRange,
    search: searchQuery,
  }), [selectedFloor, selectedWard, selectedStatuses, selectedTypes, selectedAmenities, priceRange, searchQuery]);
  
  const floorData = useMemo(() => getFloorData(filteredBeds), [filteredBeds]);
  const stats = useMemo(() => getBedStats(filteredBeds), [filteredBeds]);
  const selectedBeds = useMemo(() => mockBeds.filter(b => selectedBedIds.includes(b.id)), [selectedBedIds]);
  
  const handleSelectBed = (bed: BedMapItem) => {
    setSelectedBedIds(prev => 
      prev.includes(bed.id) ? prev.filter(id => id !== bed.id) : [...prev, bed.id]
    );
  };
  
  const handleStatusToggle = (status: BedMapStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const handleAmenityToggle = (amenity: BedAmenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };
  
  const clearFilters = () => {
    setSelectedFloor('all');
    setSelectedWard('all');
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setPriceRange([0, 20000]);
    setSearchQuery('');
  };
  
  return (
    <MainLayout>
      <div className="space-y-4 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Beds Availability</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor bed occupancy across all wards</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1.5" />
              Print
            </Button>
            <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
              <Button
                variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="h-7 px-2.5"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-7 px-2.5"
              >
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur py-3 -mx-4 px-4 border-b">
          <BedFilters
            floors={floors}
            wards={wards}
            selectedFloor={selectedFloor}
            selectedWard={selectedWard}
            selectedStatuses={selectedStatuses}
            selectedTypes={selectedTypes}
            selectedAmenities={selectedAmenities}
            priceRange={priceRange}
            maxPrice={20000}
            searchQuery={searchQuery}
            onFloorChange={setSelectedFloor}
            onWardChange={setSelectedWard}
            onStatusToggle={handleStatusToggle}
            onTypeToggle={handleTypeToggle}
            onAmenityToggle={handleAmenityToggle}
            onPriceChange={setPriceRange}
            onSearchChange={setSearchQuery}
            onClearFilters={clearFilters}
          />
          
          <div className="flex items-center justify-between mt-3">
            <BedStatsBar {...stats} />
            <BedLegend compact />
          </div>
        </div>
        
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="space-y-6">
            {/* Floor Tabs */}
            <Tabs value={selectedFloor} onValueChange={setSelectedFloor}>
              <TabsList>
                <TabsTrigger value="all">All Floors</TabsTrigger>
                {floors.map(floor => (
                  <TabsTrigger key={floor} value={floor}>{floor}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Ward Sections */}
            {floorData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No beds match your filters
              </div>
            ) : (
              floorData.map(floor => (
                <div key={floor.floor} className="space-y-4">
                  {(selectedFloor === 'all') && (
                    <h2 className="text-lg font-semibold text-foreground">{floor.floor}</h2>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    {floor.wards.map(ward => (
                      <WardSection
                        key={ward.wardId}
                        ward={ward}
                        selectedBeds={selectedBedIds}
                        onSelectBed={handleSelectBed}
                        onClickOccupied={setOccupiedBedSheet}
                        searchHighlight={searchQuery}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Table View placeholder */}
        {viewMode === 'table' && (
          <div className="text-center py-12 text-muted-foreground">
            Table view coming soon. Switch to Map view to see the bed layout.
          </div>
        )}
      </div>
      
      {/* Bottom Summary Panel */}
      <BedSummaryPanel
        selectedBeds={selectedBeds}
        onRemoveBed={(id) => setSelectedBedIds(prev => prev.filter(i => i !== id))}
        onClearSelection={() => setSelectedBedIds([])}
        onAssign={() => toast.success('Opening patient assignment...')}
        onReserve={() => toast.success('Opening reservation form...')}
        onTransfer={() => toast.success('Opening transfer flow...')}
        onMarkCleaning={() => toast.success('Marked for cleaning')}
      />
      
      {/* Occupied Bed Sheet */}
      <OccupiedBedSheet
        bed={occupiedBedSheet}
        open={!!occupiedBedSheet}
        onClose={() => setOccupiedBedSheet(null)}
        onTransfer={() => { setOccupiedBedSheet(null); toast.success('Opening transfer flow...'); }}
        onRelease={() => { setOccupiedBedSheet(null); toast.success('Bed released and marked for cleaning'); }}
      />
    </MainLayout>
  );
}
