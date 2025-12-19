import { Download, Printer, Trash2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visit } from "../VisitListItem";

interface DocumentsTabProps {
  selectedVisit: Visit | null;
}

const allDocuments = [
  // V25-004 documents (Active visit - Cardiology follow-up)
  {
    id: "doc-041",
    name: "Consultation Notes",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "Cardiology",
    source: "Dr. Meera Nair",
    size: "156.2 KB",
  },
  {
    id: "doc-042",
    name: "ECG Report",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "Diagnostics",
    source: "Cardiology Lab",
    size: "892.4 KB",
  },
  // V25-002 documents (General Medicine checkup)
  {
    id: "doc-021",
    name: "Health Checkup Report",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "General Medicine",
    source: "Dr. Priya Menon",
    size: "324.6 KB",
  },
  {
    id: "doc-022",
    name: "CBC Report",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "Laboratory",
    source: "Central Lab",
    size: "189.3 KB",
  },
  {
    id: "doc-023",
    name: "Lipid Profile Report",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "Laboratory",
    source: "Central Lab",
    size: "145.8 KB",
  },
  {
    id: "doc-024",
    name: "Prescription",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "General Medicine",
    source: "Dr. Priya Menon",
    size: "98.2 KB",
  },
  // V25-001 documents (Cardiology - Chest pain)
  {
    id: "doc-011",
    name: "Cardiology Consultation",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Cardiology",
    source: "Dr. Meera Nair",
    size: "278.5 KB",
  },
  {
    id: "doc-012",
    name: "ECG Report",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Diagnostics",
    source: "Cardiology Lab",
    size: "756.2 KB",
  },
  {
    id: "doc-013",
    name: "Chest X-Ray Report",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Radiology",
    source: "Radiology Dept",
    size: "2.1 MB",
  },
  {
    id: "doc-014",
    name: "Prescription",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Cardiology",
    source: "Dr. Meera Nair",
    size: "112.4 KB",
  },
  // V24-089 documents (Orthopedics - Back pain)
  {
    id: "doc-891",
    name: "Orthopedics Consultation",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Orthopedics",
    source: "Dr. Arun Kumar",
    size: "234.7 KB",
  },
  {
    id: "doc-892",
    name: "MRI Spine Report",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Radiology",
    source: "MRI Center",
    size: "4.8 MB",
  },
  {
    id: "doc-893",
    name: "Physiotherapy Plan",
    date: "16 Nov 2025",
    visitId: "V24-089",
    service: "Physiotherapy",
    source: "Rehab Center",
    size: "156.3 KB",
  },
  {
    id: "doc-894",
    name: "Prescription",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Orthopedics",
    source: "Dr. Arun Kumar",
    size: "89.5 KB",
  },
];

export function DocumentsTab({ selectedVisit }: DocumentsTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view documents.
        </p>
      </div>
    );
  }

  // Filter documents for selected visit
  const visitDocuments = allDocuments.filter(
    (doc) => doc.visitId === selectedVisit.visitId
  );

  if (visitDocuments.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No documents found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-foreground">Visit Documents</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Visit ID</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Source</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Size</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-card">
            {visitDocuments.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="p-4">
                  <p className="text-sm font-mono font-medium text-foreground">{doc.visitId}</p>
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    {doc.name}
                  </div>
                </td>
                <td className="p-4 text-sm">{doc.date}</td>
                <td className="p-4 text-sm">{doc.service}</td>
                <td className="p-4 text-sm">{doc.source}</td>
                <td className="p-4 text-sm">{doc.size}</td>
                <td className="p-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Printer className="h-4 w-4" />
                    </button>
                    <button className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
