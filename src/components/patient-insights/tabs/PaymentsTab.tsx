import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Eye, CreditCard, Banknote, Building2, Smartphone } from "lucide-react";
import { Visit } from "../VisitListItem";
import { formatINR } from "@/utils/currency";

interface PaymentsTabProps {
  selectedVisit: Visit | null;
}

// Mock transactions with enhanced data (amounts in paise - 100 paise = ₹1)
const allTransactions = [
  // V25-004 transactions (Active visit - Cardiology follow-up)
  {
    id: "TXN-2025-041",
    invoiceNo: "INV-2025-001236",
    date: "20-Dec-2025",
    time: "09:00",
    visitId: "V25-004",
    type: "Bill",
    service: "Cardiology Consultation",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    method: "—",
    payer: "—",
    originalAmount: 250000,
    totalAmount: 250000,
    paidAmount: 0,
    balanceAmount: 250000,
    status: "Unpaid" as const,
  },
  {
    id: "TXN-2025-042",
    invoiceNo: "INV-2025-001237",
    date: "20-Dec-2025",
    time: "10:30",
    visitId: "V25-004",
    type: "Bill",
    service: "ECG Test",
    doctor: "Dr. Meera Nair",
    department: "Diagnostics",
    method: "Cash",
    payer: "Harish Kalyan",
    originalAmount: 100000,
    totalAmount: 80000,
    paidAmount: 40000,
    balanceAmount: 40000,
    status: "Partial" as const,
  },
  {
    id: "TXN-2025-043",
    invoiceNo: "INV-2025-001238",
    date: "20-Dec-2025",
    time: "11:00",
    visitId: "V25-004",
    type: "Bill",
    service: "Laboratory - Lipid Profile",
    doctor: "Dr. Meera Nair",
    department: "Laboratory",
    method: "—",
    payer: "—",
    originalAmount: 65000,
    totalAmount: 65000,
    paidAmount: 0,
    balanceAmount: 65000,
    status: "Unpaid" as const,
  },
  // V25-002 transactions (General Medicine checkup)
  {
    id: "TXN-2025-021",
    invoiceNo: "INV-2025-001240",
    date: "15-Dec-2025",
    time: "09:00",
    visitId: "V25-002",
    type: "Bill",
    service: "General Consultation",
    doctor: "Dr. Arun Kumar",
    department: "General Medicine",
    method: "UPI",
    payer: "Harish Kalyan",
    originalAmount: 150000,
    totalAmount: 150000,
    paidAmount: 150000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
  {
    id: "TXN-2025-022",
    invoiceNo: "INV-2025-001241",
    date: "15-Dec-2025",
    time: "09:30",
    visitId: "V25-002",
    type: "Bill",
    service: "Blood Test - CBC",
    doctor: "Dr. Arun Kumar",
    department: "Laboratory",
    method: "UPI",
    payer: "Harish Kalyan",
    originalAmount: 85000,
    totalAmount: 80000,
    paidAmount: 80000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
  {
    id: "TXN-2025-023",
    invoiceNo: "INV-2025-001242",
    date: "15-Dec-2025",
    time: "09:45",
    visitId: "V25-002",
    type: "Bill",
    service: "Lipid Profile",
    doctor: "Dr. Arun Kumar",
    department: "Laboratory",
    method: "Card",
    payer: "Harish Kalyan",
    originalAmount: 120000,
    totalAmount: 120000,
    paidAmount: 120000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
  // V25-001 transactions (Cardiology - Chest pain)
  {
    id: "TXN-2025-011",
    invoiceNo: "INV-2025-001230",
    date: "01-Dec-2025",
    time: "14:00",
    visitId: "V25-001",
    type: "Bill",
    service: "Cardiology Consultation",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    method: "—",
    payer: "—",
    originalAmount: 250000,
    totalAmount: 250000,
    paidAmount: 0,
    balanceAmount: 250000,
    status: "Unpaid" as const,
  },
  {
    id: "TXN-2025-012",
    invoiceNo: "INV-2025-001231",
    date: "01-Dec-2025",
    time: "14:30",
    visitId: "V25-001",
    type: "Bill",
    service: "ECG Test",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    method: "—",
    payer: "—",
    originalAmount: 85000,
    totalAmount: 80000,
    paidAmount: 0,
    balanceAmount: 80000,
    status: "Unpaid" as const,
  },
  {
    id: "TXN-2025-013",
    invoiceNo: "INV-2025-001232",
    date: "01-Dec-2025",
    time: "15:00",
    visitId: "V25-001",
    type: "Bill",
    service: "Chest X-Ray",
    doctor: "Dr. Vinod Kumar",
    department: "Radiology",
    method: "—",
    payer: "—",
    originalAmount: 150000,
    totalAmount: 150000,
    paidAmount: 0,
    balanceAmount: 150000,
    status: "Unpaid" as const,
  },
  // V24-089 transactions (Orthopedics - Back pain)
  {
    id: "TXN-2024-891",
    invoiceNo: "INV-2024-001180",
    date: "15-Nov-2025",
    time: "10:00",
    visitId: "V24-089",
    type: "Bill",
    service: "Orthopedics Consultation",
    doctor: "Dr. Ashok Reddy",
    department: "Orthopedics",
    method: "Insurance",
    payer: "Star Health Insurance",
    originalAmount: 200000,
    totalAmount: 200000,
    paidAmount: 200000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
  {
    id: "TXN-2024-892",
    invoiceNo: "INV-2024-001181",
    date: "15-Nov-2025",
    time: "11:00",
    visitId: "V24-089",
    type: "Bill",
    service: "MRI Spine",
    doctor: "Dr. Vinod Kumar",
    department: "Radiology",
    method: "Insurance",
    payer: "Star Health Insurance",
    originalAmount: 900000,
    totalAmount: 850000,
    paidAmount: 850000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
  {
    id: "TXN-2024-893",
    invoiceNo: "INV-2024-001182",
    date: "16-Nov-2025",
    time: "09:00",
    visitId: "V24-089",
    type: "Bill",
    service: "Physiotherapy Session",
    doctor: "Dr. Ashok Reddy",
    department: "Physiotherapy",
    method: "Cash",
    payer: "Harish Kalyan",
    originalAmount: 100000,
    totalAmount: 100000,
    paidAmount: 100000,
    balanceAmount: 0,
    status: "Paid" as const,
  },
];

const getStatusBadge = (status: "Paid" | "Partial" | "Unpaid" | "Refunded") => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Paid</Badge>;
    case "Partial":
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Partial</Badge>;
    case "Unpaid":
      return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Unpaid</Badge>;
    case "Refunded":
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getMethodIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case "card":
      return <CreditCard className="h-3.5 w-3.5" />;
    case "cash":
      return <Banknote className="h-3.5 w-3.5" />;
    case "upi":
      return <Smartphone className="h-3.5 w-3.5" />;
    case "insurance":
      return <Building2 className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

export function PaymentsTab({ selectedVisit }: PaymentsTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view payment history.
        </p>
      </div>
    );
  }

  // Filter transactions for selected visit
  const visitTransactions = allTransactions.filter(
    (transaction) => transaction.visitId === selectedVisit.visitId
  );

  if (visitTransactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No payment transactions found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-semibold text-foreground">Visit Transactions</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Invoice No.</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Date & Time</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Service / Doctor</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Amount</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Paid / Balance</th>
              <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Mode</th>
              <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Status</th>
              <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-card divide-y">
            {visitTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/20 transition-colors">
                {/* Invoice No & Type */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">{transaction.invoiceNo}</span>
                    <span className="text-xs text-muted-foreground">{transaction.type}</span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{transaction.date}</span>
                    <span className="text-xs text-muted-foreground">{transaction.time}</span>
                  </div>
                </td>

                {/* Service / Doctor */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{transaction.service}</span>
                    <span className="text-xs text-muted-foreground">
                      {transaction.doctor} • {transaction.department}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="p-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-foreground">{formatINR(transaction.totalAmount)}</span>
                    {transaction.originalAmount !== transaction.totalAmount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatINR(transaction.originalAmount)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Paid / Balance */}
                <td className="p-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-emerald-600">{formatINR(transaction.paidAmount)}</span>
                    <span className={`text-xs ${transaction.balanceAmount > 0 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                      {formatINR(transaction.balanceAmount)}
                    </span>
                  </div>
                </td>

                {/* Mode */}
                <td className="p-3">
                  <div className="flex justify-center">
                    {transaction.method !== "—" ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-md">
                        {getMethodIcon(transaction.method)}
                        <span className="text-xs text-foreground">{transaction.method}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="p-3">
                  <div className="flex justify-center">
                    {getStatusBadge(transaction.status)}
                  </div>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>Showing 1 to {visitTransactions.length} of {visitTransactions.length} results</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}