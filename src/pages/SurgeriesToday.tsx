import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { surgeriesToday, SurgeryRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const SurgeriesToday = () => {
  const navigate = useNavigate();

  const statusStyles: Record<string, string> = {
    Scheduled: "badge-info",
    "In Progress": "badge-warning",
    Completed: "badge-success",
    Cancelled: "badge-error",
  };

  const priorityStyles: Record<string, string> = {
    Emergency: "badge-error",
    Urgent: "badge-warning",
    Elective: "badge-info",
  };

  const columns: Column<SurgeryRecord>[] = [
    { key: "id", label: "Case ID", sortable: true },
    { key: "patientName", label: "Patient", sortable: true },
    { key: "procedure", label: "Procedure", sortable: true },
    { key: "surgeon", label: "Surgeon", sortable: true },
    { key: "orRoom", label: "OR Room", sortable: true },
    { key: "anesthesia", label: "Anesthesia" },
    {
      key: "scheduledStart",
      label: "Scheduled Start",
      sortable: true,
      render: (row) => format(new Date(row.scheduledStart), "HH:mm"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      value: "all",
      options: [
        { value: "Emergency", label: "Emergency" },
        { value: "Urgent", label: "Urgent" },
        { value: "Elective", label: "Elective" },
      ],
    },
  ];

  const rowActions: RowAction<SurgeryRecord>[] = [
    { label: "View Case", onClick: (row) => navigate(`/or/case/${row.id}`) },
    { label: "Start/Update Status", onClick: () => {} },
    { label: "Print Checklist", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Surgeries Today"
      count={surgeriesToday.length}
      subtitle="Operating room schedule for today"
      breadcrumbs={["Overview", "Surgeries Today"]}
      data={surgeriesToday}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No surgeries scheduled today."
      searchPlaceholder="Search by Case ID or Patient Name..."
      onRowClick={(row) => navigate(`/or/case/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default SurgeriesToday;
