import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { walkInPatients, PatientRecord } from "@/data/overview.mock";

const statusStyles = {
  OP: "badge-info",
  ER: "badge-error",
};

const WalkInPatients = () => {
  const navigate = useNavigate();

  const columns: Column<PatientRecord>[] = [
    { key: "id", label: "Patient ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "assignedDoctor", label: "Assigned Doctor", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status as "OP" | "ER"] || "badge-info"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "arrivalTime",
      label: "Arrival Time",
      sortable: true,
      render: (row) => row.arrivalTime || "-",
    },
    { key: "roomBed", label: "Room/Bed" },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "OP", label: "OP" },
        { value: "ER", label: "ER" },
      ],
    },
    {
      key: "department",
      label: "Department",
      value: "all",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Emergency", label: "Emergency" },
        { value: "General Medicine", label: "General Medicine" },
      ],
    },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Profile", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Assign Doctor", onClick: (row) => console.log("Assign doctor", row.id) },
    { label: "Print OP Ticket", onClick: (row) => console.log("Print ticket", row.id) },
  ];

  return (
    <ListPageLayout
      title="Walk-in Patients"
      count={walkInPatients.length}
      subtitle="Visits without prior appointment today"
      breadcrumbs={["Overview", "Walk-in Patients"]}
      columns={columns}
      data={walkInPatients}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No walk-ins recorded today."
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default WalkInPatients;
