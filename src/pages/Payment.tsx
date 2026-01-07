import { useState, useEffect } from "react";
import bainesLogo from "@/assets/baines-logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Download, Printer, CheckCircle2, Trash2, CreditCard, Smartphone, RotateCcw, AlertCircle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentMethodModal } from "@/components/payment";
import { SplitPaymentWizardModal, type SplitPaymentStep } from "@/components/payment/SplitPaymentWizardModal";
import { useSplitPaymentAutoCalc, type SplitRow } from "@/hooks/useSplitPaymentAutoCalc";
import type { PaymentMethod as PaymentMethodType, PaymentAttempt } from "@/types/payment-intent";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";

interface InvoiceItem {
  name: string;
  price: number;
}

interface PaymentData {
  appointmentType: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  date: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData & { fromPatientInsights?: boolean; patientId?: string };
  const fromPatientInsights = paymentData?.fromPatientInsights;
  const patientId = paymentData?.patientId;
  
  const [useAdvance, setUseAdvance] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<"now" | "later">("now");
  const [countdown, setCountdown] = useState(9);
  const [printingStatus, setPrintingStatus] = useState<"printing" | "success" | "done">("printing");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("card");
  const [showSplitWizard, setShowSplitWizard] = useState(false);

  const advanceAmount = 1000;
  const billAmount = 6000;
  const usedAdvance = useAdvance ? Math.min(advanceAmount, billAmount) : 0;
  const remainingBalance = useAdvance ? Math.max(0, advanceAmount - billAmount) : advanceAmount;
  const payableAmount = Math.max(0, billAmount - usedAdvance);

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
  } = useSplitPaymentAutoCalc({ totalDue: payableAmount });

  // Wizard steps
  const wizardSteps: SplitPaymentStep[] = getCardUpiSteps().map(step => ({
    ...step,
    status: 'pending' as const,
  }));

  useEffect(() => {
    if (showSuccess) {
      const printingTimer = setTimeout(() => {
        setPrintingStatus("success");
        const successTimer = setTimeout(() => {
          setPrintingStatus("done");
        }, 2000);
        return () => clearTimeout(successTimer);
      }, 2000);
      return () => clearTimeout(printingTimer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showSuccess && printingStatus === "done" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [showSuccess, printingStatus, countdown, navigate]);

  const handlePayNow = () => {
    if (!isValid) {
      toast.error(validationError || "Please check split amounts");
      return;
    }

    const cardUpiSteps = getCardUpiSteps();
    if (cardUpiSteps.length > 0) {
      setShowSplitWizard(true);
    } else {
      setPaymentType("now");
      setShowSuccess(true);
      setCountdown(9);
      setPrintingStatus("printing");
    }
  };

  const handlePayLater = () => {
    setPaymentType("later");
    setShowSuccess(true);
    setCountdown(9);
    setPrintingStatus("printing");
  };

  const handleSplitWizardComplete = (steps: SplitPaymentStep[]) => {
    const cardAmount = steps.filter(s => s.method === 'card' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    const upiAmount = steps.filter(s => s.method === 'upi' && s.status === 'succeeded')
      .reduce((sum, s) => sum + s.amount, 0);
    
    toast.success(`Split payment collected: Card ${formatINR(cardAmount)} + UPI ${formatINR(upiAmount)}`);
    setPaymentType("now");
    setShowSuccess(true);
    setCountdown(9);
    setPrintingStatus("printing");
  };

  const handlePaymentSuccess = (attempt: PaymentAttempt) => {
    setShowPaymentModal(false);
    setShowSuccess(true);
    setCountdown(9);
    setPrintingStatus("printing");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Appointments", "Payment"]} />
        
        <main className="p-6">
          <div className="flex items-center justify-between h-10 mb-12">
            <div className="w-[130px]">
              <button
                onClick={() => navigate("/book-appointment", { 
                  state: { fromPatientInsights, patientId } 
                })}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-semibold">Appointment</span>
              </button>
            </div>

            <BookingSteps currentStep="payment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />
            
            <div className="w-[130px]" />
          </div>

          <div className="max-w-[1600px] mx-auto">
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                {/* Invoice Header */}
                <Card className="p-0 overflow-hidden">
                  {/* Hospital Header */}
                  <div className="bg-primary/5 border-b border-border px-6 py-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <img src={bainesLogo} alt="Baines Hospital" className="h-9" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">123 Healthcare Avenue, Medical District</p>
                        <p className="text-sm text-muted-foreground">Phone: +91 98765 43210 | GSTIN: 29XXXXX1234X1Z5</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details Row */}
                  <div className="grid grid-cols-3 gap-6 px-6 py-4 bg-muted/30 border-b border-border">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoice No.</p>
                      <p className="text-sm font-semibold text-foreground mt-1">INV-2025-009</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoice Date</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{paymentData?.date || "21/12/2025"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Admission No.</p>
                      <p className="text-sm font-semibold text-foreground mt-1">ADM-2025-0142</p>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Patient Details</p>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Siva Karthikeyan</p>
                        <p className="text-xs text-muted-foreground">UHID: GDID-009</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Age / Gender</p>
                        <p className="text-sm text-foreground">35 Years / Male</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Admission Date</p>
                        <p className="text-sm text-foreground">05/10/2025</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Discharge Date</p>
                        <p className="text-sm text-foreground">08/10/2025</p>
                      </div>
                    </div>
                  </div>

                  {/* Attending Doctor */}
                  <div className="px-6 py-3 bg-muted/20 border-b border-border">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Attending Physician:</p>
                      <p className="text-sm font-medium text-foreground">Dr. Arun Kumar, MD (Cardiology)</p>
                    </div>
                  </div>

                  {/* Bill Items */}
                  <div className="px-6 py-4">
                    {paymentData?.items && paymentData.items.length > 0 && (
                      <div className="space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 py-2 border-b-2 border-foreground/20 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          <div className="col-span-1">S.No</div>
                          <div className="col-span-5">Particulars</div>
                          <div className="col-span-2 text-center">Qty</div>
                          <div className="col-span-2 text-right">Rate (₹)</div>
                          <div className="col-span-2 text-right">Amount (₹)</div>
                        </div>

                        {/* Doctor Consultation Section */}
                        <div className="py-2 border-b border-dashed border-border">
                          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">A. Doctor Consultation</p>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">1</div>
                            <div className="col-span-5">Cardiology Consultation - Dr. Arun Kumar</div>
                            <div className="col-span-2 text-center">1</div>
                            <div className="col-span-2 text-right">1,500.00</div>
                            <div className="col-span-2 text-right font-medium">1,500.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">2</div>
                            <div className="col-span-5">Follow-up Visit</div>
                            <div className="col-span-2 text-center">2</div>
                            <div className="col-span-2 text-right">500.00</div>
                            <div className="col-span-2 text-right font-medium">1,000.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1 text-sm bg-muted/30 rounded mt-1">
                            <div className="col-span-10 text-right font-semibold text-muted-foreground">Sub-Total (A)</div>
                            <div className="col-span-2 text-right font-bold">2,500.00</div>
                          </div>
                        </div>

                        {/* Laboratory Section */}
                        <div className="py-2 border-b border-border">
                          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">B. Laboratory Investigations</p>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">3</div>
                            <div className="col-span-5">Complete Blood Count (CBC)</div>
                            <div className="col-span-2 text-center">2</div>
                            <div className="col-span-2 text-right">400.00</div>
                            <div className="col-span-2 text-right font-medium">800.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">4</div>
                            <div className="col-span-5">Lipid Profile</div>
                            <div className="col-span-2 text-center">1</div>
                            <div className="col-span-2 text-right">650.00</div>
                            <div className="col-span-2 text-right font-medium">650.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">5</div>
                            <div className="col-span-5">Liver Function Test (LFT)</div>
                            <div className="col-span-2 text-center">1</div>
                            <div className="col-span-2 text-right">850.00</div>
                            <div className="col-span-2 text-right font-medium">850.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1.5 text-sm">
                            <div className="col-span-1 text-muted-foreground">6</div>
                            <div className="col-span-5">Cardiac Biomarkers (Troponin I)</div>
                            <div className="col-span-2 text-center">1</div>
                            <div className="col-span-2 text-right">1,200.00</div>
                            <div className="col-span-2 text-right font-medium">1,200.00</div>
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-1 text-sm bg-muted/30 rounded mt-1">
                            <div className="col-span-10 text-right font-semibold text-muted-foreground">Sub-Total (B)</div>
                            <div className="col-span-2 text-right font-bold">3,500.00</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(!paymentData?.items || paymentData.items.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">No invoice data available. Generate from booking appointment.</p>
                    )}
                  </div>

                  {/* Grand Total Section */}
                  {paymentData?.items && paymentData.items.length > 0 && (
                    <div className="px-6 py-4 bg-muted/30 border-t border-border">
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-sm">
                          <div className="col-span-10 text-right text-muted-foreground">Gross Total</div>
                          <div className="col-span-2 text-right font-semibold">6,000.00</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                          <div className="col-span-10 text-right text-muted-foreground">Discount (0%)</div>
                          <div className="col-span-2 text-right">0.00</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm border-t border-dashed border-border pt-2">
                          <div className="col-span-10 text-right text-muted-foreground">Taxable Amount</div>
                          <div className="col-span-2 text-right font-semibold">6,000.00</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                          <div className="col-span-10 text-right text-muted-foreground">CGST @ 0%</div>
                          <div className="col-span-2 text-right">0.00</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                          <div className="col-span-10 text-right text-muted-foreground">SGST @ 0%</div>
                          <div className="col-span-2 text-right">0.00</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 mt-4 pt-3 border-t-2 border-foreground/30">
                        <div className="col-span-10 text-right font-bold text-base">NET AMOUNT PAYABLE</div>
                        <div className="col-span-2 text-right font-bold text-lg text-primary">₹6,000</div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-right italic">
                        Rupees Six Thousand Only
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-6 py-4 bg-muted/10 border-t border-border">
                    <div className="grid grid-cols-2 gap-6 text-xs text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground mb-1">Payment Terms</p>
                        <p>• Payment due on discharge</p>
                        <p>• Accepted: Cash, Card, UPI, Net Banking</p>
                        <p>• Insurance claims processed within 7 working days</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground mb-1">For GoodDoc Hospital</p>
                        <div className="h-10"></div>
                        <p className="border-t border-border pt-1 inline-block">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </Button>
                </div>
              </div>

              {/* Collect Payment */}
              <Card className="w-full lg:w-[420px] h-fit self-start overflow-hidden">
                {/* Header */}
                <div className="bg-primary px-5 py-4">
                  <h3 className="text-base font-semibold text-primary-foreground">Payment Settlement</h3>
                  <p className="text-xs text-primary-foreground/70 mt-0.5">Invoice: INV-2025-009</p>
                </div>
                
                <div className="p-5 space-y-5">
                  {/* Bill Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Gross Bill Amount</span>
                      <span className="font-medium">₹44,000.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Discount Applied</span>
                      <span className="font-medium text-green-600">- ₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-dashed border-border pt-3">
                      <span className="font-semibold">Net Bill Amount</span>
                      <span className="font-bold text-lg">₹{billAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Advance/Deposit Section */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Patient Deposit</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">₹{advanceAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <Switch
                        id="use-advance"
                        checked={useAdvance}
                        onCheckedChange={setUseAdvance}
                      />
                      <label htmlFor="use-advance" className="text-xs cursor-pointer text-muted-foreground">
                        Adjust deposit against this bill
                      </label>
                    </div>
                    
                    {useAdvance && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Deposit Used</span>
                          <span className="font-medium text-green-600">- ₹{usedAdvance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Remaining Deposit</span>
                          <span className="font-medium">₹{remainingBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount Payable */}
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount to Collect</p>
                        <p className="text-2xl font-bold text-primary mt-1">₹{payableAmount.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg">₹</span>
                      </div>
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

                  </div>

                  {/* Payer Details */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-sm font-semibold">Payer Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Payer Name</label>
                        <input
                          type="text"
                          defaultValue="Siva Karthikeyan"
                          className="w-full h-10 px-3 mt-1 text-sm bg-background border border-input rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Relation</label>
                        <Select defaultValue="self">
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
                      <label className="text-xs text-muted-foreground">Mobile Number</label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full h-10 px-3 mt-1 text-sm bg-background border border-input rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Receipt Options */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Print Receipt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Send SMS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Email</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12" 
                      onClick={handlePayLater}
                    >
                      Pay Later
                    </Button>
                    <Button 
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 font-semibold" 
                      onClick={handlePayNow}
                    >
                      Settle Bill
                    </Button>
                  </div>

                  {/* Footer Note */}
                  <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                    By settling this bill, you confirm that payment has been received. 
                    A receipt will be generated automatically.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 w-[320px] bg-background rounded-lg p-6 shadow-2xl animate-in slide-in-from-bottom-5 z-50 border border-border">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {paymentType === "now" ? "Payment Successful" : "Payment Scheduled"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Your booking has been confirmed & Your payment has been {paymentType === "now" ? "processed successfully" : "scheduled for later"}.
              </p>
            </div>

            {printingStatus !== "done" && (
              <div className="py-4 w-full">
                <div className="flex items-center justify-center gap-2">
                  {printingStatus === "printing" && (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Sending to printer...</p>
                    </>
                  )}
                  {printingStatus === "success" && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <p className="text-sm text-foreground font-medium">Receipt printed successfully</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {printingStatus === "done" && (
              <>
                <div className="py-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    You will be redirected to the Home Page in
                  </p>
                  <div className="text-3xl font-bold text-primary">
                    {countdown}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">seconds...</p>
                </div>

                <Button 
                  onClick={() => navigate("/")}
                  size="sm"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      <PaymentMethodModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        patientId={patientId || "P001"}
        patientName="Siva Karthikeyan"
        mrn="GDID-009"
        orderId="INV-2025-009"
        amount={payableAmount * 100}
        purpose="settlement"
        defaultMethod={selectedPaymentMethod}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentModal(false)}
      />

      {/* Split Payment Wizard Modal */}
      <SplitPaymentWizardModal
        open={showSplitWizard}
        onOpenChange={setShowSplitWizard}
        patientId={patientId || "P001"}
        patientName="Siva Karthikeyan"
        mrn="GDID-009"
        orderId="INV-2025-009"
        totalAmount={payableAmount}
        purpose="settlement"
        steps={wizardSteps}
        onComplete={handleSplitWizardComplete}
        onCancel={() => setShowSplitWizard(false)}
      />
    </PageContent>
    </div>
  );
};

export default Payment;
