import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, Trash2 } from "lucide-react";
import { Visit } from "../VisitListItem";

interface PaymentsTabProps {
  selectedVisit: Visit | null;
}

// Mock transactions - filter by visit ID
const allTransactions = [
  {
    id: "INV-2025-001",
    date: "05 Aug 2025",
    visitId: "VST-102345",
    type: "Bill Payment",
    service: "Consultation",
    method: "Card",
    payer: "Harish Kalyan",
    amount: "1,500",
  },
  {
    id: "INV-2025-002",
    date: "05 Aug 2025",
    visitId: "VST-102346",
    type: "Bill Payment",
    service: "Laboratory",
    method: "UPI",
    payer: "Harish Kalyan",
    amount: "650",
  },
  {
    id: "INV-2025-003",
    date: "05 Aug 2025",
    visitId: "VST-102912",
    type: "Bill Payment",
    service: "Radiology",
    method: "Cash",
    payer: "Harish Kalyan",
    amount: "1,200",
  },
  {
    id: "INV-2025-004",
    date: "07 Aug 2025",
    visitId: "VST-205431",
    type: "Bill Payment",
    service: "IPD Admission",
    method: "Card",
    payer: "Harish Kalyan",
    amount: "5,800",
  },
  {
    id: "INV-2025-005",
    date: "07 Aug 2025",
    visitId: "VST-308972",
    type: "Bill Payment",
    service: "Day-Care",
    method: "Insurance",
    payer: "Harish Kalyan",
    amount: "12,500",
  },
];

export function PaymentsTab({ selectedVisit }: PaymentsTabProps) {
  const [useAdvance, setUseAdvance] = useState(false);
  const [paymentRows, setPaymentRows] = useState([{ id: 1, amount: "", method: "Cash" }]);

  const advanceAmount = 3200;
  const billAmount = 1500;
  const usedAdvance = useAdvance ? Math.min(advanceAmount, billAmount) : 0;
  const remainingBalance = useAdvance ? Math.max(0, advanceAmount - billAmount) : advanceAmount;
  const payableAmount = Math.max(0, billAmount - usedAdvance);

  const addPaymentRow = () => {
    const newId = Math.max(...paymentRows.map(r => r.id)) + 1;
    setPaymentRows([...paymentRows, { id: newId, amount: "", method: "Cash" }]);
  };

  const removePaymentRow = (id: number) => {
    setPaymentRows(paymentRows.filter(row => row.id !== id));
  };

  const updatePaymentRow = (id: number, field: 'amount' | 'method', value: string) => {
    setPaymentRows(paymentRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view payment history.
        </p>
      </div>
    );
  }

  // Filter transactions for selected visit
  const visitTransactions = allTransactions.filter(
    (transaction) => transaction.visitId === selectedVisit.visitId
  );

  if (visitTransactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No payment transactions found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Payment Collection Card */}
      <Card className="w-full lg:w-[420px] p-6 h-fit">
        <h3 className="text-base font-semibold text-foreground mb-5">Collect Payment</h3>
        
        <div className="space-y-5">
          {/* Bill Amount */}
          <div className="flex justify-between items-center pb-5 border-b border-border">
            <p className="text-sm font-medium text-foreground">Bill Amount:</p>
            <p className="text-[18px] font-semibold text-primary">₹{billAmount.toLocaleString()}</p>
          </div>

          {/* Advance Amount Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Advance Amount</span>
              <span className="text-lg font-medium text-primary">₹{advanceAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="use-advance"
                checked={useAdvance}
                onCheckedChange={setUseAdvance}
              />
              <label htmlFor="use-advance" className="text-sm cursor-pointer">
                Use advance amount for this bill
              </label>
            </div>
          </div>

          {useAdvance && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <p className="text-sm font-medium text-primary">Advance Amount Used!</p>
              <p className="text-xs text-muted-foreground">
                Current bill (₹{billAmount.toLocaleString()}) Used from advance
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining Advance Balance</span>
                  <span className="font-medium">₹{remainingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payable amount</span>
                  <span className="font-medium">₹{payableAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border"></div>

          {/* Payer Name */}
          <div className="space-y-2.5">
            <p className="text-sm font-medium text-foreground">Payer Name</p>
            <input
              type="text"
              defaultValue="Fredrick John"
              className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
            />
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Payment Options</p>
            
            {paymentRows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={index === 0 ? payableAmount.toLocaleString() : row.amount}
                      onChange={(e) => updatePaymentRow(row.id, 'amount', e.target.value)}
                      readOnly={index === 0}
                      className="w-full h-10 pl-8 pr-4 text-sm font-semibold text-primary bg-background border border-input rounded-md"
                    />
                  </div>
                </div>
                <Select 
                  value={row.method} 
                  onValueChange={(value) => updatePaymentRow(row.id, 'method', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
                {paymentRows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePaymentRow(row.id)}
                    className="h-10 w-10 text-muted-foreground hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <p 
              className="text-sm text-primary font-medium cursor-pointer"
              onClick={addPaymentRow}
            >
              Add Payment
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1">
              Pay Later
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              Confirm Payment
            </Button>
          </div>
        </div>
      </Card>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Visit Transactions</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download statement
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Method</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {visitTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-4 text-sm">{transaction.id}</td>
                <td className="p-4 text-sm">{transaction.date}</td>
                <td className="p-4 text-sm">{transaction.type}</td>
                <td className="p-4 text-sm">{transaction.service}</td>
                <td className="p-4 text-sm">{transaction.method}</td>
                <td className="p-4 text-sm">{transaction.payer}</td>
                <td className="p-4 text-sm text-primary font-medium">₹{transaction.amount}</td>
                <td className="p-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
