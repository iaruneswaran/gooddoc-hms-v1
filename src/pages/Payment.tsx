import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Download, Printer, ChevronDown } from "lucide-react";
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
  const paymentData = location.state as PaymentData;
  
  const [useAdvance, setUseAdvance] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  
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
            onClick={() => navigate("/book-appointment")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-lg font-semibold">Appointments</span>
          </button>

          <BookingSteps currentStep="payment" />

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
              <Card className="w-full lg:w-[420px] p-6 h-fit">
                <h3 className="text-base font-semibold text-foreground mb-6">Collect Payment</h3>
                
                <div className="space-y-6">
                  {/* Bill Amount */}
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Bill Amount:</p>
                    <p className="text-2xl font-bold text-foreground">₹{billAmount.toLocaleString()}</p>
                  </div>

                  {/* Advance Amount Toggle */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Advance Amount</p>
                          <p className="text-lg font-bold text-primary">₹{advanceAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch checked={useAdvance} onCheckedChange={setUseAdvance} />
                        <p className="text-xs text-muted-foreground">Use advance amount for this bill</p>
                      </div>
                    </div>

                    {useAdvance && (
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-primary">Advance Amount Used!</p>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-muted-foreground">
                            Current bill (₹{billAmount.toLocaleString()}) Used from advance
                          </p>
                          <div className="flex justify-between pt-2">
                            <p className="font-medium text-foreground">Remaining Advance Balance</p>
                            <p className="font-bold text-foreground">₹{remainingBalance.toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between pt-1">
                            <p className="font-medium text-foreground">Payable amount</p>
                            <p className="font-bold text-primary">₹{payableAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payer Name */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Payer Name</p>
                    <input
                      type="text"
                      defaultValue="Fredrick John"
                      className="w-full h-10 px-4 bg-background border border-input rounded-md text-sm"
                    />
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
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

                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/5">
                      Add Payment
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      Pay Later
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;
