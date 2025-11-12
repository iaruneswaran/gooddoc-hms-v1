import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, RefreshCw, Bell } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClearancesSection } from "@/components/discharge/ClearancesSection";
import { BillingSection } from "@/components/discharge/BillingSection";
import { FinalizeSection } from "@/components/discharge/FinalizeSection";
import { PatientDischargeInfo, DischargeStatus } from "@/types/discharge";
import { toast } from "sonner";

const FrontOfficeDischarge = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const visitId = location.state?.visitId || "VST-205431";

  const [patientInfo] = useState<PatientDischargeInfo>({
    visitId,
    patientName: "Anaya Shah",
    mrn: "MRN-204983",
    age: 34,
    sex: "F",
    admissionDate: "01 Nov 2025",
    intendedDischargeDate: "08 Nov 2025",
    attendingDoctor: "Dr. Rajesh Mehta",
    overallStatus: "In Progress"
  });

  const [clearancesOpen, setClearancesOpen] = useState(true);
  const [billingOpen, setBillingOpen] = useState(true);
  const [finalizeOpen, setFinalizeOpen] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Silently refresh clearances status
      console.log("Auto-refreshing clearances...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusVariant = (status: DischargeStatus) => {
    switch (status) {
      case 'Not Started': return 'outline';
      case 'In Progress': return 'secondary';
      case 'Ready to Finalize': return 'default';
      case 'Finalized': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Patient Insights", "Discharge (Front Office)"]} />
        
        <main className="px-6 py-6 pb-24 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          {/* Back Link */}
          <button
            onClick={() => navigate(`/patient-insights/${patientId}`)}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Patient Insights</span>
          </button>

          {/* Patient Header - Fixed */}
          <Card className="p-6 mb-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{patientInfo.patientName}</h1>
                  <Badge variant="secondary" className="font-mono">{patientInfo.mrn}</Badge>
                  <Badge variant="outline">{patientInfo.age}y | {patientInfo.sex}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Visit ID:</span>
                    <span className="font-semibold font-mono">{patientInfo.visitId}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Attending Doctor:</span>
                    <span className="font-medium">{patientInfo.attendingDoctor}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Admission Date:</span>
                    <span className="font-medium">{patientInfo.admissionDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Intended Discharge:</span>
                    <span className="font-medium">{patientInfo.intendedDischargeDate || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-2">Discharge Status</p>
                <Badge variant={getStatusVariant(patientInfo.overallStatus)} className="text-sm px-3 py-1">
                  {patientInfo.overallStatus}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Three Collapsible Sections */}
          <div className="space-y-4 max-w-[1400px]">
            
            {/* 1. Clearances */}
            <Collapsible open={clearancesOpen} onOpenChange={setClearancesOpen}>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-primary">Department Clearances</h2>
                    <Badge variant="secondary" className="text-xs">5 of 8 cleared</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {clearancesOpen ? "Collapse" : "Expand"}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-6 pb-6 pt-2">
                    <ClearancesSection visitId={visitId} />
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 2. Billing & Settlement */}
            <Collapsible open={billingOpen} onOpenChange={setBillingOpen}>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-primary">Billing & Settlement</h2>
                    <Badge variant="outline" className="text-xs">₹2,000 Outstanding</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {billingOpen ? "Collapse" : "Expand"}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-6 pb-6 pt-2">
                    <BillingSection visitId={visitId} />
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 3. Review & Finalize */}
            <Collapsible open={finalizeOpen} onOpenChange={setFinalizeOpen}>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-primary">Review & Finalize</h2>
                    <Badge variant="secondary" className="text-xs">3 pending</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {finalizeOpen ? "Collapse" : "Expand"}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-6 pb-6 pt-2">
                    <FinalizeSection visitId={visitId} patientInfo={patientInfo} />
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

          </div>
        </main>
      </div>
    </div>
  );
};

export default FrontOfficeDischarge;
