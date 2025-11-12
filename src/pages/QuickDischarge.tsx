import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BillingSection } from "@/components/discharge/BillingSection";
import { QuickDischargePanel } from "@/components/discharge/QuickDischargePanel";
import { PatientDischargeInfo } from "@/types/discharge";

const QuickDischarge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId") || "VST-205431";

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

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/discharge/quick?visitId=${searchValue.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Discharge", "Quick Discharge (Front Office)"]} />
        
        <main className="px-6 py-6 pb-24 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          
          {/* Patient Header - Compact */}
          <Card className="p-5 mb-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground">{patientInfo.patientName}</h1>
                  <Badge variant="secondary" className="font-mono text-xs">{patientInfo.mrn}</Badge>
                </div>
                
                <div className="flex gap-6 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Visit ID:</span>
                    <span className="font-semibold font-mono">{patientInfo.visitId}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Admission:</span>
                    <span className="font-medium">{patientInfo.admissionDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="font-medium">{patientInfo.attendingDoctor}</span>
                  </div>
                </div>
              </div>

              {/* Search/Scan Visit ID */}
              <div className="flex gap-2 w-64">
                <Input 
                  placeholder="Search Visit ID"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1600px]">
            
            {/* Left Column: Billing & Settlement (2/3 width) */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">Billing & Settlement</h2>
                <BillingSection visitId={visitId} />
              </Card>
            </div>

            {/* Right Column: Quick Discharge Panel (1/3 width) */}
            <div className="lg:col-span-1">
              <QuickDischargePanel visitId={visitId} patientInfo={patientInfo} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default QuickDischarge;
