import { useSearchParams, useNavigate } from "react-router-dom";
import { User, ExternalLink, Plus, ChevronLeft, CreditCard, CalendarPlus, LogOut, Wallet } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { PageContent } from "@/components/PageContent";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockPatientsByPhone } from "@/data/header-search.mock";

function StatusChip({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  if (statusLower === "paid") {
    return <Badge className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-2 py-0.5">Paid</Badge>;
  }
  if (statusLower === "pending") {
    return <Badge className="text-[11px] bg-amber-50 text-amber-700 border-amber-200 font-medium px-2 py-0.5">Pending</Badge>;
  }
  if (statusLower === "overdue") {
    return <Badge className="text-[11px] bg-red-50 text-red-700 border-red-200 font-medium px-2 py-0.5">Overdue</Badge>;
  }
  return <Badge variant="outline" className="text-[11px] font-medium px-2 py-0.5">{status}</Badge>;
}

function SectionCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-muted/40 rounded-xl p-4 flex flex-col ${className}`}>
      <h4 className="text-label font-semibold text-foreground mb-3 tracking-tight">{title}</h4>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, action }: { label: string; value?: string | React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5">
      <span className="text-caption text-muted-foreground">{label}</span>
      <div className="text-caption text-foreground font-medium text-right flex items-center gap-1.5">
        {value || <span className="text-muted-foreground font-normal">—</span>}
        {action}
      </div>
    </div>
  );
}

function BillingRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'pt-3 mt-1 border-t border-border' : ''}`}>
      <span className={`text-caption ${highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`text-caption ${highlight ? 'text-foreground font-semibold' : 'text-foreground font-medium'}`}>{value}</span>
    </div>
  );
}

const optionIcons: Record<string, React.ElementType> = {
  "Add amount": CreditCard,
  "Book appointment": CalendarPlus,
  "Discharge": LogOut,
  "Payments": Wallet,
};

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
    const searchQuery = query;
    switch (option) {
      case "Add amount":
        navigate(`/patient-insights/${gdid}/payments?action=advance&from=search&q=${searchQuery}`);
        break;
      case "Book appointment":
        navigate(`/book-appointment?patientId=${gdid}&from=search&q=${searchQuery}`);
        break;
      case "Discharge":
        navigate(`/patient-insights/${gdid}/discharge?from=search&q=${searchQuery}`);
        break;
      case "Payments":
        navigate(`/patient-insights/${gdid}/payments?from=search&q=${searchQuery}`);
        break;
      default:
        break;
    }
  };

  const isIP = patient?.type === "IP";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <PageContent className="flex-1 flex flex-col">
        <AppHeader breadcrumbs={[{ label: "Patients", onClick: () => navigate("/patients") }, "Search Results"]} />
        <div className="p-6 flex-1">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-8 w-8 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-h3 font-semibold text-foreground">Search Results</h1>
          </div>

          {hasResults ? (
            <Card className="overflow-hidden border-border/60">
              {/* Patient Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-muted/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-h2 font-semibold text-foreground">{patient.name}</h2>
                      <p className="text-small text-muted-foreground mt-0.5">
                        GDID–{patient.gdid} • {patient.age || '—'} • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-small font-medium px-3 py-1.5 bg-primary/10 text-primary border-0">
                      {isIP ? `Inpatient since ${patient.lastActivityShort.replace("In IP since ", "")}` : patient.lastActivityShort}
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-1.5 text-small font-medium" onClick={handleGoTo360}>
                      Open 360° record <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content Grid */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {isIP ? (
                    <>
                      {/* Care & Bed */}
                      <SectionCard title="Care & Bed">
                        <div className="space-y-0.5">
                          <InfoRow label="Primary doctor" value={patient.ipInfo.doctor} />
                          <InfoRow label="Ward / Bed" value={`${patient.ipInfo.ward} • ${patient.ipInfo.bed}`} />
                          <InfoRow 
                            label="Emergency contact" 
                            value={patient.ipInfo.emergencyContact || "Not added"}
                            action={!patient.ipInfo.emergencyContact && (
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto text-[11px] font-medium">
                                Add
                              </Button>
                            )}
                          />
                        </div>
                      </SectionCard>

                      {/* Orders & Reports */}
                      <SectionCard title="Orders & Reports">
                        <div className="space-y-2">
                          {patient.pending?.length > 0 ? (
                            patient.pending.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-caption text-foreground">{item.item}</span>
                                <StatusChip status={item.status} />
                              </div>
                            ))
                          ) : (
                            <p className="text-caption text-muted-foreground">No reports yet</p>
                          )}
                        </div>
                        <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-[11px] font-medium gap-1">
                          <Plus className="w-3 h-3" /> Add report
                        </Button>
                      </SectionCard>

                      {/* Billing Summary */}
                      <SectionCard title="Billing Summary">
                        <div>
                          <BillingRow label="Billed to date" value={patient.pendingAmount.bills} />
                          <BillingRow label="Advance received" value={patient.pendingAmount.advance} />
                          <BillingRow label="Due now" value={patient.pendingAmount.outstanding} highlight />
                        </div>
                        <Button variant="link" size="sm" className="text-primary p-0 mt-2 text-[11px] font-medium">
                          View details
                        </Button>
                      </SectionCard>

                      {/* Quick Actions */}
                      <SectionCard title="Quick Actions">
                        <div className="space-y-2">
                          {patient.options.map((opt: string, idx: number) => {
                            const Icon = optionIcons[opt] || CalendarPlus;
                            return (
                              <Button 
                                key={idx} 
                                variant="outline" 
                                size="sm" 
                                className="w-full justify-start text-small font-medium gap-2 h-9"
                                onClick={() => handleOptionClick(opt)}
                              >
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                {opt}
                              </Button>
                            );
                          })}
                        </div>
                      </SectionCard>

                      {/* Visit History - Full Width */}
                      <div className="col-span-4 bg-muted/40 rounded-xl px-5 py-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-label font-semibold text-foreground">Visit History</h4>
                          <p className="text-caption text-muted-foreground mt-0.5">
                            Admitted: {patient.lastActivityShort.replace("In IP since ", "")}
                          </p>
                        </div>
                        <Button variant="link" size="sm" className="text-primary p-0 text-[11px] font-medium">
                          View all visits →
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Visit History */}
                      <SectionCard title="Visit History">
                        <p className="text-caption text-muted-foreground">{patient.lastActivityShort}</p>
                        <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-[11px] font-medium gap-1">
                          <Plus className="w-3 h-3" /> Add item to visit
                        </Button>
                      </SectionCard>

                      {/* Reports */}
                      <SectionCard title="Reports">
                        {patient.pendingReports ? (
                          <div className="flex items-center justify-between">
                            <span className="text-caption text-foreground">Doctor's report</span>
                            <StatusChip status="Pending" />
                          </div>
                        ) : (
                          <p className="text-caption text-muted-foreground">No reports yet</p>
                        )}
                        <Button variant="outline" size="sm" className="mt-3 text-[11px] font-medium h-8">
                          Book follow-up
                        </Button>
                      </SectionCard>

                      {/* Billing Summary */}
                      <SectionCard title="Billing Summary">
                        <p className="text-caption text-muted-foreground">No pending amount</p>
                        <Button variant="link" size="sm" className="text-primary p-0 mt-3 text-[11px] font-medium gap-1">
                          <Plus className="w-3 h-3" /> Add pending amount
                        </Button>
                      </SectionCard>

                      {/* Quick Actions */}
                      <SectionCard title="Quick Actions">
                        <div className="space-y-2">
                          {patient.options.map((opt: string, idx: number) => {
                            const Icon = optionIcons[opt] || CalendarPlus;
                            return (
                              <Button 
                                key={idx} 
                                variant="outline" 
                                size="sm" 
                                className="w-full justify-start text-small font-medium gap-2 h-9"
                                onClick={() => handleOptionClick(opt)}
                              >
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                {opt}
                              </Button>
                            );
                          })}
                        </div>
                      </SectionCard>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-h3 font-semibold text-foreground mb-2">No results for "{query}"</h3>
              <p className="text-small text-muted-foreground mb-6">Try a different phone number or check the spelling</p>
              <Button variant="outline" onClick={() => navigate("/patients")}>
                Browse all patients
              </Button>
            </Card>
          )}
        </div>
      </PageContent>
    </div>
  );
}
