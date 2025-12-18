import { Download, Printer, Trash2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visit } from "../VisitListItem";

interface DocumentsTabProps {
  selectedVisit: Visit | null;
}

const allDocuments = [
  {
    id: "1",
    name: "Prescription",
    date: "05 Aug 2025",
    visitId: "V25-001",
    service: "Consultation",
    source: "Hospital",
    size: "239.3 KB",
  },
  {
    id: "2",
    name: "Lab Report",
    date: "05 Aug 2025",
    visitId: "V25-002",
    service: "Laboratory",
    source: "Lab",
    size: "512.8 KB",
  },
  {
    id: "3",
    name: "X-Ray Report",
    date: "05 Aug 2025",
    visitId: "V25-003",
    service: "Radiology",
    source: "Radiology",
    size: "1.2 MB",
  },
  {
    id: "4",
    name: "Admission Form",
    date: "07 Aug 2025",
    visitId: "V25-004",
    service: "IPD",
    source: "Hospital",
    size: "185.4 KB",
  },
  {
    id: "5",
    name: "Discharge Summary",
    date: "07 Aug 2025",
    visitId: "V25-004",
    service: "IPD",
    source: "Hospital",
    size: "412.7 KB",
  },
  {
    id: "6",
    name: "Chemotherapy Protocol",
    date: "07 Aug 2025",
    visitId: "V25-005",
    service: "Day-Care",
    source: "Hospital",
    size: "328.5 KB",
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
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Source</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Size</th>
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {visitDocuments.map((doc) => (
              <tr key={doc.id} className="border-t">
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
