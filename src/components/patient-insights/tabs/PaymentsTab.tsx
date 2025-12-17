import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Visit } from "../VisitListItem";

interface PaymentsTabProps {
  selectedVisit: Visit | null;
}

// Mock transactions - filter by visit ID
const allTransactions = [
  {
    id: "INV-2025-001",
    date: "05 Aug 2025",
    visitId: "V050825-001",
    type: "Bill Payment",
    service: "Consultation",
    method: "Card",
    payer: "Harish Kalyan",
    amount: "1,500",
  },
  {
    id: "INV-2025-002",
    date: "05 Aug 2025",
    visitId: "V050825-002",
    type: "Bill Payment",
    service: "Laboratory",
    method: "UPI",
    payer: "Harish Kalyan",
    amount: "650",
  },
  {
    id: "INV-2025-003",
    date: "05 Aug 2025",
    visitId: "V050825-003",
    type: "Bill Payment",
    service: "Radiology",
    method: "Cash",
    payer: "Harish Kalyan",
    amount: "1,200",
  },
  {
    id: "INV-2025-004",
    date: "07 Aug 2025",
    visitId: "V070825-001",
    type: "Bill Payment",
    service: "IPD Admission",
    method: "Card",
    payer: "Harish Kalyan",
    amount: "5,800",
  },
  {
    id: "INV-2025-005",
    date: "07 Aug 2025",
    visitId: "V070825-002",
    type: "Bill Payment",
    service: "Day-Care",
    method: "Insurance",
    payer: "Harish Kalyan",
    amount: "12,500",
  },
];

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Visit Transactions</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download statement
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Method</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {visitTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-4 text-sm">{transaction.id}</td>
                <td className="p-4 text-sm">{transaction.date}</td>
                <td className="p-4 text-sm">{transaction.type}</td>
                <td className="p-4 text-sm">{transaction.service}</td>
                <td className="p-4 text-sm">{transaction.method}</td>
                <td className="p-4 text-sm">{transaction.payer}</td>
                <td className="p-4 text-sm text-primary font-medium">₹{transaction.amount}</td>
                <td className="p-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Printer className="h-4 w-4" />
                    </button>
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
