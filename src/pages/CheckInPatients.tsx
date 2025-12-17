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
      render: (row) => row.lastDischargedAt || "—",
    },
    {
      key: "cleaningETA",
      label: "Cleaning ETA",
      render: (row) => row.cleaningETA || "—",
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
