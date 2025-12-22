import { useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, Printer, Download, FileText, Pill, Receipt, ClipboardList, Plus, Trash2, User, CreditCard } from "lucide-react";
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
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Harish Kalyan</p>
              <p className="text-xs text-muted-foreground">GDID-001 • 44Y / M</p>
            </div>
          </div>
        </div>

        <main className="p-6">

          <div className="flex gap-6 justify-center">
            {/* Left Column - Bill Summary */}
            <div className="w-[951px] space-y-6">
              {/* Summary Cards */}
              <div className="bg-primary rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">Final Bill Summary</h2>
                    <p className="text-xs text-white/60">Discharge settlement overview</p>
                  </div>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                    Visit: {visitId}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Total Bill</p>
                    </div>
                    <p className="text-lg font-semibold text-white">₹{totalBill.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Insurance</p>
                    </div>
                    <p className="text-lg font-semibold text-white">₹{insuranceApproved.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Advance</p>
                    </div>
                    <p className="text-lg font-semibold text-white">₹{advanceBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Net Payable</p>
                    </div>
                    <p className="text-lg font-semibold text-white">₹{netPayable.toLocaleString()}</p>
                  </div>
                </div>
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

              {/* Invoice Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </Button>
                </div>
                <Button 
                  className="gap-2"
                  onClick={() => navigate(`/patient-insights/${patientId}/discharge/payment`)}
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Payment
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Discharge;
