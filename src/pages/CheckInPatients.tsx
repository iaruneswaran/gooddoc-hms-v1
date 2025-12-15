import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { checkInPatients, PatientRecord } from "@/data/overview.mock";
import { format } from "date-fns";

const statusStyles = {
  OP: "badge-info",
  IP: "bg-[hsl(var(--gd-primary-100))] text-[hsl(var(--gd-primary-700))]",
  ER: "badge-error",
};

const CheckInPatients = () => {
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
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "checkInDate",
      label: "Check-in Date/Time",
      sortable: true,
      render: (row) =>
        row.checkInDate
          ? format(new Date(row.checkInDate), "dd MMM yyyy, hh:mm a")
          : "-",
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
        { value: "IP", label: "IP" },
        { value: "ER", label: "ER" },
      ],
    },
    {
      key: "department",
      label: "Department",
      value: "all",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Emergency", label: "Emergency" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "bedType", paramValue: "icu", displayLabel: "ICU", count: 25 },
    { paramKey: "bedType", paramValue: "ward", displayLabel: "Ward", count: 21 },
    { paramKey: "bedType", paramValue: "rooms", displayLabel: "Rooms", count: 3 },
  ];

  const rowActions: RowAction<PatientRecord>[] = [
    { label: "View Profile", onClick: (row) => navigate(`/patient-insights/${row.id}`) },
    { label: "Update Status", onClick: (row) => console.log("Update status", row.id) },
    { label: "Assign/Change Doctor", onClick: (row) => console.log("Assign", row.id) },
  ];

  return (
    <ListPageLayout
      title="Check In"
      count={checkInPatients.length}
      subtitle="All patient check-ins today (OP, IP, ER)"
      breadcrumbs={["Overview", "Check In"]}
      columns={columns}
      data={checkInPatients}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No check-ins today yet."
      searchPlaceholder="Search by patient name or ID..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/patient-insights/${row.id}`)}
    />
  );
};

export default CheckInPatients;
