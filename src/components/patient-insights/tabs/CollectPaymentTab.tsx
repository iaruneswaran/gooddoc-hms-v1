import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, Eye, Plus, Trash2 } from "lucide-react";
import { Visit } from "../VisitListItem";
import { formatINR } from "@/utils/currency";
import { getPendingInvoicesForVisit, type Invoice } from "@/data/billing.mock";

interface CollectPaymentTabProps {
  selectedVisit: Visit | null;
}

interface SplitPayment {
  id: string;
  method: string;
  amount: string;
}

const getStatusBadge = (status: Invoice["status"]) => {
  switch (status) {
    case "Paid":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Paid</Badge>;
    case "Partial":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Partial</Badge>;
    case "Unpaid":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Unpaid</Badge>;
  }
};

const paymentMethods = [
  { id: "cash", label: "Cash", emoji: "💵" },
  { id: "upi", label: "UPI", emoji: "📱" },
  { id: "card", label: "Card", emoji: "💳" },
  { id: "cheque", label: "Cheque", emoji: "📄" },
  { id: "neft", label: "NEFT/RTGS", emoji: "🏦" },
  { id: "insurance", label: "Insurance", emoji: "🏥" },
];

export function CollectPaymentTab({ selectedVisit }: CollectPaymentTabProps) {
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
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

  // Mock patient deposit (in paise)
  const patientDeposit = 320000;

  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to collect payment.
        </p>
      </div>
    );
  }

  const visitBills = getPendingInvoicesForVisit(selectedVisit.visitId);
  const selectedBills = visitBills.filter((bill) => selectedBillIds.includes(bill.id));

  const totalOriginalAmount = selectedBills.reduce((sum, bill) => sum + bill.originalAmount, 0);
  const totalNetAmount = selectedBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaidAmount = selectedBills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalBalanceAmount = selectedBills.reduce((sum, bill) => sum + bill.balance, 0);

  const toggleBillSelection = (billId: string) => {
    setSelectedBillIds((prev) =>
      prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBillIds.length === visitBills.length) {
      setSelectedBillIds([]);
    } else {
      setSelectedBillIds(visitBills.map((bill) => bill.id));
    }
  };

  const addSplitPayment = () => {
    setSplitPayments([...splitPayments, { id: Date.now().toString(), method: "cash", amount: "" }]);
  };

  const removeSplitPayment = (id: string) => {
    if (splitPayments.length > 1) {
      setSplitPayments(splitPayments.filter((p) => p.id !== id));
    }
  };

  const updateSplitPayment = (id: string, field: "method" | "amount", value: string) => {
    setSplitPayments(splitPayments.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const getMethodEmoji = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    return method ? method.emoji : "💵";
  };

  const amountToCollect = selectedBills.length > 0
    ? adjustDeposit
      ? Math.max(0, totalBalanceAmount - patientDeposit)
      : totalBalanceAmount
    : 0;

  return (
    <div className="flex">
      {/* Left Panel - Payable Bills */}
      <div className="flex-1 p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-foreground">Payable Bills</h3>

        {visitBills.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">No pending bills for this visit.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-center text-xs font-medium text-muted-foreground p-3 w-10">
                      <Checkbox
                        checked={selectedBillIds.length === visitBills.length && visitBills.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Invoice No.</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Date & Time</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Service / Doctor</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Amount</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Paid</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Balance</th>
                    <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Status</th>
                    <th className="text-center text-xs font-medium text-muted-foreground p-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visitBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className={`hover:bg-muted/20 transition-colors cursor-pointer ${
                        selectedBillIds.includes(bill.id) ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                      onClick={() => toggleBillSelection(bill.id)}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBillIds.includes(bill.id)}
                          onCheckedChange={() => toggleBillSelection(bill.id)}
                        />
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium text-primary">{bill.invoiceNo}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{bill.serviceCode}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-foreground">{bill.date}</p>
                        <p className="text-xs text-muted-foreground">{bill.time}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium text-foreground">{bill.service}</p>
                        <p className="text-xs text-muted-foreground">{bill.doctor} • {bill.department}</p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-sm font-semibold text-foreground">{formatINR(bill.totalAmount)}</p>
                        {bill.originalAmount !== bill.totalAmount && (
                          <p className="text-xs text-muted-foreground line-through">{formatINR(bill.originalAmount)}</p>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <p className={`text-sm font-medium ${bill.paidAmount > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                          {bill.paidAmount > 0 ? formatINR(bill.paidAmount) : "—"}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-sm font-medium text-red-600">{formatINR(bill.balance)}</p>
                      </td>
                      <td className="p-3 text-center">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
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
                <tfoot className="bg-muted/50 border-t border-border">
                  <tr>
                    <td colSpan={4} className="p-3 text-right">
                      <span className="text-sm font-semibold text-foreground">Total:</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-foreground">{formatINR(visitBills.reduce((sum, b) => sum + b.totalAmount, 0))}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-emerald-600">{formatINR(visitBills.reduce((sum, b) => sum + b.paidAmount, 0))}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-red-600">{formatINR(visitBills.reduce((sum, b) => sum + b.balance, 0))}</span>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Payment Settlement */}
      <div className="w-[420px] flex flex-col bg-background shadow-lg rounded-xl border border-border my-6 mr-6 overflow-hidden">
        <div className="bg-primary px-5 py-4 rounded-t-xl">
          <h2 className="text-base font-semibold text-primary-foreground">Payment Settlement</h2>
          {selectedBills.length > 0 && (
            <p className="text-sm text-primary-foreground/80 mt-0.5">
              {selectedBills.length === 1
                ? `Invoice: ${selectedBills[0].invoiceNo}`
                : `${selectedBills.length} Invoices Selected`}
            </p>
          )}
        </div>

        <div className="flex-1 p-5">
          {selectedBills.length === 0 ? (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground text-center px-4">
                Select bills from the left to collect payment
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gross Bill Amount</span>
                  <span className="text-sm font-semibold text-foreground">{formatINR(totalOriginalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount Applied</span>
                  <span className="text-sm font-medium text-emerald-600">- {formatINR(totalOriginalAmount - totalNetAmount)}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Net Bill Amount</span>
                  <span className="text-base font-bold text-foreground">{formatINR(totalNetAmount)}</span>
                </div>
                {totalPaidAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Already Paid</span>
                    <span className="text-sm font-medium text-emerald-600">- {formatINR(totalPaidAmount)}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-foreground">Patient Deposit</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{formatINR(patientDeposit)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="adjust-deposit" checked={adjustDeposit} onCheckedChange={setAdjustDeposit} />
                  <Label htmlFor="adjust-deposit" className="text-sm text-muted-foreground cursor-pointer">
                    Adjust deposit against this bill
                  </Label>
                </div>

                {adjustDeposit && selectedBills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Deposit Used</span>
                      <span className="text-sm font-semibold text-red-500">
                        - {formatINR(Math.min(patientDeposit, totalBalanceAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Remaining Deposit</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatINR(Math.max(0, patientDeposit - totalBalanceAmount))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Amount to Collect</span>
                  <span className="text-xl font-bold text-primary">{formatINR(amountToCollect)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Payment Collection</span>
                  <span className="text-xs font-medium text-muted-foreground">Split Payment</span>
                </div>

                {splitPayments.map((payment, index) => (
                  <div key={payment.id} className="flex items-center gap-3">
                    {/* Amount Input */}
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={payment.amount}
                        onChange={(e) => updateSplitPayment(payment.id, "amount", e.target.value)}
                        className="pl-7 h-10 bg-background border-border rounded-lg text-sm"
                      />
                    </div>

                    {/* Payment Method Dropdown */}
                    <Select value={payment.method} onValueChange={(value) => updateSplitPayment(payment.id, "method", value)}>
                      <SelectTrigger className="w-[140px] h-10 bg-background border-border rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-lg rounded-lg z-50">
                        {paymentMethods.map((method) => {
                          const isSelected = payment.method === method.id;
                          return (
                            <SelectItem 
                              key={method.id} 
                              value={method.id}
                              className={`cursor-pointer rounded-md my-0.5 ${isSelected ? 'bg-primary/10' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{method.emoji}</span>
                                <span className={isSelected ? 'text-primary font-medium' : ''}>{method.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    {/* Remove Button */}
                    {splitPayments.length > 1 && (
                      <button 
                        className="h-10 w-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors" 
                        onClick={() => removeSplitPayment(payment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Split Payment Link */}
                <button 
                  onClick={addSplitPayment}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Split Payment
                </button>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold text-foreground">Payer Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input placeholder="Payer name" value={payerName} onChange={(e) => setPayerName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Relation</Label>
                    <Select value={payerRelation} onValueChange={setPayerRelation}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Mobile Number</Label>
                  <Input placeholder="+91" value={payerMobile} onChange={(e) => setPayerMobile(e.target.value)} className="h-9" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">After Payment</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="print" checked={printReceipt} onCheckedChange={(checked) => setPrintReceipt(!!checked)} />
                    <Label htmlFor="print" className="text-sm text-foreground cursor-pointer">Print Receipt</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="sms" checked={sendSms} onCheckedChange={(checked) => setSendSms(!!checked)} />
                    <Label htmlFor="sms" className="text-sm text-foreground cursor-pointer">SMS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="email" checked={sendEmail} onCheckedChange={(checked) => setSendEmail(!!checked)} />
                    <Label htmlFor="email" className="text-sm text-foreground cursor-pointer">Email</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <Button className="w-full h-11" disabled={selectedBills.length === 0 || amountToCollect === 0}>
            Collect Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
