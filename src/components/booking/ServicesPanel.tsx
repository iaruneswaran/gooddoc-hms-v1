import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ServiceItem, CartItem } from "@/types/booking/ipAdmission";
import { searchServices } from "@/data/services.mock";
import { ServiceRow } from "./ServiceRow";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";

interface ServicesPanelProps {
  cart: CartItem[];
  onAddToCart: (service: ServiceItem) => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateDiscount: (itemId: string, discountPct: number) => void;
  onRemoveFromCart: (itemId: string) => void;
}

export function ServicesPanel({
  cart,
  onAddToCart,
  onUpdateQty,
  onUpdateDiscount,
  onRemoveFromCart,
}: ServicesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const results = useMemo(() => 
    searchServices(debouncedSearch),
    [debouncedSearch]
  );
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services by name or code…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Results */}
      <div className="max-h-[340px] overflow-y-auto border rounded-lg">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            No services found
          </div>
        ) : (
          <div className="divide-y">
            {results.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
