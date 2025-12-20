import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { appointmentRequests, AppointmentRequestRecord } from "@/data/overview.mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Calendar, Clock, Stethoscope, MapPin, FileText, Hash } from "lucide-react";

const AppointmentRequests = () => {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequestRecord | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Map visitType to simplified display
  const getVisitTypeLabel = (visitType: string): string => {
    return visitType === "Follow-up" ? "Follow up" : "First Visit";
  };

  const getVisitTypeBadgeStyle = (visitType: string): string => {
    return visitType === "Follow-up" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-green-100 text-green-700";
  };

  const handleViewSummary = (row: AppointmentRequestRecord) => {
    setSelectedRequest(row);
    setShowSummary(true);
  };

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
{
      key: "visitType",
      label: "Visit Type",
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className={getVisitTypeBadgeStyle(row.visitType)}>
          {getVisitTypeLabel(row.visitType)}
        </Badge>
      ),
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
        { value: "First Visit", label: "First Visit" },
        { value: "Follow-up", label: "Follow up" },
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
    { label: "View Appointment Summary", onClick: (row) => handleViewSummary(row) },
    { label: "Schedule Now", onClick: (row) => navigate(`/book-appointment?requestId=${row.requestId}`) },
    { label: "Contact Patient", onClick: (row) => console.log("Contact", row.contact) },
    { label: "Reject", onClick: (row) => console.log("Reject", row.requestId) },
  ];

  return (
    <>
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

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Appointment Summary</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRequest.ageSex.includes('F') ? 'bg-pink-100' : 'bg-blue-100'}`}>
                  <User className={`w-5 h-5 ${selectedRequest.ageSex.includes('F') ? 'text-pink-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedRequest.patient}</p>
                  <p className="text-sm text-muted-foreground">GDID - {selectedRequest.requestId.slice(-3)} • {selectedRequest.ageSex}</p>
                </div>
                <Badge className={`ml-auto ${selectedRequest.status === "New" ? "bg-amber-100 text-amber-700" : selectedRequest.status === "Pending" ? "bg-blue-100 text-blue-700" : selectedRequest.status === "Scheduled" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {selectedRequest.status === "New" ? "Pending Check-in" : selectedRequest.status}
                </Badge>
              </div>

              {/* Visit Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Visit ID</p>
                      <p className="text-sm font-medium">V25-{selectedRequest.requestId.slice(-3)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Appointment Time</p>
                      <p className="text-sm font-medium">{selectedRequest.preferredDate} {selectedRequest.preferredTime}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in Time</p>
                      <p className="text-sm font-medium">Not checked in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Token/Queue No.</p>
                      <p className="text-sm font-medium">Not assigned</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Doctor</p>
                      <p className="text-sm font-medium">{selectedRequest.preferredProvider || "Any"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{selectedRequest.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Clinical Information</p>
                <p className="text-sm text-muted-foreground italic">No clinical information available.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentRequests;