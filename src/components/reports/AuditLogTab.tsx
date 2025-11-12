import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye } from "lucide-react";

const mockAuditLogs = [
  {
    id: "AUD-5012",
    timestamp: "2025-11-06 14:30:15",
    user: "Jane Smith (Finance Admin)",
    entity: "Transaction",
    entityId: "TX-902134",
    action: "Payment Recorded",
    details: "Recorded payment of ₹250.00 via Card",
  },
  {
    id: "AUD-5011",
    timestamp: "2025-11-06 13:45:22",
    user: "John Doe (Billing Specialist)",
    entity: "Invoice",
    entityId: "INV-1089",
    action: "Adjustment Applied",
    details: "Applied contractual adjustment of ₹32.00",
  },
  {
    id: "AUD-5010",
    timestamp: "2025-11-06 11:20:08",
    user: "Sarah Johnson (AP Specialist)",
    entity: "Payment",
    entityId: "PAY-8821",
    action: "Vendor Payment",
    details: "Paid vendor MedSupply Co. ₹1,200.00 via Bank Transfer",
  },
  {
    id: "AUD-5009",
    timestamp: "2025-11-06 10:15:33",
    user: "Mike Wilson (AR Analyst)",
    entity: "Refund",
    entityId: "REF-445",
    action: "Refund Issued",
    details: "Issued refund of ₹150.00 to David Martinez - Duplicate payment",
  },
  {
    id: "AUD-5008",
    timestamp: "2025-11-06 09:30:41",
    user: "Emily Brown (Billing Manager)",
    entity: "Adjustment",
    entityId: "ADJ-772",
    action: "Write-off Applied",
    details: "Write-off of ₹85.00 on invoice INV-987 - Bad debt",
  },
];

export function AuditLogTab() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Audit Log</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete history of all financial transactions and changes
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Entity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="transaction">Transaction</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="today">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last-7">Last 7 Days</SelectItem>
            <SelectItem value="last-30">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.id}</TableCell>
                <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.entity}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{log.action}</Badge>
                </TableCell>
                <TableCell className="max-w-md">{log.details}</TableCell>
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
        <div>Showing 1 to {mockAuditLogs.length} of {mockAuditLogs.length} audit entries</div>
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
