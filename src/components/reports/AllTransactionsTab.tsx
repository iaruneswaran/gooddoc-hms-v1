import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Download, FileText, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const mockTransactions = [
  {
    id: "TX-902134",
    date: "2025-11-05 10:24",
    direction: "inflow",
    category: "Patient Payment",
    invoice: "INV-1042",
    patient: "Sarah Johnson",
    mrn: "MRN-88321",
    encounter: "E-2341",
    department: "OPD",
    provider: "Dr. Smith",
    method: "Card",
    gross: 250.0,
    discount: 0,
    net: 250.0,
    status: "Paid",
    balance: 0,
  },
  {
    id: "TX-902198",
    date: "2025-11-05 12:55",
    direction: "outflow",
    category: "Vendor Payment",
    invoice: "PO-7721",
    patient: "MedSupply Co.",
    mrn: "-",
    encounter: "-",
    department: "Pharmacy",
    provider: "-",
    method: "Bank Transfer",
    gross: 1200.0,
    discount: 0,
    net: -1200.0,
    status: "Paid",
    balance: 0,
  },
  {
    id: "TX-902245",
    date: "2025-11-05 14:20",
    direction: "inflow",
    category: "Insurance Remittance",
    invoice: "CLM-8821",
    patient: "Michael Chen",
    mrn: "MRN-77204",
    encounter: "E-2389",
    department: "Surgery",
    provider: "Dr. Patel",
    method: "EFT",
    gross: 4500.0,
    discount: 450.0,
    net: 4050.0,
    status: "Paid",
    balance: 0,
  },
  {
    id: "TX-902301",
    date: "2025-11-06 09:15",
    direction: "inflow",
    category: "Lab Services",
    invoice: "INV-1089",
    patient: "Emily Brown",
    mrn: "MRN-92103",
    encounter: "E-2401",
    department: "Laboratory",
    provider: "Lab Tech",
    method: "Card",
    gross: 320.0,
    discount: 0,
    net: 320.0,
    status: "Partial",
    balance: 120.0,
  },
  {
    id: "TX-902356",
    date: "2025-11-06 11:45",
    direction: "outflow",
    category: "Refund",
    invoice: "REF-445",
    patient: "David Martinez",
    mrn: "MRN-65432",
    encounter: "E-2198",
    department: "Billing",
    provider: "-",
    method: "Card Reversal",
    gross: 150.0,
    discount: 0,
    net: -150.0,
    status: "Reversed",
    balance: 0,
  },
];

export function AllTransactionsTab() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === mockTransactions.length ? [] : mockTransactions.map((t) => t.id)
    );
  };

  const selectedTotals = mockTransactions
    .filter((t) => selectedRows.includes(t.id))
    .reduce(
      (acc, t) => ({
        gross: acc.gross + t.gross,
        net: acc.net + t.net,
        balance: acc.balance + t.balance,
      }),
      { gross: 0, net: 0, balance: 0 }
    );

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Transactions</h2>
          {selectedRows.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedRows.length} selected • Gross: {formatCurrency(selectedTotals.gross)} • Net:{" "}
              {formatCurrency(selectedTotals.net)} • Balance: {formatCurrency(selectedTotals.balance)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <Tag className="w-4 h-4" />
                Tag
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Status
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedRows.length === mockTransactions.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className="sticky left-0 bg-background z-10">Date/Time</TableHead>
              <TableHead className="sticky left-[140px] bg-background z-10">Ref ID</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Invoice/Claim</TableHead>
              <TableHead>Patient/Vendor</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>Encounter</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(transaction.id)}
                    onCheckedChange={() => toggleRow(transaction.id)}
                  />
                </TableCell>
                <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">
                  {transaction.date}
                </TableCell>
                <TableCell className="sticky left-[140px] bg-background z-10 font-medium">
                  {transaction.id}
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.direction === "inflow" ? "default" : "destructive"} className={cn(
                    transaction.direction === "inflow" ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"
                  )}>
                    {transaction.direction === "inflow" ? "Inflow" : "Outflow"}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.invoice}</TableCell>
                <TableCell>{transaction.patient}</TableCell>
                <TableCell>{transaction.mrn}</TableCell>
                <TableCell>{transaction.encounter}</TableCell>
                <TableCell>{transaction.department}</TableCell>
                <TableCell>{transaction.provider}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.gross)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.discount)}</TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  transaction.net >= 0 ? "text-success" : "text-danger"
                )}>
                  {formatCurrency(transaction.net)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing 1 to {mockTransactions.length} of {mockTransactions.length} transactions</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
