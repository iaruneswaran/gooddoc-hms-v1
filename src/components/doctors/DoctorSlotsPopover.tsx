import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, User, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotInfo {
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "blocked" | "completed";
  patientName?: string;
}

interface DoctorSlotsPopoverProps {
  doctorName: string;
  totalSlots: number;
  completedSlots: number;
}

// Generate mock slots for a doctor
const generateMockSlots = (total: number, completed: number): SlotInfo[] => {
  const slots: SlotInfo[] = [];
  const patientNames = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", 
    "Rajesh Singh", "Meera Joshi", "Vikram Rao", "Anita Gupta",
    "Suresh Menon", "Kavita Nair"
  ];
  
  let hour = 8;
  let minute = 0;
  
  for (let i = 0; i < total; i++) {
    const startHour = hour;
    const startMinute = minute;
    
    // Advance by 30 minutes
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
    
    const formatTime = (h: number, m: number) => {
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
    };
    
    let status: SlotInfo["status"];
    let patientName: string | undefined;
    
    if (i < completed) {
      status = "completed";
      patientName = patientNames[i % patientNames.length];
    } else if (i < completed + Math.floor((total - completed) * 0.6)) {
      status = "booked";
      patientName = patientNames[(i + 3) % patientNames.length];
    } else if (i === total - 1 && Math.random() > 0.5) {
      status = "blocked";
    } else {
      status = "available";
    }
    
    slots.push({
      startTime: formatTime(startHour, startMinute),
      endTime: formatTime(hour, minute),
      status,
      patientName,
    });
  }
  
  return slots;
};

const statusConfig = {
  available: { 
    label: "Available", 
    className: "bg-green-50 border-green-200 text-green-700",
    dotColor: "bg-green-500"
  },
  booked: { 
    label: "Booked", 
    className: "bg-blue-50 border-blue-200 text-blue-700",
    dotColor: "bg-blue-500"
  },
  blocked: { 
    label: "Blocked", 
    className: "bg-gray-50 border-gray-200 text-gray-500",
    dotColor: "bg-gray-400"
  },
  completed: { 
    label: "Completed", 
    className: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dotColor: "bg-emerald-500"
  },
};

export function DoctorSlotsPopover({ 
  doctorName, 
  totalSlots, 
  completedSlots 
}: DoctorSlotsPopoverProps) {
  const [filter, setFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  
  const slots = generateMockSlots(totalSlots, completedSlots);
  
  const filteredSlots = filter === "all" 
    ? slots 
    : slots.filter(slot => slot.status === filter);
  
  const slotCounts = {
    available: slots.filter(s => s.status === "available").length,
    booked: slots.filter(s => s.status === "booked").length,
    completed: slots.filter(s => s.status === "completed").length,
    blocked: slots.filter(s => s.status === "blocked").length,
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Badge 
          className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {completedSlots}/{totalSlots} Completed
        </Badge>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 bg-popover border shadow-lg z-50" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Today's Slots</span>
            </div>
            <span className="text-xs text-muted-foreground">{doctorName}</span>
          </div>
          
          {/* Summary chips */}
          <div className="flex gap-2 flex-wrap mb-3">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {slotCounts.available} Available
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {slotCounts.booked} Booked
            </Badge>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
              {slotCounts.completed} Completed
            </Badge>
            {slotCounts.blocked > 0 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                {slotCounts.blocked} Blocked
              </Badge>
            )}
          </div>
          
          {/* Filter dropdown */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Filter slots" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-[60]">
              <SelectItem value="all">All Slots ({slots.length})</SelectItem>
              <SelectItem value="available">Available ({slotCounts.available})</SelectItem>
              <SelectItem value="booked">Booked ({slotCounts.booked})</SelectItem>
              <SelectItem value="completed">Completed ({slotCounts.completed})</SelectItem>
              <SelectItem value="blocked">Blocked ({slotCounts.blocked})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Slots list */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No slots match the selected filter
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredSlots.map((slot, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-md border transition-colors",
                    statusConfig[slot.status].className
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", statusConfig[slot.status].dotColor)} />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {slot.patientName && (
                      <div className="flex items-center gap-1 text-xs">
                        <User className="w-3 h-3" />
                        <span className="max-w-[100px] truncate">{slot.patientName}</span>
                      </div>
                    )}
                    {slot.status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {slot.status === "blocked" && (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t bg-muted/20">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}