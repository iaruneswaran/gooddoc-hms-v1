import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X, Save, Share2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

export function GlobalFilterBar() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("last-30");
  const [direction, setDirection] = useState("both");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const applyFilters = () => {
    const filters = [];
    if (dateRange !== "all") filters.push(`Date: ${dateRange}`);
    if (direction !== "both") filters.push(`Direction: ${direction}`);
    if (category !== "all") filters.push(`Category: ${category}`);
    if (status !== "all") filters.push(`Status: ${status}`);
    if (searchId) filters.push(`ID: ${searchId}`);
    setActiveFilters(filters);
  };

  const clearAllFilters = () => {
    setDateRange("last-30");
    setDirection("both");
    setCategory("all");
    setStatus("all");
    setSearchId("");
    setActiveFilters([]);
    toast({
      title: "Filters cleared",
      description: "All filters have been reset.",
    });
  };

  const saveView = () => {
    toast({
      title: "View saved",
      description: "You can access it from Saved Views.",
    });
  };

  const shareView = () => {
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    });
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7">Last 7 Days</SelectItem>
                  <SelectItem value="last-30">Last 30 Days</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Both</SelectItem>
            <SelectItem value="inflow">Inflows</SelectItem>
            <SelectItem value="outflow">Outflows</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="patient-payments">Patient Payments</SelectItem>
            <SelectItem value="insurance">Insurance Remittances</SelectItem>
            <SelectItem value="pharmacy">Pharmacy Sales</SelectItem>
            <SelectItem value="lab">Lab Services</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="vendor">Vendor Payments</SelectItem>
            <SelectItem value="payroll">Payroll</SelectItem>
            <SelectItem value="refunds">Refunds</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partially Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
            <SelectItem value="voided">Voided</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by invoice, claim, patient, vendor, or ref ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-80"
        />

        <Button onClick={applyFilters} className="gap-2">
          <Filter className="w-4 h-4" />
          Apply
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveView} className="gap-2">
            <Save className="w-4 h-4" />
            Save View
          </Button>
          <Button variant="outline" size="sm" onClick={shareView} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-2">
              {filter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
