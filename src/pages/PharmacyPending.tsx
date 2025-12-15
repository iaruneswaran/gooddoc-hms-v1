import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { pharmacyPending, PharmacyOrderRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const PharmacyPending = () => {
  const navigate = useNavigate();

  const priorityStyles: Record<string, string> = {
    STAT: "badge-error",
    Normal: "badge-info",
  };

  const statusStyles: Record<string, string> = {
    Pending: "badge-warning",
    "Partially Dispensed": "badge-info",
    Dispensed: "badge-success",
  };

  const columns: Column<PharmacyOrderRecord>[] = [
    { key: "id", label: "Rx ID", sortable: true },
    { key: "patientName", label: "Patient", sortable: true },
    { key: "prescriber", label: "Prescriber", sortable: true },
    { key: "itemsCount", label: "Items", sortable: true },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <Badge className={priorityStyles[row.priority]}>{row.priority}</Badge>
      ),
    },
    {
      key: "queueStatus",
      label: "Queue Status",
      render: (row) => (
        <Badge className={statusStyles[row.queueStatus]}>{row.queueStatus}</Badge>
      ),
    },
    {
      key: "createdTime",
      label: "Created Time",
      sortable: true,
      render: (row) => format(new Date(row.createdTime), "HH:mm"),
    },
  ];

  const filters: Filter[] = [
    {
      key: "priority",
      label: "Priority",
      value: "all",
      options: [
        { value: "STAT", label: "STAT" },
        { value: "Normal", label: "Normal" },
      ],
    },
    {
      key: "queueStatus",
      label: "Status",
      value: "all",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Partially Dispensed", label: "Partially Dispensed" },
      ],
    },
  ];

  const rowActions: RowAction<PharmacyOrderRecord>[] = [
    { label: "Open Prescription", onClick: (row) => navigate(`/pharmacy/rx/${row.id}`) },
    { label: "Mark Dispensed", onClick: () => {} },
    { label: "Print Label", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Pharmacy Pending"
      count={pharmacyPending.length}
      subtitle="Orders awaiting dispensing"
      breadcrumbs={["Overview", "Pharmacy Pending"]}
      data={pharmacyPending}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No pending pharmacy orders."
      searchPlaceholder="Search by Rx ID or Patient Name..."
      onRowClick={(row) => navigate(`/pharmacy/rx/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default PharmacyPending;
