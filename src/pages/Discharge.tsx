import { useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, Printer, Download, FileText, Pill, Receipt, ClipboardList, Plus, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import DischargeInvoice from "@/components/billing/DischargeInvoice";

interface SplitPayment {
  id: string;
  amount: string;
  method: string;
}

const paymentMethods = [
  { value: "cash", label: "Cash", emoji: "💵" },
  { value: "upi", label: "UPI", emoji: "📱" },
  { value: "card", label: "Card", emoji: "💳" },
  { value: "cheque", label: "Cheque", emoji: "📝" },
  { value: "neft", label: "NEFT/RTGS", emoji: "🏦" },
  { value: "insurance", label: "Insurance", emoji: "🏥" },
];

const Discharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { patientId } = useParams();
  const visitId = location.state?.visitId || "V25-004";
  const [applyAdvance, setApplyAdvance] = useState(false);
  const [depositExpanded, setDepositExpanded] = useState(false);
  const [adjustDeposit, setAdjustDeposit] = useState(false);
  const [confirmCounseling, setConfirmCounseling] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
    { id: "1", amount: "", method: "cash" }
  ]);

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
  const totalBill = 32700;
  const advanceBalance = 20000;
  const insuranceApproved = 0;
  
  // Deposit calculations
  const patientDeposit = 20000;
  const depositUsed = depositExpanded ? Math.min(patientDeposit, totalBill) : 0;
  const remainingDeposit = patientDeposit - depositUsed;
  const netPayable = depositExpanded ? Math.max(0, totalBill - depositUsed) : totalBill;

  const addSplitPayment = () => {
    setSplitPayments([...splitPayments, { id: Date.now().toString(), amount: "", method: "cash" }]);
  };

  const removeSplitPayment = (id: string) => {
    if (splitPayments.length > 1) {
      setSplitPayments(splitPayments.filter(p => p.id !== id));
    }
  };

  const updateSplitPayment = (id: string, field: "amount" | "method", value: string) => {
    setSplitPayments(splitPayments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className={cn("flex-1 transition-all duration-300", isCollapsed ? "ml-[60px]" : "ml-[220px]")}>
        <AppHeader breadcrumbs={fromSearch ? [{ label: "Search Results", onClick: handleBack }, "Discharge"] : ["Patient Insights", "Discharge"]} />
        
        <main className="p-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">{fromSearch ? "Search Results" : "Patient Insights"}</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-foreground mb-1">Patient Discharge</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Visit ID:</span>
                  <Badge variant="secondary" className="font-mono">{visitId}</Badge>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Admission: 05 Oct 2025</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">LOS: 3 days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Bill Summary */}
            <div className="col-span-2 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Bill</p>
                  <p className="text-xl font-bold text-foreground">₹{totalBill.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Insurance</p>
                  <p className="text-xl font-bold text-primary">₹{insuranceApproved.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Advance</p>
                  <p className="text-xl font-bold text-emerald-600">₹{advanceBalance.toLocaleString()}</p>
                </Card>
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Net Payable</p>
                  <p className="text-xl font-bold text-primary">₹{netPayable.toLocaleString()}</p>
                </Card>
              </div>

              {/* Invoice Details */}
              <DischargeInvoice 
                invoiceNo="INV-2025-009"
                invoiceDate="21/12/2025"
                admissionNo="ADM-2025-0142"
                patientName="Siva Karthikeyan"
                uhid="GDID-009"
                age="35 Years"
                gender="Male"
                admissionDate="05/10/2025"
                dischargeDate="08/10/2025"
                attendingPhysician="Dr. Arun Kumar, MD (Cardiology)"
                grossTotal={44000}
                netAmount={44000}
              />

            </div>

            {/* Right Column - Actions & Documents */}
            <div className="space-y-6">
              {/* Settlement & Payment Adjustments Combined */}
              <Card className="p-0 overflow-hidden">
                <div className="bg-primary px-4 py-3 rounded-t-lg">
                  <h2 className="text-base font-semibold text-primary-foreground">Payment Settlement</h2>
                  <p className="text-xs text-primary-foreground/80 mt-0.5">INV-2025-009</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Amount to Collect */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Amount to Collect</p>
                    <p className="text-2xl font-bold text-primary">₹{netPayable.toLocaleString()}</p>
                  </div>

                  {/* Patient Deposit Section */}
                  <div className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium text-foreground">Patient Deposit</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">₹{patientDeposit.toLocaleString()}</span>
                    </div>
                    
                    {/* Toggle row */}
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={depositExpanded}
                        onCheckedChange={setDepositExpanded}
                      />
                      <span className="text-sm text-muted-foreground">Adjust deposit against this bill</span>
                    </div>
                    
                    {/* Deposit details - shown when toggle is on */}
                    {depositExpanded && (
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Deposit Used</span>
                          <span className="text-sm font-medium text-destructive">- ₹{depositUsed.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Remaining Deposit</span>
                          <span className="text-sm font-semibold text-emerald-600">₹{remainingDeposit.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Collection with Split */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Payment Collection</p>
                      <span className="text-xs text-primary font-medium">Split Payment</span>
                    </div>

                    <div className="space-y-2">
                      {splitPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center gap-2">
                          <Input
                            placeholder="₹ 0.00"
                            value={payment.amount}
                            onChange={(e) => updateSplitPayment(payment.id, "amount", e.target.value)}
                            className="flex-1"
                          />
                          <Select
                            value={payment.method}
                            onValueChange={(value) => updateSplitPayment(payment.id, "method", value)}
                          >
                            <SelectTrigger className="w-[120px] bg-background">
                              <SelectValue>
                                {paymentMethods.find(m => m.value === payment.method)?.emoji}{" "}
                                {paymentMethods.find(m => m.value === payment.method)?.label}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border z-50">
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{method.emoji}</span>
                                    <span>{method.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {splitPayments.length > 1 && (
                            <button
                              onClick={() => removeSplitPayment(payment.id)}
                              className="p-2 rounded-lg transition-colors text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addSplitPayment}
                      className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Split Payment
                    </button>
                  </div>

                  {/* Payer Details */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-sm font-medium text-foreground">Payer Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Name</label>
                        <Input placeholder="Payer name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Relation</label>
                        <Select defaultValue="self">
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border border-border z-50">
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
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Mobile Number</label>
                      <Input placeholder="+91" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <Button className="w-full" size="lg">
                      Collect Payment
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Printer className="w-4 h-4" />
                      Print Bill
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Discharge Documents */}
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground mb-4">Discharge Documents</h2>
                
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Discharge Summary</p>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <Pill className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Prescription</p>
                      <p className="text-xs text-muted-foreground">e-Prescription</p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <Receipt className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Final Bill</p>
                      <p className="text-xs text-muted-foreground">Invoice & Receipt</p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Care Instructions</p>
                      <p className="text-xs text-muted-foreground">Patient Guide</p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </Card>

              {/* Finalize */}
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground mb-4">Finalize Discharge</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Checkbox 
                      id="counseling" 
                      checked={confirmCounseling}
                      onCheckedChange={(checked) => setConfirmCounseling(checked as boolean)}
                      className="mt-0.5"
                    />
                    <label htmlFor="counseling" className="text-sm cursor-pointer">
                      I confirm discharge counseling provided and documents shared with patient/attendant.
                    </label>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!confirmCounseling || netPayable > 0}
                  >
                    Complete Discharge
                  </Button>
                  
                  {netPayable > 0 && (
                    <p className="text-xs text-destructive text-center">
                      Collect outstanding balance before discharge
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discharge;
