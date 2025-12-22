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
import DischargeBillInvoice from "@/components/billing/DischargeBillInvoice";
import { SAMPLE_DISCHARGE_BILL } from "@/data/discharge-bill.mock";

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
        <AppHeader breadcrumbs={fromSearch ? [{ label: "Search Results", onClick: handleBack }, "Interim Bill"] : ["Patient Insights", "Interim Bill"]} />
        
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
            <div className="w-[1000px] space-y-6">
              {/* Interim Bill Invoice */}
              <DischargeBillInvoice bill={SAMPLE_DISCHARGE_BILL} isSample={false} />

              {/* Invoice Action Buttons */}
              <div className="flex items-center justify-end mt-4 gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print Invoice
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
