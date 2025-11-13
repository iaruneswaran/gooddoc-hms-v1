import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, FileText } from "lucide-react";
import { formatINR } from "@/utils/currency";

// Mock invoices data
const MOCK_INVOICES = [
  {
    id: "INV-2025-001234",
    date: "15 Jun 2025",
    service: "Consultation - Dr. Sharma",
    totalAmount: 150000,
    partiallyPaid: 50000,
    balance: 100000,
    status: "Pending",
  },
  {
    id: "INV-2025-001189",
    date: "12 Jun 2025",
    service: "Laboratory Tests",
    totalAmount: 85000,
    partiallyPaid: 85000,
    balance: 0,
    status: "Paid",
  },
  {
    id: "INV-2025-001156",
    date: "10 Jun 2025",
    service: "Radiology - X-Ray",
    totalAmount: 120000,
    partiallyPaid: 60000,
    balance: 60000,
    status: "Partially Paid",
  },
];

export function ClaimInvoicesList() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Available Invoices</h3>
        </div>
        <Badge variant="secondary">{MOCK_INVOICES.length} invoices</Badge>
      </div>

      <div className="space-y-3">
        {MOCK_INVOICES.map((invoice) => (
          <div
            key={invoice.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{invoice.id}</p>
                  <Badge
                    variant={
                      invoice.status === "Paid"
                        ? "default"
                        : invoice.status === "Partially Paid"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : invoice.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{invoice.date}</p>
                <p className="text-sm">{invoice.service}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                <p className="text-sm font-semibold">{formatINR(invoice.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Paid</p>
                <p className="text-sm font-medium text-green-600">
                  {formatINR(invoice.partiallyPaid)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-sm font-semibold text-orange-600">
                  {formatINR(invoice.balance)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Printer className="h-3 w-3 mr-1" />
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>

      {MOCK_INVOICES.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No invoices available</p>
        </div>
      )}
    </Card>
  );
}
