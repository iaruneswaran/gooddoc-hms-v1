import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientChip } from "@/components/patient-insights/PatientChip";
import { KpiTile } from "@/components/patient-insights/KpiTile";
import { InvoicesTable } from "@/components/billing/InvoicesTable";
import { PaymentSummaryPanel } from "@/components/billing/PaymentSummaryPanel";
import { AdvanceCollectionForm } from "@/components/billing/AdvanceCollectionForm";
import { AdvanceTransactionsTable } from "@/components/billing/AdvanceTransactionsTable";
import { TransactionsTable } from "@/components/billing/TransactionsTable";
import { SuccessModal } from "@/components/billing/SuccessModal";
import { ClaimFilters } from "@/components/insurance/ClaimFilters";
import { ClaimsTable } from "@/components/insurance/ClaimsTable";
import { mockClaims } from "@/data/insurance.mock";
import { Invoice, TransactionRow } from "@/types/billing";
import { Claim, ClaimStatus, ServiceType } from "@/types/insurance";
import { formatINR } from "@/utils/currency";
import { toast } from "@/hooks/use-toast";

const PatientInsights = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  const [activeTab, setActiveTab] = useState("bills");
  
  // Payment state
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(["INV-2025-001"]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"payment" | "advance">("payment");
  const [advanceBalance, setAdvanceBalance] = useState(320000);
  
  // Insurance filters
  const [claimSearchQuery, setClaimSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "All">("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "All">("All");

  // Mapping for breadcrumb navigation based on source page
  const breadcrumbConfig: Record<string, { label: string; path: string }> = {
    "patients": { label: "Patients", path: "/patients" },
    "appointments": { label: "Appointments", path: "/" },
    "op-patients": { label: "OP Patients", path: "/patients/op" },
    "ip-patients": { label: "IP Patients", path: "/patients/ip" },
    "discharged": { label: "Discharged", path: "/discharged" },
    "emergency": { label: "Emergency Cases", path: "/emergency" },
    "surgeries": { label: "Surgeries", path: "/surgeries" },
    "pharmacy": { label: "Medicine Orders", path: "/pharmacy" },
    "transfers": { label: "Transfers", path: "/transfers" },
  };

  const currentBreadcrumb = breadcrumbConfig[fromPage || ""] || { label: "Appointments", path: "/" };

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "001",
    title: "Mr",
    age: 44,
    gender: "Male",
    dob: "10/04/1980",
    mobile: "+91 98765 43210",
    email: "name@example.com",
    bloodGroup: "O+",
    address: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    outstandingTotal: "6,600",
    advanceAmount: "3,200",
    billsAmount: "9,800",
    balanceAmount: "3,400",
  };

  // Filter insurance claims
  const filteredClaims = useMemo(() => {
    return mockClaims.filter((claim) => {
      if (claimSearchQuery) {
        const query = claimSearchQuery.toLowerCase();
        const matchesClaimNo = claim.claimNo.toLowerCase().includes(query);
        const matchesPatient = claim.patient?.name.toLowerCase().includes(query);
        const matchesPolicy = claim.policy?.policyNo.toLowerCase().includes(query);
        
        if (!matchesClaimNo && !matchesPatient && !matchesPolicy) {
          return false;
        }
      }

      if (statusFilter !== "All" && claim.status !== statusFilter) {
        return false;
      }

      if (serviceTypeFilter !== "All") {
        const hasServiceType = claim.services.some(
          (service) => service.type === serviceTypeFilter
        );
        if (!hasServiceType) {
          return false;
        }
      }

      return true;
    });
  }, [claimSearchQuery, statusFilter, serviceTypeFilter]);

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: "INV-2025-001",
      date: "15 Jun 2025",
      service: "Consultation",
      totalAmount: 150000,
      partiallyPaid: 0,
      balance: 150000,
      status: "Pending",
    },
    {
      id: "INV-2025-002",
      date: "20 May 2025",
      service: "Laboratory",
      totalAmount: 65000,
      partiallyPaid: 0,
      balance: 65000,
      status: "Pending",
    },
    {
      id: "INV-2025-003",
      date: "10 Apr 2025",
      service: "Imaging",
      totalAmount: 120000,
      partiallyPaid: 0,
      balance: 120000,
      status: "Pending",
    },
  ];

  // Mock advance transactions
  const advanceTransactions: TransactionRow[] = [
    {
      id: "REP-2025-001",
      date: "06 Oct 2025",
      type: "advance",
      category: "Advance",
      serviceOrReason: "Admission",
      method: "cash",
      party: "Fredrick John",
      amount: 160000,
      status: "Success",
    },
    {
      id: "REP-2025-002",
      date: "06 Oct 2025",
      type: "advance",
      category: "Advance",
      serviceOrReason: "Admission",
      method: "cash",
      party: "Fredrick John",
      amount: 160000,
      status: "Success",
    },
  ];

  // Mock all transactions
  const allTransactions: TransactionRow[] = [
    {
      id: "CLM-2025-001",
      date: "18 Jun 2025",
      type: "insurance",
      category: "Insurance Claim",
      serviceOrReason: "Hospitalization",
      method: "insurance",
      party: "Star Health Insurance",
      amount: 1000000,
      status: "Success",
    },
    {
      id: "INV-2025-001",
      date: "15 Jun 2025",
      type: "payment",
      category: "Bill Payment",
      serviceOrReason: "Consultation",
      method: "card",
      party: "Robb Stark",
      amount: 150000,
      status: "Success",
    },
    {
      id: "INV-2025-002",
      date: "20 May 2025",
      type: "payment",
      category: "Bill Payment",
      serviceOrReason: "Laboratory",
      method: "upi",
      party: "Harish Kalyan",
      amount: 65000,
      status: "Success",
    },
  ];

  const handleToggleInvoice = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleToggleAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map((inv) => inv.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedInvoices([]);
  };

  const handleConfirmPayment = (paymentData: any) => {
    console.log("Payment confirmed:", paymentData);
    setAdvanceBalance((prev) => prev - paymentData.appliedAdvance);
    setSuccessType("payment");
    setShowSuccess(true);
    toast({
      title: "Payment collected successfully",
      description: `Collected ${formatINR(
        paymentData.paymentLines.reduce((sum: number, line: any) => sum + line.amount, 0)
      )}`,
    });
  };

  const handleConfirmAdvance = (advanceData: any) => {
    console.log("Advance confirmed:", advanceData);
    const totalAdvance = advanceData.paymentLines.reduce(
      (sum: number, line: any) => sum + line.amount,
      0
    );
    setAdvanceBalance((prev) => prev + totalAdvance);
    setSuccessType("advance");
    setShowSuccess(true);
    toast({
      title: "Advance collected successfully",
      description: `Collected ${formatINR(totalAdvance)}`,
    });
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Downloading statement",
      description: "Your statement will be downloaded shortly",
    });
  };

  // Insurance handlers
  const handleViewClaim = (claim: Claim) => {
    toast({ title: "View Claim", description: `Viewing claim ${claim.claimNo}` });
  };

  const handleEditClaim = (claim: Claim) => {
    toast({ title: "Edit Claim", description: `Editing claim ${claim.claimNo}` });
  };

  const handleDeleteClaim = (claim: Claim) => {
    toast({ title: "Delete Claim", description: `Deleting claim ${claim.claimNo}`, variant: "destructive" });
  };

  const handleAddPayment = (claim: Claim) => {
    toast({ title: "Add Payment", description: `Adding payment to claim ${claim.claimNo}` });
  };

  const handleAddDocument = (claim: Claim) => {
    toast({ title: "Add Document", description: `Adding document to claim ${claim.claimNo}` });
  };

  const handleDownloadPDF = (claim: Claim) => {
    toast({ title: "Downloading PDF", description: `Downloading ${claim.claimNo}.pdf` });
  };

  const handleClearFilters = () => {
    setClaimSearchQuery("");
    setStatusFilter("All");
    setServiceTypeFilter("All");
  };

  const selectedInvoicesData = invoices.filter((inv) =>
    selectedInvoices.includes(inv.id)
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={[
          { 
            label: currentBreadcrumb.label, 
            onClick: () => navigate(currentBreadcrumb.path) 
          }, 
          "Patient Insight"
        ]} />
        
        {/* Fixed Header with Patient Info and Actions */}
        <div className="bg-background border-b border-border flex-shrink-0">
          <div className="px-6 py-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(currentBreadcrumb.path)}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">{currentBreadcrumb.label}</span>
            </button>

            {/* Header Content */}
            <div className="flex items-center justify-between gap-6">
              {/* Left: Patient Chip and Buttons */}
              <div className="flex items-center gap-2">
                <PatientChip
                  name={patient.name}
                  gdid={patient.gdid}
                  age={patient.age}
                  gender={patient.gender}
                />
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/services${fromPage ? `?from=${fromPage}` : ''}`)}
                  >
                    Services
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Navigate to transfer page
                    }}
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/timeline`)}
                  >
                    Timeline
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/discharge`)}
                  >
                    Discharge
                  </Button>
                </div>
              </div>

              {/* Right: KPIs */}
              <div className="flex gap-3">
                <KpiTile label="Outstanding Total" amount={patient.outstandingTotal} />
                <KpiTile label="Advance Amount" amount={patient.advanceAmount} />
                <KpiTile label="Bills Amount" amount={patient.billsAmount} />
                <KpiTile label="Balance Amount" amount={patient.balanceAmount} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Payment Tabs */}
        <main className="flex-1 flex flex-col overflow-auto min-h-0 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0 border-b border-border w-full">
              <TabsTrigger 
                value="bills"
                className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-normal data-[state=active]:font-medium border-b-0"
              >
                Bills
              </TabsTrigger>
              <TabsTrigger 
                value="advance"
                className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-normal data-[state=active]:font-medium border-b-0"
              >
                Advance
              </TabsTrigger>
              <TabsTrigger 
                value="insurance"
                className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-normal data-[state=active]:font-medium border-b-0"
              >
                Insurance
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-normal data-[state=active]:font-medium border-b-0"
              >
                History
              </TabsTrigger>
            </TabsList>

            {/* Bills Tab */}
            <TabsContent value="bills" className="mt-6 flex-1">
              <div className="grid grid-cols-[1fr_420px] gap-6 h-full">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Payable Bills</h2>
                  </div>
                  <InvoicesTable
                    invoices={invoices}
                    selectedInvoices={selectedInvoices}
                    onToggleInvoice={handleToggleInvoice}
                    onToggleAll={handleToggleAll}
                  />
                </Card>
                <PaymentSummaryPanel
                  selectedInvoices={selectedInvoicesData}
                  advanceBalance={advanceBalance}
                  onConfirmPayment={handleConfirmPayment}
                  onClearSelection={handleClearSelection}
                />
              </div>
            </TabsContent>

            {/* Advance Tab */}
            <TabsContent value="advance" className="mt-6 flex-1">
              <div className="grid grid-cols-[400px_1fr] gap-6">
                <AdvanceCollectionForm onConfirmAdvance={handleConfirmAdvance} />
                <AdvanceTransactionsTable
                  transactions={advanceTransactions}
                />
              </div>
            </TabsContent>

            {/* Insurance Tab */}
            <TabsContent value="insurance" className="mt-6 flex-1">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <ClaimFilters
                      onSearchChange={setClaimSearchQuery}
                      onStatusChange={setStatusFilter}
                      onServiceTypeChange={setServiceTypeFilter}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-4 gap-2"
                    onClick={() => navigate(`/patient-insights/${patientId}/insurance`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Go to Insurance
                  </Button>
                </div>
                
                <div className="mt-6">
                  <ClaimsTable
                    claims={filteredClaims}
                    onViewClaim={handleViewClaim}
                    onEditClaim={handleEditClaim}
                    onDeleteClaim={handleDeleteClaim}
                    onAddPayment={handleAddPayment}
                    onAddDocument={handleAddDocument}
                    onDownloadPDF={handleDownloadPDF}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6 flex-1">
              <TransactionsTable
                transactions={allTransactions}
                title="Transaction History"
                showFilters={true}
                onDownloadStatement={handleDownloadStatement}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Success Modal */}
        <SuccessModal
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          title={successType === "payment" ? "Payment Collected" : "Advance Collected"}
          summary={
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{successType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Success</span>
              </div>
            </div>
          }
          onPrintReceipt={() => toast({ title: "Printing receipt..." })}
        />
      </PageContent>
    </div>
  );
};

export default PatientInsights;
