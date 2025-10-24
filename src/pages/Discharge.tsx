import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, RefreshCw, Plus, Upload, Printer } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { DischargeSteps } from "@/components/DischargeSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const Discharge = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ClearancesStep />;
      case 2:
        return <ClinicalSummaryStep />;
      case 3:
        return <MedicationsStep />;
      case 4:
        return <BillingStep />;
      case 5:
        return <FinalizeStep />;
      default:
        return <ClearancesStep />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Patient Insights", "Discharge"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate(`/patient-insights/${patientId}`)}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Patient Insights</span>
          </button>

          <DischargeSteps currentStep={currentStep} />

          <div className="max-w-[1400px] mx-auto">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of 5
              </div>
              <Button 
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={currentStep === 5}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ClearancesStep = () => {
  const departments = [
    { name: "Doctor", status: "Pending", notes: "—", lastUpdated: "—" },
    { name: "Nursing", status: "Pending", notes: "—", lastUpdated: "—" },
    { name: "Pharmacy", status: "Pending", notes: "—", lastUpdated: "—" },
    { name: "Laboratory", status: "Cleared", notes: "All reports collected", lastUpdated: "Lab Technician\n07 Oct, 03:30 pm" },
    { name: "Radiology", status: "Cleared", notes: "Images and reports provided", lastUpdated: "Radiologist\n07 Oct, 04:00 pm" },
    { name: "Billing", status: "In Review", notes: "Reviewing final charges", lastUpdated: "Requested 08 Oct, 08:00 am" },
    { name: "Insurance/TPA", status: "Requested", notes: "Awaiting final approval", lastUpdated: "Requested 08 Oct, 08:00 am" },
    { name: "Ward Admin", status: "Pending", notes: "—", lastUpdated: "—" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-6">Department Clearances</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ensure all departments have cleared the patient for discharge.
      </p>

      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="flex items-center gap-2">
          Request All Clearances (4)
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.name}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell>
                <Badge variant={
                  dept.status === "Cleared" ? "default" : 
                  dept.status === "In Review" ? "secondary" :
                  dept.status === "Requested" ? "secondary" : "outline"
                }>
                  {dept.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{dept.notes}</TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-pre-line">{dept.lastUpdated}</TableCell>
              <TableCell>
                {dept.status === "Pending" && (
                  <Button size="sm" variant="outline">Request</Button>
                )}
                {dept.status === "Cleared" && (
                  <Badge variant="default">Cleared</Badge>
                )}
                {(dept.status === "In Review" || dept.status === "Requested") && (
                  <Button size="sm" variant="outline">Mark Cleared</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-xs text-muted-foreground mt-4">
        Note: Request sends a notification to the department's queue.
      </p>
    </Card>
  );
};

const ClinicalSummaryStep = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-6">Clinical Summary</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Document the patient's diagnosis, treatment, and discharge instructions.
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Diagnosis (ICD-10) *</label>
          <Input placeholder="Start typing to search ICD-10 codes" />
          <p className="text-xs text-muted-foreground">Start typing to search codes and procedures.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Secondary Diagnoses</label>
          <Button variant="outline" size="sm">Add secondary diagnoses (optional)</Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Procedures/Interventions</label>
          <Input placeholder="Search or enter procedures performed" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hospital Course</label>
          <Textarea placeholder="Key events, treatment given, progress during stay..." rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Condition at Discharge</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="improved">Improved</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Discharge Type *</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="against-advice">Against Medical Advice</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Patient Instructions</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity</label>
            <Textarea placeholder="Activity restrictions and recommendations" rows={2} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Diet</label>
            <Textarea placeholder="Dietary instructions and restrictions" rows={2} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wound Care</label>
            <Textarea placeholder="Wound care instructions if applicable" rows={2} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Warning Signs</label>
            <Textarea placeholder="Signs that require immediate medical attention" rows={2} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Documents</label>
          <p className="text-xs text-muted-foreground">Upload consent forms, OT notes, imaging reports, lab summaries</p>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Browse files
          </Button>
        </div>
      </div>
    </Card>
  );
};

const MedicationsStep = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-6">Medications & Follow-up</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Prescribe discharge medications and schedule follow-up appointments.
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Discharge Prescriptions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print e-Rx
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Medicine
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                  No prescriptions added yet. Click "Add Medicine" to start.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Follow-up Appointment</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Follow-up Clinic/Doctor</label>
              <Input placeholder="Search clinic or doctor" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Follow-up Date & Time</label>
              <Input type="datetime-local" placeholder="dd-mm-yyyy --:--" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tests to Repeat</label>
            <Input placeholder="Add tests to be repeated during follow-up" />
          </div>

          <Button variant="outline">Book Follow-up</Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Patient Education</h3>
          <p className="text-sm text-muted-foreground">Provide education materials based on diagnosis:</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer">Diabetes Management Guide</Badge>
            <Badge variant="outline" className="cursor-pointer">Post-Operative Care</Badge>
            <Badge variant="outline" className="cursor-pointer">Medication Safety</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BillingStep = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-6">Final Bill & Settlement</h2>
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
          <p className="text-2xl font-bold text-primary">₹80,000</p>
        </Card>
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Advance Applied</p>
          <p className="text-2xl font-bold text-foreground">₹0</p>
        </Card>
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Net Payable</p>
          <p className="text-2xl font-bold text-primary">₹15,000</p>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Patient Invoice Summary</h3>
          <div className="mb-4 flex gap-6 text-sm">
            <span><span className="font-medium">Admission Date:</span> 05 Oct</span>
            <span><span className="font-medium">Discharge Date:</span> 07 Oct</span>
          </div>

          {/* Room & Admission */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Room & Admission</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>05 Oct</TableCell>
                  <TableCell>Room Charges – General Ward (Per Day)</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>₹2,500</TableCell>
                  <TableCell>₹7,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>05 Oct</TableCell>
                  <TableCell>Admission Fee</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹5,000</TableCell>
                  <TableCell>₹5,000</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Room & Admission)</TableCell>
                  <TableCell className="font-bold">₹12,500</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Medications & Procedures */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Medications & Procedures</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>06 Oct</TableCell>
                  <TableCell>IV Fluids & Medications</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹8,500</TableCell>
                  <TableCell>₹8,500</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Medications & Procedures)</TableCell>
                  <TableCell className="font-bold">₹8,500</TableCell>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Appointment No</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>07 Oct</TableCell>
                  <TableCell>LAB-001</TableCell>
                  <TableCell>Complete Blood Count</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>₹800</TableCell>
                  <TableCell>₹1,600</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>07 Oct</TableCell>
                  <TableCell>LAB-002</TableCell>
                  <TableCell>Liver Function Test</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹1,500</TableCell>
                  <TableCell>₹1,500</TableCell>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Appointment No</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>06 Oct</TableCell>
                  <TableCell>RADIO-001</TableCell>
                  <TableCell>Chest X-Ray</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹1,200</TableCell>
                  <TableCell>₹1,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>06 Oct</TableCell>
                  <TableCell>RADIO-002</TableCell>
                  <TableCell>CT Scan Abdomen</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹4,000</TableCell>
                  <TableCell>₹4,000</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Radiology)</TableCell>
                  <TableCell className="font-bold">₹5,200</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Day Care Procedures */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Day Care Procedures</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>06 Oct</TableCell>
                  <TableCell>Minor Surgery – Appendix Removal</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>₹15,000</TableCell>
                  <TableCell>₹15,000</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Day Care Procedures)</TableCell>
                  <TableCell className="font-bold">₹15,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Other Services */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Other Services</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>05 Oct</TableCell>
                  <TableCell>Oxygen Support</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>₹500</TableCell>
                  <TableCell>₹1,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>06 Oct</TableCell>
                  <TableCell>Physiotherapy Sessions</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>₹1,200</TableCell>
                  <TableCell>₹2,400</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-semibold">Subtotal (Other Services)</TableCell>
                  <TableCell className="font-bold">₹3,400</TableCell>
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
                  <TableCell>Room & Admission</TableCell>
                  <TableCell className="text-right">₹12,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Medications & Procedures</TableCell>
                  <TableCell className="text-right">₹8,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Laboratory</TableCell>
                  <TableCell className="text-right">₹3,100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Radiology</TableCell>
                  <TableCell className="text-right">₹5,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Day Care Procedures</TableCell>
                  <TableCell className="text-right">₹15,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Other Services</TableCell>
                  <TableCell className="text-right">₹3,400</TableCell>
                </TableRow>
                <TableRow className="bg-primary/10">
                  <TableCell className="font-bold text-lg">Total</TableCell>
                  <TableCell className="text-right font-bold text-lg">₹47,700</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Adjustments</h3>
          
          <div className="flex items-center gap-4">
            <Checkbox id="advance" />
            <label htmlFor="advance" className="text-sm">Apply Advance Balance</label>
            <span className="text-sm text-muted-foreground ml-auto">Available: ₹20,000</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Discount" />
            <Input placeholder="Amount" />
            <Input placeholder="Reason" />
          </div>
          <p className="text-xs text-muted-foreground">Approved by: [Current User]</p>
        </div>

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
              <p className="text-xs text-muted-foreground">Preauth #</p>
              <p className="text-sm font-medium">PA-2025-1234</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-sm font-medium">₹80,000</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Co-pay</p>
              <p className="text-sm font-medium">₹5,000</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Deductible</p>
              <p className="text-sm font-medium">₹2,000</p>
            </div>
          </div>
        </div>

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
  );
};

const FinalizeStep = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-6">Review & Finalize</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Verify all steps are complete before finalizing the discharge.
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Discharge Checklist</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox id="clearances" />
              <label htmlFor="clearances" className="text-sm">All department clearances received</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="summary" />
              <label htmlFor="summary" className="text-sm">Clinical summary completed</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="prescriptions" />
              <label htmlFor="prescriptions" className="text-sm">Prescriptions printed/sent</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="billing" />
              <label htmlFor="billing" className="text-sm">Billing settled</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="documents" />
              <label htmlFor="documents" className="text-sm">Discharge documents generated</label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Discharge Documents</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-medium">Discharge Summary PDF</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💊</span>
                <div>
                  <p className="text-sm font-medium">e-Prescription</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧾</span>
                <div>
                  <p className="text-sm font-medium">Final Bill & Receipt</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-sm font-medium">Patient Instructions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Checkbox id="counseling" className="mt-1" />
            <label htmlFor="counseling" className="text-sm">
              I confirm discharge counseling provided and documents shared with patient/attendant.
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Ready to Finalize</h3>
          <p className="text-sm text-muted-foreground">Please complete all checklist items before finalizing.</p>
          
          <Button size="lg" className="w-full" disabled>
            Finalize Discharge
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Discharge;
