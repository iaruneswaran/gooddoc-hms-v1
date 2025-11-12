import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TransactionRow } from "@/types/billing";
import { formatINR } from "@/utils/currency";
import { FileText } from "lucide-react";

interface AdvanceTransactionsTableProps {
  transactions: TransactionRow[];
  onAdjustToInvoice?: (transactionId: string) => void;
  onRefund?: (transactionId: string) => void;
}

export function AdvanceTransactionsTable({
  transactions,
  onAdjustToInvoice,
  onRefund,
}: AdvanceTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No advance transactions found</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Advance Transactions</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Reason</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-medium">{txn.id}</td>
                <td className="p-4 text-sm">{txn.date}</td>
                <td className="p-4 text-sm">{txn.serviceOrReason}</td>
                <td className="p-4 text-sm">{txn.party}</td>
                <td className="p-4 text-sm font-semibold text-primary">
                  {txn.amount >= 0 ? "+" : ""}
                  {formatINR(Math.abs(txn.amount))}
                </td>
                <td className="p-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      txn.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : txn.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {onAdjustToInvoice && txn.amount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAdjustToInvoice(txn.id)}
                      >
                        Adjust
                      </Button>
                    )}
                    {onRefund && txn.amount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefund(txn.id)}
                      >
                        Refund
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
