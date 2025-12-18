import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { PatientCell } from "@/components/overview/PatientCell";
import { ipPatients, newAdmissions, erCasesToday, IPPatientRecord } from "@/data/overview.mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BedDouble } from "lucide-react";

const IPPatients = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admittedToday = searchParams.get("admittedToday");
  const erCase = searchParams.get("erCase");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPPatientRecord | null>(null);

  let data = ipPatients;
  let displayCount = ipPatients.length;
  let pageTitle = "IP Patients";

  if (admittedToday === "true") {
    data = newAdmissions;
    displayCount = newAdmissions.length;
    pageTitle = "New Admissions";
  } else if (erCase === "true") {
    data = erCasesToday;
    displayCount = erCasesToday.length;
    pageTitle = "Emergency Case";
  }

  const handleViewSummary = (row: IPPatientRecord) => {
    setSelectedPatient(row);
    setSummaryOpen(true);
  };

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
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
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
    { 
      key: "attendingDoctor", 
      label: "Attending Doctor", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.attendingDoctor}</span>
          <span className="text-muted-foreground text-xs">{row.primaryDiagnosis}</span>
        </div>
      )
    },
    {
      key: "lengthOfStay",
      label: "Days",
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

  // Extract unique doctors from data
  const uniqueDoctors = [...new Set(data.map(p => p.attendingDoctor))].sort();

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
    {
      key: "attendingDoctor",
      label: "Doctor",
      value: "all",
      options: uniqueDoctors.map(doctor => ({ value: doctor, label: doctor })),
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "admittedToday", paramValue: "true", displayLabel: "New Admissions", count: newAdmissions.length },
    { paramKey: "erCase", paramValue: "true", displayLabel: "Emergency Case", count: erCasesToday.length },
  ];

  const rowActions: RowAction<IPPatientRecord>[] = [
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=ip-patients`) },
    { label: "View Summary", onClick: (row) => handleViewSummary(row) },
  ];

  return (
    <>
      <ListPageLayout
        title={pageTitle}
        count={displayCount}
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

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5" />
              Admission Summary
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Visit ID</p>
                  <p className="text-sm font-medium">{selectedPatient.visitId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Admit Date/Time</p>
                  <p className="text-sm font-medium">{selectedPatient.admitDateTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Length of Stay</p>
                  <p className="text-sm font-medium">{selectedPatient.lengthOfStay} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bed Class</p>
                  <p className="text-sm font-medium">{selectedPatient.bedClass}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="text-sm font-medium">{selectedPatient.patient}</p>
                  <p className="text-xs text-muted-foreground">GDID - {selectedPatient.mrn.slice(-3).padStart(3, '0')} • {selectedPatient.ageSex}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Attending Doctor</p>
                  <p className="text-sm font-medium">{selectedPatient.attendingDoctor}</p>
                  <p className="text-xs text-muted-foreground">{selectedPatient.primaryDiagnosis}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Ward</p>
                  <p className="text-sm font-medium">{selectedPatient.ward}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bed</p>
                  <p className="text-sm font-medium">Bed {selectedPatient.bed}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="text-sm font-medium">{selectedPatient.emergencyContact || "Not provided"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground">Clinical Information</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Patient admitted for {selectedPatient.primaryDiagnosis}. Currently in {selectedPatient.ward} under the care of {selectedPatient.attendingDoctor}.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IPPatients;
