import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { ipPatients, newAdmissions, erCasesToday, IPPatientRecord } from "@/data/overview.mock";

const bedClassStyles: Record<IPPatientRecord["bedClass"], string> = {
  "ICU": "bg-red-100 text-red-700",
  "HDU": "bg-orange-100 text-orange-700",
  "Private": "bg-purple-100 text-purple-700",
  "Ward": "bg-blue-100 text-blue-700",
};

const IPPatients = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admittedToday = searchParams.get("admittedToday");
  const erCase = searchParams.get("erCase");

  let data = ipPatients;
  let displayCount = ipPatients.length;
  let pageTitle = "IP Patients";
  let pageSubtitle = "Inpatient records • Default sort: Admit Date/Time DESC";

  if (admittedToday === "true") {
    data = newAdmissions;
    displayCount = newAdmissions.length;
    pageTitle = "New Admissions";
    pageSubtitle = "Patients admitted today • Default sort: Admit Date/Time DESC";
  } else if (erCase === "true") {
    data = erCasesToday;
    displayCount = erCasesToday.length;
    pageTitle = "Emergency Case";
    pageSubtitle = "ER cases admitted today • Default sort: Admit Date/Time DESC";
  }

  const columns: Column<IPPatientRecord>[] = [
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} />
    },
    { key: "admitDateTime", label: "Admit Date/Time", sortable: true },
    { key: "ward", label: "Ward", sortable: true },
    { key: "room", label: "Room" },
    { key: "bed", label: "Bed" },
    {
      key: "bedClass",
      label: "Bed Class",
      render: (row) => (
        <Badge className={bedClassStyles[row.bedClass]}>{row.bedClass}</Badge>
      ),
    },
    { key: "attendingDoctor", label: "Attending Doctor", sortable: true },
    { key: "primaryDiagnosis", label: "Primary Diagnosis" },
    {
      key: "lengthOfStay",
      label: "LOS (days)",
      sortable: true,
      render: (row) => <span>{row.lengthOfStay} days</span>,
    },
    {
      key: "isolation",
      label: "Isolation",
      render: (row) => row.isolation ? (
        <Badge className="bg-yellow-100 text-yellow-700">{row.isolation}</Badge>
      ) : <span>—</span>,
    },
  ];

  const filters: Filter[] = [
    {
      key: "ward",
      label: "Ward",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "HDU", label: "HDU" },
        { value: "Ward-A", label: "Ward A" },
        { value: "Ward-B", label: "Ward B" },
        { value: "Private Wing", label: "Private Wing" },
      ],
    },
    {
      key: "bedClass",
      label: "Bed Class",
      value: "all",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "HDU", label: "HDU" },
        { value: "Private", label: "Private" },
        { value: "Ward", label: "Ward" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "admittedToday", paramValue: "true", displayLabel: "New Admissions", count: newAdmissions.length },
    { paramKey: "erCase", paramValue: "true", displayLabel: "Emergency Case", count: erCasesToday.length },
  ];

  const rowActions: RowAction<IPPatientRecord>[] = [
    { label: "View Chart", onClick: (row) => navigate(`/patient-insights/${row.mrn}`) },
    { label: "Patient 360", onClick: (row) => navigate(`/patients/${row.mrn}/360`) },
    { label: "Transfer Bed", onClick: (row) => console.log("Transfer", row.mrn) },
    { label: "Start Discharge", onClick: (row) => navigate(`/patient-insights/${row.mrn}/discharge`) },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      subtitle={pageSubtitle}
      breadcrumbs={["Overview", pageTitle]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No IP patients found."
      searchPlaceholder="Search by MRN, name, ward, bed..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}`)}
    />
  );
};

export default IPPatients;
