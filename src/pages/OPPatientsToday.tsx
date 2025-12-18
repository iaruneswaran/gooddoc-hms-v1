import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { opPatients as initialOpPatients, opCompleted, opCheckedIn, opPendingCheckIn, OPPatientRecord } from "@/data/overview.mock";
import { toast } from "sonner";

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
  const [opPatientsData, setOpPatientsData] = useState<OPPatientRecord[]>(initialOpPatients);

  let data = opPatientsData;
  let displayCount = opPatientsData.length;

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

  const generateToken = () => {
    const tokenNum = Math.floor(Math.random() * 900) + 100;
    return `T${tokenNum}`;
  };

  const handleCheckIn = (row: OPPatientRecord) => {
    const now = new Date();
    const checkInTime = `${now.getDate().toString().padStart(2, '0')}-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const token = generateToken();

    setOpPatientsData(prev => prev.map(patient => 
      patient.mrn === row.mrn 
        ? { ...patient, status: "Checked-in" as const, checkInTime, tokenQueueNo: token }
        : patient
    ));

    toast.success(`Patient checked in successfully`, {
      description: `Token: ${token} assigned to ${row.patient}`,
    });
  };

  const columns: Column<OPPatientRecord>[] = [
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="op-patients" />
    },
    { key: "visitId", label: "Visit ID" },
    { 
      key: "appointmentTime", 
      label: "Appointment Time", 
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
      label: "Provider", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.provider}</span>
          <span className="text-muted-foreground text-xs">{row.department}</span>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    { 
      key: "checkInTime", 
      label: "Check-in Time", 
      render: (row) => {
        if (!row.checkInTime) return "—";
        const [date, time] = row.checkInTime.split(' ');
        return (
          <div className="flex flex-col">
            <span>{time}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        );
      }
    },
    { key: "tokenQueueNo", label: "Token/Queue No.", render: (row) => row.tokenQueueNo || "—" },
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
    { paramKey: "visitStatus", paramValue: "Completed", displayLabel: "Visit Completed", count: opCompleted.length },
    { paramKey: "visitStatus", paramValue: "Pending", displayLabel: "Check in completed", count: opCheckedIn.length },
    { paramKey: "visitStatus", paramValue: "In_Queue", displayLabel: "Check In Pending", count: opPendingCheckIn.length },
  ];

  const rowActions: RowAction<OPPatientRecord>[] = [
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=op-patients`) },
    { label: "Check In", onClick: (row) => handleCheckIn(row) },
  ];

  return (
    <ListPageLayout
      title="OP Patients"
      count={displayCount}
      breadcrumbs={["Overview", "OP Patients"]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No OP patients for today."
      searchPlaceholder="Search by MRN, name, Visit ID..."
      getRowId={(row) => row.mrn}
      onRowClick={(row) => navigate(`/patient-insights/${row.mrn}?from=op-patients`)}
    />
  );
};

export default OPPatientsToday;
