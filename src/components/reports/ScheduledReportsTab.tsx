import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Plus, Edit, Trash2 } from "lucide-react";

const mockSchedules = [
  {
    id: "SCH-001",
    name: "Daily Cash Flow",
    report: "Cash Flow Summary",
    cadence: "Daily at 08:00 AM",
    recipients: "finance@gooddoc.com, cfo@gooddoc.com",
    format: "PDF",
    lastRun: "2025-11-06 08:00",
    nextRun: "2025-11-07 08:00",
    status: "Active",
    enabled: true,
  },
  {
    id: "SCH-002",
    name: "Weekly AR Aging",
    report: "AR Aging Report",
    cadence: "Weekly on Monday at 09:00 AM",
    recipients: "billing@gooddoc.com",
    format: "Excel",
    lastRun: "2025-11-04 09:00",
    nextRun: "2025-11-11 09:00",
    status: "Active",
    enabled: true,
  },
  {
    id: "SCH-003",
    name: "Monthly Department Performance",
    report: "Departmental Net Revenue",
    cadence: "Monthly on 1st at 10:00 AM",
    recipients: "ops@gooddoc.com, finance@gooddoc.com",
    format: "PDF",
    lastRun: "2025-11-01 10:00",
    nextRun: "2025-12-01 10:00",
    status: "Active",
    enabled: false,
  },
];

export function ScheduledReportsTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Scheduled Reports</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Automate report delivery to your team
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Schedule
          </Button>
        </div>

        {mockSchedules.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>{schedule.report}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {schedule.cadence}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{schedule.recipients}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.format}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{schedule.lastRun}</TableCell>
                    <TableCell className="whitespace-nowrap">{schedule.nextRun}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{schedule.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={schedule.enabled} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No scheduled reports</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first scheduled report to automate report delivery
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
