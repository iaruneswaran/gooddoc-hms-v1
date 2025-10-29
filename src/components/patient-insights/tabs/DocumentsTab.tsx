import { Download, Printer, Trash2, FileText } from "lucide-react";
import { Visit } from "../VisitListItem";

interface DocumentsTabProps {
  selectedVisit: Visit | null;
}

const mockDocuments = [
  {
    id: "1",
    name: "Prescription",
    date: "Jun 15, 2025",
    service: "Consultation",
    source: "Hospital",
    size: "239.3 KB",
  },
  {
    id: "2",
    name: "Lab Report",
    date: "May 20, 2025",
    service: "Laboratory",
    source: "Lab",
    size: "512.8 KB",
  },
  {
    id: "3",
    name: "X-Ray Report",
    date: "Apr 10, 2025",
    service: "Imaging",
    source: "Radiology",
    size: "1.2 MB",
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

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Patient Documents</h2>
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
            {mockDocuments.map((doc) => (
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
