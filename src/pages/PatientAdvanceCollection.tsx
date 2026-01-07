import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  Download,
  Printer,
  Trash2,
  User,
  CreditCard,
  Smartphone,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";
import { PaymentMethodModal } from "@/components/payment";
import { SplitPaymentWizardModal, type SplitPaymentStep } from "@/components/payment/SplitPaymentWizardModal";
import { useSplitPaymentAutoCalc, type SplitRow } from "@/hooks/useSplitPaymentAutoCalc";
import type { PaymentMethod as PaymentMethodType, PaymentAttempt } from "@/types/payment-intent";

// Mock patient data
const mockPatient = {
  name: "Harish Kalyan",
  gdid: "GDID-001",
  age: 44,
  gender: "Male",
  phone: "+91 98765 43210",
  visitId: "V25-004",
  currentAdvance: 320000, // ₹3,200 in paise
  usedAdvance: 0,
  estimatedBill: 980000, // ₹9,800 in paise
};

// Mock advance history with more details
const advanceHistory = [
  {
    id: "ADV-2025-001",
    receiptNo: "RCP-2025-001",
    date: "07 Aug 2025",
    time: "11:30 AM",
    amount: 200000,
    method: "UPI",
    reason: "Admission Deposit",
    payerName: "Harish Kalyan",
  },
  {
    id: "ADV-2025-002",
    receiptNo: "RCP-2025-002",
    date: "07 Aug 2025",
    time: "02:15 PM",
    amount: 120000,
    method: "Cash",
    reason: "Additional Deposit",
    payerName: "Priya Kalyan",
  },
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

  // Amount to collect (editable input)
  const [amountToCollect, setAmountToCollect] = useState(5000); // Default ₹5,000

  // Use the auto-calc split payment hook
  const {
    rows: splitRows,
    totalEntered,
    isValid,
    validationError,
    updateRowAmount,
    updateRowMethod,
    addRow,
    removeRow,
    resetDistribution,
    getCardUpiSteps,
  } = useSplitPaymentAutoCalc({ totalDue: amountToCollect });

  const [reason, setReason] = useState("Additional Deposit");
  const [payerName, setPayerName] = useState(mockPatient.name);
  const [payerRelation, setPayerRelation] = useState("self");
  const [payerMobile, setPayerMobile] = useState(mockPatient.phone);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("card");
  const [showSplitWizard, setShowSplitWizard] = useState(false);

  const handlePaymentSuccess = (attempt: PaymentAttempt) => {
    setShowPaymentModal(false);
    const receiptNo = `RCP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    toast.success("Advance collected successfully!", {
      description: `Receipt No: ${receiptNo}`,
    });
    // Reset amount
    setAmountToCollect(0);
  };

  const handleSplitWizardComplete = (steps: SplitPaymentStep[]) => {
    const cardAmount = steps.filter(s => s.method === 'card' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    const upiAmount = steps.filter(s => s.method === 'upi' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    
    const receiptNo = `RCP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    toast.success("Split payment collected successfully!", {
      description: `Card: ${formatINR(cardAmount)} + UPI: ${formatINR(upiAmount)} • Receipt: ${receiptNo}`,
    });
    // Reset
    setAmountToCollect(0);
  };

  const handleSplitWizardPartial = (steps: SplitPaymentStep[]) => {
    const completedAmount = steps.filter(s => s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = steps.filter(s => s.status !== 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    
    toast.warning("Partial payment collected", {
      description: `Collected: ${formatINR(completedAmount)} • Pending: ${formatINR(pendingAmount)}`,
    });
  };

  const availableBalance = mockPatient.currentAdvance - mockPatient.usedAdvance;
  const newBalance = availableBalance + amountToCollect * 100; // Convert to paise

  const handleCollectAdvance = () => {
    if (amountToCollect <= 0 || !isValid) {
      toast.error("Please enter a valid amount and ensure split is correct");
      return;
    }

    // Check if there are Card/UPI splits that need wizard
    const cardUpiSteps = getCardUpiSteps();
    
    if (cardUpiSteps.length > 0) {
      // Open split payment wizard for Card/UPI
      setShowSplitWizard(true);
    } else {
      // Only cash - process directly
      setIsProcessing(true);
      setTimeout(() => {
        const receiptNo = `RCP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
        setIsProcessing(false);
        toast.success("Advance collected successfully!", {
          description: `Receipt No: ${receiptNo}`,
        });
        setAmountToCollect(0);
      }, 1500);
    }
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ''}`);
  };

  const canConfirm = payerName.trim() !== "" && amountToCollect > 0 && isValid;

  // Get wizard steps for split payment
  const wizardSteps: SplitPaymentStep[] = getCardUpiSteps().map(step => ({
    ...step,
    status: 'pending' as const,
  }));

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
        
        {/* Compact Header */}
        <div className="h-[72px] bg-background border-b border-border flex-shrink-0 flex items-center justify-between px-6">
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
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-[1fr_420px] gap-6">
            {/* Left Panel - Advance History Table */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Advance Deposits</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Balance:</span>
                  <span className="font-semibold text-green-600">{formatINR(availableBalance)}</span>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Receipt No.</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Date & Time</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Reason</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Method</th>
                      <th className="text-right text-sm font-medium text-muted-foreground p-4">Amount</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background">
                    {advanceHistory.map((adv) => (
                      <tr key={adv.id} className="border-t hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-medium">{adv.receiptNo}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{adv.date}</p>
                          <p className="text-xs text-muted-foreground">{adv.time}</p>
                        </td>
                        <td className="p-4 text-sm">{adv.reason}</td>
                        <td className="p-4 text-sm">{adv.payerName}</td>
                        <td className="p-4 text-sm">{adv.method}</td>
                        <td className="p-4 text-sm font-medium text-right text-green-600">{formatINR(adv.amount)}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="mt-4 pt-4 border-t flex items-center justify-end text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Collected:</span>
                  <span className="font-semibold">{formatINR(mockPatient.currentAdvance)}</span>
                </div>
              </div>
            </Card>

            {/* Right Panel - Collection Form (styled like PaymentSummaryPanel) */}
            <Card className="overflow-hidden sticky top-6 h-fit">
              {/* Header */}
              <div className="bg-primary px-5 py-4">
                <h3 className="text-base font-semibold text-primary-foreground">Collect Advance</h3>
                <p className="text-xs text-primary-foreground/70 mt-0.5">
                  Record deposit from patient or attendant
                </p>
              </div>
              
              <div className="p-5 space-y-5">
                {/* Reason Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Reason for Advance</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-lg z-50">
                      {reasonOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Balance Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Current Advance Balance</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{formatINR(availableBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Estimated Bill</span>
                    <span>{formatINR(mockPatient.estimatedBill)}</span>
                  </div>
                </div>

                {/* Amount to Collect */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Amount to Collect</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      value={amountToCollect || ""}
                      onChange={(e) => setAmountToCollect(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="pl-7 h-11 text-lg font-semibold"
                      min={0}
                    />
                  </div>
                </div>

                {/* Split Payment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Split Payment</p>
                    <button
                      onClick={resetDistribution}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                  
                  {splitRows.map((row) => (
                    <div key={row.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                          <Input
                            type="number"
                            value={row.amount || ""}
                            onChange={(e) => updateRowAmount(row.id, parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="pl-7 h-11"
                            min={0}
                          />
                        </div>
                        <Select
                          value={row.method}
                          onValueChange={(value) => updateRowMethod(row.id, value as SplitRow['method'])}
                        >
                          <SelectTrigger className={`w-[130px] h-11 ${row.method === "card" || row.method === "upi" ? "border-primary bg-primary/5" : ""}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border shadow-lg z-50">
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                        {splitRows.length > 1 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="h-11 w-11 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Validation Error */}
                  {validationError && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {validationError}
                    </div>
                  )}

                  <button 
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                    onClick={addRow}
                  >
                    <span className="text-lg leading-none">+</span> Add Split Payment
                  </button>

                  {/* Quick Payment Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="h-12 flex flex-col items-center justify-center gap-1 border-2 hover:border-primary hover:bg-primary/5"
                      onClick={() => {
                        setSelectedPaymentMethod("card");
                        setShowPaymentModal(true);
                      }}
                      disabled={amountToCollect <= 0}
                    >
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Pay by Card</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 flex flex-col items-center justify-center gap-1 border-2 hover:border-primary hover:bg-primary/5"
                      onClick={() => {
                        setSelectedPaymentMethod("upi");
                        setShowPaymentModal(true);
                      }}
                      disabled={amountToCollect <= 0}
                    >
                      <Smartphone className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Pay by UPI</span>
                    </Button>
                  </div>
                </div>

                {/* New Balance Preview */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">New Balance After Collection</p>
                      <p className="text-2xl font-bold text-primary mt-1">{formatINR(newBalance)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-lg">₹</span>
                    </div>
                  </div>
                </div>

                {/* Payer Details */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <p className="text-sm font-semibold">Payer Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <Input
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        className="h-10 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Relation</Label>
                      <Select value={payerRelation} onValueChange={setPayerRelation}>
                        <SelectTrigger className="h-10 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-lg z-50">
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Mobile Number</Label>
                    <Input
                      type="tel"
                      value={payerMobile}
                      onChange={(e) => setPayerMobile(e.target.value)}
                      className="h-10 mt-1"
                    />
                  </div>
                </div>

                {/* Receipt Options */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <p className="text-sm font-medium text-foreground mr-2">After Payment</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox 
                      checked={printReceipt}
                      onCheckedChange={(checked) => setPrintReceipt(checked as boolean)}
                    />
                    <span>Print Receipt</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox 
                      checked={sendSms}
                      onCheckedChange={(checked) => setSendSms(checked as boolean)}
                    />
                    <span>SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox 
                      checked={sendEmail}
                      onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                    />
                    <span>Email</span>
                  </label>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={handleCollectAdvance}
                  disabled={!canConfirm || isProcessing}
                  className="w-full h-12 bg-primary hover:bg-primary/90 font-semibold"
                >
                  {isProcessing ? "Processing..." : "Collect Advance"}
                </Button>

                {/* Footer Note */}
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  By collecting this advance, you confirm that payment has been received. 
                  A receipt will be generated automatically.
                </p>
              </div>
            </Card>
          </div>
        </main>

        {/* Single Payment Modal */}
        <PaymentMethodModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          patientId={patientId || "P001"}
          patientName={mockPatient.name}
          mrn={mockPatient.gdid}
          orderId={`ADV-${Date.now()}`}
          amount={amountToCollect * 100} // Convert to paise
          purpose="advance"
          defaultMethod={selectedPaymentMethod}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />

        {/* Split Payment Wizard Modal */}
        <SplitPaymentWizardModal
          open={showSplitWizard}
          onOpenChange={setShowSplitWizard}
          patientId={patientId || "P001"}
          patientName={mockPatient.name}
          mrn={mockPatient.gdid}
          orderId={`ADV-${Date.now()}`}
          totalAmount={amountToCollect * 100} // Convert to paise
          purpose="advance"
          steps={wizardSteps}
          onComplete={handleSplitWizardComplete}
          onPartialComplete={handleSplitWizardPartial}
          onCancel={() => setShowSplitWizard(false)}
        />
      </PageContent>
    </div>
  );
};

export default PatientAdvanceCollection;
