import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { dischargedPatients, dischargePending, IPPatientRecord } from "@/data/overview.mock";

const dischargeTypeStyles: Record<string, string> = {
  "Home": "bg-green-100 text-green-700",
  "Transfer": "bg-blue-100 text-blue-700",
  "AMA": "bg-amber-100 text-amber-700",
  "Expired": "bg-gray-100 text-gray-700",
};

const billingStatusStyles: Record<string, string> = {
  "Paid": "bg-green-100 text-green-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Partially Paid": "bg-blue-100 text-blue-700",
};

const DischargedToday = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dischargeStatus = searchParams.get("dischargeStatus");

  let data = dischargedPatients;
  let displayCount = dischargedPatients.length;
  let pageTitle = "Discharged";

  if (dischargeStatus === "Pending") {
    data = dischargePending;
    displayCount = dischargePending.length;
    pageTitle = "Discharge Pending";
  }

  const dischargedColumns: Column<IPPatientRecord>[] = [
    { key: "mrn", label: "ID", sortable: true, render: (row) => <span>GDID {row.mrn.replace(/\D/g, '').slice(-3).padStart(3, '0')}</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ageSex", label: "Age/Sex" },
    { key: "ward", label: "Ward" },
    { key: "room", label: "Room" },
    { key: "bed", label: "Bed" },
    { key: "dischargeDateTime", label: "Discharge Date/Time", sortable: true, render: (row) => row.dischargeDateTime || "—" },
    {
      key: "dischargeType",
      label: "Discharge Type",
      render: (row) => row.dischargeType ? (
        <Badge className={dischargeTypeStyles[row.dischargeType]}>{row.dischargeType}</Badge>
      ) : <span>—</span>,
    },
    { key: "primaryDiagnosis", label: "Primary Diagnosis" },
    {
      key: "billingStatus",
      label: "Billing Status",
      render: (row) => row.billingStatus ? (
        <Badge className={billingStatusStyles[row.billingStatus]}>{row.billingStatus}</Badge>
      ) : <span>—</span>,
    },
    {
      key: "dischargeSummary",
      label: "Discharge Summary",
      render: (row) => row.dischargeSummary === "Ready" ? (
        <Badge className="bg-green-100 text-green-700">Ready</Badge>
      ) : (
        <Badge className="bg-amber-100 text-amber-700">Not Ready</Badge>
      ),
    },
    { key: "followUpAppointment", label: "Follow-up", render: (row) => row.followUpAppointment || "—" },
  ];

  const pendingColumns: Column<IPPatientRecord>[] = [
    { key: "mrn", label: "MRN", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ageSex", label: "Age/Sex" },
    { key: "ward", label: "Ward" },
    { key: "room", label: "Room" },
    { key: "bed", label: "Bed" },
    { key: "plannedDischargeDateTime", label: "Planned Discharge", sortable: true, render: (row) => row.plannedDischargeDateTime || "—" },
    {
      key: "blockingTasks",
      label: "Blocking Tasks",
      render: (row) => row.blockingTasks?.length ? (
        <div className="flex flex-wrap gap-1">
          {row.blockingTasks.map((task) => (
            <Badge key={task} className="bg-red-100 text-red-700 text-xs">{task}</Badge>
          ))}
        </div>
      ) : <span>—</span>,
    },
    { key: "attendingDoctor", label: "Attending Doctor" },
    { key: "lengthOfStay", label: "LOS", render: (row) => <span>{row.lengthOfStay} days</span> },
  ];

  const filters: Filter[] = [
    {
      key: "ward",
      label: "Ward",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "Ward-A", label: "Ward A" },
        { value: "Ward-B", label: "Ward B" },
        { value: "Private Wing", label: "Private Wing" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "dischargeStatus", paramValue: "Pending", displayLabel: "Discharge Pending", count: dischargePending.length },
  ];

  const rowActions: RowAction<IPPatientRecord>[] = [
    { label: "View Summary", onClick: (row) => navigate(`/patient-insights/${row.mrn}`) },
    { label: "Print Discharge Summary", onClick: (row) => console.log("Print", row.mrn) },
    { label: "Export to PDF", onClick: (row) => console.log("Export", row.mrn) },
  ];

  const displayColumns = dischargeStatus === "Pending" ? pendingColumns : dischargedColumns;

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      subtitle="Discharge records for today • Default sort: Discharge Date/Time DESC"
      breadcrumbs={["Overview", pageTitle]}
      columns={displayColumns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No discharged patients for today."
      searchPlaceholder="Search by MRN, name, ward..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}`)}
    />
  );
};

export default DischargedToday;
