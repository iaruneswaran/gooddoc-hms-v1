import { useState, useMemo, useCallback, useEffect } from "react";
import { Check, ChevronDown, Search, CalendarDays, Plus, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVisit, VisitOption } from "@/contexts/VisitContext";
import { useDebounce } from "@/hooks/useDebounce";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Completed: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  Scheduled: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "In Progress": {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
};

const statusFilters = ["All", "Active", "Scheduled", "Completed"] as const;

export function VisitSelector() {
  const { visits, selectedVisitId, setSelectedVisitId, selectedVisit, isLoading } = useVisit();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const debouncedSearch = useDebounce(searchValue, 250);

  // Filter visits based on search and status
  const filteredVisits = useMemo(() => {
    let result = visits;
    
    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((v) => v.status === statusFilter);
    }
    
    // Search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      result = result.filter((visit) => {
        const visitIdMatch = visit.visitId.toLowerCase().includes(search);
        const doctorMatch = visit.doctor?.toLowerCase().includes(search);
        const dateMatch = format(visit.datetime, "dd-MMM-yyyy").toLowerCase().includes(search);
        const typeMatch = visit.type.toLowerCase().includes(search);
        return visitIdMatch || doctorMatch || dateMatch || typeMatch;
      });
    }
    
    return result;
  }, [visits, debouncedSearch, statusFilter]);

  // Group visits by month/year with active pinned at top
  const groupedVisits = useMemo(() => {
    const sorted = [...filteredVisits].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return b.datetime.getTime() - a.datetime.getTime();
    });

    const groups: Record<string, VisitOption[]> = {};
    const activeVisits: VisitOption[] = [];

    sorted.forEach((visit) => {
      if (visit.isActive) {
        activeVisits.push(visit);
      } else {
        const key = format(visit.datetime, "MMMM yyyy");
        if (!groups[key]) groups[key] = [];
        groups[key].push(visit);
      }
    });

    return { activeVisits, groups };
  }, [filteredVisits]);

  const handleSelect = useCallback(
    (visitId: string) => {
      setSelectedVisitId(visitId);
      setOpen(false);
      setSearchValue("");
      setStatusFilter("All");
    },
    [setSelectedVisitId]
  );

  // Announce selection changes for screen readers
  useEffect(() => {
    if (selectedVisit) {
      const liveRegion = document.getElementById("visit-selector-live");
      if (liveRegion) {
        liveRegion.textContent = `Selected visit ${selectedVisit.visitId}`;
      }
    }
  }, [selectedVisit]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Visit:</span>
        <div className="h-9 w-[300px] animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

  const statusStyle = selectedVisit ? statusConfig[selectedVisit.status] : null;

  return (
    <div className="flex items-center gap-2">
      {/* Screen reader live region */}
      <div id="visit-selector-live" className="sr-only" aria-live="polite" />
      
      <span className="text-sm font-medium text-muted-foreground">Visit:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            aria-label="Select visit"
            aria-haspopup="listbox"
            className={cn(
              "inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border",
              "bg-card hover:bg-accent/50 transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "text-sm"
            )}
          >
            {selectedVisit ? (
              <>
                {/* Visit ID segment */}
                <span className="font-mono font-semibold text-foreground">
                  {selectedVisit.visitId}
                </span>
                
                {/* Separator */}
                <span className="text-border">•</span>
                
                {/* Date segment */}
                <span className="text-muted-foreground">
                  {format(selectedVisit.datetime, "dd-MMM-yyyy")}
                </span>
                
                {/* Separator */}
                <span className="text-border">•</span>
                
                {/* Status badge segment */}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-md border-0",
                    statusStyle?.bg,
                    statusStyle?.text
                  )}
                >
                  {selectedVisit.status}
                </Badge>
              </>
            ) : (
              <span className="text-muted-foreground">Select visit...</span>
            )}
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[480px] p-0 bg-popover border shadow-lg" 
          align="end"
          sideOffset={8}
        >
          {/* Search and Filters Header */}
          <div className="p-3 border-b border-border space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visit by ID, doctor, or date..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
            
            {/* Status Filter Pills */}
            <div className="flex gap-1.5">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Visit List */}
          <ScrollArea className="max-h-[320px]">
            <div className="py-2">
              {/* Empty State */}
              {filteredVisits.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No visits found.
                </div>
              )}

              {/* Active Visits (Pinned) */}
              {groupedVisits.activeVisits.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 sticky top-0">
                    Active Visit
                  </div>
                  {groupedVisits.activeVisits.map((visit) => (
                    <VisitRow
                      key={visit.id}
                      visit={visit}
                      isSelected={selectedVisitId === visit.visitId}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {/* Grouped by Month */}
              {Object.entries(groupedVisits.groups).map(([monthYear, groupVisits]) => (
                <div key={monthYear} className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 sticky top-0">
                    {monthYear}
                  </div>
                  {groupVisits.map((visit) => (
                    <VisitRow
                      key={visit.id}
                      visit={visit}
                      isSelected={selectedVisitId === visit.visitId}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create new visit
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Individual Visit Row Component
function VisitRow({
  visit,
  isSelected,
  onSelect,
}: {
  visit: VisitOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const statusStyle = statusConfig[visit.status] || statusConfig.Completed;

  return (
    <button
      onClick={() => onSelect(visit.visitId)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 text-left",
        "hover:bg-accent/50 transition-colors cursor-pointer",
        isSelected && "bg-accent"
      )}
    >
      {/* Selection Check */}
      <div className="flex-shrink-0 w-5">
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </div>

      {/* Visit Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono font-semibold text-sm text-foreground">
            {visit.visitId}
          </span>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-[10px] font-medium px-1.5 py-0 rounded border-0",
              statusStyle.bg,
              statusStyle.text
            )}
          >
            {visit.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          <span>{format(visit.datetime, "dd MMM yyyy, hh:mm a")}</span>
          {visit.doctor && (
            <>
              <span className="text-border">•</span>
              <Stethoscope className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{visit.doctor}</span>
            </>
          )}
        </div>
      </div>

      {/* Quick Open Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(visit.visitId);
        }}
        className="text-xs text-primary hover:underline font-medium flex-shrink-0"
      >
        Open
      </button>
    </button>
  );
}
