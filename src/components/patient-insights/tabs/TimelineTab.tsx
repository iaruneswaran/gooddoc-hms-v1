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

interface TimelineTabProps {
  patientId?: string;
}

interface TransferHistoryItem {
  id: string;
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

export function TimelineTab({ patientId }: TimelineTabProps) {
  // Mock transfer history data
  const transferHistory: TransferHistoryItem[] = [
    {
      id: "t1",
      transferDate: "2025-11-01",
      transferTime: "09:32",
      fromLocation: "Emergency Room",
      fromBed: "ER-05",
      toLocation: "Ward 3B",
      toBed: "3B-102",
      reason: "Admission for observation",
      authorizedBy: "Dr. Priya Sharma",
      status: "Completed",
    },
    {
      id: "t2",
      transferDate: "2025-11-03",
      transferTime: "14:00",
      fromLocation: "Ward 3B",
      fromBed: "3B-102",
      toLocation: "ICU",
      toBed: "ICU-08",
      reason: "Critical condition - respiratory distress",
      authorizedBy: "Dr. Rajesh Kumar",
      status: "Completed",
    },
    {
      id: "t3",
      transferDate: "2025-11-05",
      transferTime: "10:30",
      fromLocation: "ICU",
      fromBed: "ICU-08",
      toLocation: "Ward 2A",
      toBed: "2A-215",
      reason: "Condition stabilized",
      authorizedBy: "Dr. Priya Sharma",
      status: "Completed",
    },
    {
      id: "t4",
      transferDate: "2025-11-07",
      transferTime: "11:00",
      fromLocation: "Ward 2A",
      fromBed: "2A-215",
      toLocation: "Discharge",
      toBed: "-",
      reason: "Recovery complete",
      authorizedBy: "Dr. Anjali Mehta",
      status: "Completed",
    },
  ];

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

  return (
    <div className="px-6 pt-6 pb-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Transfer History</h3>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-medium">Date & Time</TableHead>
              <TableHead className="text-xs font-medium">From</TableHead>
              <TableHead className="text-xs font-medium">To</TableHead>
              <TableHead className="text-xs font-medium">Reason</TableHead>
              <TableHead className="text-xs font-medium">Authorized By</TableHead>
              <TableHead className="text-xs font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferHistory.map((transfer) => (
              <TableRow key={transfer.id} className="hover:bg-muted/30">
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
