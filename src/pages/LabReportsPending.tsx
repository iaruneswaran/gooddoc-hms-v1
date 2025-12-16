import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { labOrders, LabOrderRecord } from "@/data/overview.mock";

const priorityStyles: Record<LabOrderRecord["priority"], string> = {
  "Routine": "bg-gray-100 text-gray-700",
  "Stat": "bg-red-100 text-red-700",
};

const statusStyles: Record<LabOrderRecord["status"], string> = {
  "Ordered": "bg-gray-100 text-gray-700",
  "Collected": "bg-blue-100 text-blue-700",
  "In-Process": "bg-amber-100 text-amber-700",
  "Completed": "bg-green-100 text-green-700",
  "Verified": "bg-purple-100 text-purple-700",
};

const LabOrdersToday = () => {
  const navigate = useNavigate();

  const columns: Column<LabOrderRecord>[] = [
    { key: "orderId", label: "Order ID", sortable: true, render: (row) => <span>GDID {row.orderId.replace(/\D/g, '').slice(-3).padStart(3, '0')}</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ageSex", label: "Age/Sex" },
    { key: "location", label: "Location" },
    { key: "tests", label: "Tests" },
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
    { key: "specimenType", label: "Specimen Type" },
    { key: "collectedAt", label: "Collected At", render: (row) => row.collectedAt || "—" },
    { key: "resultETA", label: "Result ETA", render: (row) => row.resultETA || "—" },
    {
      key: "criticalResult",
      label: "Critical Result",
      render: (row) => row.criticalResult ? (
        <Badge className="bg-red-100 text-red-700">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
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
        { value: "Collected", label: "Collected" },
        { value: "In-Process", label: "In-Process" },
        { value: "Completed", label: "Completed" },
        { value: "Verified", label: "Verified" },
      ],
    },
  ];

  const rowActions: RowAction<LabOrderRecord>[] = [
    { label: "Open Lab Order", onClick: (row) => navigate(`/diagnostics/lab/${row.orderId}`) },
    { label: "View Results", onClick: (row) => navigate(`/diagnostics/lab/${row.orderId}`) },
    { label: "Contact Lab", onClick: (row) => console.log("Contact lab for", row.orderId) },
  ];

  return (
    <ListPageLayout
      title="Lab Orders Today"
      count={labOrders.length}
      subtitle="Laboratory orders for today • Default sort: Priority (Stat first)"
      breadcrumbs={["Overview", "Lab Orders Today"]}
      columns={columns}
      data={labOrders}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No lab orders for today."
      searchPlaceholder="Search by Order ID, patient name, test..."
      getRowId={(row) => row.orderId}
      onRowClick={(row) => navigate(`/diagnostics/lab/${row.orderId}`)}
    />
  );
};

export default LabOrdersToday;
