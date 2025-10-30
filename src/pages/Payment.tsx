import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Download, Printer, CheckCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvoiceItem {
  name: string;
  price: number;
}

interface PaymentData {
  appointmentType: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
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

  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [showSuccess, countdown, navigate]);

  const handlePayNow = () => {
    setPaymentType("now");
    setShowSuccess(true);
    setCountdown(9);
  };

  const handlePayLater = () => {
    setPaymentType("later");
    setShowSuccess(true);
    setCountdown(9);
  };
  
  const advanceAmount = 1000;
  const billAmount = paymentData?.total || 1600;
  const usedAdvance = useAdvance ? Math.min(advanceAmount, billAmount) : 0;
  const remainingBalance = useAdvance ? Math.max(0, advanceAmount - billAmount) : advanceAmount;
  const payableAmount = Math.max(0, billAmount - usedAdvance);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Payment"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/book-appointment", { 
              state: { fromPatientInsights, patientId } 
            })}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Appointment</span>
          </button>

          <BookingSteps currentStep="payment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />

          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-6">Payment</h2>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Invoice Summary */}
              <Card className="flex-1 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6">Invoice Summary</h3>
                
                <div className="space-y-6">
                  {/* Patient Details */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Patient</p>
                      <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                      <p className="text-xs text-muted-foreground mt-1">GDID - 009 • 35 | M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Invoice No</p>
                      <p className="text-sm font-medium text-foreground">IN-2025-009</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium text-foreground">{paymentData?.date || "05/08/2025"}</p>
                    </div>
                  </div>

                  {/* Episode Ledger */}
                  <div className="pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-4">Episode Ledger</p>
                    <div className="space-y-3">
                      {paymentData?.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-sm text-foreground">{item.name}</p>
                          <p className="text-sm font-medium text-foreground">₹{item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-6 border-t border-border space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-sm text-foreground">₹{paymentData?.subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">CGST (9%)</p>
                      <p className="text-sm text-foreground">₹{paymentData?.cgst.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">SGST (9%)</p>
                      <p className="text-sm text-foreground">₹{paymentData?.sgst.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <p className="text-base font-semibold text-foreground">Bill Amount:</p>
                      <p className="text-base font-bold text-foreground">₹{billAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
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
              </Card>

              {/* Collect Payment */}
              <Card className="w-full lg:w-[420px] p-6 h-fit self-start">
                <h3 className="text-base font-semibold text-foreground mb-5">Collect Payment</h3>
                
                <div className="space-y-5">
                  {/* Bill Amount */}
                  <div className="flex justify-between items-center pb-5 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Bill Amount:</p>
                    <p className="text-[18px] font-semibold text-primary">₹{billAmount.toLocaleString()}</p>
                  </div>

                  {/* Advance Amount Toggle */}
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
                        Current bill (₹{billAmount.toLocaleString()}) Used from advance
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Remaining Advance Balance</span>
                          <span className="font-medium">₹{remainingBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Payable amount</span>
                          <span className="font-medium">₹{payableAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border"></div>

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
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={payableAmount.toLocaleString()}
                            readOnly
                            className="w-full h-10 pl-8 pr-4 text-lg font-bold text-primary bg-background border border-input rounded-md"
                          />
                        </div>
                      </div>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Net Banking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-sm text-primary font-medium cursor-pointer">
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
                {paymentType === "now" ? "Payment Successful" : "Payment Scheduled"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Your booking has been confirmed & Your payment has been {paymentType === "now" ? "processed successfully" : "scheduled for later"}.
              </p>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
