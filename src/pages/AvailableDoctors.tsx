import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { availableDoctors, DoctorRecord } from "@/data/overview.mock";

const AvailableDoctors = () => {
  const navigate = useNavigate();

  const columns: Column<DoctorRecord>[] = [
    { key: "id", label: "Doctor ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "specialization", label: "Specialization", sortable: true },
    { key: "department", label: "Department", sortable: true },
    {
      key: "status",
      label: "Status",
      render: () => (
        <Badge className="badge-success">Available</Badge>
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
      key: "department",
      label: "Department",
      value: "all",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Neurology", label: "Neurology" },
        { value: "General Medicine", label: "General Medicine" },
      ],
    },
    {
      key: "specialization",
      label: "Specialization",
      value: "all",
      options: [
        { value: "Cardiologist", label: "Cardiologist" },
        { value: "Orthopedic Surgeon", label: "Orthopedic Surgeon" },
        { value: "Neurologist", label: "Neurologist" },
      ],
    },
  ];

  const rowActions: RowAction<DoctorRecord>[] = [
    { label: "Assign Patient", onClick: (row) => console.log("Assign patient", row.id) },
    { label: "View Schedule", onClick: (row) => navigate(`/doctors/${row.id}/schedule`) },
    { label: "Mark On Break", onClick: (row) => console.log("Mark on break", row.id) },
  ];

  return (
    <ListPageLayout
      title="Available Now"
      count={availableDoctors.length}
      subtitle="Doctors marked available now"
      breadcrumbs={["Overview", "Available Now"]}
      columns={columns}
      data={availableDoctors}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No doctors available right now."
      searchPlaceholder="Search by doctor name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/doctors/${row.id}`)}
    />
  );
};

export default AvailableDoctors;
