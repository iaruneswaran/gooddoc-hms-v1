import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";

interface DentalProcedure {
  id: string;
  patientName: string;
  mrn: string;
  ageSex: string;
  procedureId: string;
  date: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  dentist: string;
  price: number;
  category: "General" | "Restorative" | "Surgical" | "Cosmetic";
  treatment: string[];
}

const mockProcedures: DentalProcedure[] = [
  {
    id: "DP-101",
    patientName: "Aditya Verma",
    mrn: "GD3042",
    ageSex: "28 | M",
    procedureId: "DPROC-2026-001",
    date: "07-05-2026",
    time: "10:00 AM",
    status: "Completed",
    dentist: "Dr. Sarah Dental",
    price: 1500.00,
    category: "General",
    treatment: ["Scaling", "Polishing"]
  },
  {
    id: "DP-102",
    patientName: "Meera Nair",
    mrn: "GD3055",
    ageSex: "34 | F",
    procedureId: "DPROC-2026-002",
    date: "07-05-2026",
    time: "11:30 AM",
    status: "In Progress",
    dentist: "Dr. Rahul Smile",
    price: 8500.00,
    category: "Restorative",
    treatment: ["Root Canal Treatment", "Post & Core"]
  },
  {
    id: "DP-103",
    patientName: "Sanjay Gupta",
    mrn: "GD3068",
    ageSex: "45 | M",
    procedureId: "DPROC-2026-003",
    date: "07-05-2026",
    time: "02:00 PM",
    status: "Scheduled",
    dentist: "Dr. Sarah Dental",
    price: 45000.00,
    category: "Surgical",
    treatment: ["Dental Implant", "Bone Grafting"]
  },
  {
    id: "DP-104",
    patientName: "Ananya Roy",
    mrn: "GD3072",
    ageSex: "22 | F",
    procedureId: "DPROC-2026-004",
    date: "07-05-2026",
    time: "03:30 PM",
    status: "Scheduled",
    dentist: "Dr. Anita Braces",
    price: 12000.00,
    category: "Cosmetic",
    treatment: ["Teeth Whitening", "Composite Veneers"]
  }
];

const statusStyles: Record<string, string> = {
  "Scheduled": "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Completed": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};

const DentalProcedures = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const typeFilter = searchParams.get("type");

  let data = mockProcedures;
  let displayCount = data.length;
  let pageTitle = "Dental Procedures";

  if (statusFilter === "active") {
    data = data.filter(p => p.status === "In Progress" || p.status === "Scheduled");
    displayCount = data.length;
  }

  if (typeFilter) {
    data = data.filter(p => p.category.toLowerCase() === typeFilter.toLowerCase() || p.treatment.some(t => t.includes(typeFilter)));
    displayCount = data.length;
  }

  const columns: Column<DentalProcedure>[] = [
    { 
      key: "patientName", 
      label: "Patient", 
      sortable: true,
      width: "200px",
      render: (row) => <PatientCell name={row.patientName} gdid={row.mrn} ageSex={row.ageSex} patientId={row.mrn} fromPage="dental-procedures" />
    },
    { key: "ageSex", label: "Age/Sex" },
    { 
      key: "alerts", 
      label: "Alerts",
      render: (row) => (
        <div className="flex gap-1">
          {row.mrn === "GD3042" && <Badge variant="destructive" className="h-5 text-[10px] px-1 bg-destructive/10 text-destructive border-none">Penicillin</Badge>}
          {row.mrn === "GD3055" && <Badge variant="warning" className="h-5 text-[10px] px-1">Diabetic</Badge>}
        </div>
      )
    },
    { 
      key: "date", 
      label: "Last Visit", 
      render: (row) => <span className="text-muted-foreground">{row.date}</span>
    },
    {
      key: "treatment",
      label: "Outstanding Treatments",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.treatment.map(t => <Badge key={t} variant="outline" className="text-[10px] py-0">{t}</Badge>)}
        </div>
      )
    },
    { key: "dentist", label: "Assigned Doctor" },
  ];

  const filters: Filter[] = [
    {
      key: "category",
      label: "Category",
      value: "all",
      options: [
        { value: "General", label: "General" },
        { value: "Restorative", label: "Restorative" },
        { value: "Surgical", label: "Surgical" },
        { value: "Cosmetic", label: "Cosmetic" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "type", paramValue: "RCT", displayLabel: "Root Canal", count: mockProcedures.filter(p => p.treatment.includes("Root Canal Treatment")).length },
    { paramKey: "type", paramValue: "Cleaning", displayLabel: "Cleaning", count: mockProcedures.filter(p => p.treatment.includes("Scaling")).length },
  ];

  const rowActions: RowAction<DentalProcedure>[] = [
    { label: "Open Consultation", onClick: (row) => navigate(`/dental/procedures/patients/${row.mrn}/consultation`) },
    { label: "View History", onClick: (row) => console.log("View history", row.id) },
    { label: "Print Summary", onClick: (row) => console.log("Print summary", row.id) },
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.mrn}?from=dental-procedures`) },
  ];

  return (
    <ListPageLayout
      title="Patient List"
      count={displayCount}
      breadcrumbs={["Dental Procedures", "Patient List"]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No patients found. Adjust filters or add a new patient."
      searchPlaceholder="Search by name, ID, phone..."
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/dental/procedures/patients/${row.mrn}/consultation`)}
      pageKey="dental-procedures"
    />
  );
};

export default DentalProcedures;
