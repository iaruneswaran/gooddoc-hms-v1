import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice, PaymentLine } from "@/types/billing";
import { formatINR } from "@/utils/currency";
import { X, Plus } from "lucide-react";

interface PaymentSummaryPanelProps {
  selectedInvoices: Invoice[];
  advanceBalance: number;
  onConfirmPayment: (paymentData: {
    payerName: string;
    appliedAdvance: number;
    paymentLines: PaymentLine[];
    allowPartial: boolean;
  }) => void;
  onClearSelection: () => void;
}

export function PaymentSummaryPanel({
  selectedInvoices,
  advanceBalance,
  onConfirmPayment,
  onClearSelection,
}: PaymentSummaryPanelProps) {
  const [useAdvance, setUseAdvance] = useState(false);
  const [appliedAdvance, setAppliedAdvance] = useState(0);
  const [payerName, setPayerName] = useState("Fredrick John");
  const [paymentLines, setPaymentLines] = useState<PaymentLine[]>([
    { id: 1, method: "cash", amount: 0, refs: {} },
  ]);
  const [allowPartial, setAllowPartial] = useState(false);

  const subtotal = selectedInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const maxAdvance = Math.min(advanceBalance, subtotal);
  const netPayable = subtotal - appliedAdvance;
  const totalPayments = paymentLines.reduce((sum, line) => sum + line.amount, 0);
  const remaining = netPayable - totalPayments;

  const handleUseAdvanceToggle = (checked: boolean) => {
    setUseAdvance(checked);
    if (checked) {
      setAppliedAdvance(maxAdvance);
      updateFirstPaymentAmount(subtotal - maxAdvance);
    } else {
      setAppliedAdvance(0);
      updateFirstPaymentAmount(subtotal);
    }
  };

  const handleApplyMaxAdvance = () => {
    setAppliedAdvance(maxAdvance);
    updateFirstPaymentAmount(subtotal - maxAdvance);
  };

  const updateFirstPaymentAmount = (amount: number) => {
    setPaymentLines((prev) => [
      { ...prev[0], amount },
      ...prev.slice(1),
    ]);
  };

  const handleAdvanceAmountChange = (value: string) => {
    const amount = parseInt(value) || 0;
    const capped = Math.min(amount, maxAdvance);
    setAppliedAdvance(capped);
    updateFirstPaymentAmount(subtotal - capped);
  };

  const addPaymentLine = () => {
    const newId = Math.max(...paymentLines.map((l) => l.id)) + 1;
    setPaymentLines([...paymentLines, { id: newId, method: "cash", amount: 0, refs: {} }]);
  };

  const removePaymentLine = (id: number) => {
    if (paymentLines.length > 1) {
      setPaymentLines(paymentLines.filter((line) => line.id !== id));
    }
  };

  const updatePaymentLine = (id: number, updates: Partial<PaymentLine>) => {
    setPaymentLines(
      paymentLines.map((line) => (line.id === id ? { ...line, ...updates } : line))
    );
  };

  const handleConfirm = () => {
    if (!payerName.trim()) return;
    if (remaining > 0 && !allowPartial) return;
    
    onConfirmPayment({
      payerName,
      appliedAdvance,
      paymentLines,
      allowPartial,
    });
  };

  const canConfirm =
    payerName.trim() !== "" && (remaining <= 0 || allowPartial) && remaining >= 0;

  if (selectedInvoices.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select invoices to collect payment
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 sticky top-6">
      {/* Selected Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Selected Invoices</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
        <div className="space-y-2">
          {selectedInvoices.map((inv) => (
            <div key={inv.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{inv.id}</span>
              <span className="font-medium">{formatINR(inv.balance)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center py-3 border-t border-b">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-lg font-semibold text-primary">{formatINR(subtotal)}</span>
      </div>

      {/* Advance Section */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Advance Balance</span>
          <span className="font-medium text-primary">{formatINR(advanceBalance)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="use-advance"
            checked={useAdvance}
            onCheckedChange={handleUseAdvanceToggle}
          />
          <Label htmlFor="use-advance" className="text-sm cursor-pointer">
            Use advance amount for this bill
          </Label>
        </div>
        {useAdvance && (
          <div className="space-y-2 p-3 bg-muted/30 rounded-md">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={appliedAdvance}
                onChange={(e) => handleAdvanceAmountChange(e.target.value)}
                className="flex-1"
                min={0}
                max={maxAdvance}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyMaxAdvance}
                className="whitespace-nowrap"
              >
                Apply max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Max: {formatINR(maxAdvance)}
            </p>
          </div>
        )}
      </div>

      {/* Net Payable */}
      {appliedAdvance > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Applied Advance</span>
          <span className="font-medium text-destructive">-{formatINR(appliedAdvance)}</span>
        </div>
      )}
      <div className="flex justify-between items-center py-3 border-t border-b">
        <span className="font-semibold">Net payable now</span>
        <span className="text-xl font-bold text-primary">{formatINR(netPayable)}</span>
      </div>

      {/* Payer Name */}
      <div className="space-y-2">
        <Label htmlFor="payer-name">Payer Name</Label>
        <Input
          id="payer-name"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder="Enter payer name"
          required
        />
      </div>

      {/* Payment Lines */}
      <div className="space-y-3">
        <Label>Payment Options</Label>
        {paymentLines.map((line, index) => (
          <div key={line.id} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                value={line.amount}
                onChange={(e) =>
                  updatePaymentLine(line.id, { amount: parseInt(e.target.value) || 0 })
                }
                placeholder="Amount"
                min={0}
              />
            </div>
            <Select
              value={line.method}
              onValueChange={(value) =>
                updatePaymentLine(line.id, { method: value as any })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {paymentLines.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePaymentLine(line.id)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addPaymentLine}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Payments</span>
          <span className="font-medium">{formatINR(totalPayments)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining</span>
          <span
            className={`font-semibold ${
              remaining < 0 ? "text-destructive" : remaining > 0 ? "text-orange-600" : "text-green-600"
            }`}
          >
            {formatINR(Math.abs(remaining))}
            {remaining < 0 && " over-allocated"}
          </span>
        </div>
      </div>

      {/* Allow Partial Payment */}
      {remaining > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="allow-partial"
            checked={allowPartial}
            onCheckedChange={(checked) => setAllowPartial(checked as boolean)}
          />
          <Label htmlFor="allow-partial" className="text-sm cursor-pointer">
            Allow partial payment
          </Label>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="w-full"
        size="lg"
      >
        Confirm Payment
      </Button>
    </Card>
  );
}
