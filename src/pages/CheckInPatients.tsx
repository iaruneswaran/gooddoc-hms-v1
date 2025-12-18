import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";

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

  // Filter to show only Available beds
  let data = bedsAvailability.filter(bed => bed.status === "Available");
  let displayCount = data.length;
  let pageTitle = "Available Beds";

  if (bedType === "icu") {
    data = icuBeds.filter(bed => bed.status === "Available");
    displayCount = data.length;
    pageTitle = "ICU Beds";
  } else if (bedType === "ward") {
    data = wardBeds.filter(bed => bed.status === "Available");
    displayCount = data.length;
    pageTitle = "Ward Beds";
  } else if (bedType === "rooms") {
    data = roomBeds.filter(bed => bed.status === "Available");
    displayCount = data.length;
    pageTitle = "Private/Isolation Rooms";
  }

  const columns: Column<BedRecord>[] = [
    { 
      key: "ward", 
      label: "Ward/Bed", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.ward}</span>
          <span className="text-muted-foreground text-xs">Bed {row.bed}</span>
        </div>
      ),
    },
    {
      key: "bedType",
      label: "Type",
      sortable: true,
      render: (row) => (
        <Badge className={bedTypeStyles[row.bedType]}>{row.bedType}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: () => (
        <Badge className="bg-green-100 text-green-700">Available</Badge>
      ),
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
  ];

  const filters: Filter[] = [
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
    { paramKey: "bedType", paramValue: "icu", displayLabel: "ICU", count: icuBeds.filter(b => b.status === "Available").length },
    { paramKey: "bedType", paramValue: "ward", displayLabel: "Ward", count: wardBeds.filter(b => b.status === "Available").length },
    { paramKey: "bedType", paramValue: "rooms", displayLabel: "Rooms", count: roomBeds.filter(b => b.status === "Available").length },
  ];

  const rowActions: RowAction<BedRecord>[] = [
    { label: "Reserve Bed", onClick: (row) => console.log("Reserve", row.ward, row.bed) },
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
      emptyMessage="No available beds found."
      searchPlaceholder="Search by ward, bed..."
      getRowId={(row) => `${row.ward}-${row.room}-${row.bed}`}
    />
  );
};

export default BedsAvailability;
