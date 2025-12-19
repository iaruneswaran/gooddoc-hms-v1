import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Visit } from "../VisitListItem";

interface TimelineTabProps {
  selectedVisit?: Visit | null;
}

interface TransferHistoryItem {
  id: string;
  visitId: string;
  transferDate: string;
  transferTime: string;
  fromLocation: string;
  fromBed: string;
  toLocation: string;
  toBed: string;
  reason: string;
  authorizedBy: string;
  status: "Completed" | "In Progress" | "Cancelled";
}

// Mock transfer history data with visitId
const allTransferHistory: TransferHistoryItem[] = [
  {
    id: "t1",
    visitId: "V25-004",
    transferDate: "2025-08-07",
    transferTime: "11:00",
    fromLocation: "Emergency Room",
    fromBed: "ER-05",
    toLocation: "Ward 3B",
    toBed: "3B-102",
    reason: "Admission for observation",
    authorizedBy: "Dr. Karthik Reddy",
    status: "Completed",
  },
  {
    id: "t2",
    visitId: "V25-004",
    transferDate: "2025-08-08",
    transferTime: "14:00",
    fromLocation: "Ward 3B",
    fromBed: "3B-102",
    toLocation: "Private Room",
    toBed: "PR-204",
    reason: "Patient requested private room",
    authorizedBy: "Dr. Karthik Reddy",
    status: "Completed",
  },
];

export function TimelineTab({ selectedVisit }: TimelineTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view transfer history.
        </p>
      </div>
    );
  }

  // Filter transfers for selected visit
  const visitTransfers = allTransferHistory.filter(
    (transfer) => transfer.visitId === selectedVisit.visitId
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (visitTransfers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No transfer history found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Transfer History</h3>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-medium">Visit ID</TableHead>
              <TableHead className="text-xs font-medium">Date & Time</TableHead>
              <TableHead className="text-xs font-medium">From</TableHead>
              <TableHead className="text-xs font-medium">To</TableHead>
              <TableHead className="text-xs font-medium">Reason</TableHead>
              <TableHead className="text-xs font-medium">Authorized By</TableHead>
              <TableHead className="text-xs font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitTransfers.map((transfer) => (
              <TableRow key={transfer.id} className="hover:bg-muted/30">
                <TableCell className="py-3">
                  <p className="text-sm font-mono font-medium text-foreground">{transfer.visitId}</p>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm font-medium text-foreground">
                    {format(new Date(transfer.transferDate), "dd MMM yyyy")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transfer.transferTime}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm text-foreground">{transfer.fromLocation}</div>
                  <div className="text-xs text-muted-foreground">
                    Bed: {transfer.fromBed}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm text-foreground">{transfer.toLocation}</div>
                  <div className="text-xs text-muted-foreground">
                    Bed: {transfer.toBed}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm text-foreground max-w-[200px] truncate" title={transfer.reason}>
                    {transfer.reason}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-foreground">{transfer.authorizedBy}</span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant={getStatusVariant(transfer.status)} className="text-xs">
                    {transfer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
