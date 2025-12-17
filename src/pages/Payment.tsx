import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Download, Printer, CheckCircle2, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceItem {
  name: string;
  price: number;
}

interface PaymentData {
  appointmentType: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  date: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData & { fromPatientInsights?: boolean; patientId?: string };
  const fromPatientInsights = paymentData?.fromPatientInsights;
  const patientId = paymentData?.patientId;
  
  const [useAdvance, setUseAdvance] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<"now" | "later">("now");
  const [countdown, setCountdown] = useState(9);
  const [printingStatus, setPrintingStatus] = useState<"printing" | "success" | "done">("printing");
  const [paymentRows, setPaymentRows] = useState([{ id: 1, amount: "", method: "Cash" }]);

  useEffect(() => {
    if (showSuccess) {
      // First show "printing" for 2 seconds
      const printingTimer = setTimeout(() => {
        setPrintingStatus("success");
        // Then show "success" for 2 seconds
        const successTimer = setTimeout(() => {
          setPrintingStatus("done");
        }, 2000);
        return () => clearTimeout(successTimer);
      }, 2000);
      return () => clearTimeout(printingTimer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showSuccess && printingStatus === "done" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [showSuccess, printingStatus, countdown, navigate]);

  const handlePayNow = () => {
    setPaymentType("now");
    setShowSuccess(true);
    setCountdown(9);
    setPrintingStatus("printing");
  };

  const handlePayLater = () => {
    setPaymentType("later");
    setShowSuccess(true);
    setCountdown(9);
    setPrintingStatus("printing");
  };
  
  const advanceAmount = 1000;
  const billAmount = 44000; // Grand total from invoice
  const usedAdvance = useAdvance ? Math.min(advanceAmount, billAmount) : 0;
  const remainingBalance = useAdvance ? Math.max(0, advanceAmount - billAmount) : advanceAmount;
  const payableAmount = Math.max(0, billAmount - usedAdvance);

  const addPaymentRow = () => {
    const newId = Math.max(...paymentRows.map(r => r.id)) + 1;
    setPaymentRows([...paymentRows, { id: newId, amount: "", method: "Cash" }]);
  };

  const removePaymentRow = (id: number) => {
    setPaymentRows(paymentRows.filter(row => row.id !== id));
  };

  const updatePaymentRow = (id: number, field: 'amount' | 'method', value: string) => {
    setPaymentRows(paymentRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Appointments", "Payment"]} />
        
        <main className="p-6">
          <div className="flex items-center justify-between h-10 mb-12">
            <button
              onClick={() => navigate("/book-appointment", { 
                state: { fromPatientInsights, patientId } 
              })}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors w-[120px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-semibold">Appointment</span>
            </button>

            <BookingSteps currentStep="payment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />
            
            <div className="w-[120px]" />
          </div>

          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-6">Payment</h2>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                {/* Invoice Summary */}
                <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-base font-semibold text-foreground">Invoice Summary</h3>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Invoice No</p>
                      <p className="text-sm font-medium text-foreground">IN-2025-009</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium text-foreground">{paymentData?.date || "05/11/2025"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Patient</p>
                      <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                      <p className="text-xs text-muted-foreground mt-1">GDID - 009 • 35 | M</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {paymentData?.items && paymentData.items.length > 0 && (
                  <>
                  {/* Admission */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Admission</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[140px]">Appointment No</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead className="w-[80px]">Qty</TableHead>
                          <TableHead className="w-[100px]">Rate</TableHead>
                          <TableHead className="w-[100px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="w-[100px]">05 Oct</TableCell>
                          <TableCell className="w-[140px]">—</TableCell>
                          <TableCell>Admission Fee</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹5,000</TableCell>
                          <TableCell className="w-[100px]">₹5,000</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Admission)</TableCell>
                          <TableCell className="font-bold">₹5,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Services & Procedures */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Services & Procedures</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[140px]">Appointment No</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead className="w-[80px]">Qty</TableHead>
                          <TableHead className="w-[100px]">Rate</TableHead>
                          <TableHead className="w-[100px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="w-[100px]">06 Oct</TableCell>
                          <TableCell className="w-[140px]">—</TableCell>
                          <TableCell>Cardiac Catheterization</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹28,000</TableCell>
                          <TableCell className="w-[100px]">₹28,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="w-[100px]">05 Oct</TableCell>
                          <TableCell className="w-[140px]">—</TableCell>
                          <TableCell>Nursing Care (per day)</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹1,200</TableCell>
                          <TableCell className="w-[100px]">₹1,200</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Services & Procedures)</TableCell>
                          <TableCell className="font-bold">₹29,200</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Consultation */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Consultation</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[140px]">Appointment No</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead className="w-[80px]">Qty</TableHead>
                          <TableHead className="w-[100px]">Rate</TableHead>
                          <TableHead className="w-[100px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="w-[100px]">05 Oct</TableCell>
                          <TableCell className="w-[140px]">CONS-001</TableCell>
                          <TableCell>Cardiology Consultation</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹1,500</TableCell>
                          <TableCell className="w-[100px]">₹1,500</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Consultation)</TableCell>
                          <TableCell className="font-bold">₹1,500</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Laboratory */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Laboratory</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[140px]">Appointment No</TableHead>
                          <TableHead>Test Name</TableHead>
                          <TableHead className="w-[80px]">Qty</TableHead>
                          <TableHead className="w-[100px]">Rate</TableHead>
                          <TableHead className="w-[100px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="w-[100px]">07 Oct</TableCell>
                          <TableCell className="w-[140px]">LAB-001</TableCell>
                          <TableCell>Complete Blood Count</TableCell>
                          <TableCell className="w-[80px]">2</TableCell>
                          <TableCell className="w-[100px]">₹800</TableCell>
                          <TableCell className="w-[100px]">₹1,600</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="w-[100px]">07 Oct</TableCell>
                          <TableCell className="w-[140px]">LAB-002</TableCell>
                          <TableCell>Liver Function Test</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹1,500</TableCell>
                          <TableCell className="w-[100px]">₹1,500</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Laboratory)</TableCell>
                          <TableCell className="font-bold">₹3,100</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Radiology */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Radiology</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[140px]">Appointment No</TableHead>
                          <TableHead>Test Name</TableHead>
                          <TableHead className="w-[80px]">Qty</TableHead>
                          <TableHead className="w-[100px]">Rate</TableHead>
                          <TableHead className="w-[100px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="w-[100px]">06 Oct</TableCell>
                          <TableCell className="w-[140px]">RADIO-001</TableCell>
                          <TableCell>Chest X-Ray</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹1,200</TableCell>
                          <TableCell className="w-[100px]">₹1,200</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="w-[100px]">06 Oct</TableCell>
                          <TableCell className="w-[140px]">RADIO-002</TableCell>
                          <TableCell>CT Scan Abdomen</TableCell>
                          <TableCell className="w-[80px]">1</TableCell>
                          <TableCell className="w-[100px]">₹4,000</TableCell>
                          <TableCell className="w-[100px]">₹4,000</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Radiology)</TableCell>
                          <TableCell className="font-bold">₹5,200</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>


                  {/* Grand Total */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3 text-primary">Grand Total</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Admission</TableCell>
                          <TableCell className="text-right">₹5,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Services & Procedures</TableCell>
                          <TableCell className="text-right">₹29,200</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Consultation</TableCell>
                          <TableCell className="text-right">₹1,500</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Laboratory</TableCell>
                          <TableCell className="text-right">₹3,100</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Radiology</TableCell>
                          <TableCell className="text-right">₹5,200</TableCell>
                        </TableRow>
                        <TableRow className="bg-primary/10">
                          <TableCell className="font-bold text-lg">Total</TableCell>
                          <TableCell className="text-right font-bold text-lg">₹44,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  </>
                  )}
                  
                  {(!paymentData?.items || paymentData.items.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">No invoice data available. Generate from booking appointment.</p>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </Button>
              </div>
            </div>

              {/* Collect Payment */}
              <Card className="w-full lg:w-[420px] p-6 h-fit self-start">
                <h3 className="text-base font-semibold text-foreground mb-6">Collect Payment</h3>
                
                <div className="space-y-6">
                  {/* Bill Amount */}
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Bill Amount:</p>
                    <p className="text-xl font-semibold text-primary">₹{billAmount.toLocaleString()}</p>
                  </div>

                  {/* Advance Amount Toggle */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Advance Amount</span>
                      <span className="text-xl font-semibold text-primary">₹{advanceAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Switch
                        id="use-advance"
                        checked={useAdvance}
                        onCheckedChange={setUseAdvance}
                      />
                      <label htmlFor="use-advance" className="text-sm font-normal cursor-pointer text-foreground">
                        Use advance amount for this bill
                      </label>
                    </div>
                    
                    {useAdvance && (
                      <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm text-green-700 dark:text-green-400">Advance Amount Used!</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Current bill (₹{billAmount.toLocaleString()}) Used from advance
                        </p>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-medium text-foreground">Remaining Advance Balance</span>
                          <span className="text-base font-semibold text-foreground">₹{remainingBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payable Amount */}
                  <div className="flex justify-between items-center py-4 border-t border-b border-border">
                    <span className="font-semibold text-foreground">Payable amount</span>
                    <span className="text-xl font-bold text-primary">₹{payableAmount.toLocaleString()}</span>
                  </div>

                  {/* Payer Name */}
                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Payer Name</p>
                    <input
                      type="text"
                      defaultValue="Fredrick John"
                      className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
                    />
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Payment Options</p>
                    
                    {paymentRows.map((row, index) => (
                      <div key={row.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={index === 0 ? payableAmount.toLocaleString() : row.amount}
                              onChange={(e) => updatePaymentRow(row.id, 'amount', e.target.value)}
                              readOnly={index === 0}
                              className="w-full h-10 pl-8 pr-4 text-sm font-semibold text-primary bg-background border border-input rounded-md"
                            />
                          </div>
                        </div>
                        <Select 
                          value={row.method} 
                          onValueChange={(value) => updatePaymentRow(row.id, 'method', value)}
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
                            <Trash2 className="h-4 w-4" />
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" className="flex-1" onClick={handlePayLater}>
                      Pay Later
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handlePayNow}>
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 w-[320px] bg-background rounded-lg p-6 shadow-2xl animate-in slide-in-from-bottom-5 z-50 border border-border">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {paymentType === "now" ? "Payment Successful" : "Payment Scheduled"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Your booking has been confirmed & Your payment has been {paymentType === "now" ? "processed successfully" : "scheduled for later"}.
              </p>
            </div>

            {printingStatus !== "done" && (
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
            )}

            {printingStatus === "done" && (
              <>
                <div className="py-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    You will be redirected to the Home Page in
                  </p>
                  <div className="text-3xl font-bold text-primary">
                    {countdown}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">seconds...</p>
                </div>

                <Button 
                  onClick={() => navigate("/")}
                  size="sm"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </PageContent>
    </div>
  );
};

export default Payment;
