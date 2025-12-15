import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { ipPatients, PatientRecord } from "@/data/overview.mock";
import { format } from "date-fns";

const IPPatients = () => {
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
        <Badge className="bg-[hsl(var(--gd-primary-100))] text-[hsl(var(--gd-primary-700))]">
          IP
        </Badge>
      ),
    },
    {
      key: "admitDate",
      label: "Admit Date/Time",
      sortable: true,
      render: (row) =>
        row.admitDate
          ? format(new Date(row.admitDate), "dd MMM yyyy, hh:mm a")
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
      ],
    },
    {
      key: "doctor",
      label: "Doctor",
      value: "all",
      options: [
        { value: "Dr. Meera Nair", label: "Dr. Meera Nair" },
        { value: "Dr. Rajesh Kumar", label: "Dr. Rajesh Kumar" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "admittedToday", paramValue: "true", displayLabel: "New Admissions" },
    { paramKey: "erCase", paramValue: "true", displayLabel: "ER case today" },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Profile", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Transfer Bed", onClick: (row) => console.log("Transfer", row.id) },
    { label: "Assign/Change Doctor", onClick: (row) => console.log("Assign", row.id) },
    { label: "Start Discharge", onClick: (row) => navigate(`/patient-insights/${row.id}/discharge`) },
  ];

  return (
    <ListPageLayout
      title="IP Patients"
      count={ipPatients.length}
      subtitle="Currently admitted in-patients"
      breadcrumbs={["Overview", "IP Patients"]}
      columns={columns}
      data={ipPatients}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No active in-patients."
      emptyCta={{ label: "View recent discharges", route: "/patients/discharged?date=today" }}
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default IPPatients;
