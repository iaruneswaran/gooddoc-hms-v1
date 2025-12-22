import { useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight,
  Printer, 
  Download, 
  FileText, 
  User, 
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Pill,
  Stethoscope,
  Building2,
  Shield,
  Banknote,
  ArrowRight
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PendingBill {
  id: string;
  department: string;
  description: string;
  date: string;
  amount: number;
  status: "pending" | "partial" | "paid";
  icon: React.ReactNode;
}

interface PaymentEntry {
  id: string;
  amount: string;
  method: string;
}

const paymentMethods = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "cheque", label: "Cheque", icon: "📝" },
  { value: "neft", label: "NEFT/RTGS", icon: "🏦" },
];

const pendingBills: PendingBill[] = [
  { id: "1", department: "Bed & Room Charges", description: "Deluxe Room - 3 days", date: "18-20 Dec 2025", amount: 7500, status: "pending", icon: <Building2 className="w-4 h-4" /> },
  { id: "2", department: "Doctor Consultation", description: "Cardiology - Dr. Arun Kumar", date: "18-19 Dec 2025", amount: 2500, status: "pending", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "3", department: "Procedures & Services", description: "Cardiac Catheterization, ECG, Echo", date: "18-19 Dec 2025", amount: 22260, status: "pending", icon: <FileText className="w-4 h-4" /> },
  { id: "4", department: "Laboratory", description: "CBC, Lipid Profile, LFT, Troponin", date: "18-20 Dec 2025", amount: 3675, status: "pending", icon: <Receipt className="w-4 h-4" /> },
  { id: "5", department: "Radiology & Imaging", description: "Chest X-Ray, CT Angiography", date: "18-19 Dec 2025", amount: 7297.50, status: "pending", icon: <FileText className="w-4 h-4" /> },
  { id: "6", department: "Pharmacy & Consumables", description: "Medicines & Surgical Items", date: "18-19 Dec 2025", amount: 1207.50, status: "pending", icon: <Pill className="w-4 h-4" /> },
  { id: "7", department: "Nursing & Care", description: "Nursing Charges, IV Monitoring", date: "18-20 Dec 2025", amount: 2000, status: "pending", icon: <User className="w-4 h-4" /> },
];

const Discharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { patientId } = useParams();
  const visitId = location.state?.visitId || "V25-004";
  
  const [selectedBills, setSelectedBills] = useState<string[]>(pendingBills.map(b => b.id));
  const [applyAdvance, setApplyAdvance] = useState(true);
  const [applyInsurance, setApplyInsurance] = useState(true);
  const [payments, setPayments] = useState<PaymentEntry[]>([{ id: "1", amount: "", method: "card" }]);
  const [dischargeConfirmed, setDischargeConfirmed] = useState(false);
  const [medicationCounseling, setMedicationCounseling] = useState(false);
  const [dischargeSummaryReady, setDischargeSummaryReady] = useState(false);

  const fromSearch = searchParams.get("from") === "search";
  const patientSearchQuery = searchParams.get("q") || "";

  const handleBack = () => {
    if (fromSearch && patientSearchQuery) {
      navigate(`/patients/search?q=${patientSearchQuery}`);
    } else {
      navigate(`/patient-insights/${patientId}`);
    }
  };

  const { isCollapsed } = useSidebarContext();

  // Calculate totals
  const grossCharges = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const tax = 1640;
  const adjustments = -500;
  const totalBill = grossCharges + tax + adjustments;
  
  const advanceAmount = 20000;
  const insuranceAmount = applyInsurance ? Math.round(totalBill * 0.8) : 0; // 80% coverage
  
  const appliedAdvance = applyAdvance ? advanceAmount : 0;
  const appliedInsurance = insuranceAmount;
  
  const netPayable = Math.max(0, totalBill - appliedAdvance - appliedInsurance);
  const amountEntered = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const balanceRemaining = netPayable - amountEntered;

  const addPayment = () => {
    setPayments([...payments, { id: Date.now().toString(), amount: "", method: "cash" }]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const updatePayment = (id: string, field: "amount" | "method", value: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const canProceedToDischarge = balanceRemaining <= 0 && medicationCounseling && dischargeSummaryReady;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />
      
      <div className={cn("flex-1 transition-all duration-300", isCollapsed ? "ml-[60px]" : "ml-[220px]")}>
        <AppHeader breadcrumbs={fromSearch ? [{ label: "Search Results", onClick: handleBack }, "Discharge"] : ["Patient Insights", "Discharge"]} />
        
        {/* Compact Header */}
        <div className="h-[72px] bg-background border-b border-border flex items-center justify-between px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Patient</span>
          </button>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Discharge Pending
            </Badge>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Siva Karthikeyan</p>
                <p className="text-xs text-muted-foreground">GDID-009 • 35Y / M • Cardiac Care - CC-207</p>
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-foreground">Discharge Settlement</h1>
              <p className="text-sm text-muted-foreground">Complete pending payments and discharge checklist to proceed</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Pending Bills */}
              <div className="col-span-2 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <Card className="p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Gross Charges</p>
                    <p className="text-lg font-bold text-foreground">₹{grossCharges.toLocaleString()}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Tax & Adjustments</p>
                    <p className="text-lg font-bold text-foreground">₹{(tax + adjustments).toLocaleString()}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Advance Paid</p>
                    <p className="text-lg font-bold text-emerald-600">₹{advanceAmount.toLocaleString()}</p>
                  </Card>
                  <Card className="p-3 bg-primary/5 border-primary/20">
                    <p className="text-[10px] font-medium text-primary uppercase tracking-wide">Net Payable</p>
                    <p className="text-lg font-bold text-primary">₹{netPayable.toLocaleString()}</p>
                  </Card>
                </div>

                {/* Pending Bills Table */}
                <Card className="overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-semibold text-foreground">Pending Bills</h2>
                        <p className="text-xs text-muted-foreground">{pendingBills.length} departments • ₹{grossCharges.toLocaleString()} total</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigate(`/patient-insights/${patientId}/discharge/invoice`)}>
                        <FileText className="w-3.5 h-3.5" />
                        View Detailed Invoice
                      </Button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {pendingBills.map((bill) => (
                      <div key={bill.id} className="flex items-center gap-4 p-3 hover:bg-muted/20 transition-colors">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          "bg-primary/10 text-primary"
                        )}>
                          {bill.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{bill.department}</p>
                          <p className="text-xs text-muted-foreground truncate">{bill.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{bill.date}</div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">₹{bill.amount.toLocaleString()}</p>
                          <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                            Pending
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Summary */}
                  <div className="p-4 bg-muted/30 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{grossCharges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (GST)</span>
                      <span className="font-medium">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Adjustments (Loyalty Discount)</span>
                      <span className="font-medium text-emerald-600">{adjustments < 0 ? "-" : ""}₹{Math.abs(adjustments).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total Bill Amount</span>
                      <span>₹{totalBill.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Payment & Discharge */}
              <div className="space-y-4">
                {/* Payment Adjustments */}
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Apply Credits</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={applyAdvance} 
                          onCheckedChange={(checked) => setApplyAdvance(!!checked)}
                        />
                        <div>
                          <p className="text-sm font-medium">Advance Payment</p>
                          <p className="text-xs text-muted-foreground">Available: ₹{advanceAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">-₹{appliedAdvance.toLocaleString()}</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={applyInsurance} 
                          onCheckedChange={(checked) => setApplyInsurance(!!checked)}
                        />
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Insurance (80%)</p>
                            <p className="text-xs text-muted-foreground">Star Health - Gold PPO</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">-₹{appliedInsurance.toLocaleString()}</span>
                    </label>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Amount to Collect</span>
                    <span className="text-xl font-bold text-primary">₹{netPayable.toLocaleString()}</span>
                  </div>

                  {/* Payment Entry */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Payment Entry</p>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addPayment}>
                        + Add Split
                      </Button>
                    </div>
                    
                    {payments.map((payment, idx) => (
                      <div key={payment.id} className="flex gap-2">
                        <Select 
                          value={payment.method} 
                          onValueChange={(v) => updatePayment(payment.id, "method", v)}
                        >
                          <SelectTrigger className="w-[120px] h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map(m => (
                              <SelectItem key={m.value} value={m.value}>
                                <span className="flex items-center gap-1.5">
                                  <span>{m.icon}</span>
                                  <span>{m.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={payment.amount}
                            onChange={(e) => updatePayment(payment.id, "amount", e.target.value)}
                            className="pl-7 h-9 text-sm"
                          />
                        </div>
                        {payments.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                            onClick={() => removePayment(payment.id)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {balanceRemaining > 0 && (
                    <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Balance remaining: ₹{balanceRemaining.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {balanceRemaining <= 0 && amountEntered > 0 && (
                    <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Payment complete
                      </p>
                    </div>
                  )}
                </Card>

                {/* Discharge Checklist */}
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Discharge Checklist</h3>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={balanceRemaining <= 0} 
                        disabled
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">All payments cleared</p>
                      </div>
                      {balanceRemaining <= 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={medicationCounseling}
                        onCheckedChange={(checked) => setMedicationCounseling(!!checked)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Medication counseling done</p>
                      </div>
                      {medicationCounseling ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={dischargeSummaryReady}
                        onCheckedChange={(checked) => setDischargeSummaryReady(!!checked)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Discharge summary ready</p>
                      </div>
                      {dischargeSummaryReady ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </label>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={!canProceedToDischarge}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Discharge
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                      <Download className="w-3.5 h-3.5" />
                      Download Bill
                    </Button>
                    <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discharge;
