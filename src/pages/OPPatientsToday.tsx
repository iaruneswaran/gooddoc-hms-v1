import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { opPatients, PatientRecord } from "@/data/overview.mock";
import { format } from "date-fns";

const OPPatientsToday = () => {
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
        <Badge className="badge-info">OP</Badge>
      ),
    },
    {
      key: "visitDate",
      label: "Visit Date/Time",
      sortable: true,
      render: (row) =>
        row.visitDate
          ? format(new Date(row.visitDate), "dd MMM yyyy, hh:mm a")
          : "-",
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
        { value: "Pediatrics", label: "Pediatrics" },
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

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "visitStatus", paramValue: "Completed", displayLabel: "Consultation Completed" },
    { paramKey: "visitStatus", paramValue: "Pending", displayLabel: "Check in completed" },
    { paramKey: "visitStatus", paramValue: "In_Queue", displayLabel: "Pending to check in" },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Profile", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Print OP Ticket", onClick: (row) => console.log("Print ticket", row.id) },
    { label: "Assign/Change Doctor", onClick: (row) => console.log("Assign doctor", row.id) },
  ];

  return (
    <ListPageLayout
      title="OP Patients"
      count={opPatients.length}
      subtitle="Out-patient visits registered today"
      breadcrumbs={["Overview", "OP Patients"]}
      columns={columns}
      data={opPatients}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No OP visits today."
      emptyCta={{ label: "View all patients", route: "/patients" }}
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default OPPatientsToday;
