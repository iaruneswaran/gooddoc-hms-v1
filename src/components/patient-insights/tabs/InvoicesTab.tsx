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
  service: string;
  totalAmount: number;
  partiallyPaid: number;
  balance: number;
  status: "Paid" | "Partially Paid" | "Pending";
}

// Mock invoices data
const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    service: "General Consultation",
    totalAmount: 150000,
    partiallyPaid: 50000,
    balance: 100000,
    status: "Partially Paid",
  },
  {
    id: "INV-2024-002",
    date: "2024-01-10",
    service: "Blood Test - CBC",
    totalAmount: 80000,
    partiallyPaid: 80000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2024-003",
    date: "2024-01-05",
    service: "X-Ray Chest",
    totalAmount: 120000,
    partiallyPaid: 0,
    balance: 120000,
    status: "Pending",
  },
];

export function InvoicesTab({ selectedVisit }: InvoicesTabProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">Payable Bills</h3>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
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
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-muted/20 transition-colors">
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
