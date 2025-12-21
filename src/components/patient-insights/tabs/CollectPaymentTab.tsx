import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, Eye, Plus, X, Banknote, CreditCard, Smartphone, Building2, IndianRupee } from "lucide-react";
import { Visit } from "../VisitListItem";
import { formatINR } from "@/utils/currency";

interface CollectPaymentTabProps {
  selectedVisit: Visit | null;
}

interface PayableBill {
  id: string;
  invoiceNo: string;
  date: string;
  time: string;
  service: string;
  doctor: string;
  department: string;
  originalAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "Pending" | "Partial" | "Paid";
  visitId: string;
}

interface SplitPayment {
  id: string;
  method: string;
  amount: string;
}

// Mock payable bills
const mockPayableBills: PayableBill[] = [
  {
    id: "1",
    invoiceNo: "INV-2025-001236",
    date: "20-Dec-2025",
    time: "09:00",
    service: "Cardiology Consultation",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    originalAmount: 2500,
    totalAmount: 2500,
    paidAmount: 0,
    balanceAmount: 2500,
    status: "Pending",
    visitId: "V25-004",
  },
  {
    id: "2",
    invoiceNo: "INV-2025-001237",
    date: "20-Dec-2025",
    time: "10:30",
    service: "ECG Test",
    doctor: "Dr. Meera Nair",
    department: "Diagnostics",
    originalAmount: 1000,
    totalAmount: 800,
    paidAmount: 400,
    balanceAmount: 400,
    status: "Partial",
    visitId: "V25-004",
  },
  {
    id: "3",
    invoiceNo: "INV-2025-001238",
    date: "20-Dec-2025",
    time: "11:00",
    service: "Laboratory - Lipid Profile",
    doctor: "Dr. Meera Nair",
    department: "Laboratory",
    originalAmount: 650,
    totalAmount: 650,
    paidAmount: 0,
    balanceAmount: 650,
    status: "Pending",
    visitId: "V25-004",
  },
  {
    id: "4",
    invoiceNo: "INV-2025-001225",
    date: "15-Dec-2025",
    time: "16:00",
    service: "General Consultation",
    doctor: "Dr. Priya Menon",
    department: "General Medicine",
    originalAmount: 1500,
    totalAmount: 1500,
    paidAmount: 0,
    balanceAmount: 1500,
    status: "Pending",
    visitId: "V25-002",
  },
  {
    id: "5",
    invoiceNo: "INV-2025-001250",
    date: "01-Dec-2025",
    time: "09:00",
    service: "Cardiology Consultation",
    doctor: "Dr. Vinod Kumar",
    department: "Cardiology",
    originalAmount: 2500,
    totalAmount: 2500,
    paidAmount: 0,
    balanceAmount: 2500,
    status: "Pending",
    visitId: "V25-001",
  },
];

const getStatusBadge = (status: "Pending" | "Partial" | "Paid") => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Paid</Badge>;
    case "Partial":
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Partial</Badge>;
    case "Pending":
      return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "insurance", label: "Insurance", icon: Building2 },
];

export function CollectPaymentTab({ selectedVisit }: CollectPaymentTabProps) {
  const [selectedBill, setSelectedBill] = useState<PayableBill | null>(null);
  const [adjustDeposit, setAdjustDeposit] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
    { id: "1", method: "cash", amount: "" },
  ]);
  const [payerName, setPayerName] = useState("");
  const [payerRelation, setPayerRelation] = useState("self");
  const [payerMobile, setPayerMobile] = useState("");
  const [printReceipt, setPrintReceipt] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  // Mock patient deposit
  const patientDeposit = 3200;

  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to collect payment.
        </p>
      </div>
    );
  }

  // Filter bills for selected visit
  const visitBills = mockPayableBills.filter(
    (bill) => bill.visitId === selectedVisit.visitId && bill.status !== "Paid"
  );

  const addSplitPayment = () => {
    setSplitPayments([
      ...splitPayments,
      { id: Date.now().toString(), method: "cash", amount: "" },
    ]);
  };

  const removeSplitPayment = (id: string) => {
    if (splitPayments.length > 1) {
      setSplitPayments(splitPayments.filter((p) => p.id !== id));
    }
  };

  const updateSplitPayment = (id: string, field: "method" | "amount", value: string) => {
    setSplitPayments(
      splitPayments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const getMethodIcon = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      const Icon = method.icon;
      return <Icon className="h-4 w-4" />;
    }
    return null;
  };

  const amountToCollect = selectedBill
    ? adjustDeposit
      ? Math.max(0, selectedBill.balanceAmount - patientDeposit)
      : selectedBill.balanceAmount
    : 0;

  return (
    <div className="flex h-full">
      {/* Left Panel - Payable Bills */}
      <div className="flex-1 border-r border-border p-6 overflow-y-auto">
        <h2 className="text-[14px] font-semibold text-foreground mb-4">Payable Bills</h2>

        {visitBills.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No pending bills for this visit.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Invoice No.</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Date & Time</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Service</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Amount</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Paid</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Balance</th>
                  <th className="text-center text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-center text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-card divide-y">
                {visitBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className={`hover:bg-muted/20 transition-colors cursor-pointer ${
                      selectedBill?.id === bill.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                    }`}
                    onClick={() => setSelectedBill(bill)}
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-primary">{bill.invoiceNo}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{bill.date}</span>
                        <span className="text-xs text-muted-foreground">{bill.time}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{bill.service}</span>
                        <span className="text-xs text-muted-foreground">{bill.doctor}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-foreground">{formatINR(bill.totalAmount)}</span>
                        {bill.originalAmount !== bill.totalAmount && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatINR(bill.originalAmount)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-medium text-emerald-600">{formatINR(bill.paidAmount)}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-medium text-red-500">{formatINR(bill.balanceAmount)}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        {getStatusBadge(bill.status)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Panel - Payment Settlement */}
      <div className="w-[420px] flex flex-col bg-background overflow-hidden rounded-xl shadow-lg border border-border">
        {/* Blue Header */}
        <div className="bg-primary px-5 py-4 rounded-t-xl">
          <h2 className="text-base font-semibold text-primary-foreground">Payment Settlement</h2>
          {selectedBill && (
            <p className="text-sm text-primary-foreground/80 mt-0.5">Invoice: {selectedBill.invoiceNo}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!selectedBill ? (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground text-center px-4">
                Select a bill from the left to collect payment
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Bill Summary */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gross Bill Amount</span>
                  <span className="text-sm font-semibold text-foreground">{formatINR(selectedBill.originalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount Applied</span>
                  <span className="text-sm font-medium text-emerald-600">
                    - {formatINR(selectedBill.originalAmount - selectedBill.totalAmount)}
                  </span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Net Bill Amount</span>
                  <span className="text-base font-bold text-foreground">{formatINR(selectedBill.totalAmount)}</span>
                </div>
                {selectedBill.paidAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Already Paid</span>
                    <span className="text-sm font-medium text-emerald-600">- {formatINR(selectedBill.paidAmount)}</span>
                  </div>
                )}
              </div>

              {/* Patient Deposit */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-foreground">Patient Deposit</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{formatINR(patientDeposit)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="adjust-deposit"
                    checked={adjustDeposit}
                    onCheckedChange={setAdjustDeposit}
                  />
                  <Label htmlFor="adjust-deposit" className="text-sm text-muted-foreground cursor-pointer">
                    Adjust deposit against this bill
                  </Label>
                </div>
              </div>

              {/* Amount to Collect */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Amount to Collect</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{formatINR(amountToCollect)}</span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Payment Collection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">Payment Collection</Label>
                  <button
                    className="text-sm text-muted-foreground hover:text-primary font-medium"
                    onClick={addSplitPayment}
                  >
                    Split Payment
                  </button>
                </div>

                <div className="space-y-3">
                  {splitPayments.map((payment) => (
                    <div key={payment.id} className="flex gap-2 items-center">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={payment.amount}
                          onChange={(e) => updateSplitPayment(payment.id, "amount", e.target.value)}
                          className="pl-7 h-11"
                        />
                      </div>
                      <Select
                        value={payment.method}
                        onValueChange={(value) => updateSplitPayment(payment.id, "method", value)}
                      >
                        <SelectTrigger className="w-[130px] h-11">
                          <div className="flex items-center gap-2">
                            {getMethodIcon(payment.method)}
                            <span className="text-sm">{paymentMethods.find(m => m.id === payment.method)?.label}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center gap-2">
                                <method.icon className="h-4 w-4" />
                                <span>{method.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {splitPayments.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 text-muted-foreground hover:text-destructive"
                          onClick={() => removeSplitPayment(payment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  onClick={addSplitPayment}
                >
                  <Plus className="h-4 w-4" />
                  Add Split Payment
                </button>
              </div>

              {/* Payer Details */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Payer Details</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Payer Name</Label>
                    <Input
                      placeholder="Harish Kalyan"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Relation</Label>
                    <Select value={payerRelation} onValueChange={setPayerRelation}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Mobile Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={payerMobile}
                    onChange={(e) => setPayerMobile(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Notification Options */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="print-receipt"
                    checked={printReceipt}
                    onCheckedChange={(checked) => setPrintReceipt(checked as boolean)}
                  />
                  <Label htmlFor="print-receipt" className="text-sm cursor-pointer">Print Receipt</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="send-sms"
                    checked={sendSms}
                    onCheckedChange={(checked) => setSendSms(checked as boolean)}
                  />
                  <Label htmlFor="send-sms" className="text-sm cursor-pointer">Send SMS</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="send-email"
                    checked={sendEmail}
                    onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                  />
                  <Label htmlFor="send-email" className="text-sm cursor-pointer">Email</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 h-12 text-sm font-medium">
                  Pay Later
                </Button>
                <Button className="flex-1 h-12 text-sm font-medium">
                  Settle Bill
                </Button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                By settling this bill, you confirm that payment has been received. A receipt will be generated automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}