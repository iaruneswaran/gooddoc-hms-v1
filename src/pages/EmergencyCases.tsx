import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { emergencyCases, ERCaseRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const EmergencyCases = () => {
  const navigate = useNavigate();

  const triageStyles: Record<number, string> = {
    1: "bg-red-600 text-white",
    2: "bg-orange-500 text-white",
    3: "bg-yellow-500 text-black",
    4: "bg-green-500 text-white",
    5: "bg-blue-500 text-white",
  };

  const triageLabels: Record<number, string> = {
    1: "Level 1 - Resuscitation",
    2: "Level 2 - Emergent",
    3: "Level 3 - Urgent",
    4: "Level 4 - Less Urgent",
    5: "Level 5 - Non-Urgent",
  };

  const statusStyles: Record<string, string> = {
    Waiting: "badge-warning",
    Treating: "badge-info",
    Admitted: "badge-success",
    Transferred: "badge-info",
    Discharged: "badge-success",
  };

  const columns: Column<ERCaseRecord>[] = [
    { key: "id", label: "Case ID", sortable: true },
    { key: "patientName", label: "Patient", sortable: true },
    {
      key: "triageLevel",
      label: "Triage Level",
      sortable: true,
      render: (row) => (
        <Badge className={triageStyles[row.triageLevel]}>
          Level {row.triageLevel}
        </Badge>
      ),
    },
    {
      key: "arrivalTime",
      label: "Arrival Time",
      sortable: true,
      render: (row) => format(new Date(row.arrivalTime), "HH:mm"),
    },
    { key: "assignedPhysician", label: "Assigned Physician", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    { key: "erAreaBed", label: "ER Area/Bed" },
  ];

  const filters: Filter[] = [
    {
      key: "triageLevel",
      label: "Triage",
      value: "all",
      options: [
        { value: "1", label: "Level 1" },
        { value: "2", label: "Level 2" },
        { value: "3", label: "Level 3" },
        { value: "4", label: "Level 4" },
        { value: "5", label: "Level 5" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Waiting", label: "Waiting" },
        { value: "Treating", label: "Treating" },
        { value: "Admitted", label: "Admitted" },
        { value: "Transferred", label: "Transferred" },
        { value: "Discharged", label: "Discharged" },
      ],
    },
  ];

  const rowActions: RowAction<ERCaseRecord>[] = [
    { label: "Open ER Case", onClick: (row) => navigate(`/er/case/${row.id}`) },
    { label: "Update Triage/Status", onClick: () => {} },
    { label: "Assign Physician", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Emergency Cases"
      count={emergencyCases.length}
      subtitle="ER arrivals and active cases"
      breadcrumbs={["Overview", "Emergency Cases"]}
      data={emergencyCases}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No ER cases today."
      searchPlaceholder="Search by Case ID or Patient Name..."
      onRowClick={(row) => navigate(`/er/case/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default EmergencyCases;
