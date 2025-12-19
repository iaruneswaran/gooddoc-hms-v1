import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Button } from "@/components/ui/button";
import { PatientCell } from "@/components/overview/PatientCell";
import { appointmentRequests, AppointmentRequestRecord } from "@/data/overview.mock";

const AppointmentRequests = () => {
  const navigate = useNavigate();

  const columns: Column<AppointmentRequestRecord>[] = [
    { 
      key: "patient", 
      label: "Patient Info", 
      sortable: true,
      width: "220px",
      render: (row) => <PatientCell name={row.patient} gdid={row.requestId} ageSex={row.ageSex} patientId={row.requestId} fromPage="scheduled" />
    },
    { 
      key: "contact", 
      label: "Contact",
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.contact}</span>
          <span className="text-muted-foreground text-xs">{row.email}</span>
        </div>
      )
    },
    { 
      key: "preferredDate", 
      label: "Preferred Date", 
      sortable: true,
      render: (row) => <span>{row.preferredDate}</span>
    },
    { 
      key: "preferredTime", 
      label: "Preferred Time", 
      sortable: true,
      render: (row) => <span>{row.preferredTime}</span>
    },
    { 
      key: "preferredProvider", 
      label: "Doctor", 
      render: (row) => <span>{row.preferredProvider || "Any"}</span>
    },
    { 
      key: "department", 
      label: "Department", 
      render: (row) => <span>{row.department}</span>
    },
    { key: "reason", label: "Reason" },
    {
      key: "visitType",
      label: "Visit Type",
      sortable: true,
      render: (row) => <span>{row.visitType}</span>,
    },
    {
      key: "actions",
      label: "",
      width: "140px",
      render: (row) => (
        <Button 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/book-appointment?requestId=${row.requestId}`);
          }}
        >
          Schedule Now
        </Button>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "visitType",
      label: "Visit Type",
      value: "all",
      options: [
        { value: "OP", label: "OP" },
        { value: "IP", label: "IP" },
        { value: "Emergency", label: "Emergency" },
        { value: "Follow-up", label: "Follow-up" },
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
