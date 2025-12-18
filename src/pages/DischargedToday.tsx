import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { dischargedPatients, dischargePending, IPPatientRecord } from "@/data/overview.mock";

// Generate billing amounts based on mrn for variety
const getBillingAmount = (mrn: string) => {
  const amounts = [12500, 45000, 78000, 23400, 56700, 34500, 89000, 15600, 67800, 41200];
  const numericPart = parseInt(mrn.replace(/\D/g, '')) || 0;
  return amounts[numericPart % amounts.length];
};

const getPaymentMode = (mrn: string) => {
  const modes = ["Cash", "Card", "UPI", "Insurance", "NEFT"];
  const numericPart = parseInt(mrn.replace(/\D/g, '')) || 0;
  return modes[numericPart % modes.length];
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
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="discharged" />
    },
    { key: "visitId", label: "Visit ID" },
    { 
      key: "ward", 
      label: "Ward/Bed",
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.ward}</span>
          <span className="text-muted-foreground text-xs">{row.bed}</span>
        </div>
      )
    },
    { 
      key: "dischargeDateTime", 
      label: "Discharge Date/Time", 
      sortable: true, 
      render: (row) => {
        if (!row.dischargeDateTime) return "—";
        const [date, time] = row.dischargeDateTime.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      }
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => {
        const amount = getBillingAmount(row.mrn);
        return <span>₹{amount.toLocaleString('en-IN')}</span>;
      },
    },
    {
      key: "paid",
      label: "Paid",
      render: (row) => {
        const amount = getBillingAmount(row.mrn);
        return <span className="text-green-600 font-medium">₹{amount.toLocaleString('en-IN')}</span>;
      },
    },
    {
      key: "balance",
      label: "Balance",
      render: () => <span>₹0</span>,
    },
    {
      key: "mode",
      label: "Mode",
      render: (row) => <span>{getPaymentMode(row.mrn)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: () => <Badge className="bg-green-100 text-green-700">Settled</Badge>,
    },
  ];

  const pendingColumns: Column<IPPatientRecord>[] = [
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="discharged" />
    },
    { key: "visitId", label: "Visit ID" },
    { key: "ward", label: "Ward" },
    { key: "room", label: "Room" },
    { key: "bed", label: "Bed" },
    { 
      key: "plannedDischargeDateTime", 
      label: "Planned Discharge", 
      sortable: true, 
      render: (row) => {
        if (!row.plannedDischargeDateTime) return "—";
        const [date, time] = row.plannedDischargeDateTime.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      }
    },
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

  // No sub-filters for Discharged - it's now a simple card

  const rowActions: RowAction<IPPatientRecord>[] = [
    { label: "View Summary", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=discharged`) },
    { label: "Print Discharge Summary", onClick: (row) => console.log("Print", row.mrn) },
    { label: "Export to PDF", onClick: (row) => console.log("Export", row.mrn) },
  ];

  const displayColumns = dischargeStatus === "Pending" ? pendingColumns : dischargedColumns;

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      breadcrumbs={["Overview", pageTitle]}
      columns={displayColumns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No discharged patients for today."
      searchPlaceholder="Search by MRN, name, ward..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}?from=discharged`)}
    />
  );
};

export default DischargedToday;
