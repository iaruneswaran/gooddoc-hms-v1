import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { doctorsOnDuty, opDoctors, ipDoctors, otherDoctors, DoctorOnDutyRecord } from "@/data/overview.mock";
import { Stethoscope } from "lucide-react";

const roleStyles: Record<DoctorOnDutyRecord["role"], string> = {
  "Onsite": "bg-green-100 text-green-700",
  "On-call": "bg-blue-100 text-blue-700",
  "In OPD": "bg-purple-100 text-purple-700",
  "In OT": "bg-red-100 text-red-700",
  "In Ward Rounds": "bg-amber-100 text-amber-700",
  "In Procedure": "bg-orange-100 text-orange-700",
  "Break": "bg-gray-100 text-gray-700",
  "Remote": "bg-indigo-100 text-indigo-700",
};

const statusStyles: Record<NonNullable<DoctorOnDutyRecord["currentStatus"]>, string> = {
  "Available": "bg-green-100 text-green-700",
  "With Patient": "bg-blue-100 text-blue-700",
  "In Procedure": "bg-amber-100 text-amber-700",
  "On Break": "bg-gray-100 text-gray-700",
  "In Meeting": "bg-purple-100 text-purple-700",
};

const DoctorCell = ({ name, degrees }: { name: string; degrees: string }) => {
  const initials = name.replace("Dr. ", "").split(" ").map(n => n[0]).join("");
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 bg-primary/10">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-foreground truncate">{name}</span>
        <span className="text-xs text-muted-foreground truncate">{degrees}</span>
      </div>
    </div>
  );
};

const DoctorsOnDuty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorType = searchParams.get("type");

  let data = doctorsOnDuty;
  let displayCount = doctorsOnDuty.length;
  let pageTitle = "Doctors on Duty";

  // Define columns based on doctor type
  const baseColumns: Column<DoctorOnDutyRecord>[] = [
    { 
      key: "doctorName", 
      label: "Doctor", 
      sortable: true,
      width: "220px",
      render: (row) => <DoctorCell name={row.doctorName} degrees={row.degrees} />
    },
    { key: "specialty", label: "Specialty", sortable: true },
  ];

  let specificColumns: Column<DoctorOnDutyRecord>[] = [];

  if (doctorType === "op") {
    data = opDoctors;
    displayCount = opDoctors.length;
    pageTitle = "OP Doctors";
    
    specificColumns = [
      { key: "department", label: "Department/Clinic", sortable: true },
      { key: "opdRoom", label: "OPD Room", render: (row) => row.opdRoom || "—" },
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => <Badge className={roleStyles[row.role]}>{row.role}</Badge>,
      },
      { key: "shiftStart", label: "Shift Start" },
      { key: "shiftEnd", label: "Shift End" },
      {
        key: "currentStatus",
        label: "Current Status",
        render: (row) => row.currentStatus ? (
          <Badge className={statusStyles[row.currentStatus]}>{row.currentStatus}</Badge>
        ) : <span>—</span>,
      },
      { key: "queueLength", label: "Queue Length", sortable: true, render: (row) => row.queueLength ?? "—" },
      { key: "nextAppointmentAt", label: "Next Appointment At", render: (row) => row.nextAppointmentAt || "—" },
      { key: "slotsAvailable", label: "Slots Available", render: (row) => row.slotsAvailable ?? "—" },
      { key: "avgConsultTime", label: "Avg Consult (mins)", render: (row) => row.avgConsultTime ? `${row.avgConsultTime} min` : "—" },
      { key: "contactPager", label: "Contact/Pager" },
    ];
  } else if (doctorType === "ip") {
    data = ipDoctors;
    displayCount = ipDoctors.length;
    pageTitle = "IP Doctors";
    
    specificColumns = [
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => <Badge className={roleStyles[row.role]}>{row.role}</Badge>,
      },
      { key: "primaryUnits", label: "Primary Units/Wards", render: (row) => row.primaryUnits || "—" },
      { key: "currentLocation", label: "Current Location" },
      { key: "shiftStart", label: "Shift Start" },
      { key: "shiftEnd", label: "Shift End" },
      {
        key: "onCallStatus",
        label: "On-call",
        render: (row) => row.onCallStatus ? (
          <Badge className="bg-amber-100 text-amber-700">Yes</Badge>
        ) : <span className="text-muted-foreground">No</span>,
      },
      { key: "ipCensus", label: "IP Census", sortable: true, render: (row) => row.ipCensus ?? "—" },
      { key: "roundsStartTime", label: "Rounds Start Time", render: (row) => row.roundsStartTime || "—" },
      { key: "nextTask", label: "Next Task", render: (row) => row.nextTask || "—" },
      { key: "contactPager", label: "Contact/Pager" },
    ];
  } else if (doctorType === "other") {
    data = otherDoctors;
    displayCount = otherDoctors.length;
    pageTitle = "Emergency Doctors";
    
    specificColumns = [
      { key: "context", label: "Context/Assignment", render: (row) => row.context || "—" },
      { key: "currentLocation", label: "Location" },
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => <Badge className={roleStyles[row.role]}>{row.role}</Badge>,
      },
      { key: "shiftStart", label: "Shift Start" },
      { key: "shiftEnd", label: "Shift End" },
      {
        key: "currentStatus",
        label: "Current Status",
        render: (row) => row.currentStatus ? (
          <Badge className={statusStyles[row.currentStatus]}>{row.currentStatus}</Badge>
        ) : <span>—</span>,
      },
      { key: "casesToday", label: "Cases/Tasks Today", render: (row) => row.casesToday ?? "—" },
      { key: "contactPager", label: "Contact/Pager" },
      { key: "notes", label: "Notes", render: (row) => row.notes || "—" },
    ];
  } else {
    // Default view - all doctors
    specificColumns = [
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => <Badge className={roleStyles[row.role]}>{row.role}</Badge>,
      },
      { key: "shiftStart", label: "Shift Start" },
      { key: "shiftEnd", label: "Shift End" },
      { key: "currentLocation", label: "Current Location" },
      { key: "contactPager", label: "Contact/Pager" },
    ];
  }

  const columns = [...baseColumns, ...specificColumns];

  const filters: Filter[] = [
    {
      key: "specialty",
      label: "Specialty",
      value: "all",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Neurology", label: "Neurology" },
        { value: "General Medicine", label: "General Medicine" },
        { value: "Pediatrics", label: "Pediatrics" },
      ],
    },
    {
      key: "role",
      label: "Role",
      value: "all",
      options: [
        { value: "Onsite", label: "Onsite" },
        { value: "On-call", label: "On-call" },
        { value: "In OPD", label: "In OPD" },
        { value: "In OT", label: "In OT" },
        { value: "In Ward Rounds", label: "In Ward Rounds" },
        { value: "In Procedure", label: "In Procedure" },
        { value: "Remote", label: "Remote" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "type", paramValue: "op", displayLabel: "OP Doctors", count: opDoctors.length },
    { paramKey: "type", paramValue: "ip", displayLabel: "IP Doctors", count: ipDoctors.length },
    { paramKey: "type", paramValue: "other", displayLabel: "Emergency Doctors", count: otherDoctors.length },
  ];

  const rowActions: RowAction<DoctorOnDutyRecord>[] = [
    { label: "View Schedule", onClick: (row) => navigate(`/doctors/${row.doctorName.replace(/\s+/g, "-").toLowerCase()}/schedule`) },
    { label: "View Calendar", onClick: (row) => navigate(`/doctors/${row.doctorName.replace(/\s+/g, "-").toLowerCase()}/calendar`) },
    { label: "Contact", onClick: (row) => console.log("Contact", row.contactPager) },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      breadcrumbs={["Overview", pageTitle]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No doctors currently on duty."
      searchPlaceholder="Search by name, specialty, department..."
      getRowId={(row) => row.doctorName + row.contactPager}
    />
  );
};

export default DoctorsOnDuty;