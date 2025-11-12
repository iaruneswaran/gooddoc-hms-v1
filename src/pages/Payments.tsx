import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Payments = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(["INV-2025-001"]);
  const [useAdvance, setUseAdvance] = useState(false);
  const [paymentRows, setPaymentRows] = useState([
    { id: 1, amount: "0.00", method: "Cash" }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [printingStatus, setPrintingStatus] = useState<"printing" | "success" | "done">("printing");
  const [actionType, setActionType] = useState<"payment" | "advance" | "refund">("payment");

  const invoices = [
    {
      id: "INV-2025-001",
      date: "15 Jun 2025",
      service: "Consultation",
      totalAmount: 1500,
      partiallyPaid: 0,
      balance: 1500,
      payer: "Harish Kalyan",
      status: "Pending",
    },
    {
      id: "INV-2025-002",
      date: "20 May 2025",
      service: "Laboratory",
      totalAmount: 650,
      partiallyPaid: 0,
      balance: 650,
      payer: "Harish Kalyan",
      status: "Pending",
    },
    {
      id: "INV-2025-003",
      date: "10 Apr 2025",
      service: "Imaging",
      totalAmount: 1200,
      partiallyPaid: 0,
      balance: 1200,
      payer: "Harish Kalyan",
      status: "Pending",
    },
  ];

  const advanceAmount = 3200;
  const outstandingTotal = 6600;
  const insuranceApproved = 10000;

  const totalSelected = invoices
    .filter(inv => selectedInvoices.includes(inv.id))
    .reduce((sum, inv) => sum + inv.balance, 0);

  const handleInvoiceToggle = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  useEffect(() => {
    if (showSuccess) {
      // First show "printing" for 2 seconds
      const printingTimer = setTimeout(() => {
        setPrintingStatus("success");
        // Then show "success" for 2 seconds
        const successTimer = setTimeout(() => {
          setPrintingStatus("done");
          // Close modal after showing success
          const closeTimer = setTimeout(() => {
            setShowSuccess(false);
            setPrintingStatus("printing");
          }, 1000);
          return () => clearTimeout(closeTimer);
        }, 2000);
        return () => clearTimeout(successTimer);
      }, 2000);
      return () => clearTimeout(printingTimer);
    }
  }, [showSuccess]);

  const handleConfirmPayment = () => {
    setActionType("payment");
    setShowSuccess(true);
    setPrintingStatus("printing");
  };

  const handleCollectAdvance = () => {
    setActionType("advance");
    setShowSuccess(true);
    setPrintingStatus("printing");
  };

  const handleConfirmRefund = () => {
    setActionType("refund");
    setShowSuccess(true);
    setPrintingStatus("printing");
  };

  const addPaymentRow = () => {
    const newId = Math.max(...paymentRows.map(row => row.id)) + 1;
    setPaymentRows([...paymentRows, { id: newId, amount: "0.00", method: "Cash" }]);
  };

  const removePaymentRow = (id: number) => {
    if (paymentRows.length > 1) {
      setPaymentRows(paymentRows.filter(row => row.id !== id));
    }
  };

  const updatePaymentRow = (id: number, field: "amount" | "method", value: string) => {
    setPaymentRows(paymentRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Appointments", "Patient Insights", "Payments"]} />
        
        <main className="p-6">
          {/* Back Button */}
            <button
              onClick={() => navigate(`/patient-insights/${patientId}`)}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Patient Insights</span>
            </button>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Outstanding Total</p>
              <p className="text-3xl font-semibold text-primary">₹{outstandingTotal.toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Advance Amount</p>
              <p className="text-3xl font-semibold text-primary">₹{advanceAmount.toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Insurance Approved</p>
              <p className="text-3xl font-semibold text-primary">₹{insuranceApproved.toLocaleString()}</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="collection" className="w-full">
            <div className="w-full">
              <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0 border-b border-border">
                <TabsTrigger 
                  value="collection"
                  className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                >
                  Collection
                </TabsTrigger>
                <TabsTrigger 
                  value="advance"
                  className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                >
                  Advance
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="tab-trigger bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium border-b-0"
                >
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="collection" className="mt-6">
              <div className="grid grid-cols-[1fr_400px] gap-6">
                {/* Left Column - Invoice Table */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-primary">Payment Collection</h2>
                    <div className="text-sm text-muted-foreground">
                      Active Visit: <span className="font-medium text-foreground">VST-205431</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4 w-12"></th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Invoice No</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Total Amount</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Partially Paid</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Balance</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-t">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedInvoices.includes(invoice.id)}
                                onCheckedChange={() => handleInvoiceToggle(invoice.id)}
                              />
                            </td>
                            <td className="p-4 text-sm">{invoice.id}</td>
                            <td className="p-4 text-sm">{invoice.date}</td>
                            <td className="p-4 text-sm">{invoice.service}</td>
                            <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>₹{invoice.totalAmount}</td>
                            <td className="p-4 text-sm font-medium text-muted-foreground">₹{invoice.partiallyPaid}</td>
                            <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>₹{invoice.balance}</td>
                            <td className="p-4 text-sm">{invoice.status}</td>
                            <td className="p-4 text-sm">
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Right Column - Selected Invoices & Payment */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-base font-semibold text-foreground mb-5">Selected Invoices</h3>
                    
                    <div className="space-y-5">
                      {selectedInvoices.map((invoiceId) => {
                        const invoice = invoices.find(inv => inv.id === invoiceId);
                        if (!invoice) return null;
                        
                        return (
                          <div key={invoiceId}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{invoiceId}</span>
                              <span className="text-sm font-medium text-foreground">₹{invoice.balance}</span>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex justify-between items-center pb-5 border-b border-border">
                        <p className="text-sm font-medium text-foreground">Net payable now</p>
                        <p className="text-[18px] font-semibold text-primary">₹{totalSelected}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Advance Amount</span>
                          <span className="text-lg font-medium text-primary">₹{advanceAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="use-advance"
                            checked={useAdvance}
                            onCheckedChange={setUseAdvance}
                          />
                          <label htmlFor="use-advance" className="text-sm cursor-pointer">
                            Use advance amount for this bill
                          </label>
                        </div>
                      </div>

                      {useAdvance && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                          <p className="text-sm font-medium text-primary">Advance Amount Used!</p>
                          <p className="text-xs text-muted-foreground">
                            Current bill (₹{totalSelected.toLocaleString()}) Used from advance
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Remaining Advance Balance</span>
                              <span className="font-medium">₹{Math.max(0, advanceAmount - totalSelected).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Payable amount</span>
                              <span className="font-medium">₹{Math.max(0, totalSelected - advanceAmount).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-border"></div>

                      <div className="space-y-2.5">
                        <p className="text-sm font-medium text-foreground">Payer Name</p>
                        <input
                          type="text"
                          defaultValue="Fredrick John"
                          className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Payment Options</p>
                        
                        {paymentRows.map((row) => (
                          <div key={row.id} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                                  ₹
                                </span>
                                <input
                                  type="text"
                                  value={row.amount}
                                  onChange={(e) => updatePaymentRow(row.id, "amount", e.target.value)}
                                  className="w-full h-10 pl-8 pr-4 text-sm font-semibold text-primary bg-background border border-input rounded-md"
                                />
                              </div>
                            </div>
                            <Select 
                              value={row.method} 
                              onValueChange={(value) => updatePaymentRow(row.id, "method", value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                              </SelectContent>
                            </Select>
                            {paymentRows.length > 1 && (
                              <button
                                onClick={() => removePaymentRow(row.id)}
                                className="h-10 w-10 flex items-center justify-center text-primary hover:text-primary/80"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}

                        <p 
                          className="text-sm text-primary font-medium cursor-pointer"
                          onClick={addPaymentRow}
                        >
                          Add Payment
                        </p>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <Button 
                          onClick={handleConfirmPayment}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          Confirm Payment
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advance" className="mt-6">
              <div className="grid grid-cols-[1fr_400px] gap-6">
                {/* Left Column - Advance Transactions Table */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Advance Transactions</h2>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Reason</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background">
                        <tr className="border-t">
                          <td className="p-4 text-sm">REP-2025-001</td>
                          <td className="p-4 text-sm">06 Oct 2025</td>
                          <td className="p-4 text-sm">Admission</td>
                          <td className="p-4 text-sm">Fredrick John</td>
                          <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>+₹1,600</td>
                          <td className="p-4 text-sm">Success</td>
                          <td className="p-4 text-sm">
                            <div className="flex gap-2">
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              </button>
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-4 text-sm">REP-2025-002</td>
                          <td className="p-4 text-sm">06 Oct 2025</td>
                          <td className="p-4 text-sm">Admission</td>
                          <td className="p-4 text-sm">Fredrick John</td>
                          <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>+₹1,600</td>
                          <td className="p-4 text-sm">Success</td>
                          <td className="p-4 text-sm">
                            <div className="flex gap-2">
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              </button>
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Right Column - Advance Collection Form */}
                <Card className="p-6">
                  <h3 className="text-base font-semibold text-foreground mb-5">Collect Advance</h3>
                  
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <p className="text-sm font-medium text-foreground">Payer Name</p>
                      <input
                        type="text"
                        defaultValue="Fredrick John"
                        className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-sm font-medium text-foreground">Reason</p>
                      <input
                        type="text"
                        defaultValue="Admission"
                        className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
                      />
                    </div>

                    <div className="border-t border-border"></div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">Payment Options</p>
                      
                      {paymentRows.map((row) => (
                        <div key={row.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={row.amount}
                                onChange={(e) => updatePaymentRow(row.id, "amount", e.target.value)}
                                className="w-full h-10 pl-8 pr-4 text-sm font-semibold text-primary bg-background border border-input rounded-md"
                              />
                            </div>
                          </div>
                          <Select 
                            value={row.method} 
                            onValueChange={(value) => updatePaymentRow(row.id, "method", value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                          {paymentRows.length > 1 && (
                            <button
                              onClick={() => removePaymentRow(row.id)}
                              className="h-10 w-10 flex items-center justify-center text-primary hover:text-primary/80"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      <p 
                        className="text-sm text-primary font-medium cursor-pointer"
                        onClick={addPaymentRow}
                      >
                        Add Payment
                      </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button 
                        onClick={handleCollectAdvance}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        Collect Payment
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-primary">Patient Transactions</h2>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Search" className="max-w-xs" />
                    <Button variant="outline" size="sm">
                      Download statement
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Transaction ID</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Category</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Service/Reason</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Method</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Payer/Receiver</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background">
                      <tr className="border-t">
                        <td className="p-4 text-sm">REP-2025-001</td>
                        <td className="p-4 text-sm">06 Oct 2025</td>
                        <td className="p-4 text-sm">Credited</td>
                        <td className="p-4 text-sm">Advance</td>
                        <td className="p-4 text-sm">Admission</td>
                        <td className="p-4 text-sm">Cash</td>
                        <td className="p-4 text-sm">Fredrick John</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>+₹1,600</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">REP-2025-002</td>
                        <td className="p-4 text-sm">06 Oct 2025</td>
                        <td className="p-4 text-sm">Credited</td>
                        <td className="p-4 text-sm">Advance</td>
                        <td className="p-4 text-sm">Admission</td>
                        <td className="p-4 text-sm">Cash</td>
                        <td className="p-4 text-sm">Fredrick John</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>+₹1,600</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">REP-2025-001</td>
                        <td className="p-4 text-sm">06 Oct 2025</td>
                        <td className="p-4 text-sm">Debited</td>
                        <td className="p-4 text-sm">Refund</td>
                        <td className="p-4 text-sm">Overpayment</td>
                        <td className="p-4 text-sm">Cash</td>
                        <td className="p-4 text-sm">Robb Stark</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>-₹1,600</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">REP-2025-002</td>
                        <td className="p-4 text-sm">06 Oct 2025</td>
                        <td className="p-4 text-sm">Debited</td>
                        <td className="p-4 text-sm">Refund</td>
                        <td className="p-4 text-sm">Overpayment</td>
                        <td className="p-4 text-sm">Cash</td>
                        <td className="p-4 text-sm">Robb Stark</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>-₹1,600</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">INV-2025-001</td>
                        <td className="p-4 text-sm">15 Jun 2025</td>
                        <td className="p-4 text-sm">Payment</td>
                        <td className="p-4 text-sm">Bill Payment</td>
                        <td className="p-4 text-sm">Consultation</td>
                        <td className="p-4 text-sm">Card</td>
                        <td className="p-4 text-sm">Robb Stark</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>₹1,500</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">INV-2025-002</td>
                        <td className="p-4 text-sm">20 May 2025</td>
                        <td className="p-4 text-sm">Payment</td>
                        <td className="p-4 text-sm">Bill Payment</td>
                        <td className="p-4 text-sm">Laboratory</td>
                        <td className="p-4 text-sm">UPI</td>
                        <td className="p-4 text-sm">Harish Kalyan</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>₹650</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 text-sm">INV-2025-003</td>
                        <td className="p-4 text-sm">10 Apr 2025</td>
                        <td className="p-4 text-sm">Payment</td>
                        <td className="p-4 text-sm">Bill Payment</td>
                        <td className="p-4 text-sm">Imaging</td>
                        <td className="p-4 text-sm">Cash</td>
                        <td className="p-4 text-sm">Harish Kalyan</td>
                        <td className="p-4 text-sm font-medium" style={{ color: '#800139' }}>₹1,200</td>
                        <td className="p-4 text-sm">Success</td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 w-[320px] bg-background rounded-lg p-6 shadow-2xl animate-in slide-in-from-bottom-5 z-50 border border-border">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {actionType === "payment" && "Payment Successful"}
                {actionType === "advance" && "Advance Collected"}
                {actionType === "refund" && "Refund Processed"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {actionType === "payment" && "Your booking has been confirmed & Your payment has been processed successfully."}
                {actionType === "advance" && "Advance payment has been collected and recorded successfully."}
                {actionType === "refund" && "Refund has been processed and will be credited to the account."}
              </p>
            </div>

            <div className="py-4 w-full">
              <div className="flex items-center justify-center gap-2">
                {printingStatus === "printing" && (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Sending to printer...</p>
                  </>
                )}
                {printingStatus === "success" && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <p className="text-sm text-foreground font-medium">Receipt printed successfully</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
