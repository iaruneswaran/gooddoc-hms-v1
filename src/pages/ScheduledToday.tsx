import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { scheduledToday, PatientRecord } from "@/data/overview.mock";

const ScheduledToday = () => {
  const navigate = useNavigate();

  const columns: Column<PatientRecord>[] = [
    { key: "id", label: "Patient ID", sortable: true },
    { key: "name", label: "Patient Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "assignedDoctor", label: "Assigned Doctor", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className="badge-info">{row.status}</Badge>
      ),
    },
    {
      key: "appointmentTime",
      label: "Appointment Time",
      sortable: true,
      render: (row) => row.appointmentTime || "-",
    },
    { key: "roomBed", label: "Room/Bed" },
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
      key: "doctor",
      label: "Doctor",
      value: "all",
      options: [
        { value: "Dr. Meera Nair", label: "Dr. Meera Nair" },
        { value: "Dr. Rajesh Kumar", label: "Dr. Rajesh Kumar" },
        { value: "Dr. Anita Singh", label: "Dr. Anita Singh" },
      ],
    },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Appointment", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Check-in Patient", onClick: (row) => console.log("Check-in", row.id) },
    { label: "Reschedule", onClick: (row) => console.log("Reschedule", row.id) },
  ];

  return (
    <ListPageLayout
      title="Scheduled Today"
      count={scheduledToday.length}
      subtitle="All appointments for today"
      breadcrumbs={["Overview", "Scheduled Today"]}
      columns={columns}
      data={scheduledToday}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No appointments scheduled today."
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default ScheduledToday;
