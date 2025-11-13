import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Search, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { searchServices } from "@/data/services.mock";
import { useDebounce } from "@/hooks/useDebounce";
import { formatINR } from "@/utils/currency";

interface ClaimStepServicesProps {
  data: any;
  onChange: (data: any) => void;
  errors: string[];
}

const CATEGORIES = ['Procedure', 'Nursing', 'Pharmacy', 'Lab', 'Room'];

export function ClaimStepServices({ data, onChange, errors }: ClaimStepServicesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const services = data.services || [];
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const searchResults = useMemo(() => 
    searchServices(debouncedSearch, selectedCategories),
    [debouncedSearch, selectedCategories]
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const addService = (service: any) => {
    const taxAmount = Math.round(service.price * (service.taxPct || 0) / 100);
    onChange({
      ...data,
      services: [
        ...services,
        {
          id: `${service.id}-${Date.now()}`,
          type: service.category,
          description: service.name,
          code: service.code,
          units: 1,
          unitCost: service.price * 100, // Convert to paise
          tax: taxAmount * 100, // Convert to paise
          discount: 0,
          total: (service.price + taxAmount) * 100, // Convert to paise
        },
      ],
    });
  };

  const updateService = (index: number, field: string, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };

    // Recalculate total
    const { units, unitCost, tax, discount } = updatedServices[index];
    const subtotal = units * unitCost;
    const total = subtotal + tax - discount;
    updatedServices[index].total = total;

    onChange({ ...data, services: updatedServices });
  };

  const removeService = (index: number) => {
    onChange({
      ...data,
      services: services.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Search Services</h2>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services/procedures by name or code…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          {/* Search Results */}
          <div className="border rounded-lg">
            <ScrollArea className="h-[300px]">
              {searchResults.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  No services found
                </div>
              ) : (
                <div className="divide-y">
                  {searchResults.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium truncate">{service.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{service.code}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-4">
                        <p className="text-sm font-semibold">{formatINR(service.price * 100)}</p>
                        
                        <Button
                          size="sm"
                          onClick={() => addService(service)}
                          className="h-8 px-3"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </Card>

      {/* Added Services */}
      {services.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Services & Procedures</h2>
          
          <div className="space-y-2">
            {services.map((service: any, index: number) => (
              <div key={service.id} className="flex justify-between items-center gap-3 py-2 group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{service.description}</p>
                  <button
                    onClick={() => removeService(index)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {/* Units editor */}
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      value={service.units}
                      onChange={(e) => updateService(index, "units", Number(e.target.value))}
                      className="h-7 w-14 text-xs text-center"
                      min="1"
                    />
                    <span className="text-xs text-muted-foreground">×</span>
                  </div>
                  
                  {/* Price editor */}
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={(service.unitCost / 100).toFixed(2)}
                      onChange={(e) => updateService(index, "unitCost", Math.round(Number(e.target.value) * 100))}
                      className="h-7 w-24 text-sm text-right font-semibold"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Total */}
                  <div className="w-24 text-right">
                    <p className="text-sm font-semibold">{formatINR(service.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
