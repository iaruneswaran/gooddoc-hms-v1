import { Visit } from "../VisitListItem";
import { InvoicesTable } from "@/components/billing/InvoicesTable";
import { useState } from "react";
import { Invoice } from "@/types/billing";

interface InvoicesTabProps {
  selectedVisit: Visit | null;
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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const handleToggleInvoice = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleToggleAll = () => {
    if (selectedInvoices.length === mockInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(mockInvoices.map((inv) => inv.id));
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">Patient Invoices</h3>
      </div>
      <InvoicesTable
        invoices={mockInvoices}
        selectedInvoices={selectedInvoices}
        onToggleInvoice={handleToggleInvoice}
        onToggleAll={handleToggleAll}
      />
    </div>
  );
}
