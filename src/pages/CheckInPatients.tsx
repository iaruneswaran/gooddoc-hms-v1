import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { bedsAvailability, icuBeds, wardBeds, roomBeds, BedRecord } from "@/data/overview.mock";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, MoreHorizontal } from "lucide-react";
import { useSidebarContext } from "@/contexts/SidebarContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";

const statusStyles: Record<BedRecord["status"], string> = {
  "Available": "bg-green-100 text-green-700",
  "Cleaning": "bg-amber-100 text-amber-700",
  "Reserved": "bg-blue-100 text-blue-700",
  "Blocked": "bg-red-100 text-red-700",
};

const BedsAvailability = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bedType = searchParams.get("bedType");
  const { isCollapsed } = useSidebarContext();
  const [statusFilter, setStatusFilter] = useState("all");

  let data = bedsAvailability;
  let displayCount = bedsAvailability.length;
  let pageTitle = "Beds Availability";

  if (bedType === "icu") {
    data = icuBeds;
    displayCount = icuBeds.length;
    pageTitle = "ICU Beds";
  } else if (bedType === "ward") {
    data = wardBeds;
    displayCount = wardBeds.length;
    pageTitle = "Ward Beds";
  } else if (bedType === "rooms") {
    data = roomBeds;
    displayCount = roomBeds.length;
    pageTitle = "Private/Isolation Rooms";
  }

  // Apply status filter
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter(bed => bed.status === statusFilter);
  }, [data, statusFilter]);

  // Group beds by ward
  const groupedBeds = useMemo(() => {
    const groups: Record<string, BedRecord[]> = {};
    filteredData.forEach(bed => {
      if (!groups[bed.ward]) {
        groups[bed.ward] = [];
      }
      groups[bed.ward].push(bed);
    });
    // Sort wards: ICU first, then HDU, then others alphabetically
    const wardOrder = ["ICU", "HDU", "Private Wing", "Isolation"];
    return Object.entries(groups).sort(([a], [b]) => {
      const aIndex = wardOrder.indexOf(a);
      const bIndex = wardOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [filteredData]);

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${isCollapsed ? "ml-[60px]" : "ml-[220px]"}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/overview")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-xs text-muted-foreground">Overview/{pageTitle}</div>
              <div className="flex items-center gap-3">
                <h1 className="text-h3 font-semibold">{pageTitle}</h1>
                <span className="text-muted-foreground">{filteredData.length}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print List
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {groupedBeds.map(([wardName, beds]) => (
          <div key={wardName} className="space-y-3">
            {/* Ward Header */}
            <div className="flex items-center gap-2">
              <h2 className="text-label font-semibold text-foreground">{wardName}</h2>
              <span className="text-xs text-muted-foreground">({beds.length} beds)</span>
            </div>

            {/* Beds Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Bed</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Last Discharged At</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Cleaning ETA</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Isolation Capable</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground">Reserved For</th>
                    <th className="px-4 py-3 text-label font-medium text-muted-foreground w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {beds.map((bed) => (
                    <tr key={`${bed.ward}-${bed.room}-${bed.bed}`} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="text-small font-medium">Bed {bed.bed}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusStyles[bed.status]}>{bed.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {bed.lastDischargedAt ? (
                          <div className="flex flex-col">
                            <span className="text-small">{bed.lastDischargedAt.split(' ')[1]}</span>
                            <span className="text-caption text-muted-foreground">{bed.lastDischargedAt.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {bed.cleaningETA ? (
                          <span className="text-small">{bed.cleaningETA}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {bed.isolationCapability ? (
                          <Badge className="bg-green-100 text-green-700">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-small">{bed.reservedFor || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Reserve Bed</DropdownMenuItem>
                            <DropdownMenuItem>Mark Cleaning</DropdownMenuItem>
                            <DropdownMenuItem>Block Bed</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {groupedBeds.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No beds found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default BedsAvailability;
