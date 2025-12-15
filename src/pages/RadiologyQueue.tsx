import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { radiologyQueue, RadiologyOrderRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const RadiologyQueue = () => {
  const navigate = useNavigate();

  const priorityStyles: Record<string, string> = {
    STAT: "badge-error",
    Urgent: "badge-warning",
    Routine: "badge-info",
  };

  const statusStyles: Record<string, string> = {
    Waiting: "badge-warning",
    "In Progress": "badge-info",
    Completed: "badge-success",
  };

  const columns: Column<RadiologyOrderRecord>[] = [
    { key: "id", label: "Order ID", sortable: true },
    { key: "patientName", label: "Patient", sortable: true },
    {
      key: "modality",
      label: "Modality",
      sortable: true,
      render: (row) => (
        <Badge variant="outline">{row.modality}</Badge>
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
      key: "scheduledTime",
      label: "Scheduled Time",
      sortable: true,
      render: (row) => format(new Date(row.scheduledTime), "HH:mm"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    { key: "room", label: "Room" },
  ];

  const filters: Filter[] = [
    {
      key: "modality",
      label: "Modality",
      value: "all",
      options: [
        { value: "X-ray", label: "X-ray" },
        { value: "CT", label: "CT" },
        { value: "MRI", label: "MRI" },
        { value: "US", label: "Ultrasound" },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      value: "all",
      options: [
        { value: "STAT", label: "STAT" },
        { value: "Urgent", label: "Urgent" },
        { value: "Routine", label: "Routine" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Waiting", label: "Waiting" },
        { value: "In Progress", label: "In Progress" },
      ],
    },
  ];

  const rowActions: RowAction<RadiologyOrderRecord>[] = [
    { label: "Open Study", onClick: (row) => navigate(`/radiology/order/${row.id}`) },
    { label: "Start Exam", onClick: () => {} },
    { label: "Assign Room/Tech", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Radiology Queue"
      count={radiologyQueue.length}
      subtitle="Imaging studies in queue"
      breadcrumbs={["Overview", "Radiology Queue"]}
      data={radiologyQueue}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No patients in the radiology queue."
      searchPlaceholder="Search by Order ID or Patient Name..."
      onRowClick={(row) => navigate(`/radiology/order/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default RadiologyQueue;
