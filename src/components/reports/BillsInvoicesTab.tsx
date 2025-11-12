import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, DollarSign, FileText, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const mockInvoices = [
  {
    id: "INV-1042",
    billDate: "2025-11-05",
    patient: "Sarah Johnson",
    mrn: "MRN-88321",
    encounter: "E-2341",
    visitDate: "2025-11-04",
    department: "OPD",
    provider: "Dr. Smith",
    payer: "Self-pay",
    claim: "-",
    eobStatus: "-",
    charges: 250.0,
    adjustments: 0,
    insurancePayments: 0,
    patientPayments: 250.0,
    refunds: 0,
    balance: 0,
    status: "Paid",
    agingBucket: "0-30",
  },
  {
    id: "INV-1089",
    billDate: "2025-11-06",
    patient: "Emily Brown",
    mrn: "MRN-92103",
    encounter: "E-2401",
    visitDate: "2025-11-06",
    department: "Laboratory",
    provider: "Lab Tech",
    payer: "BlueCross PPO",
    claim: "CLM-9012",
    eobStatus: "Pending",
    charges: 320.0,
    adjustments: 0,
    insurancePayments: 0,
    patientPayments: 200.0,
    refunds: 0,
    balance: 120.0,
    status: "Partial",
    agingBucket: "0-30",
  },
  {
    id: "INV-1023",
    billDate: "2025-10-15",
    patient: "Michael Chen",
    mrn: "MRN-77204",
    encounter: "E-2389",
    visitDate: "2025-10-14",
    department: "Surgery",
    provider: "Dr. Patel",
    payer: "Aetna HMO",
    claim: "CLM-8821",
    eobStatus: "Approved",
    charges: 4500.0,
    adjustments: 450.0,
    insurancePayments: 4050.0,
    patientPayments: 0,
    refunds: 0,
    balance: 0,
    status: "Paid",
    agingBucket: "0-30",
  },
  {
    id: "INV-987",
    billDate: "2025-09-20",
    patient: "Robert Williams",
    mrn: "MRN-54321",
    encounter: "E-2156",
    visitDate: "2025-09-19",
    department: "Emergency",
    provider: "Dr. Anderson",
    payer: "Medicare",
    claim: "CLM-7654",
    eobStatus: "Denied",
    charges: 1850.0,
    adjustments: 0,
    insurancePayments: 0,
    patientPayments: 0,
    refunds: 0,
    balance: 1850.0,
    status: "Denied",
    agingBucket: "31-60",
  },
  {
    id: "INV-901",
    billDate: "2025-08-10",
    patient: "Jennifer Davis",
    mrn: "MRN-43210",
    encounter: "E-1998",
    visitDate: "2025-08-09",
    department: "Radiology",
    provider: "Dr. Lee",
    payer: "United Healthcare",
    claim: "CLM-6543",
    eobStatus: "Partial",
    charges: 920.0,
    adjustments: 92.0,
    insurancePayments: 628.0,
    patientPayments: 0,
    refunds: 0,
    balance: 200.0,
    status: "Partial",
    agingBucket: "91-120",
  },
];

export function BillsInvoicesTab() {
  const navigate = useNavigate();

  const openInvoiceDetail = (invoiceId: string) => {
    navigate(`/reports/transactions-billing/invoice/${invoiceId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success text-success-foreground";
      case "Partial":
        return "bg-warning text-warning-foreground";
      case "Denied":
        return "bg-danger text-danger-foreground";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bills & Invoices</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>Encounter</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Claim #</TableHead>
              <TableHead>EOB Status</TableHead>
              <TableHead className="text-right">Charges</TableHead>
              <TableHead className="text-right">Adjustments</TableHead>
              <TableHead className="text-right">Insurance</TableHead>
              <TableHead className="text-right">Patient</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.billDate}</TableCell>
                <TableCell>{invoice.patient}</TableCell>
                <TableCell>{invoice.mrn}</TableCell>
                <TableCell>{invoice.encounter}</TableCell>
                <TableCell>{invoice.visitDate}</TableCell>
                <TableCell>{invoice.department}</TableCell>
                <TableCell>{invoice.provider}</TableCell>
                <TableCell>{invoice.payer}</TableCell>
                <TableCell>{invoice.claim}</TableCell>
                <TableCell>
                  {invoice.eobStatus !== "-" && (
                    <Badge variant="secondary">{invoice.eobStatus}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.charges)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.adjustments)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.insurancePayments)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.patientPayments)}</TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  invoice.balance > 0 ? "text-warning" : "text-success"
                )}>
                  {formatCurrency(invoice.balance)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{invoice.agingBucket}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openInvoiceDetail(invoice.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <DollarSign className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing 1 to {mockInvoices.length} of {mockInvoices.length} invoices</div>
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
