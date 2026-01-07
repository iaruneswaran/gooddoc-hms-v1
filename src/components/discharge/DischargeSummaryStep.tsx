import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Printer,
  Download,
  FileText
} from "lucide-react";
import { StepStatus } from "@/types/discharge-flow";
import { SAMPLE_DISCHARGE_SUMMARY } from "@/data/discharge-flow.mock";

interface DischargeSummaryStepProps {
  stepStatus: StepStatus;
  onFinalize: () => void;
  requireBillingClearance: boolean;
  totalOutstanding: number;
}

// Mock documents data for discharge
const DISCHARGE_DOCUMENTS = [
  {
    id: "1",
    docNo: "DOC001",
    name: "Cardiology Consultation Notes",
    date: "20 Dec 2025",
    time: "10:45 AM",
    service: "Cardiology OPD",
    preparedBy: "Dr. Meera Nair",
    verifiedBy: "Dr. Meera Nair",
  },
  {
    id: "2",
    docNo: "DOC002",
    name: "12-Lead ECG Report",
    date: "20 Dec 2025",
    time: "11:15 AM",
    service: "Cardiology Diagnostics",
    preparedBy: "ECG Tech - Ramesh K",
    verifiedBy: "Dr. Meera Nair",
  },
  {
    id: "3",
    docNo: "DOC003",
    name: "ECG Tracing Image",
    date: "20 Dec 2025",
    time: "11:10 AM",
    service: "Cardiology Diagnostics",
    preparedBy: "ECG Tech - Ramesh K",
    verifiedBy: null,
  },
  {
    id: "4",
    docNo: "RX001",
    name: "Prescription",
    date: "20 Dec 2025",
    time: "11:30 AM",
    service: "Cardiology OPD",
    preparedBy: "Dr. Meera Nair",
    verifiedBy: null,
  },
  {
    id: "5",
    docNo: "LAB001",
    name: "Lipid Profile Report",
    date: "20 Dec 2025",
    time: "12:00 PM",
    service: "Clinical Biochemistry",
    preparedBy: "Lab Tech - Anita S",
    verifiedBy: "Dr. Sunita Rao (Pathologist)",
  },
  {
    id: "6",
    docNo: "LAB002",
    name: "Complete Blood Count",
    date: "21 Dec 2025",
    time: "08:30 AM",
    service: "Clinical Pathology",
    preparedBy: "Lab Tech - Priya M",
    verifiedBy: "Dr. Sunita Rao (Pathologist)",
  },
  {
    id: "7",
    docNo: "RAD001",
    name: "Chest X-Ray Report",
    date: "21 Dec 2025",
    time: "09:00 AM",
    service: "Radiology",
    preparedBy: "Radiographer - Kumar S",
    verifiedBy: "Dr. Venkat Rao (Radiologist)",
  },
  {
    id: "8",
    docNo: "DOC004",
    name: "Discharge Summary",
    date: "22 Dec 2025",
    time: "02:45 PM",
    service: "Cardiology",
    preparedBy: "Dr. Arun Kumar",
    verifiedBy: "Dr. Arun Kumar",
  },
];

export default function DischargeSummaryStep({ 
  stepStatus, 
  onFinalize, 
  requireBillingClearance, 
  totalOutstanding 
}: DischargeSummaryStepProps) {
  const summary = SAMPLE_DISCHARGE_SUMMARY;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4 print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Discharge Summary</h2>
            <p className="text-xs text-muted-foreground">Bill documents for this encounter</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">
            {summary.conditionAtDischarge}
          </Badge>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Prepared / Verified By</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DISCHARGE_DOCUMENTS.map((doc) => (
                <tr key={doc.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono text-primary">{doc.docNo}</td>
                  <td className="py-3 px-4 font-medium">{doc.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span>{doc.date}</span>
                      <span className="text-xs text-muted-foreground">{doc.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{doc.service}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span>{doc.preparedBy}</span>
                      {doc.verifiedBy && (
                        <span className="text-xs text-muted-foreground">{doc.verifiedBy}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}