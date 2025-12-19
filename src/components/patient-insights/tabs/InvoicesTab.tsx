import { Visit } from "../VisitListItem";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface InvoicesTabProps {
  selectedVisit: Visit | null;
}

interface Invoice {
  id: string;
  date: string;
  visitId: string;
  service: string;
  totalAmount: number;
  partiallyPaid: number;
  balance: number;
  status: "Paid" | "Partially Paid" | "Pending";
}

// Mock invoices data with visitId
const mockInvoices: Invoice[] = [
  // V25-004 invoices (Active visit - Cardiology follow-up)
  {
    id: "INV-2025-041",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "Cardiology Consultation",
    totalAmount: 250000,
    partiallyPaid: 0,
    balance: 250000,
    status: "Pending",
  },
  {
    id: "INV-2025-042",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "ECG Test",
    totalAmount: 80000,
    partiallyPaid: 0,
    balance: 80000,
    status: "Pending",
  },
  // V25-002 invoices (General Medicine checkup)
  {
    id: "INV-2025-021",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "General Consultation",
    totalAmount: 150000,
    partiallyPaid: 150000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2025-022",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "Blood Test - CBC",
    totalAmount: 80000,
    partiallyPaid: 80000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2025-023",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "Lipid Profile",
    totalAmount: 120000,
    partiallyPaid: 120000,
    balance: 0,
    status: "Paid",
  },
  // V25-001 invoices (Cardiology - Chest pain)
  {
    id: "INV-2025-011",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Cardiology Consultation",
    totalAmount: 250000,
    partiallyPaid: 250000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2025-012",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "ECG Test",
    totalAmount: 80000,
    partiallyPaid: 80000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2025-013",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Chest X-Ray",
    totalAmount: 150000,
    partiallyPaid: 50000,
    balance: 100000,
    status: "Partially Paid",
  },
  // V24-089 invoices (Orthopedics - Back pain)
  {
    id: "INV-2024-891",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Orthopedics Consultation",
    totalAmount: 200000,
    partiallyPaid: 200000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2024-892",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "MRI Spine",
    totalAmount: 850000,
    partiallyPaid: 850000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2024-893",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Physiotherapy Session",
    totalAmount: 100000,
    partiallyPaid: 100000,
    balance: 0,
    status: "Paid",
  },
];

export function InvoicesTab({ selectedVisit }: InvoicesTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view bills.
        </p>
      </div>
    );
  }

  // Filter invoices for selected visit
  const visitInvoices = mockInvoices.filter(
    (invoice) => invoice.visitId === selectedVisit.visitId
  );

  if (visitInvoices.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No bills found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">Payable Bills</h3>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Visit ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Bill No</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Total Amount</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Partially Paid</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Balance</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-card">
            {visitInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-mono font-medium text-foreground">{invoice.visitId}</p>
                </td>
                <td className="p-4 text-sm font-medium">{invoice.id}</td>
                <td className="p-4 text-sm">{invoice.date}</td>
                <td className="p-4 text-sm">{invoice.service}</td>
                <td className="p-4 text-sm font-medium text-primary">
                  {formatINR(invoice.totalAmount)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatINR(invoice.partiallyPaid)}
                </td>
                <td className="p-4 text-sm font-semibold text-primary">
                  {formatINR(invoice.balance)}
                </td>
                <td className="p-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Download invoice"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Print invoice"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
