import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatINR } from "@/utils/currency";

interface ImagingOrder {
  id: string;
  patientName: string;
  gdid: string;
  ageSex: string;
  visitId: string;
  tests: string;
  status: "Pending" | "Ready";
  orderedDoctor: string;
  time: string;
  date: string;
}

const mockImaging: ImagingOrder[] = [
  { id: "IMG-001", patientName: "Rahul Sharma", gdid: "GD101", ageSex: "34 | M", visitId: "V25-901", tests: "Full Mouth X-Ray", status: "Ready", orderedDoctor: "Dr. Sarah Dental", time: "09:30 AM", date: "07-05-2026" },
  { id: "IMG-002", patientName: "Priya Patel", gdid: "GD102", ageSex: "28 | F", visitId: "V25-902", tests: "Bitewing X-Ray", status: "Pending", orderedDoctor: "Dr. Rahul Smile", time: "10:15 AM", date: "07-05-2026" },
  { id: "IMG-003", patientName: "Amit Kumar", gdid: "GD103", ageSex: "45 | M", visitId: "V25-903", tests: "Panoramic X-Ray", status: "Ready", orderedDoctor: "Dr. Sarah Dental", time: "11:00 AM", date: "07-05-2026" },
  { id: "IMG-004", patientName: "Sneha Roy", gdid: "GD104", ageSex: "22 | F", visitId: "V25-904", tests: "Periapical X-Ray", status: "Pending", orderedDoctor: "Dr. Anita Braces", time: "02:30 PM", date: "07-05-2026" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Ready: "bg-green-100 text-green-700",
};

const DentalImagingList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get("status");
  
  let data = mockImaging;
  let displayCount = data.length;
  let pageTitle = "Dental Imaging";

  if (statusFilter === "Pending") {
    data = data.filter(i => i.status === "Pending");
    displayCount = data.length;
  } else if (statusFilter === "Ready") {
    data = data.filter(i => i.status === "Ready");
    displayCount = data.length;
  }

  const columns: Column<ImagingOrder>[] = [
    {
      key: "patient",
      label: "Patient",
      render: (row) => <PatientCell patientId={row.gdid} name={row.patientName} gdid={row.gdid} ageSex={row.ageSex} fromPage="dental-imaging" />,
    },
    { key: "visitId", label: "Visit ID" },
    { key: "tests", label: "Imaging Type" },
    {
      key: "orderedDoctor",
      label: "Dentist",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.orderedDoctor}</span>
          <span className="text-xs text-muted-foreground">Dental Clinic</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        <Badge className={`${statusStyles[row.status]} min-w-[100px] justify-center`}>{row.status}</Badge>
      ),
    },
    {
      key: "time",
      label: "Ordered",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.time}</span>
          <span className="text-xs text-muted-foreground">{row.date}</span>
        </div>
      ),
    },
    {
      key: "fee",
      label: "Cost",
      render: () => <span className="font-medium">{formatINR(1200 * 100)}</span>
    }
  ];

  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Ready", value: "Ready" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "status", paramValue: "Pending", displayLabel: "Pending Report", count: mockImaging.filter(i => i.status === "Pending").length },
    { paramKey: "status", paramValue: "Ready", displayLabel: "Ready", count: mockImaging.filter(i => i.status === "Ready").length },
  ];

  const rowActions: RowAction<ImagingOrder>[] = [
    { label: "View Image", onClick: (row) => console.log("View image", row.id) },
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.gdid}?from=dental-imaging`) },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      searchPlaceholder="Search by patient name, visit ID..."
      breadcrumbs={["Dental", "Imaging"]}
      emptyMessage="No imaging orders found"
      getRowId={(row) => row.id}
      pageKey="dental-imaging"
    />
  );
}

export default DentalImagingList;
