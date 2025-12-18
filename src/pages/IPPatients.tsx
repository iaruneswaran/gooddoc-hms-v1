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
import { Badge } from "@/components/ui/badge";
import { User, UserRound, FileText, Clock, Stethoscope, Calendar, BedDouble, MapPin } from "lucide-react";

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

  const getGender = (ageSex: string) => {
    return ageSex.includes("M") ? "male" : "female";
  };

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
            <DialogTitle>Admission Summary</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Header */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    getGender(selectedPatient.ageSex) === "male" ? "bg-blue-100" : "bg-pink-100"
                  }`}>
                    {getGender(selectedPatient.ageSex) === "male" ? (
                      <User className="w-6 h-6 text-blue-600" />
                    ) : (
                      <UserRound className="w-6 h-6 text-pink-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-base">{selectedPatient.patient}</p>
                    <p className="text-muted-foreground text-sm">
                      GDID - {selectedPatient.mrn.slice(-3).padStart(3, '0')} • {selectedPatient.ageSex}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Admitted
                </Badge>
              </div>

              {/* Info Grid Row 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Visit ID</p>
                    <p className="text-sm font-medium">{selectedPatient.visitId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Length of Stay</p>
                    <p className="text-sm font-medium">{selectedPatient.lengthOfStay} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Stethoscope className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    <p className="text-sm font-medium">{selectedPatient.attendingDoctor}</p>
                  </div>
                </div>
              </div>

              {/* Info Grid Row 2 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Admit Date/Time</p>
                    <p className="text-sm font-medium">{selectedPatient.admitDateTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BedDouble className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ward/Bed</p>
                    <p className="text-sm font-medium">{selectedPatient.ward} - Bed {selectedPatient.bed}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bed Class</p>
                    <p className="text-sm font-medium">{selectedPatient.bedClass}</p>
                  </div>
                </div>
              </div>

              {/* Clinical Information Box */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Clinical Information</p>
                <p className="text-sm text-muted-foreground italic">
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
