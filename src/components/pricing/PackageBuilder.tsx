import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Search, Plus, Minus, Trash2, AlertTriangle } from "lucide-react";
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
import { formatINR } from "@/utils/currency";

// Helper to format rupees (not paise)
const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export function PackageBuilder() {
  const { watch, setValue } = useFormContext<PricingItemFormData>();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  const inclusions = watch("attributes.inclusions") || [];
  const priceMode = watch("attributes.priceMode") || "bundled";
  const exclusionNotes = watch("attributes.exclusionNotes") || "";
  
  const { data: searchResults, isLoading } = useCatalogSearch(searchQuery, categoryFilter);
  
  // Get categories excluding Package
  const availableCategories = Object.keys(CATEGORY_CONFIG).filter(c => c !== "Package");
  
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
  
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold mb-4">Package Components</h3>
      
      {/* Search and Filter */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items to add..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {availableCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Search Results */}
      {searchQuery && (
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Search Results ({searchResults?.length || 0})
          </Label>
          <ScrollArea className="h-[200px] border rounded-md">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : searchResults?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No items found</div>
            ) : (
              <div className="p-2 space-y-1">
                {searchResults?.map((item) => {
                  const isAdded = hasDuplicates(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded-md hover:bg-muted/50 ${
                        isAdded ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px]">
                            {item.internalCode}
                          </Badge>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {formatCurrency(item.unitPrice)}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant={isAdded ? "secondary" : "outline"}
                          disabled={isAdded}
                          onClick={() => handleAddComponent(item)}
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
      )}
      
      {/* Selected Components */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground mb-2 block">
          Package Inclusions ({inclusions.length} items)
        </Label>
        
        {inclusions.length === 0 ? (
          <div className="border border-dashed rounded-md p-6 text-center text-muted-foreground">
            <p className="text-sm">No components added yet</p>
            <p className="text-xs mt-1">Search and add items above to build your package</p>
          </div>
        ) : (
          <ScrollArea className="h-[250px] border rounded-md">
            <div className="p-2 space-y-2">
              {inclusions.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.itemName}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.itemId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.itemId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Price */}
                    <span className="text-sm font-medium w-20 text-right">
                      {formatCurrency((item.unitPrice || 0) * item.quantity)}
                    </span>
                    
                    {/* Remove */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveComponent(item.itemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {/* Component Total */}
        {inclusions.length > 0 && (
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Components Total</span>
            <span className="text-lg font-semibold">{formatCurrency(componentTotal)}</span>
          </div>
        )}
      </div>
      
      {/* Price Mode */}
      <div className="mb-4">
        <Label className="mb-2 block">Price Mode</Label>
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
                    ? "Show single package price; hide component prices in billing"
                    : "Show component prices; package may apply a discount"}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Warnings */}
      {inclusions.length > 0 && priceMode === "bundled" && (
        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-md mb-4">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs text-warning-foreground">
            <p className="font-medium">Bundled Pricing</p>
            <p className="mt-0.5 text-muted-foreground">
              Set the final package price in the Pricing step. Component prices will be hidden from patients.
            </p>
          </div>
        </div>
      )}
      
      {/* Exclusion Notes */}
      <div>
        <Label htmlFor="exclusion-notes">Notes / Exclusions</Label>
        <Textarea
          id="exclusion-notes"
          value={exclusionNotes}
          onChange={(e) => setValue("attributes.exclusionNotes", e.target.value)}
          placeholder="e.g., Does not include confirmatory tests, Additional charges for contrast"
          className="mt-1"
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Important notes about what's not included or conditions
        </p>
      </div>
    </Card>
  );
}
