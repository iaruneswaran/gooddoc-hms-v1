import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { opPatients, opCompleted, opCheckedIn, opPendingCheckIn, OPPatientRecord } from "@/data/overview.mock";

const statusStyles: Record<OPPatientRecord["status"], string> = {
  "Scheduled": "bg-gray-100 text-gray-700",
  "Pending Check-in": "bg-amber-100 text-amber-700",
  "Checked-in": "bg-blue-100 text-blue-700",
  "With Doctor": "bg-indigo-100 text-indigo-700",
  "Awaiting Billing": "bg-purple-100 text-purple-700",
  "Completed": "bg-green-100 text-green-700",
  "No-show": "bg-red-100 text-red-700",
  "Canceled": "bg-gray-100 text-gray-500",
};

const OPPatientsToday = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitStatusFilter = searchParams.get("visitStatus");

  let data = opPatients;
  let displayCount = opPatients.length;

  if (visitStatusFilter === "Completed") {
    data = opCompleted;
    displayCount = opCompleted.length;
  } else if (visitStatusFilter === "Pending") {
    data = opCheckedIn;
    displayCount = opCheckedIn.length;
  } else if (visitStatusFilter === "In_Queue") {
    data = opPendingCheckIn;
    displayCount = opPendingCheckIn.length;
  }

  const columns: Column<OPPatientRecord>[] = [
    { key: "mrn", label: "MRN", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ageSex", label: "Age/Sex" },
    { key: "visitId", label: "Visit ID" },
    { key: "appointmentTime", label: "Appointment Time", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "provider", label: "Provider", sortable: true },
    { key: "visitReason", label: "Visit Reason" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    { key: "checkInTime", label: "Check-in Time", render: (row) => row.checkInTime || "—" },
    { key: "waitingTime", label: "Waiting Time", render: (row) => row.waitingTime || "—" },
    { key: "tokenQueueNo", label: "Token/Queue No.", render: (row) => row.tokenQueueNo || "—" },
    { key: "insurancePlan", label: "Insurance Plan", render: (row) => row.insurancePlan || "—" },
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
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "Checked-in", label: "Checked-in" },
        { value: "With Doctor", label: "With Doctor" },
        { value: "Completed", label: "Completed" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "visitStatus", paramValue: "Completed", displayLabel: "OP Completed", count: opCompleted.length },
    { paramKey: "visitStatus", paramValue: "Pending", displayLabel: "Check in completed", count: opCheckedIn.length },
    { paramKey: "visitStatus", paramValue: "In_Queue", displayLabel: "Pending to check in", count: opPendingCheckIn.length },
  ];

  const rowActions: RowAction<OPPatientRecord>[] = [
    { label: "View Chart", onClick: (row) => navigate(`/patient-insights/${row.mrn}`) },
    { label: "Patient 360", onClick: (row) => navigate(`/patients/${row.mrn}/360`) },
    { label: "Book Follow-up", onClick: (row) => navigate(`/book-appointment?patientId=${row.mrn}`) },
  ];

  return (
    <ListPageLayout
      title="OP Patients"
      count={displayCount}
      subtitle="Outpatient visits for today • Default sort: Appointment Time ASC"
      breadcrumbs={["Overview", "OP Patients"]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No OP patients for today."
      searchPlaceholder="Search by MRN, name, Visit ID..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}`)}
    />
  );
};

export default OPPatientsToday;
