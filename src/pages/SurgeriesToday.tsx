import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { surgeries, SurgeryRecord } from "@/data/overview.mock";

const statusStyles: Record<SurgeryRecord["status"], string> = {
  "Scheduled": "bg-gray-100 text-gray-700",
  "In-Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-green-100 text-green-700",
  "Canceled": "bg-red-100 text-red-700",
};

const SurgeriesToday = () => {
  const navigate = useNavigate();

  const columns: Column<SurgeryRecord>[] = [
    { key: "caseId", label: "Case ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ageSex", label: "Age/Sex" },
    { key: "procedure", label: "Procedure" },
    { key: "surgeon", label: "Surgeon", sortable: true },
    { key: "orRoom", label: "OR Room" },
    { key: "startTime", label: "Start Time", sortable: true },
    { key: "estimatedDuration", label: "Est. Duration" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    { key: "anesthesiaType", label: "Anesthesia Type" },
    { key: "asaClass", label: "ASA Class" },
    {
      key: "postOpBedReserved",
      label: "Post-op Bed Reserved",
      render: (row) => row.postOpBedReserved ? (
        <Badge className="bg-green-100 text-green-700">Yes</Badge>
      ) : (
        <Badge className="bg-amber-100 text-amber-700">No</Badge>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "In-Progress", label: "In-Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Canceled", label: "Canceled" },
      ],
    },
    {
      key: "orRoom",
      label: "OR Room",
      value: "all",
      options: [
        { value: "OR-1", label: "OR-1" },
        { value: "OR-2", label: "OR-2" },
        { value: "OR-3", label: "OR-3" },
        { value: "OR-4", label: "OR-4" },
        { value: "OR-5", label: "OR-5" },
      ],
    },
  ];

  const rowActions: RowAction<SurgeryRecord>[] = [
    { label: "View Case Details", onClick: (row) => console.log("View case", row.caseId) },
    { label: "Patient Chart", onClick: (row) => navigate(`/patient-insights/${row.patient.replace(/\s+/g, "-").toLowerCase()}`) },
    { label: "Update Status", onClick: (row) => console.log("Update status", row.caseId) },
  ];

  // Sort to pin In-Progress at top
  const sortedSurgeries = [...surgeries].sort((a, b) => {
    if (a.status === "In-Progress" && b.status !== "In-Progress") return -1;
    if (a.status !== "In-Progress" && b.status === "In-Progress") return 1;
    return 0;
  });

  return (
    <ListPageLayout
      title="Surgeries"
      count={surgeries.length}
      subtitle="Operating room schedule for today • Default sort: Start Time ASC (In-Progress pinned)"
      breadcrumbs={["Overview", "Surgeries"]}
      columns={columns}
      data={sortedSurgeries}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No surgeries scheduled for today."
      searchPlaceholder="Search by Case ID, patient, procedure, surgeon..."
      getRowId={(row) => row.caseId}
    />
  );
};

export default SurgeriesToday;
