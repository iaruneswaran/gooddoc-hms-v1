import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceSummaryStructuredProps {
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  invoiceNo: string;
  date: string;
}

export function InvoiceSummaryStructured({
  patientName,
  patientId,
  age,
  gender,
  invoiceNo,
  date,
}: InvoiceSummaryStructuredProps) {
  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">{patientName}</h3>
          <p className="text-sm text-muted-foreground">{patientId} • {age} | {gender}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Invoice No</p>
          <p className="text-sm font-medium text-foreground">{invoiceNo}</p>
          <p className="text-xs text-muted-foreground mt-2">Date</p>
          <p className="text-sm text-foreground">{date}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-6 text-sm">
        <span><span className="font-medium">Admission Date:</span> 05 Nov</span>
        <span><span className="font-medium">Discharge Date:</span> 07 Nov</span>
      </div>

      {/* Room & Admission */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-primary">Room & Admission</h4>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>IPD Admission</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹5,000</TableCell>
              <TableCell className="w-[100px]">₹5,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Semi-Private Room (per day)</TableCell>
              <TableCell className="w-[80px]">2</TableCell>
              <TableCell className="w-[100px]">₹2,500</TableCell>
              <TableCell className="w-[100px]">₹5,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Private Room (per day)</TableCell>
              <TableCell className="w-[80px]">2</TableCell>
              <TableCell className="w-[100px]">₹5,000</TableCell>
              <TableCell className="w-[100px]">₹10,000</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Room & Admission)</TableCell>
              <TableCell className="font-bold">₹20,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Consultations */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-primary">Consultations</h4>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Consultation</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹1,000</TableCell>
              <TableCell className="w-[100px]">₹1,000</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Consultations)</TableCell>
              <TableCell className="font-bold">₹1,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Nursing Care */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-primary">Nursing Care</h4>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Nursing Care (per day)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹1,200</TableCell>
              <TableCell className="w-[100px]">₹1,200</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Nursing Care (per day)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹1,260</TableCell>
              <TableCell className="w-[100px]">₹1,260</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Nursing Care)</TableCell>
              <TableCell className="font-bold">₹2,460</TableCell>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Chest (PA View)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹500</TableCell>
              <TableCell className="w-[100px]">₹500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Cervical Spine</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹600</TableCell>
              <TableCell className="w-[100px]">₹600</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Abdomen (KUB)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹300</TableCell>
              <TableCell className="w-[100px]">₹300</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Lumbar Spine</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹700</TableCell>
              <TableCell className="w-[100px]">₹700</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Radiology)</TableCell>
              <TableCell className="font-bold">₹2,100</TableCell>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Complete Blood Count (CBC)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹450</TableCell>
              <TableCell className="w-[100px]">₹450</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Complete Blood Count (CBC)</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹450</TableCell>
              <TableCell className="w-[100px]">₹450</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Laboratory)</TableCell>
              <TableCell className="font-bold">₹900</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Procedures */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-primary">Procedures</h4>
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
              <TableCell className="w-[100px]">05 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Cardiac Catheterization</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹28,000</TableCell>
              <TableCell className="w-[100px]">₹28,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-[100px]">06 Nov</TableCell>
              <TableCell className="w-[140px]">—</TableCell>
              <TableCell>Cardiac Catheterization</TableCell>
              <TableCell className="w-[80px]">1</TableCell>
              <TableCell className="w-[100px]">₹31,360</TableCell>
              <TableCell className="w-[100px]">₹31,360</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Procedures)</TableCell>
              <TableCell className="font-bold">₹59,360</TableCell>
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
              <TableCell className="text-right">₹20,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Consultations</TableCell>
              <TableCell className="text-right">₹1,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nursing Care</TableCell>
              <TableCell className="text-right">₹2,460</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Radiology</TableCell>
              <TableCell className="text-right">₹2,100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Laboratory</TableCell>
              <TableCell className="text-right">₹900</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Procedures</TableCell>
              <TableCell className="text-right">₹59,360</TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="font-bold text-lg">Total</TableCell>
              <TableCell className="text-right font-bold text-lg">₹85,820</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
