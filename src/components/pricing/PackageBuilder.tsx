import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Search, Plus, X, Package, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PricingItemFormData, PackageComponent } from "@/types/pricing-item";
import { useCatalogSearch, CatalogItem } from "@/api/pricingApi";
import { CATEGORY_CONFIG, PRICE_MODES, PricingCategory } from "@/config/pricing-categories";

// Helper to format rupees
const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

// Get departments for a category
const getDepartmentsForCategory = (category: string): string[] => {
  if (category === "All" || !category) return [];
  const config = CATEGORY_CONFIG[category as PricingCategory];
  return config?.departments || [];
};

export function PackageBuilder() {
  const { watch, setValue } = useFormContext<PricingItemFormData>();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  
  const inclusions = watch("attributes.inclusions") || [];
  const priceMode = watch("attributes.priceMode") || "bundled";
  const exclusionNotes = watch("attributes.exclusionNotes") || "";
  
  // Combine category and department for search
  const searchFilter = departmentFilter !== "All" ? departmentFilter : categoryFilter;
  const { data: searchResults, isLoading } = useCatalogSearch(searchQuery, searchFilter);
  
  // Get categories excluding Package
  const availableCategories = Object.keys(CATEGORY_CONFIG).filter(c => c !== "Package");
  
  // Get departments based on selected category
  const availableDepartments = getDepartmentsForCategory(categoryFilter);
  
  // Calculate total from components
  const componentTotal = inclusions.reduce((sum, item) => {
    return sum + (item.unitPrice || 0) * item.quantity;
  }, 0);
  
  // Check for duplicates
  const hasDuplicates = (itemId: string) => {
    return inclusions.some(inc => inc.itemId === itemId);
  };
  
  const handleAddComponent = (item: CatalogItem) => {
    if (hasDuplicates(item.id)) return;
    
    const newComponent: PackageComponent = {
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      quantity: 1,
      unitPrice: item.unitPrice,
    };
    
    setValue("attributes.inclusions", [...inclusions, newComponent]);
  };
  
  const handleRemoveComponent = (itemId: string) => {
    setValue(
      "attributes.inclusions",
      inclusions.filter(inc => inc.itemId !== itemId)
    );
  };
  
  const handleQuantityChange = (itemId: string, delta: number) => {
    setValue(
      "attributes.inclusions",
      inclusions.map(inc => {
        if (inc.itemId === itemId) {
          const newQty = Math.max(1, inc.quantity + delta);
          return { ...inc, quantity: newQty };
        }
        return inc;
      })
    );
  };

  // Reset department when category changes
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setDepartmentFilter("All");
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Package className="h-4 w-4" />
        Package Components
      </h3>
      
      {/* Split Layout: Left (Search) | Right (Selected) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Search & Filter */}
        <div className="space-y-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Search & Add Items
          </div>
          
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          
          {/* Search Results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                {searchQuery ? `Results (${searchResults?.length || 0})` : "Start typing to search"}
              </Label>
            </div>
            
            <ScrollArea className="h-[320px] border rounded-md bg-muted/20">
              {!searchQuery ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Search for items to add</p>
                  <p className="text-xs mt-1">Filter by category and department first</p>
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm">Searching...</p>
                </div>
              ) : searchResults?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No items found</p>
                  <p className="text-xs mt-1">Try different keywords or filters</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {searchResults?.map((item) => {
                    const isAdded = hasDuplicates(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-md border bg-background hover:border-primary/50 transition-colors ${
                          isAdded ? "opacity-50 border-muted" : "border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {item.internalCode}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {item.category} • {item.department}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-medium text-muted-foreground">
                            {formatCurrency(item.unitPrice)}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant={isAdded ? "secondary" : "default"}
                            disabled={isAdded}
                            onClick={() => handleAddComponent(item)}
                            className="h-7 px-2"
                          >
                            {isAdded ? "Added" : <Plus className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        {/* Right Panel - Selected Items */}
        <div className="space-y-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Selected Items
          </div>
          
          {/* Selected Items as Tags */}
          {inclusions.length === 0 ? (
            <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground h-[200px] flex flex-col items-center justify-center">
              <Package className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No items added yet</p>
              <p className="text-xs mt-1">Search and add items from the left panel</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border rounded-md bg-muted/20">
              {inclusions.map((item) => (
                <Badge
                  key={item.itemId}
                  variant="secondary"
                  className="h-7 pl-3 pr-1.5 gap-1.5 text-sm font-normal"
                >
                  {item.itemName}
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(item.itemId)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Section: Price Mode & Notes - Fixed at bottom */}
      <div className="sticky bottom-0 bg-background grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t">
        {/* Price Mode */}
        <div>
          <Label className="mb-3 block">Price Mode</Label>
          <RadioGroup
            value={priceMode}
            onValueChange={(value) => setValue("attributes.priceMode", value as "bundled" | "itemized")}
            className="space-y-2"
          >
            {PRICE_MODES.map((mode) => (
              <div key={mode.value} className="flex items-start space-x-3">
                <RadioGroupItem value={mode.value} id={`price-mode-${mode.value}`} className="mt-0.5" />
                <div>
                  <Label htmlFor={`price-mode-${mode.value}`} className="font-normal cursor-pointer">
                    {mode.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {mode.value === "bundled"
                      ? "Single package price; hide component prices"
                      : "Show component prices; apply package discount"}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {/* Bundled Warning */}
          {inclusions.length > 0 && priceMode === "bundled" && (
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-md mt-3">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Set the final package price in the Pricing step.
              </p>
            </div>
          )}
        </div>
        
        {/* Exclusion Notes */}
        <div>
          <Label htmlFor="exclusion-notes" className="mb-3 block">Notes / Exclusions</Label>
          <Textarea
            id="exclusion-notes"
            value={exclusionNotes}
            onChange={(e) => setValue("attributes.exclusionNotes", e.target.value)}
            placeholder="e.g., Does not include confirmatory tests, Additional charges for contrast"
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Important notes about what's not included
          </p>
        </div>
      </div>
    </Card>
  );
}
