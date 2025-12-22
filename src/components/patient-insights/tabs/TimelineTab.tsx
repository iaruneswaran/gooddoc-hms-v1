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
  // V25-004 transfers (Active visit - Cardiology follow-up)
  {
    id: "t-041",
    visitId: "V25-004",
    transferDate: "2025-12-20",
    transferTime: "10:15",
    fromLocation: "Reception",
    fromBed: "—",
    toLocation: "Cardiology OPD",
    toBed: "Room 12",
    reason: "Scheduled consultation",
    authorizedBy: "Front Desk",
    status: "Completed",
  },
  // V25-002 transfers (General Medicine checkup)
  {
    id: "t-021",
    visitId: "V25-002",
    transferDate: "2025-12-15",
    transferTime: "09:00",
    fromLocation: "Reception",
    fromBed: "—",
    toLocation: "General Medicine OPD",
    toBed: "Room 5",
    reason: "Annual checkup",
    authorizedBy: "Front Desk",
    status: "Completed",
  },
  {
    id: "t-022",
    visitId: "V25-002",
    transferDate: "2025-12-15",
    transferTime: "09:45",
    fromLocation: "General Medicine OPD",
    fromBed: "Room 5",
    toLocation: "Laboratory",
    toBed: "—",
    reason: "Blood tests ordered",
    authorizedBy: "Dr. Priya Menon",
    status: "Completed",
  },
  // V25-001 transfers (Cardiology - Chest pain)
  {
    id: "t-011",
    visitId: "V25-001",
    transferDate: "2025-12-01",
    transferTime: "10:30",
    fromLocation: "Emergency Room",
    fromBed: "ER-03",
    toLocation: "Cardiology OPD",
    toBed: "Room 8",
    reason: "Chest pain evaluation",
    authorizedBy: "Dr. Emergency",
    status: "Completed",
  },
  {
    id: "t-012",
    visitId: "V25-001",
    transferDate: "2025-12-01",
    transferTime: "11:30",
    fromLocation: "Cardiology OPD",
    fromBed: "Room 8",
    toLocation: "ECG Lab",
    toBed: "—",
    reason: "ECG ordered",
    authorizedBy: "Dr. Meera Nair",
    status: "Completed",
  },
  {
    id: "t-013",
    visitId: "V25-001",
    transferDate: "2025-12-01",
    transferTime: "12:00",
    fromLocation: "ECG Lab",
    fromBed: "—",
    toLocation: "Radiology",
    toBed: "—",
    reason: "Chest X-Ray ordered",
    authorizedBy: "Dr. Meera Nair",
    status: "Completed",
  },
  // V24-089 transfers (Orthopedics - Back pain)
  {
    id: "t-891",
    visitId: "V24-089",
    transferDate: "2025-11-15",
    transferTime: "14:00",
    fromLocation: "Reception",
    fromBed: "—",
    toLocation: "Orthopedics OPD",
    toBed: "Room 15",
    reason: "Back pain consultation",
    authorizedBy: "Front Desk",
    status: "Completed",
  },
  {
    id: "t-892",
    visitId: "V24-089",
    transferDate: "2025-11-15",
    transferTime: "15:00",
    fromLocation: "Orthopedics OPD",
    fromBed: "Room 15",
    toLocation: "MRI Center",
    toBed: "—",
    reason: "MRI Spine ordered",
    authorizedBy: "Dr. Arun Kumar",
    status: "Completed",
  },
  {
    id: "t-893",
    visitId: "V24-089",
    transferDate: "2025-11-16",
    transferTime: "10:00",
    fromLocation: "Reception",
    fromBed: "—",
    toLocation: "Physiotherapy",
    toBed: "PT-2",
    reason: "Physiotherapy session",
    authorizedBy: "Dr. Arun Kumar",
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
              <TableHead className="text-xs font-medium">Ordering Clinician</TableHead>
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
                  <div className="text-sm font-medium text-foreground">{transfer.fromLocation}</div>
                  {transfer.fromBed !== "—" && (
                    <div className="text-xs text-muted-foreground">{transfer.fromBed}</div>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm font-medium text-foreground">{transfer.toLocation}</div>
                  {transfer.toBed !== "—" && (
                    <div className="text-xs text-muted-foreground">{transfer.toBed}</div>
                  )}
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
