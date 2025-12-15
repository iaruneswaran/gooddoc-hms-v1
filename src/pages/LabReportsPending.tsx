import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { labReportsPending, LabOrderRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const LabReportsPending = () => {
  const navigate = useNavigate();

  const priorityStyles: Record<string, string> = {
    STAT: "badge-error",
    High: "badge-warning",
    Normal: "badge-info",
  };

  const statusStyles: Record<string, string> = {
    Pending: "badge-warning",
    Processing: "badge-info",
    Completed: "badge-success",
  };

  const columns: Column<LabOrderRecord>[] = [
    { key: "id", label: "Order ID", sortable: true },
    { key: "patientName", label: "Patient", sortable: true },
    { key: "testName", label: "Test Name", sortable: true },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <Badge className={priorityStyles[row.priority]}>{row.priority}</Badge>
      ),
    },
    { key: "orderingDoctor", label: "Ordering Doctor", sortable: true },
    {
      key: "collectedTime",
      label: "Collected Time",
      sortable: true,
      render: (row) =>
        row.collectedTime
          ? format(new Date(row.collectedTime), "HH:mm")
          : "-",
    },
    {
      key: "resultStatus",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.resultStatus]}>{row.resultStatus}</Badge>
      ),
    },
    { key: "eta", label: "ETA", render: (row) => row.eta || "-" },
  ];

  const filters: Filter[] = [
    {
      key: "priority",
      label: "Priority",
      value: "all",
      options: [
        { value: "STAT", label: "STAT" },
        { value: "High", label: "High" },
        { value: "Normal", label: "Normal" },
      ],
    },
    {
      key: "resultStatus",
      label: "Status",
      value: "all",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Processing", label: "Processing" },
      ],
    },
  ];

  const rowActions: RowAction<LabOrderRecord>[] = [
    { label: "Open Lab Order", onClick: (row) => navigate(`/diagnostics/lab/${row.id}`) },
    { label: "Mark Collected", onClick: () => {} },
    { label: "Notify Doctor", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Lab Reports Pending"
      count={labReportsPending.length}
      subtitle="Awaiting lab results"
      breadcrumbs={["Overview", "Lab Reports Pending"]}
      data={labReportsPending}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No pending lab reports for today."
      searchPlaceholder="Search by Order ID or Patient Name..."
      onRowClick={(row) => navigate(`/diagnostics/lab/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default LabReportsPending;
