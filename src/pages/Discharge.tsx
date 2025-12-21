import { useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, Printer, Download, FileText, Pill, Receipt, ClipboardList } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import DischargeInvoice from "@/components/billing/DischargeInvoice";

const Discharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { patientId } = useParams();
  const visitId = location.state?.visitId || "V25-004";
  const [applyAdvance, setApplyAdvance] = useState(false);
  const [confirmCounseling, setConfirmCounseling] = useState(false);
  
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
  const netPayable = applyAdvance ? Math.max(0, totalBill - advanceBalance) : totalBill;

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
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground mb-4">Settlement</h2>
                
                <div className="space-y-4">
                  {/* Amount to Collect */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Amount to Collect</p>
                    <p className="text-2xl font-bold text-primary">₹{netPayable.toLocaleString()}</p>
                  </div>

                  {/* Apply Advance */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="advance" 
                        checked={applyAdvance}
                        onCheckedChange={(checked) => setApplyAdvance(checked as boolean)}
                      />
                      <label htmlFor="advance" className="text-sm font-medium cursor-pointer">
                        Apply Advance Balance
                      </label>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">₹{advanceBalance.toLocaleString()}</span>
                  </div>

                  {/* Discount Fields */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Discount Type</label>
                      <Input placeholder="Select type" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Amount</label>
                        <Input placeholder="₹0" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Reason</label>
                        <Input placeholder="Enter reason" />
                      </div>
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
