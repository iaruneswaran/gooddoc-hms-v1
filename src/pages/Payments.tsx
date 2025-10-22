import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
  const [paymentAmount, setPaymentAmount] = useState("0.00");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const invoices = [
    {
      id: "INV-2025-001",
      date: "15 Jun 2025",
      service: "Consultation",
      totalAmount: 1500,
      paid: 0,
      balance: 1500,
    },
    {
      id: "INV-2025-002",
      date: "20 May 2025",
      service: "Laboratory",
      totalAmount: 650,
      paid: 0,
      balance: 650,
    },
    {
      id: "INV-2025-003",
      date: "10 Apr 2025",
      service: "Imaging",
      totalAmount: 1200,
      paid: 0,
      balance: 1200,
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

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights", "Payments"]} />
        
        <main className="p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/patient-insights/${patientId}`)}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Patient Insights
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
            <div className="w-full border-b border-border">
              <TabsList className="h-auto bg-transparent p-0 gap-8 rounded-none justify-start border-0">
                <TabsTrigger 
                  value="collection"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                >
                  Collection
                </TabsTrigger>
                <TabsTrigger 
                  value="advance"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                >
                  Advance
                </TabsTrigger>
                <TabsTrigger 
                  value="refunds"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                >
                  Refunds
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-base font-normal data-[state=active]:font-medium"
                >
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="collection" className="mt-6">
              <div className="grid grid-cols-[1fr_400px] gap-6">
                {/* Left Column - Invoice Table */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Payment Collection</h2>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4 w-12"></th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Invoice No</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Total Amount</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Paid</th>
                          <th className="text-left text-sm font-medium text-muted-foreground p-4">Balance</th>
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
                            <td className="p-4 text-sm">₹{invoice.totalAmount}</td>
                            <td className="p-4 text-sm">₹{invoice.paid.toFixed(2)}</td>
                            <td className="p-4 text-sm text-destructive font-medium">₹{invoice.balance}</td>
                            <td className="p-4 text-sm">
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Right Column - Selected Invoices & Payment */}
                <div className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Selected Invoices</h3>
                    
                    {selectedInvoices.map((invoiceId) => {
                      const invoice = invoices.find(inv => inv.id === invoiceId);
                      if (!invoice) return null;
                      
                      return (
                        <div key={invoiceId} className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">{invoiceId}</span>
                            <span className="text-sm font-medium">₹{invoice.balance}</span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Net payable now</span>
                        <span className="text-lg font-semibold text-primary">₹{totalSelected}</span>
                      </div>
                      <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                        Split Payment
                      </Button>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Advance Amount</span>
                        </div>
                        <span className="text-sm font-medium">₹{advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Switch
                          id="use-advance"
                          checked={useAdvance}
                          onCheckedChange={setUseAdvance}
                        />
                        <Label htmlFor="use-advance" className="text-sm cursor-pointer">
                          Use advance amount for this bill
                        </Label>
                      </div>
                    </div>

                    {useAdvance && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-2">Advance Amount Used!</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Current bill (₹{totalSelected}) Used from advance
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining Advance Balance</span>
                            <span className="font-medium">₹{(advanceAmount - totalSelected).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payable amount</span>
                            <span className="font-medium">₹0.00</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm font-medium mb-3">Payer Name</h3>
                    <Input defaultValue="Fredrick John" className="mb-4" />

                    <h3 className="text-sm font-medium mb-3">Payment Options</h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        type="text"
                        value={`₹${paymentAmount}`}
                        onChange={(e) => setPaymentAmount(e.target.value.replace('₹', ''))}
                        className="flex-1"
                      />
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="link" size="sm" className="text-primary p-0 h-auto mb-4">
                      Add Payment
                    </Button>

                    <Button className="w-full bg-[#8B1538] hover:bg-[#6B0F2B] text-white">
                      Confirm Payment
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advance" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">Advance payment management coming soon...</p>
              </Card>
            </TabsContent>

            <TabsContent value="refunds" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">Refund management coming soon...</p>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">Payment history coming soon...</p>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Payments;
