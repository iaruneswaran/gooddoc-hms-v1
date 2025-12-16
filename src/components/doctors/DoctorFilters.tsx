import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";

interface DoctorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function DoctorFilters({ search, onSearchChange }: DoctorFiltersProps) {
  const [filters, setFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Filter Controls and Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
        <Select onValueChange={(val) => addFilter(`Department: ${val}`)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="endocrinology">Endocrinology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => addFilter(`Specialty: ${val}`)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="interventional">Interventional Cardiology</SelectItem>
            <SelectItem value="diabetes">Diabetes & Metabolism</SelectItem>
            <SelectItem value="joint">Joint Replacement</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => addFilter(`Availability: ${val}`)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="next-3-days">Next 3 days</SelectItem>
            <SelectItem value="on-leave">On leave</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => addFilter(`Status: ${val}`)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => addFilter(`Mode: ${val}`)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-person">In-person</SelectItem>
            <SelectItem value="telemedicine">Telemedicine</SelectItem>
          </SelectContent>
        </Select>

        </div>

        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, department, specialty, location"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Applied Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {filter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
