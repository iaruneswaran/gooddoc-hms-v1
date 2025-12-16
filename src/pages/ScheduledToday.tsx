import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { appointmentRequests, AppointmentRequestRecord } from "@/data/overview.mock";

const urgencyStyles: Record<AppointmentRequestRecord["urgency"], string> = {
  "Low": "bg-green-100 text-green-700",
  "Med": "bg-amber-100 text-amber-700",
  "High": "bg-red-100 text-red-700",
};

const statusStyles: Record<AppointmentRequestRecord["status"], string> = {
  "New": "bg-blue-100 text-blue-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Scheduled": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
};

const sourceStyles: Record<AppointmentRequestRecord["source"], string> = {
  "Call": "bg-purple-100 text-purple-700",
  "Portal": "bg-blue-100 text-blue-700",
  "Walk-in": "bg-green-100 text-green-700",
  "Referral": "bg-amber-100 text-amber-700",
};

const AppointmentRequests = () => {
  const navigate = useNavigate();

  const columns: Column<AppointmentRequestRecord>[] = [
    { key: "requestId", label: "Request ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "contact", label: "Contact" },
    { key: "preferredDateTime", label: "Preferred Date/Time", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "preferredProvider", label: "Preferred Provider", render: (row) => row.preferredProvider || "Any" },
    { key: "reason", label: "Reason" },
    {
      key: "urgency",
      label: "Urgency",
      sortable: true,
      render: (row) => (
        <Badge className={urgencyStyles[row.urgency]}>{row.urgency}</Badge>
      ),
    },
    {
      key: "source",
      label: "Source",
      render: (row) => (
        <Badge className={sourceStyles[row.source]}>{row.source}</Badge>
      ),
    },
    {
      key: "insuranceVerified",
      label: "Insurance Verified",
      render: (row) => row.insuranceVerified ? (
        <Badge className="bg-green-100 text-green-700">Yes</Badge>
      ) : (
        <Badge className="bg-amber-100 text-amber-700">No</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "New", label: "New" },
        { value: "Pending", label: "Pending" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
    {
      key: "urgency",
      label: "Urgency",
      value: "all",
      options: [
        { value: "Low", label: "Low" },
        { value: "Med", label: "Medium" },
        { value: "High", label: "High" },
      ],
    },
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
  ];

  const rowActions: RowAction<AppointmentRequestRecord>[] = [
    { label: "Schedule Now", onClick: (row) => navigate(`/book-appointment?requestId=${row.requestId}`) },
    { label: "Contact Patient", onClick: (row) => console.log("Contact", row.contact) },
    { label: "Reject", onClick: (row) => console.log("Reject", row.requestId) },
  ];

  return (
    <ListPageLayout
      title="Appointment Requests"
      count={appointmentRequests.length}
      subtitle="Pending appointment requests • Default sort: Created At DESC"
      breadcrumbs={["Overview", "Appointment Requests"]}
      columns={columns}
      data={appointmentRequests}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No appointment requests pending."
      searchPlaceholder="Search by Request ID, patient name..."
      getRowId={(row) => row.requestId}
      onRowClick={(row) => navigate(`/book-appointment?requestId=${row.requestId}`)}
    />
  );
};

export default AppointmentRequests;
