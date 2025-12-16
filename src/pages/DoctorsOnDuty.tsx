import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { doctorsOnDuty, opDoctors, ipDoctors, otherDoctors, DoctorOnDutyRecord } from "@/data/overview.mock";

const roleStyles: Record<DoctorOnDutyRecord["role"], string> = {
  "Onsite": "bg-green-100 text-green-700",
  "On-call": "bg-blue-100 text-blue-700",
  "In OPD": "bg-purple-100 text-purple-700",
  "In OT": "bg-red-100 text-red-700",
  "In Ward Rounds": "bg-amber-100 text-amber-700",
};

const DoctorsOnDuty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorType = searchParams.get("type");

  let data = doctorsOnDuty;
  let displayCount = doctorsOnDuty.length;
  let pageTitle = "Doctors on Duty";
  let pageSubtitle = "Active physicians on current shift • Default sort: Specialty ASC";

  if (doctorType === "op") {
    data = opDoctors;
    displayCount = opDoctors.length;
    pageTitle = "OP Doctors";
    pageSubtitle = "Outpatient doctors on duty • Default sort: Specialty ASC";
  } else if (doctorType === "ip") {
    data = ipDoctors;
    displayCount = ipDoctors.length;
    pageTitle = "IP Doctors";
    pageSubtitle = "Inpatient doctors on duty • Default sort: Specialty ASC";
  } else if (doctorType === "other") {
    data = otherDoctors;
    displayCount = otherDoctors.length;
    pageTitle = "Other Doctors";
    pageSubtitle = "Other doctors on duty (ER, OR, On-call) • Default sort: Specialty ASC";
  }

  const columns: Column<DoctorOnDutyRecord>[] = [
    { key: "doctorName", label: "Doctor Name", sortable: true },
    { key: "specialty", label: "Specialty", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => (
        <Badge className={roleStyles[row.role]}>{row.role}</Badge>
      ),
    },
    { key: "shiftStart", label: "Shift Start" },
    { key: "shiftEnd", label: "Shift End" },
    { key: "currentLocation", label: "Current Location" },
    { key: "contactPager", label: "Contact/Pager" },
  ];

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
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "type", paramValue: "op", displayLabel: "OP Doctors", count: opDoctors.length },
    { paramKey: "type", paramValue: "ip", displayLabel: "IP Doctors", count: ipDoctors.length },
    { paramKey: "type", paramValue: "other", displayLabel: "Other Doctors", count: otherDoctors.length },
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
      subtitle={pageSubtitle}
      breadcrumbs={["Overview", pageTitle]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No doctors currently on duty."
      searchPlaceholder="Search by name, specialty..."
      getRowId={(row) => row.doctorName}
    />
  );
};

export default DoctorsOnDuty;