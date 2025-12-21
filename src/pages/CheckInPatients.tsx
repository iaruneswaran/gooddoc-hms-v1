import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";
import { bedChargesData, BedChargeRecord } from "@/data/bed-charges.mock";
import { BedDouble, IndianRupee } from "lucide-react";

const statusStyles: Record<BedRecord["status"], string> = {
  "Available": "bg-green-100 text-green-700",
  "Cleaning": "bg-amber-100 text-amber-700",
  "Reserved": "bg-blue-100 text-blue-700",
  "Blocked": "bg-red-100 text-red-700",
};

const bedTypeStyles: Record<BedRecord["bedType"], string> = {
  "ICU": "bg-red-100 text-red-700",
  "HDU": "bg-orange-100 text-orange-700",
  "Ward": "bg-blue-100 text-blue-700",
  "Private": "bg-purple-100 text-purple-700",
  "Isolation": "bg-yellow-100 text-yellow-700",
};

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");
  const [activeTab, setActiveTab] = useState<"availability" | "charges">(
    searchParams.get("view") === "charges" ? "charges" : "availability"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as "availability" | "charges");
    const newParams = new URLSearchParams(searchParams);
    if (value === "charges") {
      newParams.set("view", "charges");
    } else {
      newParams.delete("view");
    }
    setSearchParams(newParams);
  };

  // Beds Availability Data
  let availabilityData = bedsAvailability;
  let displayCount = bedsAvailability.length;

  if (bedType === "icu") {
    availabilityData = icuBeds;
    displayCount = icuBeds.length;
  } else if (bedType === "ward") {
    availabilityData = wardBeds;
    displayCount = wardBeds.length;
  } else if (bedType === "rooms") {
    availabilityData = roomBeds;
    displayCount = roomBeds.length;
  }

  // Availability Columns
  const availabilityColumns: Column<BedRecord>[] = [
    { key: "ward", label: "Ward", sortable: true },
    { key: "room", label: "Room", sortable: true },
    { key: "bed", label: "Bed", sortable: true },
    {
      key: "bedType",
      label: "Bed Type",
      sortable: true,
      render: (row) => (
        <Badge className={bedTypeStyles[row.bedType]}>{row.bedType}</Badge>
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
      key: "lastDischargedAt",
      label: "Last Discharged At",
      render: (row) => {
        if (!row.lastDischargedAt) return "—";
        const [date, time] = row.lastDischargedAt.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      },
    },
    {
      key: "cleaningETA",
      label: "Cleaning ETA",
      render: (row) => {
        if (!row.cleaningETA) return "—";
        const [date, time] = row.cleaningETA.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      },
    },
    {
      key: "isolationCapability",
      label: "Isolation Capable",
      render: (row) => row.isolationCapability ? (
        <Badge className="bg-green-100 text-green-700">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
    {
      key: "reservedFor",
      label: "Reserved For",
      render: (row) => row.reservedFor || "—",
    },
  ];

  const availabilityFilters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Available", label: "Available" },
        { value: "Cleaning", label: "Cleaning" },
        { value: "Reserved", label: "Reserved" },
        { value: "Blocked", label: "Blocked" },
      ],
    },
    {
      key: "bedType",
      label: "Bed Type",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "HDU", label: "HDU" },
        { value: "Ward", label: "Ward" },
        { value: "Private", label: "Private" },
        { value: "Isolation", label: "Isolation" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "bedType", paramValue: "icu", displayLabel: "ICU", count: icuBeds.length },
    { paramKey: "bedType", paramValue: "ward", displayLabel: "Ward", count: wardBeds.length },
    { paramKey: "bedType", paramValue: "rooms", displayLabel: "Rooms", count: roomBeds.length },
  ];

  const availabilityRowActions: RowAction<BedRecord>[] = [
    { label: "Reserve Bed", onClick: (row) => console.log("Reserve", row.ward, row.room, row.bed) },
    { label: "Mark Cleaning", onClick: (row) => console.log("Mark Cleaning", row.ward, row.room, row.bed) },
    { label: "Block Bed", onClick: (row) => console.log("Block", row.ward, row.room, row.bed) },
  ];

  // Bed Charges Columns
  const chargesColumns: Column<BedChargeRecord>[] = [
    { 
      key: "bedType", 
      label: "Bed Type", 
      sortable: true,
      width: "200px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.bedType}</span>
          <span className="text-muted-foreground text-xs">{row.ward}</span>
        </div>
      )
    },
    { 
      key: "roomCategory", 
      label: "Category",
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="font-normal">{row.roomCategory}</Badge>
      )
    },
    { 
      key: "dailyRate", 
      label: "Daily Rate", 
      sortable: true,
      render: (row) => (
        <span className="font-medium">{formatCurrency(row.dailyRate)}</span>
      )
    },
    { 
      key: "nursingCharge", 
      label: "Nursing", 
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatCurrency(row.nursingCharge)}</span>
      )
    },
    { 
      key: "serviceCharge", 
      label: "Service", 
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatCurrency(row.serviceCharge)}</span>
      )
    },
    { 
      key: "totalPerDay", 
      label: "Total/Day", 
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-primary">{formatCurrency(row.totalPerDay)}</span>
      )
    },
    { 
      key: "occupancy", 
      label: "Occupancy", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.occupancy}/{row.totalBeds}</span>
          <span className="text-muted-foreground text-xs">{row.totalBeds - row.occupancy} available</span>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={row.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const chargesFilters: Filter[] = [
    {
      key: "roomCategory",
      label: "Category",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "HDU", label: "HDU" },
        { value: "Private", label: "Private" },
        { value: "Semi-Private", label: "Semi-Private" },
        { value: "General", label: "General" },
        { value: "PICU", label: "PICU" },
        { value: "NICU", label: "NICU" },
        { value: "Maternity", label: "Maternity" },
        { value: "Emergency", label: "Emergency" },
        { value: "Day Care", label: "Day Care" },
        { value: "Isolation", label: "Isolation" },
        { value: "VIP", label: "VIP" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ];

  const chargesRowActions: RowAction<BedChargeRecord>[] = [
    { label: "Edit Charges", onClick: (row) => console.log("Edit", row.id) },
    { label: "View History", onClick: (row) => console.log("History", row.id) },
  ];

  // Custom header with tabs
  const tabsHeader = (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
      <TabsList className="h-9 p-1 bg-muted/50">
        <TabsTrigger value="availability" className="gap-2 text-xs px-3">
          <BedDouble className="w-3.5 h-3.5" />
          Availability
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
            {bedsAvailability.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="charges" className="gap-2 text-xs px-3">
          <IndianRupee className="w-3.5 h-3.5" />
          Charges Master
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
            {bedChargesData.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  if (activeTab === "charges") {
    return (
      <ListPageLayout
        title="Beds"
        count={bedChargesData.length}
        breadcrumbs={["Overview", "Beds"]}
        columns={chargesColumns}
        data={bedChargesData}
        filters={chargesFilters}
        rowActions={chargesRowActions}
        emptyMessage="No bed charges found."
        searchPlaceholder="Search by bed type, ward, category..."
        getRowId={(row) => row.id}
        onRowClick={(row) => console.log("View details", row.id)}
        customHeaderContent={tabsHeader}
      />
    );
  }

  return (
    <ListPageLayout
      title="Beds"
      count={displayCount}
      breadcrumbs={["Overview", "Beds"]}
      columns={availabilityColumns}
      data={availabilityData}
      filters={availabilityFilters}
      rowActions={availabilityRowActions}
      urlParamFilters={activeTab === "availability" ? urlParamFilters : undefined}
      emptyMessage="No beds found."
      searchPlaceholder="Search by ward, room, bed..."
      getRowId={(row) => `${row.ward}-${row.room}-${row.bed}`}
      customHeaderContent={tabsHeader}
    />
  );
};

export default BedsAvailability;