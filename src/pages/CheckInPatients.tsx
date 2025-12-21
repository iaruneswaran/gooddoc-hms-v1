import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";
import { formatINR } from "@/utils/currency";

const statusStyles: Record<BedRecord["status"], string> = {
  "Available": "bg-green-100 text-green-700",
  "Reserved": "bg-blue-100 text-blue-700",
};

const transferStatusStyles: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700",
  "In Transit": "bg-blue-100 text-blue-700",
  "Completed": "bg-green-100 text-green-700",
};

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");

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
          <div className="text-xs text-muted-foreground">{row.transferPatientId}</div>
          <div className="text-xs text-muted-foreground">From: {row.transferFrom}</div>
          {row.transferStatus && (
            <Badge className={transferStatusStyles[row.transferStatus]} variant="outline">
              {row.transferStatus}
            </Badge>
          )}
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
    { label: "Reserve Bed", onClick: (row) => console.log("Reserve", row.bedNo) },
    { label: "Transfer Patient", onClick: (row) => navigate(`/patients/transfer?bedNo=${row.bedNo}`) },
    { label: "Edit Charges", onClick: (row) => console.log("Edit Charges", row.bedNo) },
  ];

  return (
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
  );
};

export default BedsAvailability;
