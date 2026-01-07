import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";
import { formatINR } from "@/utils/currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Bed, MapPin, DollarSign, ArrowRightLeft, LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BedMapView } from "@/components/beds";
import { MainLayout } from "@/components/MainLayout";

const statusStyles: Record<BedRecord["status"], string> = {
  "Available": "bg-green-100 text-green-700",
  "Reserved": "bg-blue-100 text-blue-700",
};

const bedTypeStyles: Record<BedRecord["bedType"], string> = {
  "ICU": "bg-red-100 text-red-700",
  "HDU": "bg-orange-100 text-orange-700",
  "Ward": "bg-blue-100 text-blue-700",
  "Private": "bg-purple-100 text-purple-700",
  "Isolation": "bg-amber-100 text-amber-700",
};

type ViewMode = 'table' | 'map';

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");
  const [selectedBed, setSelectedBed] = useState<BedRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  const handleViewDetails = (row: BedRecord) => {
    setSelectedBed(row);
    setShowDetails(true);
  };

  // Get filtered data based on URL params
  let displayData = bedsAvailability;
  let displayCount = bedsAvailability.length;

  if (bedType === "icu") {
    displayData = icuBeds;
    displayCount = icuBeds.length;
  } else if (bedType === "ward") {
    displayData = wardBeds;
    displayCount = wardBeds.length;
  } else if (bedType === "rooms") {
    displayData = roomBeds;
    displayCount = roomBeds.length;
  }

  const columns: Column<BedRecord>[] = [
    { 
      key: "bedNo", 
      label: "Bed No.", 
      sortable: true,
      render: (row) => (
        <span className="font-mono font-semibold">{row.bedNo}</span>
      ),
    },
    { 
      key: "ward", 
      label: "Ward", 
      sortable: true,
      render: (row) => (
        <span className="font-medium">{row.ward}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "dailyRate",
      label: "Daily Rate",
      sortable: true,
      render: (row) => (
        <span className="font-medium">{formatINR(row.dailyRate)}</span>
      ),
    },
    {
      key: "totalPerDay",
      label: "Total/Day",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-primary">{formatINR(row.totalPerDay)}</span>
      ),
    },
    {
      key: "transferPatient",
      label: "Transfer Details",
      render: (row) => row.transferPatient ? (
        <div className="space-y-1">
          <div className="font-medium">{row.transferPatient}</div>
          <div className="text-xs text-muted-foreground">
            {row.transferFrom} → {row.transferTo}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Available", label: "Available" },
        { value: "Reserved", label: "Reserved" },
      ],
    },
    {
      key: "ward",
      label: "Ward",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "HDU", label: "HDU" },
        { value: "Ward-A", label: "Ward-A" },
        { value: "Ward-B", label: "Ward-B" },
        { value: "Ward-C", label: "Ward-C" },
        { value: "Private Wing", label: "Private Wing" },
        { value: "Isolation", label: "Isolation" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "bedType", paramValue: "icu", displayLabel: "ICU", count: icuBeds.length },
    { paramKey: "bedType", paramValue: "ward", displayLabel: "Ward", count: wardBeds.length },
    { paramKey: "bedType", paramValue: "rooms", displayLabel: "Rooms", count: roomBeds.length },
  ];

  const rowActions: RowAction<BedRecord>[] = [
    { label: "View Details", onClick: (row) => handleViewDetails(row) },
  ];

  // View Toggle Button
  const ViewToggle = () => (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('table')}
        className="gap-1.5 h-8"
      >
        <Table className="w-4 h-4" />
        Table
      </Button>
      <Button
        variant={viewMode === 'map' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('map')}
        className="gap-1.5 h-8"
      >
        <LayoutGrid className="w-4 h-4" />
        Map
      </Button>
    </div>
  );

  // If map view, render the BedMapView directly
  if (viewMode === 'map') {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Overview / Beds
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Beds Availability
              </h1>
            </div>
            <ViewToggle />
          </div>
          
          {/* Map View */}
          <BedMapView />
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <ListPageLayout
        title="Beds Availability"
        count={displayCount}
        breadcrumbs={["Overview", "Beds"]}
        columns={columns}
        data={displayData}
        filters={filters}
        rowActions={rowActions}
        urlParamFilters={urlParamFilters}
        emptyMessage="No beds found."
        searchPlaceholder="Search by bed number, ward..."
        getRowId={(row) => row.bedNo}
      />

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              Bed Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBed && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-mono font-bold text-lg text-primary">{selectedBed.bedNo}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedBed.ward}</p>
                    <p className="text-sm text-muted-foreground">{selectedBed.room} • {selectedBed.bed}</p>
                  </div>
                </div>
                <Badge className={statusStyles[selectedBed.status]}>{selectedBed.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Bed Type</p>
                  <Badge className={bedTypeStyles[selectedBed.bedType]}>{selectedBed.bedType}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ward</p>
                  <p className="text-sm font-medium">{selectedBed.ward}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="text-sm font-medium">{selectedBed.room}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bed</p>
                  <p className="text-sm font-medium">{selectedBed.bed}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Daily Rate</p>
                  <p className="text-sm font-semibold">{formatINR(selectedBed.dailyRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total per Day</p>
                  <p className="text-sm font-semibold text-primary">{formatINR(selectedBed.totalPerDay)}</p>
                </div>
              </div>

              {selectedBed.transferPatient && (
                <>
                  <Separator />
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">Transfer Details</p>
                    </div>
                    <p className="text-sm font-medium">{selectedBed.transferPatient}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedBed.transferFrom} → {selectedBed.transferTo}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BedsAvailability;
