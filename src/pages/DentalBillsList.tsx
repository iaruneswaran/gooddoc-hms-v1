import { useNavigate, useSearchParams } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction, UrlParamFilter } from "@/components/overview/ListPageLayout";
import { Badge } from "@/components/ui/badge";
import { PatientCell } from "@/components/overview/PatientCell";
import { billsData, paidBills, outstandingBills, BillRecord } from "@/data/bills.mock";

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const statusStyles: Record<BillRecord["status"], string> = {
  "Paid": "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Unpaid": "bg-red-100 text-red-700",
};

const DentalBillsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  let data = billsData.map(bill => ({ ...bill, department: "Dental" }));
  let displayCount = data.length;
  let pageTitle = "Dental Revenue";

  if (typeFilter === "insurance") {
    data = data.filter(b => b.paymentMode === "Insurance");
    displayCount = data.length;
    pageTitle = "Dental Insurance Claims";
  } else if (typeFilter === "self") {
    data = data.filter(b => b.paymentMode !== "Insurance");
    displayCount = data.length;
    pageTitle = "Dental Self Pay Revenue";
  }

  const columns: Column<BillRecord>[] = [
    { 
      key: "patientName", 
      label: "Patient", 
      sortable: true,
      width: "200px",
      render: (row) => <PatientCell name={row.patientName} gdid={row.patientId} ageSex={row.ageSex} patientId={row.patientId} fromPage="dental-bills" />
    },
    { 
      key: "invoiceNo", 
      label: "Invoice No.",
      render: (row) => (
        <span className="font-medium">{row.invoiceNo}</span>
      )
    },
    { 
      key: "billDate", 
      label: "Bill Date", 
      sortable: true,
      render: (row) => {
        const [date, time] = row.billDate.split(' ');
        return (
          <div className="flex flex-col">
            <span>{date}</span>
            <span className="text-muted-foreground text-xs">{time}</span>
          </div>
        );
      }
    },
    {
      key: "doctor", 
      label: "Dentist", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.doctor}</span>
          <span className="text-muted-foreground text-xs">Dental Clinic</span>
        </div>
      )
    },
    { 
      key: "netAmount", 
      label: "Amount", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold">{formatCurrency(row.netAmount)}</span>
        </div>
      )
    },
    { 
      key: "paidAmount", 
      label: "Paid", 
      sortable: true,
      render: (row) => (
        <span className="text-green-600 font-medium">{formatCurrency(row.paidAmount)}</span>
      )
    },
    {
      key: "paymentMode",
      label: "Payment Mode",
      render: (row) => (
        <span className="text-sm text-muted-foreground">{row.status === "Unpaid" ? "—" : row.paymentMode}</span>
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
        { value: "Paid", label: "Paid" },
        { value: "Partial", label: "Partial" },
        { value: "Unpaid", label: "Unpaid" },
      ],
    },
    {
      key: "paymentMode",
      label: "Payment Mode",
      value: "all",
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "UPI", label: "UPI" },
        { value: "Insurance", label: "Insurance" },
      ],
    },
  ];

  const urlParamFilters: UrlParamFilter[] = [
    { paramKey: "type", paramValue: "insurance", displayLabel: "Insurance Claims", count: data.filter(b => b.paymentMode === "Insurance").length },
    { paramKey: "type", paramValue: "self", displayLabel: "Self Pay", count: data.filter(b => b.paymentMode !== "Insurance").length },
  ];

  const rowActions: RowAction<BillRecord>[] = [
    { label: "View Invoice", onClick: (row) => console.log("View invoice", row.invoiceNo) },
    { label: "Print Bill", onClick: (row) => console.log("Print bill", row.billId) },
    { label: "Patient Insight", onClick: (row) => navigate(`/patient-insights/${row.patientId}?from=dental-bills`) },
  ];

  return (
    <ListPageLayout
      title={pageTitle}
      count={displayCount}
      breadcrumbs={["Dental", "Revenue"]}
      columns={columns}
      data={data}
      filters={filters}
      rowActions={rowActions}
      urlParamFilters={urlParamFilters}
      emptyMessage="No dental bills found."
      searchPlaceholder="Search by Invoice No, patient name..."
      getRowId={(row) => row.billId}
      pageKey="dental-revenue"
    />
  );
};

export default DentalBillsList;
