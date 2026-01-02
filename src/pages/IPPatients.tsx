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
import { User, UserRound, FileText, Stethoscope, Calendar, BedDouble, MapPin, IndianRupee } from "lucide-react";
import { formatINR } from "@/utils/currency";
import { CalendarWidget } from "@/components/CalendarWidget";

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
      key: "ipStatus",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge 
          className={row.ipStatus === "admitted" 
            ? "bg-green-100 text-green-700 border-green-200" 
            : "bg-gray-100 text-gray-700 border-gray-200"}
        >
          {row.ipStatus === "admitted" ? "Admitted" : "Discharged"}
        </Badge>
      )
    },
    { 
      key: "admitDateTime", 
      label: "Admit/Discharged Date", 
      sortable: true,
      render: (row) => {
        const displayDateTime = row.ipStatus === "discharged" && row.dischargeDateTime 
          ? row.dischargeDateTime 
          : row.admitDateTime;
        const [date, time] = displayDateTime.split(' ');
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
      key: "billAmount",
      label: "Payment Details",
      sortable: true,
      render: (row) => {
        // Generate bill amount based on mrn for variety
        const billAmounts = [15000, 25000, 35000, 45000, 55000, 65000, 75000, 85000, 95000, 105000];
        const numericPart = parseInt(row.mrn.replace(/\D/g, '')) || 0;
        const billAmount = row.billAmount ?? billAmounts[numericPart % billAmounts.length];
        const advance = row.advancePaid ?? row.totalPaid ?? 0;
        const balance = billAmount - advance;
        
        return (
          <div className="flex flex-col text-xs space-y-0.5">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Bill:</span>
              <span className="font-medium">{formatINR(billAmount * 100)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Advance:</span>
              <span className="text-green-600">{formatINR(advance * 100)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Balance:</span>
              <span className={balance > 0 ? "text-amber-600 font-medium" : "text-green-600"}>{formatINR(balance * 100)}</span>
            </div>
          </div>
        );
      },
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
      key: "ipStatus",
      label: "Status",
      value: "all",
      options: [
        { value: "admitted", label: "Admitted" },
        { value: "discharged", label: "Discharged" },
      ],
    },
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
    {
      key: "admitDate",
      label: "Admit Date",
      value: "all",
      options: [
        { value: "today", label: "Today" },
        { value: "last7days", label: "Last 7 Days" },
        { value: "last30days", label: "Last 30 Days" },
      ],
    },
    {
      key: "dischargeDate",
      label: "Discharge Date",
      value: "all",
      options: [
        { value: "today", label: "Today" },
        { value: "last7days", label: "Last 7 Days" },
        { value: "last30days", label: "Last 30 Days" },
      ],
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
        hideExportPrint
        customHeaderContent={<CalendarWidget />}
      />

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admission Summary</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-5">
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

              {/* Info Grids */}
              <div className="space-y-4">
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
                    <IndianRupee className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Details</p>
                      <p className="text-sm font-medium">
                        {(selectedPatient.totalPaid ?? 0) > 0 
                          ? formatINR(selectedPatient.totalPaid ?? 0)
                          : "No payment"}
                      </p>
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
