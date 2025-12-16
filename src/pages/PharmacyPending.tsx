import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { medicineOrders, MedicineOrderRecord } from "@/data/overview.mock";

const priorityStyles: Record<MedicineOrderRecord["priority"], string> = {
  "Routine": "bg-gray-100 text-gray-700",
  "Stat": "bg-red-100 text-red-700",
};

const statusStyles: Record<MedicineOrderRecord["status"], string> = {
  "Pending": "bg-gray-100 text-gray-700",
  "Verifying": "bg-blue-100 text-blue-700",
  "Verified": "bg-indigo-100 text-indigo-700",
  "Dispensed": "bg-green-100 text-green-700",
  "Administered": "bg-purple-100 text-purple-700",
  "Canceled": "bg-red-100 text-red-700",
};

const routeStyles: Record<MedicineOrderRecord["route"], string> = {
  "PO": "bg-green-100 text-green-700",
  "IV": "bg-red-100 text-red-700",
  "IM": "bg-amber-100 text-amber-700",
  "SC": "bg-blue-100 text-blue-700",
  "Topical": "bg-purple-100 text-purple-700",
};

const MedicineOrdersToday = () => {
  const navigate = useNavigate();

  const columns: Column<MedicineOrderRecord>[] = [
    { key: "orderId", label: "Order ID", sortable: true, render: (row) => <span>GDID {row.orderId.replace(/\D/g, '').padStart(3, '0')}</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "location", label: "Location" },
    { key: "prescriber", label: "Prescriber" },
    { key: "medications", label: "Medications" },
    {
      key: "route",
      label: "Route",
      render: (row) => (
        <Badge className={routeStyles[row.route]}>{row.route}</Badge>
      ),
    },
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
    {
      key: "allergiesFlag",
      label: "Allergies",
      render: (row) => row.allergiesFlag ? (
        <Badge className="bg-red-500 text-white">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
    {
      key: "interactionsFlag",
      label: "Interactions",
      render: (row) => row.interactionsFlag ? (
        <Badge className="bg-orange-500 text-white">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
    { key: "dispensedAt", label: "Dispensed At", render: (row) => row.dispensedAt || "—" },
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
        { value: "Pending", label: "Pending" },
        { value: "Verifying", label: "Verifying" },
        { value: "Verified", label: "Verified" },
        { value: "Dispensed", label: "Dispensed" },
        { value: "Administered", label: "Administered" },
      ],
    },
    {
      key: "route",
      label: "Route",
      value: "all",
      options: [
        { value: "PO", label: "PO (Oral)" },
        { value: "IV", label: "IV" },
        { value: "IM", label: "IM" },
        { value: "SC", label: "SC" },
        { value: "Topical", label: "Topical" },
      ],
    },
  ];

  const rowActions: RowAction<MedicineOrderRecord>[] = [
    { label: "Open Order", onClick: (row) => console.log("Open", row.orderId) },
    { label: "Verify", onClick: (row) => console.log("Verify", row.orderId) },
    { label: "Dispense", onClick: (row) => console.log("Dispense", row.orderId) },
  ];

  // Sort by priority (Stat first), then order time
  const sortedOrders = [...medicineOrders].sort((a, b) => {
    if (a.priority === "Stat" && b.priority !== "Stat") return -1;
    if (a.priority !== "Stat" && b.priority === "Stat") return 1;
    return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
  });

  return (
    <ListPageLayout
      title="Medicine Orders Today"
      count={medicineOrders.length}
      subtitle="Pharmacy medication orders • Default sort: Priority (Stat first)"
      breadcrumbs={["Overview", "Medicine Orders Today"]}
      columns={columns}
      data={sortedOrders}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No medicine orders for today."
      searchPlaceholder="Search by Order ID, patient name, medication..."
      getRowId={(row) => row.orderId}
    />
  );
};

export default MedicineOrdersToday;
