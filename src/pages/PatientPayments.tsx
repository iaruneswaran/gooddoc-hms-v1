import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Printer, ArrowRight } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Invoice {
  id: string;
  number: string;
  date: string;
  department: string;
  amount: number;
  paid: number;
  due: number;
}

const PatientPayments = () => {
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(["INV-2025-002"]);
  const [useAdvance, setUseAdvance] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("600");

  const summaryData = {
    outstandingTotal: 6600,
    advanceAmount: 2000,
    insuranceApproved: 10000,
  };

  const invoices: Invoice[] = [
    {
      id: "1",
      number: "INV-2025-002",
      date: "May 20, 2025",
      department: "Pharmacy",
      amount: 1600,
      paid: 0,
      due: 1600,
    },
    {
      id: "2",
      number: "INV-2025-001",
      date: "Jun 15, 2025",
      department: "Admission",
      amount: 25000,
      paid: 20000,
      due: 5000,
    },
    {
      id: "3",
      number: "INV-2025-003",
      date: "Apr 10, 2025",
      department: "Laboratory",
      amount: 12000,
      paid: 12000,
      due: 0,
    },
  ];

  const toggleInvoiceSelection = (invoiceNumber: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceNumber)
        ? prev.filter((num) => num !== invoiceNumber)
        : [...prev, invoiceNumber]
    );
  };

  const selectedInvoiceData = invoices.find(
    (inv) => inv.number === selectedInvoices[0]
  );

  const advanceUsed = useAdvance ? 1000 : 0;
  const remainingAdvance = summaryData.advanceAmount - advanceUsed;
  const payableAmount = selectedInvoiceData ? selectedInvoiceData.due - advanceUsed : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Patient Insights", "Payments"]} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/patient-insights/1")}
              className="gap-2 text-foreground hover:bg-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Patient Insights
            </Button>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Outstanding Total</div>
                <div className="text-2xl font-semibold text-foreground">
                  ₹{summaryData.outstandingTotal.toLocaleString()}
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Advance Amount</div>
                <div className="text-2xl font-semibold text-foreground">
                  ₹{summaryData.advanceAmount.toLocaleString()}
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Insurance Approved</div>
                <div className="text-2xl font-semibold text-foreground">
                  ₹{summaryData.insuranceApproved.toLocaleString()}
                </div>
              </Card>
            </div>

            {/* Tabs and Content */}
            <Tabs defaultValue="collection" className="w-full">
              <TabsList>
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="advance">Advance/Deposit</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>

              <TabsContent value="collection" className="mt-6">
                <div className="grid grid-cols-[1fr,400px] gap-6">
                  {/* Left: Invoice Selection Table */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Select Invoices</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground w-12"></th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Invoice</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Department</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Paid</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Due</th>
                            <th className="text-center p-3 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-t border-border hover:bg-muted/30">
                              <td className="p-3">
                                <Checkbox
                                  checked={selectedInvoices.includes(invoice.number)}
                                  onCheckedChange={() => toggleInvoiceSelection(invoice.number)}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </td>
                              <td className="p-3 text-sm text-foreground">{invoice.number}</td>
                              <td className="p-3 text-sm text-foreground">{invoice.date}</td>
                              <td className="p-3 text-sm text-foreground">{invoice.department}</td>
                              <td className="p-3 text-sm text-foreground text-right">
                                ₹{invoice.amount.toLocaleString()}
                              </td>
                              <td className="p-3 text-sm text-foreground text-right">
                                ₹{invoice.paid.toLocaleString()}
                              </td>
                              <td className="p-3 text-sm text-right">
                                <span className={invoice.due > 0 ? "text-destructive" : "text-foreground"}>
                                  ₹{invoice.due.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button variant="link" className="text-primary text-sm h-8 px-2">
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Right: Selected Invoice Panel */}
                  <div className="space-y-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-primary mb-4">Selected Invoices</h3>
                      
                      {selectedInvoiceData && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">
                              {selectedInvoiceData.number}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              ₹{selectedInvoiceData.due.toLocaleString()}
                            </span>
                          </div>

                          <div className="border-t border-border pt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-foreground">Net payable now</span>
                              <span className="text-lg font-semibold text-foreground">
                                ₹{selectedInvoiceData.due.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Advance Amount Section */}
                          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                                </div>
                                <span className="text-sm font-medium text-foreground">Advance Amount</span>
                              </div>
                              <span className="text-sm font-semibold text-primary">₹1,000</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Use advance amount for this bill
                              </span>
                              <Switch
                                checked={useAdvance}
                                onCheckedChange={setUseAdvance}
                              />
                            </div>

                            {useAdvance && (
                              <div className="pt-2 border-t border-border space-y-2">
                                <div className="text-xs text-muted-foreground">Advance Amount Used!</div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Current bill (₹{selectedInvoiceData.due})</span>
                                  <span className="text-foreground">Used from advance</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                  <span className="text-foreground">Remaining Advance Balance</span>
                                  <span className="text-foreground">₹{remainingAdvance}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Payment Options */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground">Payment Options</h4>
                            
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={`₹${payableAmount}`}
                                readOnly
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

                            <Button variant="link" className="text-primary text-sm p-0 h-auto">
                              Add Payment
                            </Button>
                          </div>

                          {/* Insurance */}
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-foreground hover:bg-secondary"
                          >
                            <span>Insurance</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>

                          {/* Confirm Payment Button */}
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            Confirm Payment
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advance">
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Advance/Deposit content coming soon</p>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Payment history content coming soon</p>
                </Card>
              </TabsContent>

              <TabsContent value="refunds">
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Refunds content coming soon</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientPayments;
