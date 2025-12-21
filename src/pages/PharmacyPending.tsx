import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { medicineOrders, MedicineOrderRecord } from "@/data/overview.mock";
import { formatINR } from "@/utils/currency";

const priorityStyles: Record<MedicineOrderRecord["priority"], string> = {
  "Routine": "bg-gray-100 text-gray-700",
  "Stat": "bg-red-100 text-red-700",
};

const paymentStatusStyles: Record<MedicineOrderRecord["paymentStatus"], string> = {
  "Paid": "bg-green-100 text-green-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Partially Paid": "bg-blue-100 text-blue-700",
  "Waived": "bg-gray-100 text-gray-700",
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
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.orderId} ageSex={row.ageSex} patientId={row.orderId} fromPage="pharmacy" />
    },
    { key: "visitId", label: "Visit ID" },
    { key: "orderId", label: "Order ID" },
    { 
      key: "location", 
      label: "Location",
      render: (row) => {
        if (!row.location) return "—";
        const parts = row.location.split('/');
        if (parts.length === 2) {
          return (
            <div className="flex flex-col">
              <span>{parts[0]}</span>
              <span className="text-muted-foreground text-xs">{parts[1]}</span>
            </div>
          );
        }
        return <span>{row.location}</span>;
      }
    },
    { key: "prescriber", label: "Prescriber" },
    {
      key: "orderAmount",
      label: "Payment Details",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatINR(row.orderAmount)}</span>
          {row.paidAmount > 0 && (
            <span className="text-muted-foreground text-xs">
              Paid: {formatINR(row.paidAmount)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      sortable: true,
      render: (row) => (
        <Badge className={paymentStatusStyles[row.paymentStatus]}>{row.paymentStatus}</Badge>
      ),
    },
    { 
      key: "dispensedAt", 
      label: "Dispensed At", 
      render: (row) => {
        if (!row.dispensedAt) return "—";
        const [date, time] = row.dispensedAt.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      }
    },
  ];

  const filters: Filter[] = [
    {
      key: "paymentStatus",
      label: "Payment Status",
      value: "all",
      options: [
        { value: "Paid", label: "Paid" },
        { value: "Pending", label: "Pending" },
        { value: "Partially Paid", label: "Partially Paid" },
        { value: "Waived", label: "Waived" },
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
      breadcrumbs={["Overview", "Medicine Orders Today"]}
      columns={columns}
      data={sortedOrders}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No medicine orders for today."
      searchPlaceholder="Search by Order ID, patient name..."
      getRowId={(row) => row.orderId}
      onRowClick={(row) => navigate(`/patient-insights/${row.orderId}?from=pharmacy`)}
    />
  );
};

export default MedicineOrdersToday;
