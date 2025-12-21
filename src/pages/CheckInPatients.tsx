import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";
import { bedChargesData } from "@/data/bed-charges.mock";

// Combined bed record with charges
interface CombinedBedRecord extends BedRecord {
  dailyRate?: number;
  nursingCharge?: number;
  serviceCharge?: number;
  totalPerDay?: number;
}

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

// Map bed types to charge categories
const bedTypeToCategory: Record<BedRecord["bedType"], string> = {
  "ICU": "ICU",
  "HDU": "HDU",
  "Ward": "General",
  "Private": "Private",
  "Isolation": "Isolation",
};

// Combine bed availability with charges
const combinedData: CombinedBedRecord[] = bedsAvailability.map(bed => {
  const category = bedTypeToCategory[bed.bedType];
  const chargeInfo = bedChargesData.find(c => c.roomCategory === category);
  
  return {
    ...bed,
    dailyRate: chargeInfo?.dailyRate,
    nursingCharge: chargeInfo?.nursingCharge,
    serviceCharge: chargeInfo?.serviceCharge,
    totalPerDay: chargeInfo?.totalPerDay,
  };
});

const icuCombined = combinedData.filter(b => b.bedType === "ICU");
const wardCombined = combinedData.filter(b => ["Ward", "HDU"].includes(b.bedType));
const roomCombined = combinedData.filter(b => ["Private", "Isolation"].includes(b.bedType));

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");

  // Get filtered data based on URL params
  let displayData = combinedData;
  let displayCount = combinedData.length;

  if (bedType === "icu") {
    displayData = icuCombined;
    displayCount = icuCombined.length;
  } else if (bedType === "ward") {
    displayData = wardCombined;
    displayCount = wardCombined.length;
  } else if (bedType === "rooms") {
    displayData = roomCombined;
    displayCount = roomCombined.length;
  }

  // Combined Columns
  const columns: Column<CombinedBedRecord>[] = [
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
      key: "dailyRate",
      label: "Daily Rate",
      sortable: true,
      render: (row) => row.dailyRate ? (
        <span className="font-medium">{formatCurrency(row.dailyRate)}</span>
      ) : "—",
    },
    {
      key: "totalPerDay",
      label: "Total/Day",
      sortable: true,
      render: (row) => row.totalPerDay ? (
        <span className="font-semibold text-primary">{formatCurrency(row.totalPerDay)}</span>
      ) : "—",
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

  const rowActions: RowAction<CombinedBedRecord>[] = [
    { label: "Reserve Bed", onClick: (row) => console.log("Reserve", row.ward, row.room, row.bed) },
    { label: "Mark Cleaning", onClick: (row) => console.log("Mark Cleaning", row.ward, row.room, row.bed) },
    { label: "Block Bed", onClick: (row) => console.log("Block", row.ward, row.room, row.bed) },
    { label: "Edit Charges", onClick: (row) => console.log("Edit Charges", row.ward, row.room, row.bed) },
  ];

  return (
    <ListPageLayout
      title="Beds Availability & Charges"
      count={displayCount}
      breadcrumbs={["Overview", "Beds"]}
      columns={columns}
      data={displayData}
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
