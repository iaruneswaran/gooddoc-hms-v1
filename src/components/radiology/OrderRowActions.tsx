import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  MoreHorizontal, CheckCircle, UserPlus, MapPin, Play, 
  ClipboardCheck, FileText, Send, Users
} from "lucide-react";
import { MOCK_STAFF, type RadiologyOrderStaff, type ExamStatus } from "@/types/radiology-staff";
import { Link } from "react-router-dom";

interface OrderRowActionsProps {
  order: RadiologyOrderStaff;
  onStatusChange: (orderId: string, status: ExamStatus) => void;
  onAssign: (orderId: string, role: "radiologist" | "technologist", staffId: string) => void;
}

export function OrderRowActions({ order, onStatusChange, onAssign }: OrderRowActionsProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignRole, setAssignRole] = useState<"radiologist" | "technologist">("radiologist");
  const [selectedStaff, setSelectedStaff] = useState("");

  const radiologists = MOCK_STAFF.filter(s => s.role === "Radiologist" || s.role === "Resident");
  const technologists = MOCK_STAFF.filter(s => s.role === "Technologist");

  const handleAssignClick = (role: "radiologist" | "technologist") => {
    setAssignRole(role);
    setSelectedStaff("");
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (selectedStaff) {
      onAssign(order.id, assignRole, selectedStaff);
      setAssignDialogOpen(false);
    }
  };

  const canApprove = order.waitingForApproval !== "-";
  const canMarkArrived = order.status === "Scheduled" || order.status === "Ordered";
  const canStartNow = order.status === "Arrived" && order.safetyStatus === "passed";
  const canCompleteQC = order.status === "Images Available" && order.qcStatus === "pending";
  const canRelease = order.reportStatus === "Approved" && (!order.hasCriticalFinding || order.criticalCommunicationLogged);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link to={`/diagnostics/radiology/${order.id}`}>
          <Button variant="default" size="sm" className="h-8">
            <FileText className="h-3 w-3 mr-1" />
            Enter Results
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canApprove && (
              <DropdownMenuItem onClick={() => onStatusChange(order.id, "Scheduled")}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Approve
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => handleAssignClick("radiologist")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Radiologist
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleAssignClick("technologist")}>
              <Users className="h-4 w-4 mr-2" />
              Assign Technologist
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {canMarkArrived && (
              <DropdownMenuItem onClick={() => onStatusChange(order.id, "Arrived")}>
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Mark Arrived
              </DropdownMenuItem>
            )}
            
            {canStartNow && (
              <DropdownMenuItem onClick={() => onStatusChange(order.id, "In Room")}>
                <Play className="h-4 w-4 mr-2 text-green-600" />
                Start Now
              </DropdownMenuItem>
            )}
            
            {canCompleteQC && (
              <DropdownMenuItem onClick={() => onStatusChange(order.id, "To Be Read")}>
                <ClipboardCheck className="h-4 w-4 mr-2 text-purple-600" />
                Complete QC
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {canRelease && (
              <DropdownMenuItem onClick={() => onStatusChange(order.id, "Released")}>
                <Send className="h-4 w-4 mr-2 text-primary" />
                Release Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Assign {assignRole === "radiologist" ? "Radiologist" : "Technologist"}
            </DialogTitle>
            <DialogDescription>
              Select a {assignRole} to assign to this exam.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label className="text-sm font-medium mb-2 block">
              Select {assignRole === "radiologist" ? "Radiologist" : "Technologist"}
            </Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${assignRole}...`} />
              </SelectTrigger>
              <SelectContent>
                {(assignRole === "radiologist" ? radiologists : technologists).map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    <div className="flex items-center gap-2">
                      <span>{staff.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{staff.role}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubmit} disabled={!selectedStaff}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
