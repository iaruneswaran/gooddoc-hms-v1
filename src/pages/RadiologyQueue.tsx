import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { radiologyOrders, RadiologyOrderRecord } from "@/data/overview.mock";

const priorityStyles: Record<RadiologyOrderRecord["priority"], string> = {
  "Routine": "bg-gray-100 text-gray-700",
  "Stat": "bg-red-100 text-red-700",
};

const statusStyles: Record<RadiologyOrderRecord["status"], string> = {
  "Ordered": "bg-gray-100 text-gray-700",
  "Scheduled": "bg-blue-100 text-blue-700",
  "In-Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-green-100 text-green-700",
  "Finalized": "bg-purple-100 text-purple-700",
};

const modalityStyles: Record<RadiologyOrderRecord["modality"], string> = {
  "X-ray": "bg-blue-100 text-blue-700",
  "CT": "bg-purple-100 text-purple-700",
  "MRI": "bg-indigo-100 text-indigo-700",
  "US": "bg-green-100 text-green-700",
  "Fluoro": "bg-amber-100 text-amber-700",
  "Mammo": "bg-pink-100 text-pink-700",
};

const RadiologyOrdersToday = () => {
  const navigate = useNavigate();

  const columns: Column<RadiologyOrderRecord>[] = [
    { key: "orderId", label: "Order ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "location", label: "Location" },
    {
      key: "modality",
      label: "Modality",
      sortable: true,
      render: (row) => (
        <Badge className={modalityStyles[row.modality]}>{row.modality}</Badge>
      ),
    },
    { key: "exam", label: "Exam" },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <Badge className={priorityStyles[row.priority]}>{row.priority}</Badge>
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
    { key: "scheduledTime", label: "Scheduled Time", sortable: true },
    { key: "imagingLocation", label: "Imaging Location" },
    {
      key: "contrast",
      label: "Contrast",
      render: (row) => row.contrast ? (
        <Badge className="bg-amber-100 text-amber-700">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
    {
      key: "pregnancySafetyFlags",
      label: "Safety Flags",
      render: (row) => row.pregnancySafetyFlags ? (
        <Badge className="bg-red-100 text-red-700">{row.pregnancySafetyFlags}</Badge>
      ) : (
        <span>—</span>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "priority",
      label: "Priority",
      value: "all",
      options: [
        { value: "Stat", label: "Stat" },
        { value: "Routine", label: "Routine" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Ordered", label: "Ordered" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "In-Progress", label: "In-Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Finalized", label: "Finalized" },
      ],
    },
    {
      key: "modality",
      label: "Modality",
      value: "all",
      options: [
        { value: "X-ray", label: "X-ray" },
        { value: "CT", label: "CT" },
        { value: "MRI", label: "MRI" },
        { value: "US", label: "Ultrasound" },
        { value: "Fluoro", label: "Fluoroscopy" },
        { value: "Mammo", label: "Mammography" },
      ],
    },
  ];

  const rowActions: RowAction<RadiologyOrderRecord>[] = [
    { label: "Open Order", onClick: (row) => navigate(`/diagnostics/radiology/${row.orderId}`) },
    { label: "View Images", onClick: (row) => console.log("View images", row.orderId) },
    { label: "Update Status", onClick: (row) => console.log("Update", row.orderId) },
  ];

  // Sort by priority (Stat first), then scheduled time
  const sortedOrders = [...radiologyOrders].sort((a, b) => {
    if (a.priority === "Stat" && b.priority !== "Stat") return -1;
    if (a.priority !== "Stat" && b.priority === "Stat") return 1;
    return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
  });

  return (
    <ListPageLayout
      title="Radiology Orders Today"
      count={radiologyOrders.length}
      subtitle="Imaging orders for today • Default sort: Priority (Stat first)"
      breadcrumbs={["Overview", "Radiology Orders Today"]}
      columns={columns}
      data={sortedOrders}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No radiology orders for today."
      searchPlaceholder="Search by Order ID, patient name, exam..."
      getRowId={(row) => row.orderId}
      onRowClick={(row) => navigate(`/diagnostics/radiology/${row.orderId}`)}
    />
  );
};

export default RadiologyOrdersToday;
