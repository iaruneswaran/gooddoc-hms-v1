import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { dischargedPatients, PatientRecord } from "@/data/overview.mock";
import { format } from "date-fns";

const DischargedToday = () => {
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
      render: () => (
        <Badge className="badge-success">Discharged</Badge>
      ),
    },
    {
      key: "dischargeDate",
      label: "Discharge Date/Time",
      sortable: true,
      render: (row) =>
        row.dischargeDate
          ? format(new Date(row.dischargeDate), "dd MMM yyyy, hh:mm a")
          : "-",
    },
    { key: "roomBed", label: "Room/Bed (Last)" },
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
      ],
    },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Summary", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Print Discharge Summary", onClick: (row) => console.log("Print summary", row.id) },
    { label: "Export to PDF", onClick: (row) => console.log("Export PDF", row.id) },
  ];

  return (
    <ListPageLayout
      title="Discharged Today"
      count={dischargedPatients.length}
      subtitle="Discharges finalized today"
      breadcrumbs={["Overview", "Discharged Today"]}
      columns={columns}
      data={dischargedPatients}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No discharges recorded today."
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default DischargedToday;
