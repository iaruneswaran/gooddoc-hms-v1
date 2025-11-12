import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Printer } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Discharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const visitId = location.state?.visitId || "VST-205431";
  const [counselingConfirmed, setCounselingConfirmed] = useState(false);

  // Mock timeline events
  const timelineEvents = [
    { date: "Sat, Nov 1", time: "09:32", location: "ER → Ward 3B", description: "Admission" },
    { date: "Sun, Nov 2", time: "08:10", location: "Laboratory", description: "CBC + CMP" },
    { date: "Sun, Nov 2", time: "14:15", location: "Pharmacy", description: "Ceftriaxone 1 g IV" },
    { date: "Mon, Nov 3", time: "10:00", location: "Radiology", description: "Chest X‑ray" },
    { date: "Tue, Nov 4", time: "16:00", location: "Ward 3B", description: "Discharge planning meeting" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Patient Insights", "Discharge"]} />
        
        <main className="p-6">
          <button
            onClick={() => navigate(`/patient-insights/${patientId}`)}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Patient Insights</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Patient Discharge</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visit ID:</span>
              <span className="font-mono font-medium">{visitId}</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Clearances Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Clearances</h2>
              <div className="space-y-3">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-32 text-sm font-medium text-muted-foreground">
                      {event.date}
                    </div>
                    <div className="flex-1 text-sm">
                      <span className="text-muted-foreground">{event.time}</span>
                      <span className="mx-2 text-muted-foreground">—</span>
                      <span className="font-medium text-foreground">{event.location}</span>
                      <span className="mx-2 text-muted-foreground">—</span>
                      <span className="text-foreground">{event.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>Next:</span>
                <span className="text-foreground">Billing & Settlement</span>
              </div>
            </div>

            {/* Billing & Settlement Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Billing & Settlement</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Review charges, apply adjustments, and collect payment.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Estimate</p>
                  <p className="text-2xl font-bold text-foreground">₹82,000</p>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Insurance Approved</p>
                  <p className="text-2xl font-bold text-foreground">₹80,000</p>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Advance Applied</p>
                  <p className="text-2xl font-bold text-foreground">₹0</p>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Net Payable</p>
                  <p className="text-2xl font-bold text-destructive">₹2,000</p>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Detailed Charges */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Detailed Charges</h3>
                  
                  {/* Room Charges */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Room Charges</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Room Type</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead className="text-right">Rate/Day</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05-07 Oct</TableCell>
                          <TableCell>Semi-Private (Ward 3B)</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell className="text-right">₹2,500</TableCell>
                          <TableCell className="text-right">₹7,500</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Room)</TableCell>
                          <TableCell className="text-right font-bold">₹7,500</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Medications */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Medications & Procedures</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05 Oct</TableCell>
                          <TableCell>Ceftriaxone 1g IV</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell className="text-right">₹450</TableCell>
                          <TableCell className="text-right">₹1,350</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>06 Oct</TableCell>
                          <TableCell>IV Fluids (NS 500ml)</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell className="text-right">₹180</TableCell>
                          <TableCell className="text-right">₹900</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Medications)</TableCell>
                          <TableCell className="text-right font-bold">₹2,250</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Laboratory */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Laboratory</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05 Oct</TableCell>
                          <TableCell>CBC</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">₹800</TableCell>
                          <TableCell className="text-right">₹800</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05 Oct</TableCell>
                          <TableCell>CMP</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">₹1,200</TableCell>
                          <TableCell className="text-right">₹1,200</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Laboratory)</TableCell>
                          <TableCell className="text-right font-bold">₹2,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Radiology */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Radiology</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>06 Oct</TableCell>
                          <TableCell>Chest X-Ray</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">₹1,200</TableCell>
                          <TableCell className="text-right">₹1,200</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Radiology)</TableCell>
                          <TableCell className="text-right font-bold">₹1,200</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Grand Total */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Grand Total</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Room & Admission</TableCell>
                          <TableCell className="text-right">₹7,500</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Medications & Procedures</TableCell>
                          <TableCell className="text-right">₹2,250</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Laboratory</TableCell>
                          <TableCell className="text-right">₹2,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Radiology</TableCell>
                          <TableCell className="text-right">₹1,200</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-bold text-lg">Total</TableCell>
                          <TableCell className="text-right font-bold text-lg">₹12,950</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Adjustments */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Adjustments</h3>
                  
                  <div className="flex items-center gap-4">
                    <Checkbox id="advance" />
                    <label htmlFor="advance" className="text-sm">Apply Advance Balance</label>
                    <span className="text-sm text-muted-foreground ml-auto">Available: ₹10,000</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="Discount %" />
                    <Input placeholder="Amount" />
                    <Input placeholder="Reason" />
                  </div>
                  <p className="text-xs text-muted-foreground">Approved by: [Current User]</p>
                </div>

                {/* Insurance Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Insurance Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Payer</p>
                      <p className="text-sm font-medium">Star Health Insurance</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Policy #</p>
                      <p className="text-sm font-medium">SH-2024-567890</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Approved Amount</p>
                      <p className="text-sm font-medium">₹80,000</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Co-pay</p>
                      <p className="text-sm font-medium">₹2,000</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Actions</h3>
                  <p className="text-sm text-destructive">Cannot finalize while outstanding balance &gt; 0.</p>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Print
                    </Button>
                    <Button className="flex items-center gap-2">
                      Collect Payment
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>Next:</span>
                <span className="text-foreground">Finalize Discharge</span>
              </div>
            </div>

            {/* Finalize Discharge Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Finalize Discharge</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="counseling"
                    checked={counselingConfirmed}
                    onCheckedChange={(checked) => setCounselingConfirmed(checked as boolean)}
                  />
                  <label 
                    htmlFor="counseling" 
                    className="text-sm text-foreground cursor-pointer leading-relaxed"
                  >
                    I confirm discharge counseling provided and documents shared with patient/attendant.
                  </label>
                </div>

                <Button 
                  className="w-full"
                  size="lg"
                  disabled={!counselingConfirmed}
                >
                  Finalize Discharge
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discharge;
