import { Visit } from "../VisitListItem";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface InvoicesTabProps {
  selectedVisit: Visit | null;
}

interface Invoice {
  id: string;
  date: string;
  time: string;
  visitId: string;
  service: string;
  doctor: string;
  department: string;
  originalAmount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentMode: "Cash" | "Card" | "UPI" | "Insurance" | "Mixed" | null;
  status: "Paid" | "Partial" | "Unpaid";
}

// Mock invoices data with visitId
const mockInvoices: Invoice[] = [
  // V25-004 invoices (Active visit - Cardiology follow-up)
  {
    id: "INV-2025-001254",
    date: "20-Dec-2025",
    time: "10:30",
    visitId: "V25-004",
    service: "Cardiology Consultation",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    originalAmount: 250000,
    totalAmount: 250000,
    paidAmount: 0,
    balance: 250000,
    paymentMode: null,
    status: "Unpaid",
  },
  {
    id: "INV-2025-001255",
    date: "20-Dec-2025",
    time: "11:00",
    visitId: "V25-004",
    service: "ECG Test",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    originalAmount: 80000,
    totalAmount: 80000,
    paidAmount: 0,
    balance: 80000,
    paymentMode: null,
    status: "Unpaid",
  },
  // V25-002 invoices (General Medicine checkup)
  {
    id: "INV-2025-001240",
    date: "15-Dec-2025",
    time: "09:00",
    visitId: "V25-002",
    service: "General Consultation",
    doctor: "Dr. Arun Kumar",
    department: "General Medicine",
    originalAmount: 150000,
    totalAmount: 150000,
    paidAmount: 150000,
    balance: 0,
    paymentMode: "UPI",
    status: "Paid",
  },
  {
    id: "INV-2025-001241",
    date: "15-Dec-2025",
    time: "09:30",
    visitId: "V25-002",
    service: "Blood Test - CBC",
    doctor: "Dr. Arun Kumar",
    department: "Laboratory",
    originalAmount: 85000,
    totalAmount: 80000,
    paidAmount: 80000,
    balance: 0,
    paymentMode: "UPI",
    status: "Paid",
  },
  {
    id: "INV-2025-001242",
    date: "15-Dec-2025",
    time: "09:45",
    visitId: "V25-002",
    service: "Lipid Profile",
    doctor: "Dr. Arun Kumar",
    department: "Laboratory",
    originalAmount: 120000,
    totalAmount: 120000,
    paidAmount: 120000,
    balance: 0,
    paymentMode: "Card",
    status: "Paid",
  },
  // V25-001 invoices (Cardiology - Chest pain)
  {
    id: "INV-2025-001230",
    date: "01-Dec-2025",
    time: "14:00",
    visitId: "V25-001",
    service: "Cardiology Consultation",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    originalAmount: 250000,
    totalAmount: 250000,
    paidAmount: 250000,
    balance: 0,
    paymentMode: "Insurance",
    status: "Paid",
  },
  {
    id: "INV-2025-001231",
    date: "01-Dec-2025",
    time: "14:30",
    visitId: "V25-001",
    service: "ECG Test",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    originalAmount: 85000,
    totalAmount: 80000,
    paidAmount: 80000,
    balance: 0,
    paymentMode: "Insurance",
    status: "Paid",
  },
  {
    id: "INV-2025-001232",
    date: "01-Dec-2025",
    time: "15:00",
    visitId: "V25-001",
    service: "Chest X-Ray",
    doctor: "Dr. Vinod Kumar",
    department: "Radiology",
    originalAmount: 150000,
    totalAmount: 150000,
    paidAmount: 50000,
    balance: 100000,
    paymentMode: "Mixed",
    status: "Partial",
  },
  // V24-089 invoices (Orthopedics - Back pain)
  {
    id: "INV-2024-001180",
    date: "15-Nov-2025",
    time: "10:00",
    visitId: "V24-089",
    service: "Orthopedics Consultation",
    doctor: "Dr. Ashok Reddy",
    department: "Orthopedics",
    originalAmount: 200000,
    totalAmount: 200000,
    paidAmount: 200000,
    balance: 0,
    paymentMode: "Insurance",
    status: "Paid",
  },
  {
    id: "INV-2024-001181",
    date: "15-Nov-2025",
    time: "11:00",
    visitId: "V24-089",
    service: "MRI Spine",
    doctor: "Dr. Vinod Kumar",
    department: "Radiology",
    originalAmount: 900000,
    totalAmount: 850000,
    paidAmount: 850000,
    balance: 0,
    paymentMode: "Insurance",
    status: "Paid",
  },
  {
    id: "INV-2024-001182",
    date: "16-Nov-2025",
    time: "09:00",
    visitId: "V24-089",
    service: "Physiotherapy Session",
    doctor: "Dr. Ashok Reddy",
    department: "Physiotherapy",
    originalAmount: 100000,
    totalAmount: 100000,
    paidAmount: 100000,
    balance: 0,
    paymentMode: "Cash",
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

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Paid
          </span>
        );
      case "Partial":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Partial
          </span>
        );
      case "Unpaid":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">Visit Bills</h3>
        <p className="text-xs text-muted-foreground">
          Showing {visitInvoices.length} invoice{visitInvoices.length !== 1 ? "s" : ""}
        </p>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Invoice No.</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Date & Time</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Doctor</th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Amount</th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Paid / Balance</th>
              <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Mode</th>
              <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Status</th>
              <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitInvoices.map((invoice, index) => (
              <tr 
                key={invoice.id} 
                className={`border-t border-border hover:bg-muted/30 transition-colors ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/10"
                }`}
              >
                {/* Invoice No */}
                <td className="p-4">
                  <p className="text-sm font-semibold text-foreground">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{invoice.service}</p>
                </td>
                
                {/* Date & Time */}
                <td className="p-4">
                  <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{invoice.time}</p>
                </td>
                
                {/* Doctor */}
                <td className="p-4">
                  <p className="text-sm font-medium text-foreground">{invoice.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{invoice.department}</p>
                </td>
                
                {/* Amount */}
                <td className="p-4 text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatINR(invoice.totalAmount)}
                  </p>
                  {invoice.originalAmount !== invoice.totalAmount && (
                    <p className="text-xs text-muted-foreground line-through mt-0.5">
                      {formatINR(invoice.originalAmount)}
                    </p>
                  )}
                </td>
                
                {/* Paid / Balance */}
                <td className="p-4 text-right">
                  <p className={`text-sm font-medium ${invoice.paidAmount > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {formatINR(invoice.paidAmount)}
                  </p>
                  <p className={`text-xs mt-0.5 ${invoice.balance > 0 ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"}`}>
                    {formatINR(invoice.balance)}
                  </p>
                </td>
                
                {/* Mode */}
                <td className="p-4 text-center">
                  {invoice.paymentMode ? (
                    <span className="text-xs font-medium text-muted-foreground">
                      {invoice.paymentMode}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                
                {/* Status */}
                <td className="p-4 text-center">
                  {getStatusBadge(invoice.status)}
                </td>
                
                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      aria-label="View invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      aria-label="Download invoice"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <p>Showing 1 to {visitInvoices.length} of {visitInvoices.length} results</p>
        <p>Page 1 of 1</p>
      </div>
    </div>
  );
}
