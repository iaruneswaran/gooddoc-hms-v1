import { useSearchParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, ExternalLink, Plus, ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { PageContent } from "@/components/PageContent";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPatientsByPhone } from "@/data/header-search.mock";

function StatusChip({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  if (statusLower === "paid") {
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Paid</Badge>;
  }
  if (statusLower === "pending") {
    return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
  }
  if (statusLower === "overdue") {
    return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
  }
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

export default function PatientSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const patient = mockPatientsByPhone[query];
  const hasResults = !!patient;

  const handleGoTo360 = () => {
    if (patient) {
      navigate(`/patient360/${patient.gdid}?from=search`);
    }
  };

  const handleOptionClick = (option: string) => {
    if (!patient) return;
    const gdid = patient.gdid;
    switch (option) {
      case "Add amount":
        navigate(`/payments/${gdid}?action=add`);
        break;
      case "Book appointment":
        navigate(`/new-appointment?patientId=${gdid}`);
        break;
      case "Discharge":
        navigate(`/discharge/${gdid}`);
        break;
      case "Payments":
        navigate(`/payments/${gdid}`);
        break;
      default:
        break;
    }
  };

  const isIP = patient?.type === "IP";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader breadcrumbs={[{ label: "Patients", onClick: () => navigate("/patients") }, "Search Results"]} />
        <PageContent className="p-4">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-h3 font-semibold text-foreground">Search Results</h1>
              <p className="text-sm text-muted-foreground">
                {hasResults ? `1 match for "${query}"` : `No results for "${query}"`}
              </p>
            </div>
          </div>

          {hasResults ? (
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">{patient.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      GDID–{patient.gdid} • {patient.age} • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm font-normal px-3 py-1">
                    {isIP ? `Inpatient since ${patient.lastActivityShort.replace("In IP since ", "")}` : patient.lastActivityShort}
                  </Badge>
                  <Button variant="link" className="text-primary gap-1" onClick={handleGoTo360}>
                    Open 360° record <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-4 gap-5">
                {isIP ? (
                  <>
                    {/* Care & Bed */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Care & bed</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Primary doctor: </span>
                          <span className="text-foreground">{patient.ipInfo.doctor}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ward/Bed: </span>
                          <span className="text-foreground">{patient.ipInfo.ward} • {patient.ipInfo.bed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Emergency contact: </span>
                          {patient.ipInfo.emergencyContact ? (
                            <span className="text-foreground">{patient.ipInfo.emergencyContact}</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Not added{" "}
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
                                Add
                              </Button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Orders & Reports */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Orders & reports</h4>
                      <div className="space-y-2">
                        {patient.pending?.length > 0 ? (
                          patient.pending.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-foreground">{item.item}</span>
                              <StatusChip status={item.status} />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No reports yet</p>
                        )}
                      </div>
                      <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-xs gap-1">
                        <Plus className="w-3 h-3" /> Add report
                      </Button>
                    </div>

                    {/* Billing Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Billing summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Billed to date</span>
                          <span className="font-medium text-foreground">{patient.pendingAmount.bills}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Advance received</span>
                          <span className="font-medium text-foreground">{patient.pendingAmount.advance}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="text-muted-foreground font-medium">Due now</span>
                          <span className="font-semibold text-foreground">{patient.pendingAmount.outstanding}</span>
                        </div>
                      </div>
                      <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-xs">
                        View details
                      </Button>
                    </div>

                    {/* Options */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Options</h4>
                      <div className="space-y-2">
                        {patient.options.map((opt: string, idx: number) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start text-sm"
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Visit History */}
                    <div className="col-span-4 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">Visit history</h4>
                          <p className="text-sm text-muted-foreground">
                            Admitted: {patient.lastActivityShort.replace("In IP since ", "")}
                          </p>
                        </div>
                        <Button variant="link" size="sm" className="text-primary p-0 text-xs">
                          View all visits
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Visit History */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Visit history</h4>
                      <p className="text-sm text-muted-foreground">{patient.lastActivityShort}</p>
                      <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-xs gap-1">
                        <Plus className="w-3 h-3" /> Add item to visit
                      </Button>
                    </div>

                    {/* Reports */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Reports</h4>
                      {patient.pendingReports ? (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">Doctor's report</span>
                          <StatusChip status="Pending" />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No reports yet</p>
                      )}
                      <Button variant="outline" size="sm" className="mt-3 text-xs">
                        Book follow-up
                      </Button>
                    </div>

                    {/* Billing Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Billing summary</h4>
                      <p className="text-sm text-muted-foreground">No pending amount</p>
                      <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-xs gap-1">
                        <Plus className="w-3 h-3" /> Add pending amount
                      </Button>
                    </div>

                    {/* Options */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Options</h4>
                      <div className="space-y-2">
                        {patient.options.map((opt: string, idx: number) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start text-sm"
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">No results for "{query}"</h3>
              <p className="text-sm text-muted-foreground mb-4">Try a different phone number or check the spelling</p>
              <Button variant="outline" onClick={() => navigate("/patients")}>
                Browse all patients
              </Button>
            </Card>
          )}
        </PageContent>
      </div>
    </div>
  );
}
