import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { format } from "date-fns";

interface DiagnosticsOrder {
  id: string;
  patientId: string;
  patientName: string;
  gdid: string;
  ageSex: string;
  visitId: string;
  location: string;
  ward?: string;
  bed?: string;
  tests: string;
  type: "Laboratory" | "Radiology";
  specimenType?: string;
  modality?: string;
  status: string;
  collectedAt?: Date;
  scheduledAt?: Date;
  resultEta?: string;
  criticalResult: boolean;
  imagingLocation?: string;
  contrast?: boolean;
}

const statusStyles: Record<string, string> = {
  Ordered: "bg-blue-100 text-blue-700",
  Collected: "bg-yellow-100 text-yellow-700",
  Scheduled: "bg-purple-100 text-purple-700",
  "In-Process": "bg-orange-100 text-orange-700",
  "In-Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Verified: "bg-emerald-100 text-emerald-700",
  Finalized: "bg-emerald-100 text-emerald-700",
};

// Combined mock data
const diagnosticsOrders: DiagnosticsOrder[] = [
  // Laboratory orders
  { id: "L001", patientId: "P000", patientName: "Anjali Kumar", gdid: "000", ageSex: "50 | M", visitId: "V25-100", location: "Ward-A", bed: "Bed 1", tests: "CBC", type: "Laboratory", specimenType: "Blood", status: "Ordered", resultEta: "17:48", criticalResult: true },
  { id: "L002", patientId: "P001", patientName: "Karthik Kumar", gdid: "001", ageSex: "49 | F", visitId: "V25-101", location: "OP", tests: "BMP", type: "Laboratory", specimenType: "Urine", status: "Collected", collectedAt: new Date("2025-12-18T15:19:00"), resultEta: "17:48", criticalResult: false },
  { id: "L003", patientId: "P002", patientName: "Divya Kumar", gdid: "002", ageSex: "41 | M", visitId: "V25-102", location: "OP", tests: "CMP", type: "Laboratory", specimenType: "Stool", status: "In-Process", collectedAt: new Date("2025-12-18T16:11:00"), resultEta: "17:48", criticalResult: false },
  { id: "L004", patientId: "P003", patientName: "Suresh Kumar", gdid: "003", ageSex: "60 | F", visitId: "V25-103", location: "Ward-A", bed: "Bed 4", tests: "Lipid Panel", type: "Laboratory", specimenType: "Swab", status: "Completed", collectedAt: new Date("2025-12-18T16:01:00"), criticalResult: false },
  { id: "L005", patientId: "P004", patientName: "Lakshmi Kumar", gdid: "004", ageSex: "28 | M", visitId: "V25-104", location: "OP", tests: "LFT", type: "Laboratory", specimenType: "CSF", status: "Verified", collectedAt: new Date("2025-12-18T15:19:00"), criticalResult: false },
  { id: "L006", patientId: "P005", patientName: "Rajan Kumar", gdid: "005", ageSex: "80 | F", visitId: "V25-105", location: "OP", tests: "TFT", type: "Laboratory", specimenType: "Sputum", status: "Ordered", resultEta: "17:48", criticalResult: false },
  { id: "L007", patientId: "P006", patientName: "Meena Kumar", gdid: "006", ageSex: "40 | M", visitId: "V25-106", location: "Ward-A", bed: "Bed 7", tests: "Coagulation", type: "Laboratory", specimenType: "Blood", status: "Collected", collectedAt: new Date("2025-12-18T15:59:00"), resultEta: "17:48", criticalResult: false },
  { id: "L008", patientId: "P007", patientName: "Arjun Kumar", gdid: "007", ageSex: "49 | F", visitId: "V25-107", location: "OP", tests: "Cardiac Markers", type: "Laboratory", specimenType: "Urine", status: "In-Process", collectedAt: new Date("2025-12-18T16:11:00"), resultEta: "17:48", criticalResult: false },
  { id: "L009", patientId: "P008", patientName: "Kavitha Kumar", gdid: "008", ageSex: "22 | M", visitId: "V25-108", location: "OP", tests: "Urinalysis", type: "Laboratory", specimenType: "Stool", status: "Completed", collectedAt: new Date("2025-12-18T15:21:00"), criticalResult: false },
  { id: "L010", patientId: "P009", patientName: "Sanjay Kumar", gdid: "009", ageSex: "61 | F", visitId: "V25-109", location: "Ward-A", bed: "Bed 10", tests: "CBC", type: "Laboratory", specimenType: "Swab", status: "Verified", collectedAt: new Date("2025-12-18T15:51:00"), criticalResult: false },
  { id: "L011", patientId: "P010", patientName: "Amit Singh", gdid: "010", ageSex: "67 | M", visitId: "V25-110", location: "OP", tests: "BMP", type: "Laboratory", specimenType: "CSF", status: "Ordered", resultEta: "17:48", criticalResult: false },
  { id: "L012", patientId: "P011", patientName: "Priya Singh", gdid: "011", ageSex: "23 | F", visitId: "V25-111", location: "OP", tests: "CMP", type: "Laboratory", specimenType: "Sputum", status: "Collected", collectedAt: new Date("2025-12-18T16:13:00"), resultEta: "17:48", criticalResult: false },
  { id: "L013", patientId: "P012", patientName: "Rahul Singh", gdid: "012", ageSex: "54 | M", visitId: "V25-112", location: "Ward-A", bed: "Bed 3", tests: "Lipid Panel", type: "Laboratory", specimenType: "Blood", status: "In-Process", collectedAt: new Date("2025-12-18T15:47:00"), resultEta: "17:48", criticalResult: false },
  { id: "L014", patientId: "P013", patientName: "Sneha Singh", gdid: "013", ageSex: "57 | F", visitId: "V25-113", location: "OP", tests: "LFT", type: "Laboratory", specimenType: "Urine", status: "Completed", collectedAt: new Date("2025-12-18T15:51:00"), criticalResult: false },
  { id: "L015", patientId: "P014", patientName: "Vikram Singh", gdid: "014", ageSex: "36 | M", visitId: "V25-114", location: "OP", tests: "TFT", type: "Laboratory", specimenType: "Stool", status: "Verified", collectedAt: new Date("2025-12-18T16:11:00"), criticalResult: false },
  { id: "L016", patientId: "P015", patientName: "Anjali Singh", gdid: "015", ageSex: "69 | F", visitId: "V25-115", location: "Ward-A", bed: "Bed 6", tests: "Coagulation", type: "Laboratory", specimenType: "Swab", status: "Ordered", resultEta: "17:48", criticalResult: false },
  { id: "L017", patientId: "P016", patientName: "Karthik Singh", gdid: "016", ageSex: "76 | M", visitId: "V25-116", location: "OP", tests: "Cardiac Markers", type: "Laboratory", specimenType: "CSF", status: "Collected", collectedAt: new Date("2025-12-18T16:04:00"), resultEta: "17:48", criticalResult: false },
  { id: "L018", patientId: "P017", patientName: "Divya Singh", gdid: "017", ageSex: "46 | F", visitId: "V25-117", location: "OP", tests: "Urinalysis", type: "Laboratory", specimenType: "Sputum", status: "In-Process", collectedAt: new Date("2025-12-18T15:44:00"), resultEta: "17:48", criticalResult: false },
  { id: "L019", patientId: "P018", patientName: "Suresh Singh", gdid: "018", ageSex: "30 | M", visitId: "V25-118", location: "Ward-A", bed: "Bed 9", tests: "CBC", type: "Laboratory", specimenType: "Blood", status: "Completed", collectedAt: new Date("2025-12-18T16:01:00"), criticalResult: false },
  { id: "L020", patientId: "P019", patientName: "Lakshmi Singh", gdid: "019", ageSex: "45 | F", visitId: "V25-119", location: "OP", tests: "BMP", type: "Laboratory", specimenType: "Urine", status: "Verified", collectedAt: new Date("2025-12-18T15:41:00"), criticalResult: false },
  { id: "L021", patientId: "P020", patientName: "Rajan Singh", gdid: "020", ageSex: "42 | M", visitId: "V25-120", location: "OP", tests: "CMP", type: "Laboratory", specimenType: "Stool", status: "Ordered", resultEta: "17:48", criticalResult: true },
  { id: "L022", patientId: "P021", patientName: "Meena Singh", gdid: "021", ageSex: "48 | F", visitId: "V25-121", location: "Ward-A", bed: "Bed 2", tests: "Lipid Panel", type: "Laboratory", specimenType: "Swab", status: "Collected", collectedAt: new Date("2025-12-18T15:30:00"), resultEta: "17:48", criticalResult: false },
  { id: "L023", patientId: "P022", patientName: "Arjun Singh", gdid: "022", ageSex: "71 | M", visitId: "V25-122", location: "OP", tests: "LFT", type: "Laboratory", specimenType: "CSF", status: "In-Process", collectedAt: new Date("2025-12-18T15:40:00"), resultEta: "17:48", criticalResult: false },
  { id: "L024", patientId: "P023", patientName: "Kavitha Singh", gdid: "023", ageSex: "59 | F", visitId: "V25-123", location: "OP", tests: "TFT", type: "Laboratory", specimenType: "Sputum", status: "Completed", collectedAt: new Date("2025-12-18T16:17:00"), criticalResult: false },
  { id: "L025", patientId: "P024", patientName: "Sanjay Singh", gdid: "024", ageSex: "65 | M", visitId: "V25-124", location: "Ward-A", bed: "Bed 5", tests: "Coagulation", type: "Laboratory", specimenType: "Blood", status: "Verified", collectedAt: new Date("2025-12-18T15:55:00"), criticalResult: false },
  // Radiology orders
  { id: "R001", patientId: "P100", patientName: "Anjali Gupta", gdid: "100", ageSex: "41 | M", visitId: "V25-400", location: "Ward-A", bed: "Bed 1", tests: "Chest X-ray", type: "Radiology", modality: "X-ray", status: "Ordered", scheduledAt: new Date("2025-12-18T08:00:00"), imagingLocation: "RAD-1", contrast: true, criticalResult: false },
  { id: "R002", patientId: "P101", patientName: "Karthik Gupta", gdid: "101", ageSex: "68 | F", visitId: "V25-401", location: "OP", tests: "CT Abdomen", type: "Radiology", modality: "CT", status: "Scheduled", scheduledAt: new Date("2025-12-18T08:15:00"), imagingLocation: "RAD-2", contrast: false, criticalResult: false },
  { id: "R003", patientId: "P102", patientName: "Divya Gupta", gdid: "102", ageSex: "32 | M", visitId: "V25-402", location: "OP", tests: "MRI Brain", type: "Radiology", modality: "MRI", status: "In-Progress", scheduledAt: new Date("2025-12-18T08:30:00"), imagingLocation: "RAD-3", contrast: false, criticalResult: false },
  { id: "R004", patientId: "P103", patientName: "Suresh Gupta", gdid: "103", ageSex: "74 | F", visitId: "V25-403", location: "Ward-A", bed: "Bed 4", tests: "US Abdomen", type: "Radiology", modality: "US", status: "Completed", scheduledAt: new Date("2025-12-18T08:45:00"), imagingLocation: "RAD-4", contrast: false, criticalResult: false },
  { id: "R005", patientId: "P104", patientName: "Lakshmi Gupta", gdid: "104", ageSex: "82 | M", visitId: "V25-404", location: "OP", tests: "CT Chest", type: "Radiology", modality: "Fluoro", status: "Finalized", scheduledAt: new Date("2025-12-18T09:00:00"), imagingLocation: "RAD-1", contrast: true, criticalResult: false },
  { id: "R006", patientId: "P105", patientName: "Rajan Gupta", gdid: "105", ageSex: "57 | F", visitId: "V25-405", location: "OP", tests: "MRI Spine", type: "Radiology", modality: "Mammo", status: "Ordered", scheduledAt: new Date("2025-12-18T09:15:00"), imagingLocation: "RAD-2", contrast: false, criticalResult: false },
  { id: "R007", patientId: "P106", patientName: "Meena Gupta", gdid: "106", ageSex: "52 | M", visitId: "V25-406", location: "Ward-A", bed: "Bed 7", tests: "X-ray Knee", type: "Radiology", modality: "X-ray", status: "Scheduled", scheduledAt: new Date("2025-12-18T09:30:00"), imagingLocation: "RAD-3", contrast: false, criticalResult: false },
  { id: "R008", patientId: "P107", patientName: "Arjun Gupta", gdid: "107", ageSex: "62 | F", visitId: "V25-407", location: "OP", tests: "CT Head", type: "Radiology", modality: "CT", status: "In-Progress", scheduledAt: new Date("2025-12-18T09:45:00"), imagingLocation: "RAD-4", contrast: false, criticalResult: false },
  { id: "R009", patientId: "P108", patientName: "Kavitha Gupta", gdid: "108", ageSex: "64 | M", visitId: "V25-408", location: "OP", tests: "Chest X-ray", type: "Radiology", modality: "MRI", status: "Completed", scheduledAt: new Date("2025-12-18T10:00:00"), imagingLocation: "RAD-1", contrast: true, criticalResult: false },
  { id: "R010", patientId: "P109", patientName: "Sanjay Gupta", gdid: "109", ageSex: "23 | F", visitId: "V25-409", location: "Ward-A", bed: "Bed 10", tests: "CT Abdomen", type: "Radiology", modality: "US", status: "Finalized", scheduledAt: new Date("2025-12-18T10:15:00"), imagingLocation: "RAD-2", contrast: false, criticalResult: false },
];

export default function DiagnosticsList() {
  const columns: Column<DiagnosticsOrder>[] = [
    {
      key: "patient",
      label: "Patient",
      render: (row) => (
        <PatientCell
          patientId={row.patientId}
          name={row.patientName}
          gdid={row.gdid}
          ageSex={row.ageSex}
          fromPage="diagnostics"
        />
      ),
    },
    {
      key: "visitId",
      label: "Visit ID",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-small">{row.visitId}</span>
          <span className="text-caption text-muted-foreground">{row.location}{row.bed ? `/${row.bed}` : ""}</span>
        </div>
      ),
    },
    {
      key: "tests",
      label: "Tests/Exam",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={row.type === "Laboratory" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
            {row.type === "Laboratory" ? "Lab" : "Rad"}
          </Badge>
          <span className="text-small">{row.tests}</span>
          {row.criticalResult && <span className="text-red-600 text-xs font-medium">CRIT</span>}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status] || "bg-gray-100 text-gray-700"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "collectedAt",
      label: "Time",
      render: (row) => {
        const dateTime = row.type === "Laboratory" ? row.collectedAt : row.scheduledAt;
        if (!dateTime) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-col">
            <span className="text-small">{format(dateTime, "HH:mm")}</span>
            <span className="text-caption text-muted-foreground">{format(dateTime, "dd-MMM-yyyy")}</span>
          </div>
        );
      },
    },
  ];

  const filters: Filter[] = [
    {
      key: "type",
      label: "Type",
      value: "all",
      options: [
        { label: "Laboratory", value: "Laboratory" },
        { label: "Radiology", value: "Radiology" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { label: "Ordered", value: "Ordered" },
        { label: "Collected", value: "Collected" },
        { label: "Scheduled", value: "Scheduled" },
        { label: "In-Process", value: "In-Process" },
        { label: "In-Progress", value: "In-Progress" },
        { label: "Completed", value: "Completed" },
        { label: "Verified", value: "Verified" },
        { label: "Finalized", value: "Finalized" },
      ],
    },
  ];

  const rowActions: RowAction<DiagnosticsOrder>[] = [
    { label: "View Details", onClick: (row) => console.log("View details", row.id) },
    { label: "Patient Insight", onClick: (row) => console.log("Patient insight", row.patientId) },
  ];

  return (
    <ListPageLayout
      title="Diagnostics"
      count={diagnosticsOrders.length}
      columns={columns}
      data={diagnosticsOrders}
      filters={filters}
      rowActions={rowActions}
      searchPlaceholder="Search by patient name, visit ID, test..."
      breadcrumbs={["Overview", "Diagnostics"]}
      emptyMessage="No diagnostics orders found"
      getRowId={(row) => row.id}
    />
  );
}
