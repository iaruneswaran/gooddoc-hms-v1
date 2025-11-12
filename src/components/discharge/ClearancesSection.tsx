import { useState } from "react";
import { RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { DepartmentClearance, ClearanceStatus } from "@/types/discharge";
import { toast } from "sonner";

interface ClearancesSectionProps {
  visitId: string;
}

export function ClearancesSection({ visitId }: ClearancesSectionProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [clearances, setClearances] = useState<DepartmentClearance[]>([
    { department: "Doctor", status: "In Review", notes: "Awaiting final sign-off", lastUpdatedBy: "Dr. Mehta", lastUpdatedAt: "08 Nov, 09:30 AM", canMarkCleared: false },
    { department: "Nursing", status: "Requested", notes: "Patient care handoff pending", lastUpdatedBy: "System", lastUpdatedAt: "08 Nov, 08:00 AM", canMarkCleared: false },
    { department: "Pharmacy", status: "In Review", notes: "Preparing discharge medications", lastUpdatedBy: "Pharmacy Team", lastUpdatedAt: "08 Nov, 10:00 AM", canMarkCleared: false },
    { department: "Laboratory", status: "Cleared", notes: "All reports collected", lastUpdatedBy: "Lab Tech", lastUpdatedAt: "07 Nov, 03:30 PM", canMarkCleared: false },
    { department: "Radiology", status: "Cleared", notes: "Images and reports provided", lastUpdatedBy: "Radiologist", lastUpdatedAt: "07 Nov, 04:00 PM", canMarkCleared: false },
    { department: "Billing", status: "In Review", notes: "Final charges under review", lastUpdatedBy: "Billing Dept", lastUpdatedAt: "08 Nov, 11:00 AM", canMarkCleared: true },
    { department: "Insurance/TPA", status: "Requested", notes: "Awaiting final approval", lastUpdatedBy: "System", lastUpdatedAt: "08 Nov, 08:00 AM", canMarkCleared: true },
    { department: "Ward Admin", status: "Pending", notes: "—", lastUpdatedBy: undefined, lastUpdatedAt: "—", canMarkCleared: false },
  ]);

  const handleRequestAll = () => {
    const pendingCount = clearances.filter(c => c.status === 'Pending').length;
    toast.success(`Clearance requests sent to ${pendingCount} departments`);
    
    setClearances(prev => prev.map(c => 
      c.status === 'Pending' ? { ...c, status: 'Requested', lastUpdatedBy: 'System', lastUpdatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) } : c
    ));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Clearance statuses refreshed");
    }, 1000);
  };

  const handleRequest = (dept: string) => {
    toast.success(`Clearance request sent to ${dept}`);
    setClearances(prev => prev.map(c => 
      c.department === dept ? { ...c, status: 'Requested', lastUpdatedBy: 'System', lastUpdatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) } : c
    ));
  };

  const handleMarkCleared = (dept: string) => {
    toast.success(`${dept} marked as cleared`);
    setClearances(prev => prev.map(c => 
      c.department === dept ? { ...c, status: 'Cleared', lastUpdatedBy: 'Front Office', lastUpdatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) } : c
    ));
  };

  const openNotes = (dept: string) => {
    setSelectedDept(dept);
    setNotesOpen(true);
  };

  const getStatusBadge = (status: ClearanceStatus) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-muted">{status}</Badge>;
      case 'Requested':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{status}</Badge>;
      case 'In Review':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{status}</Badge>;
      case 'Cleared':
        return <Badge variant="default" className="bg-green-600 text-white dark:bg-green-700">{status}</Badge>;
    }
  };

  const pendingCount = clearances.filter(c => c.status === 'Pending').length;
  const clearedCount = clearances.filter(c => c.status === 'Cleared').length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-sm text-muted-foreground">
            Ensure all departments have cleared the patient for discharge. ({clearedCount} of {clearances.length} cleared)
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRequestAll}
              disabled={pendingCount === 0}
            >
              Request All Clearances {pendingCount > 0 && `(${pendingCount})`}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearances.map((clearance) => (
              <TableRow key={clearance.department}>
                <TableCell className="font-medium">{clearance.department}</TableCell>
                <TableCell>{getStatusBadge(clearance.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {clearance.notes}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {clearance.lastUpdatedBy && (
                    <div>
                      <div className="font-medium text-foreground">{clearance.lastUpdatedBy}</div>
                      <div>{clearance.lastUpdatedAt}</div>
                    </div>
                  )}
                  {!clearance.lastUpdatedBy && <span>—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {clearance.status === 'Pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequest(clearance.department)}
                      >
                        Request
                      </Button>
                    )}
                    {clearance.status === 'Cleared' && (
                      <Badge variant="default" className="bg-green-600">Cleared</Badge>
                    )}
                    {(clearance.status === 'Requested' || clearance.status === 'In Review') && clearance.canMarkCleared && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkCleared(clearance.department)}
                      >
                        Mark Cleared
                      </Button>
                    )}
                    {(clearance.status === 'Requested' || clearance.status === 'In Review') && !clearance.canMarkCleared && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        disabled
                        className="text-muted-foreground"
                      >
                        Pending Review
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openNotes(clearance.department)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> "Request" sends notifications to the department's queue. 
          Front Office can only mark Billing and Insurance/TPA as cleared when system conditions are met.
        </p>
      </div>

      {/* Notes Side Panel */}
      <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>{selectedDept} - Clearance Notes</SheetTitle>
            <SheetDescription>
              View audit trail and add comments for this department clearance.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Audit Trail</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">System</span>
                    <span className="text-xs text-muted-foreground">08 Nov, 08:00 AM</span>
                  </div>
                  <p className="text-muted-foreground">Clearance request initiated</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Comment</label>
              <Textarea 
                placeholder="Add notes, @mention team members, or attach proof..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button size="sm">Add Comment</Button>
                <Button size="sm" variant="outline">Attach File</Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
