import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { opPatients as initialOpPatients, opCompleted, opCheckedIn, opPendingCheckIn, OPPatientRecord } from "@/data/overview.mock";
import { toast } from "sonner";
import { formatINR } from "@/utils/currency";

const statusStyles: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700",
  "Checked-in": "bg-blue-100 text-blue-700",
  "Completed": "bg-green-100 text-green-700",
};

const DentalConsultationsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitStatusFilter = searchParams.get("status");

  // Filter for Dental only
  const dentalData = initialOpPatients.map(p => ({ ...p, department: "Dental" }));

  let data = dentalData;
  let displayCount = data.length;
  let pageTitle = "Dental Consultations";

  if (visitStatusFilter === "Completed") {
    data = data.filter(p => p.status === "Completed");
    displayCount = data.length;
  } else if (visitStatusFilter === "Waiting") {
    data = data.filter(p => p.status === "Checked-in");
    displayCount = data.length;
  }

  const columns: Column<OPPatientRecord>[] = [
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="dental-consults" />
    },
    { key: "visitId", label: "Visit ID" },
    { 
      key: "appointmentTime", 
      label: "Time", 
      sortable: true,
      render: (row) => {
        const [date, time] = row.appointmentTime.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      }
    },
    { 
      key: "provider", 
      label: "Dentist",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.provider}</span>
          <span className="text-muted-foreground text-xs">Dental Clinic</span>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={`${statusStyles[row.status]} min-w-[100px] justify-center`}>{row.status}</Badge>
      ),
    },
    {
      key: "billAmount",
      label: "Fee",
      render: (row) => {
        const amount = 800; // Mock consultation fee
        return <span className="font-medium">{formatINR(amount * 100)}</span>;
      },
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Checked-in", label: "Checked-in" },
        { value: "Completed", label: "Completed" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "status", paramValue: "Completed", displayLabel: "Completed", count: dentalData.filter(p => p.status === "Completed").length },
    { paramKey: "status", paramValue: "Waiting", displayLabel: "In Waiting", count: dentalData.filter(p => p.status === "Checked-in").length },
  ];

  const rowActions: RowAction<OPPatientRecord>[] = [
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=dental-consults`) },
    { label: "Check In", onClick: (row) => toast.success("Checked in"), hidden: (row) => row.status !== "Pending" },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      breadcrumbs={["Dental", "Consultations"]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No consultations found."
      searchPlaceholder="Search by MRN, name..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}?from=dental-consults`)}
      pageKey="dental-consultations"
    />
  );
};

export default DentalConsultationsList;
