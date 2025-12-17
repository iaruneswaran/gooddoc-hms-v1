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
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="ip-patients" />
    },
    { key: "visitId", label: "Visit ID" },
    { 
      key: "admitDateTime", 
      label: "Admit Date/Time", 
      sortable: true,
      render: (row) => {
        const [date, time] = row.admitDateTime.split(' ');
        return (
          <div className="flex flex-col">
            <span>{date}</span>
            <span className="text-muted-foreground text-xs">{time}</span>
          </div>
        );
      }
    },
    { 
      key: "ward", 
      label: "Ward/Bed", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.ward}</span>
          <span className="text-muted-foreground text-xs">Bed {row.bed}</span>
        </div>
      )
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
      key: "emergencyContact", 
      label: "Emergency Contact",
      render: (row) => row.emergencyContact ? (
        <span>{row.emergencyContact}</span>
      ) : <span className="text-muted-foreground">—</span>,
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
    { label: "View Chart", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=ip-patients`) },
    { label: "Patient 360", onClick: (row) => navigate(`/patients/${row.mrn}/360?from=ip-patients`) },
    { label: "Transfer Bed", onClick: (row) => console.log("Transfer", row.mrn) },
    { label: "Start Discharge", onClick: (row) => navigate(`/patient-insights/${row.mrn}/discharge?from=ip-patients`) },
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
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}?from=ip-patients`)}
    />
  );
};

export default IPPatients;
