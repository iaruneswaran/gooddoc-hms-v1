import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";

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

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");

  let data = bedsAvailability;
  let displayCount = bedsAvailability.length;
  let pageTitle = "Beds Availability";

  if (bedType === "icu") {
    data = icuBeds;
    displayCount = icuBeds.length;
    pageTitle = "ICU Beds";
  } else if (bedType === "ward") {
    data = wardBeds;
    displayCount = wardBeds.length;
    pageTitle = "Ward Beds";
  } else if (bedType === "rooms") {
    data = roomBeds;
    displayCount = roomBeds.length;
    pageTitle = "Private/Isolation Rooms";
  }

  const columns: Column<BedRecord>[] = [
    { 
      key: "ward", 
      label: "Ward/Bed", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.ward}</span>
          <span className="text-muted-foreground text-xs">Bed {row.bed}</span>
        </div>
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
        return <span>{row.cleaningETA}</span>;
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

  // Extract unique wards from data
  const uniqueWards = [...new Set(data.map(b => b.ward))].sort();

  const filters: Filter[] = [
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
      key: "ward",
      label: "Ward",
      value: "all",
      options: uniqueWards.map(ward => ({ value: ward, label: ward })),
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "bedType", paramValue: "icu", displayLabel: "ICU", count: icuBeds.length },
    { paramKey: "bedType", paramValue: "ward", displayLabel: "Ward", count: wardBeds.length },
    { paramKey: "bedType", paramValue: "rooms", displayLabel: "Rooms", count: roomBeds.length },
  ];

  const rowActions: RowAction<BedRecord>[] = [
    { label: "Reserve Bed", onClick: (row) => console.log("Reserve", row.ward, row.room, row.bed) },
    { label: "Mark Cleaning", onClick: (row) => console.log("Mark Cleaning", row.ward, row.room, row.bed) },
    { label: "Block Bed", onClick: (row) => console.log("Block", row.ward, row.room, row.bed) },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      breadcrumbs={["Overview", pageTitle]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No beds found."
      searchPlaceholder="Search by ward, room, bed..."
      getRowId={(row) => `${row.ward}-${row.room}-${row.bed}`}
    />
  );
};

export default BedsAvailability;
