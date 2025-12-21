import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Receipt, 
  Banknote, 
  CreditCard, 
  Smartphone, 
  Building2,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  User
} from "lucide-react";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";

interface PaymentLine {
  id: number;
  method: "cash" | "card" | "upi" | "neft" | "cheque";
  amount: number;
  reference?: string;
}

// Mock patient data
const mockPatient = {
  name: "Harish Kalyan",
  gdid: "GDID-001",
  age: 44,
  gender: "Male",
  phone: "+91 98765 43210",
  visitId: "V25-004",
  admissionType: "IPD Admission",
  doctor: "Dr. Karthik Reddy",
  department: "General Medicine",
  ward: "General Medicine Ward",
  bed: "Room 204",
  admissionDate: "07 Aug 2025",
  currentAdvance: 320000, // ₹3,200 in paise
  usedAdvance: 0,
  estimatedBill: 980000, // ₹9,800 in paise
};

// Mock advance history
const advanceHistory = [
  {
    id: "ADV-2025-001",
    date: "07 Aug 2025",
    time: "11:30 AM",
    amount: 200000,
    method: "UPI",
    reason: "Admission Deposit",
    status: "Available",
    collectedBy: "Reception",
  },
  {
    id: "ADV-2025-002",
    date: "07 Aug 2025",
    time: "02:15 PM",
    amount: 120000,
    method: "Cash",
    reason: "Additional Deposit",
    status: "Available",
    collectedBy: "Billing Counter",
  },
];

const paymentMethods = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "neft", label: "NEFT/RTGS", icon: Building2 },
  { value: "cheque", label: "Cheque", icon: Receipt },
];

const reasonOptions = [
  "Admission Deposit",
  "Surgery Advance",
  "Procedure Deposit",
  "Treatment Advance",
  "Emergency Deposit",
  "Additional Deposit",
  "Other",
];

const PatientAdvanceCollection = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");

  const [paymentLines, setPaymentLines] = useState<PaymentLine[]>([
    { id: 1, method: "cash", amount: 0 },
  ]);
  const [reason, setReason] = useState("Additional Deposit");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastReceiptNo, setLastReceiptNo] = useState("");

  const totalAmount = paymentLines.reduce((sum, line) => sum + line.amount, 0);
  const availableBalance = mockPatient.currentAdvance - mockPatient.usedAdvance;
  const newBalance = availableBalance + totalAmount * 100; // Convert to paise

  const addPaymentLine = () => {
    const newId = Math.max(...paymentLines.map((l) => l.id)) + 1;
    setPaymentLines([...paymentLines, { id: newId, method: "cash", amount: 0 }]);
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

  const handleCollectAdvance = () => {
    if (totalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const receiptNo = `RCP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      setLastReceiptNo(receiptNo);
      setIsProcessing(false);
      setShowSuccess(true);
      toast.success("Advance collected successfully!", {
        description: `Receipt No: ${receiptNo}`,
      });
    }, 1500);
  };

  const handleNewCollection = () => {
    setShowSuccess(false);
    setPaymentLines([{ id: 1, method: "cash", amount: 0 }]);
    setReason("Additional Deposit");
    setNotes("");
  };

  const getMethodIcon = (method: string) => {
    const found = paymentMethods.find((m) => m.value === method);
    return found ? found.icon : Banknote;
  };

  const statusStyles: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    "Partially Used": "bg-amber-100 text-amber-700",
    "Fully Used": "bg-muted text-muted-foreground",
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ''}`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader 
          breadcrumbs={[
            { label: "Patient Insight", onClick: handleBack },
            "Collect Advance"
          ]} 
        />
        
        {/* Compact Header - Same as Services Page */}
        <div className="h-[72px] bg-card border-b border-border flex-shrink-0 flex items-center justify-between px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Patient</span>
          </button>

          {/* Patient Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm font-semibold text-foreground">{mockPatient.name}</p>
                <p className="text-xs text-muted-foreground">{mockPatient.gdid} • {mockPatient.age}Y / {mockPatient.gender.charAt(0)}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Admitted</p>
                <p className="text-sm font-medium text-foreground">{mockPatient.admissionDate}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{mockPatient.ward} • {mockPatient.bed}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Attending</p>
                <p className="text-sm font-medium text-foreground">{mockPatient.doctor}</p>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collection Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {!showSuccess ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Collect Advance Payment</h2>
                        <p className="text-sm text-muted-foreground">Record advance deposit from patient or attendant</p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2 mb-6">
                      <Label>Reason for Advance</Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reasonOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Lines */}
                    <div className="space-y-4 mb-6">
                      <Label>Payment Details</Label>
                      {paymentLines.map((line, index) => {
                        const MethodIcon = getMethodIcon(line.method);
                        return (
                          <div 
                            key={line.id} 
                            className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <MethodIcon className="w-5 h-5 text-primary" />
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  Payment Method
                                </Label>
                                <Select
                                  value={line.method}
                                  onValueChange={(value) =>
                                    updatePaymentLine(line.id, { method: value as PaymentLine["method"] })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {paymentMethods.map((method) => (
                                      <SelectItem key={method.value} value={method.value}>
                                        <div className="flex items-center gap-2">
                                          <method.icon className="w-4 h-4" />
                                          {method.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  Amount (₹)
                                </Label>
                                <Input
                                  type="number"
                                  value={line.amount || ""}
                                  onChange={(e) =>
                                    updatePaymentLine(line.id, { amount: parseInt(e.target.value) || 0 })
                                  }
                                  placeholder="0"
                                  min={0}
                                  className="text-right font-medium"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  Reference No. (Optional)
                                </Label>
                                <Input
                                  value={line.reference || ""}
                                  onChange={(e) =>
                                    updatePaymentLine(line.id, { reference: e.target.value })
                                  }
                                  placeholder="Transaction ID"
                                />
                              </div>
                            </div>
                            
                            {paymentLines.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePaymentLine(line.id)}
                                className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPaymentLine}
                        className="w-full gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Split Payment
                      </Button>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 mb-6">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any additional notes..."
                        rows={2}
                      />
                    </div>

                    {/* Total & Action */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Collection</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatINR(totalAmount * 100)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">New Balance</p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatINR(newBalance)}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleCollectAdvance}
                        disabled={totalAmount <= 0 || isProcessing}
                        className="w-full h-12 text-base"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Collect Advance
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Advance Collected Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-1">
                      Amount: <span className="font-semibold text-foreground">{formatINR(totalAmount * 100)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Receipt No: <span className="font-medium">{lastReceiptNo}</span>
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Button variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print Receipt
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="outline" onClick={handleNewCollection}>
                        Collect Another Advance
                      </Button>
                      <Button onClick={() => navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ""}`)}>
                        Back to Patient
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Advance History */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-base font-semibold mb-4">Advance History</h3>
                
                <div className="space-y-3">
                  {advanceHistory.map((adv) => (
                    <div 
                      key={adv.id} 
                      className="p-3 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{formatINR(adv.amount)}</p>
                          <p className="text-xs text-muted-foreground">{adv.reason}</p>
                        </div>
                        <Badge className={`${statusStyles[adv.status]} text-xs`}>
                          {adv.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{adv.method}</span>
                        <span>{adv.date}, {adv.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Collected</span>
                    <span className="font-semibold">{formatINR(mockPatient.currentAdvance)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-semibold text-green-600">{formatINR(availableBalance)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </PageContent>
    </div>
  );
};

export default PatientAdvanceCollection;
