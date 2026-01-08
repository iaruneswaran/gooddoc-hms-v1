import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, Plus, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { Visit } from "../VisitListItem";
import { formatINR } from "@/utils/currency";
import { getPendingInvoicesForVisit, type Invoice } from "@/data/billing.mock";
import { PaymentMethodModal, CashPaymentModal } from "@/components/payment";
import { SplitPaymentWizardModal, type SplitPaymentStep } from "@/components/payment/SplitPaymentWizardModal";
import { useSplitPaymentAutoCalc, type SplitRow } from "@/hooks/useSplitPaymentAutoCalc";
import type { PaymentMethod as PaymentMethodType, PaymentAttempt } from "@/types/payment-intent";
import { toast } from "sonner";

interface CollectPaymentTabProps {
  selectedVisit: Visit | null;
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

export function CollectPaymentTab({ selectedVisit }: CollectPaymentTabProps) {
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [adjustDeposit, setAdjustDeposit] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerRelation, setPayerRelation] = useState("self");
  const [payerMobile, setPayerMobile] = useState("");
  const [printReceipt, setPrintReceipt] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("card");
  const [showSplitWizard, setShowSplitWizard] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);

  // Mock patient deposit (in paise)
  const patientDeposit = 320000;

  const visitBills = selectedVisit ? getPendingInvoicesForVisit(selectedVisit.visitId) : [];
  const selectedBills = visitBills.filter((bill) => selectedBillIds.includes(bill.id));
  const totalBalanceAmount = selectedBills.reduce((sum, bill) => sum + bill.balance, 0);

  // Calculate amount to collect
  const amountToCollect = selectedBills.length > 0
    ? adjustDeposit
      ? Math.max(0, totalBalanceAmount - patientDeposit)
      : totalBalanceAmount
    : 0;

  // Use auto-calc split payment hook
  const {
    rows: splitRows,
    isValid,
    validationError,
    updateRowAmount,
    updateRowMethod,
    addRow,
    removeRow,
    resetDistribution,
    getCardUpiSteps,
    getAllSteps,
    hasMixedPayment,
  } = useSplitPaymentAutoCalc({ totalDue: amountToCollect / 100 }); // Convert to rupees

  const handlePaymentSuccess = (attempt: PaymentAttempt) => {
    setShowPaymentModal(false);
    toast.success("Payment collected successfully!", {
      description: `Transaction ID: ${attempt.providerTxnId || attempt.id}`,
    });
  };

  const handleSplitWizardComplete = (steps: SplitPaymentStep[]) => {
    const cardAmount = steps.filter(s => s.method === 'card' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    const upiAmount = steps.filter(s => s.method === 'upi' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    
    toast.success("Split payment collected successfully!", {
      description: `Card: ${formatINR(cardAmount)} + UPI: ${formatINR(upiAmount)}`,
    });
  };

  const handleCollectPayment = () => {
    if (!isValid) {
      toast.error(validationError || "Please check split amounts");
      return;
    }

    // If user picked a single cash method, open the Cash processing popup
    if (splitRows.length === 1 && splitRows[0].method === "cash") {
      setShowCashModal(true);
      return;
    }

    // If user picked a single non-cash method, open the Card/UPI processing popup
    if (splitRows.length === 1 && (splitRows[0].method === "card" || splitRows[0].method === "upi")) {
      setSelectedPaymentMethod(splitRows[0].method);
      setShowPaymentModal(true);
      return;
    }

    // For mixed payments (Cash + Card/UPI), show the wizard
    if (hasMixedPayment() || getCardUpiSteps().length > 0) {
      setShowSplitWizard(true);
    } else {
      // All cash - show cash modal
      setShowCashModal(true);
    }
  };

  const handleCashSuccess = () => {
    setShowCashModal(false);
    toast.success("Cash payment collected successfully!");
  };

  // Wizard steps - include all payment methods when mixed
  const wizardSteps: SplitPaymentStep[] = hasMixedPayment() 
    ? getAllSteps().map(step => ({
        ...step,
        status: 'pending' as const,
      }))
    : getCardUpiSteps().map(step => ({
        ...step,
        status: 'pending' as const,
      }));

  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="billing-body text-muted-foreground">
          Select a visit to collect payment.
        </p>
      </div>
    );
  }

  const totalOriginalAmount = selectedBills.reduce((sum, bill) => sum + bill.originalAmount, 0);
  const totalNetAmount = selectedBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaidAmount = selectedBills.reduce((sum, bill) => sum + bill.paidAmount, 0);

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

  return (
    <div className="flex">
      {/* Left Panel - Payable Bills */}
      <div className="flex-1 p-6 space-y-4">
        <h3 className="billing-section-title">Payable Bills</h3>

        {visitBills.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-muted/20">
            <p className="billing-body text-muted-foreground">No pending bills for this visit.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-center billing-label p-3 w-10">
                      <Checkbox
                        checked={selectedBillIds.length === visitBills.length && visitBills.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left billing-label p-3 whitespace-nowrap">Invoice No.</th>
                    <th className="text-left billing-label p-3 whitespace-nowrap">Date & Time</th>
                    <th className="text-left billing-label p-3 whitespace-nowrap">Service / Doctor</th>
                    <th className="text-right billing-label p-3 whitespace-nowrap">Amount</th>
                    <th className="text-right billing-label p-3 whitespace-nowrap">Paid</th>
                    <th className="text-right billing-label p-3 whitespace-nowrap">Balance</th>
                    <th className="text-center billing-label p-3 whitespace-nowrap">Status</th>
                    <th className="text-center billing-label p-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visitBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-3 text-center">
                        <Checkbox
                          checked={selectedBillIds.includes(bill.id)}
                          onCheckedChange={() => toggleBillSelection(bill.id)}
                        />
                      </td>
                      <td className="p-3">
                        <p className="billing-body text-foreground">{bill.invoiceNo}</p>
                      </td>
                      <td className="p-3">
                        <p className="billing-body">{bill.date}</p>
                        <p className="billing-helper">{bill.time}</p>
                      </td>
                      <td className="p-3">
                        <p className="billing-value">{bill.service}</p>
                        <p className="billing-helper">{bill.doctor} • {bill.department}</p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="billing-value">{formatINR(bill.totalAmount)}</p>
                        {bill.originalAmount !== bill.totalAmount && (
                          <p className="billing-helper line-through">{formatINR(bill.originalAmount)}</p>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <p className={bill.paidAmount > 0 ? "billing-amount-success" : "billing-amount-muted"}>
                          {bill.paidAmount > 0 ? formatINR(bill.paidAmount) : "—"}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="billing-value">{formatINR(bill.balance)}</p>
                      </td>
                      <td className="p-3 text-center">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1">
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
                      <span className="text-xs text-muted-foreground">Total ({visitBills.length} {visitBills.length === 1 ? 'Invoice' : 'Invoices'})</span>
                    </td>
                    <td className="p-3 text-right">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <span className="text-sm text-foreground">{formatINR(visitBills.reduce((sum, b) => sum + b.totalAmount, 0))}</span>
                    </td>
                    <td className="p-3 text-right">
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <span className="text-sm text-foreground">{formatINR(visitBills.reduce((sum, b) => sum + b.paidAmount, 0))}</span>
                    </td>
                    <td className="p-3 text-right">
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <span className="text-sm font-medium text-foreground">{formatINR(visitBills.reduce((sum, b) => sum + b.balance, 0))}</span>
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
      <div className="w-[420px] flex flex-col bg-background shadow-lg rounded-xl border border-border mt-16 mb-6 mr-6 overflow-hidden">
        <div className="bg-primary px-5 py-4 rounded-t-xl">
          <h2 className="billing-section-title !text-white">Payment Settlement</h2>
          {selectedBills.length > 0 && (
            <p className="billing-body !text-white/80 mt-0.5">
              {selectedBills.length === 1
                ? `Invoice: ${selectedBills[0].invoiceNo}`
                : `${selectedBills.length} Invoices Selected`}
            </p>
          )}
        </div>

        <div className="flex-1 p-5">
          {selectedBills.length === 0 ? (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg bg-muted/30">
              <p className="billing-body text-muted-foreground text-center px-4">
                Select bills from the left to collect payment
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="billing-label">Gross Bill Amount</span>
                  <span className="billing-value">{formatINR(totalOriginalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="billing-label">Discount Applied</span>
                  <span className="billing-amount-success">- {formatINR(totalOriginalAmount - totalNetAmount)}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="billing-section-title">Net Bill Amount</span>
                  <span className="billing-amount-primary">{formatINR(totalNetAmount)}</span>
                </div>
                {totalPaidAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="billing-label">Already Paid</span>
                    <span className="billing-amount-success">- {formatINR(totalPaidAmount)}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="billing-label">Patient Deposit</span>
                  </div>
                  <span className="billing-amount-primary text-emerald-600">{formatINR(patientDeposit)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="adjust-deposit" checked={adjustDeposit} onCheckedChange={setAdjustDeposit} />
                  <Label htmlFor="adjust-deposit" className="billing-control-label text-muted-foreground cursor-pointer">
                    Adjust deposit against this bill
                  </Label>
                </div>

                {adjustDeposit && selectedBills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="billing-label">Deposit Used</span>
                      <span className="billing-amount-negative">
                        - {formatINR(Math.min(patientDeposit, totalBalanceAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="billing-label">Remaining Deposit</span>
                      <span className="billing-value">
                        {formatINR(Math.max(0, patientDeposit - totalBalanceAmount))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="billing-section-title">Amount to Collect</span>
                  <span className="billing-amount-primary text-primary">{formatINR(amountToCollect)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="billing-section-title">Split Payment</span>
                  <button
                    onClick={resetDistribution}
                    className="billing-link flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                {splitRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-3">
                    {/* Amount Input */}
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 billing-label">₹</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={row.amount || ""}
                        onChange={(e) => updateRowAmount(row.id, parseFloat(e.target.value) || 0)}
                        className="pl-7 h-10 bg-background border-border rounded-lg billing-nums"
                        min={0}
                      />
                    </div>

                    {/* Payment Method Dropdown */}
                    <Select 
                      value={row.method} 
                      onValueChange={(value) => updateRowMethod(row.id, value as SplitRow['method'])}
                    >
                      <SelectTrigger className={`w-[140px] h-10 bg-background border-border rounded-lg ${row.method === "card" || row.method === "upi" ? "border-primary bg-primary/5" : ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-lg rounded-lg z-50">
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Remove Button */}
                    {splitRows.length > 1 && (
                      <button 
                        className="h-10 w-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors" 
                        onClick={() => removeRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Validation Error */}
                {validationError && (
                  <div className="flex items-center gap-2 billing-helper text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {validationError}
                  </div>
                )}

                {/* Add Split Payment Link */}
                <button 
                  onClick={addRow}
                  className="billing-link flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Split Payment
                </button>

              </div>

              <div className="space-y-3">
                <span className="billing-section-title">Payer Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="billing-label">Name</Label>
                    <Input placeholder="Payer name" value={payerName} onChange={(e) => setPayerName(e.target.value)} className="h-9 billing-body" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="billing-label">Relation</Label>
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
                  <Label className="billing-label">Mobile Number</Label>
                  <Input placeholder="+91" value={payerMobile} onChange={(e) => setPayerMobile(e.target.value)} className="h-9 billing-body" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="billing-label uppercase tracking-wide">After Payment</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="print" checked={printReceipt} onCheckedChange={(checked) => setPrintReceipt(!!checked)} />
                    <Label htmlFor="print" className="billing-control-label cursor-pointer">Print Receipt</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="sms" checked={sendSms} onCheckedChange={(checked) => setSendSms(!!checked)} />
                    <Label htmlFor="sms" className="billing-control-label cursor-pointer">SMS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="email" checked={sendEmail} onCheckedChange={(checked) => setSendEmail(!!checked)} />
                    <Label htmlFor="email" className="billing-control-label cursor-pointer">Email</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <Button
            className="w-full h-11"
            disabled={selectedBills.length === 0 || amountToCollect === 0}
            onClick={handleCollectPayment}
          >
            Collect Payment
          </Button>
          <p className="billing-caption text-center mt-3 leading-relaxed">
            By settling this bill, you confirm that payment has been received. 
            A receipt will be generated automatically.
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedVisit && (
        <PaymentMethodModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          patientId={selectedVisit.id || "P001"}
          patientName={selectedVisit.doctor || "Patient"}
          mrn={selectedVisit.visitId || "VISIT-001"}
          orderId={selectedBills[0]?.invoiceNo || `INV-${Date.now()}`}
          amount={amountToCollect}
          purpose="settlement"
          defaultMethod={selectedPaymentMethod}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}

      {/* Split Payment Wizard Modal */}
      {selectedVisit && (
        <SplitPaymentWizardModal
          open={showSplitWizard}
          onOpenChange={setShowSplitWizard}
          patientId={selectedVisit.id || "P001"}
          patientName={selectedVisit.doctor || "Patient"}
          mrn={selectedVisit.visitId || "VISIT-001"}
          orderId={selectedBills[0]?.invoiceNo || `INV-${Date.now()}`}
          totalAmount={amountToCollect}
          purpose="settlement"
          steps={wizardSteps}
          onComplete={handleSplitWizardComplete}
          onCancel={() => setShowSplitWizard(false)}
        />
      )}

      {/* Cash Payment Modal */}
      {selectedVisit && (
        <CashPaymentModal
          open={showCashModal}
          onOpenChange={setShowCashModal}
          patientName={selectedVisit.doctor || "Patient"}
          mrn={selectedVisit.visitId || "VISIT-001"}
          amount={amountToCollect}
          purpose="settlement"
          onSuccess={handleCashSuccess}
          onCancel={() => setShowCashModal(false)}
        />
      )}
    </div>
  );
}
