import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { doctorsOnDuty, DoctorRecord } from "@/data/overview.mock";

const statusStyles: Record<string, string> = {
  Available: "badge-success",
  "In Consultation": "badge-info",
  "In Surgery": "badge-warning",
  "On Break": "bg-[hsl(var(--gd-neutral-200))] text-[hsl(var(--gd-neutral-700))]",
};

const DoctorsOnDuty = () => {
  const navigate = useNavigate();

  const columns: Column<DoctorRecord>[] = [
    { key: "id", label: "Doctor ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "specialization", label: "Specialization", sortable: true },
    { key: "department", label: "Department", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "queue",
      label: "Queue",
      sortable: true,
      render: (row) => (
        <span title="Patients waiting">{row.queue}</span>
      ),
    },
    {
      key: "avgTime",
      label: "Avg Time",
      sortable: true,
      render: (row) => (
        <span title="Average time per consultation">{row.avgTime} min</span>
      ),
    },
    { key: "seenToday", label: "Seen Today", sortable: true },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Available", label: "Available" },
        { value: "In Consultation", label: "In Consultation" },
        { value: "In Surgery", label: "In Surgery" },
        { value: "On Break", label: "On Break" },
      ],
    },
    {
      key: "department",
      label: "Department",
      value: "all",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Neurology", label: "Neurology" },
      ],
    },
  ];

  const rowActions: RowAction<DoctorRecord>[] = [
    { label: "Open Queue", onClick: (row) => console.log("Open queue", row.id) },
    { label: "Mark Available", onClick: (row) => console.log("Mark available", row.id) },
    { label: "Mark On Break", onClick: (row) => console.log("Mark on break", row.id) },
    { label: "View Schedule", onClick: (row) => navigate(`/doctors/${row.id}/schedule`) },
  ];

  return (
    <ListPageLayout
      title="Doctors on Duty"
      count={doctorsOnDuty.length}
      subtitle="Active shift only"
      breadcrumbs={["Overview", "Doctors on Duty"]}
      columns={columns}
      data={doctorsOnDuty}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No doctors on the current shift."
      searchPlaceholder="Search by doctor name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/doctors/${row.id}`)}
    />
  );
};

export default DoctorsOnDuty;
