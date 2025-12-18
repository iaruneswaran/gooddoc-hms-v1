import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search, Plus, Trash2, Receipt, User } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useServicesCart } from "@/hooks/useServicesCart";
import { searchServices } from "@/data/services.mock";
import { ServiceCategory } from "@/types/booking/ipAdmission";
import { useDebounce } from "@/hooks/useDebounce";

const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const CATEGORIES: ServiceCategory[] = ['Procedure', 'Nursing', 'Pharmacy', 'Lab', 'Room'];

const PatientServices = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { cart, totals, addToCart, updateQty, removeFromCart } = useServicesCart();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "001",
    age: 44,
    gender: "Male",
  };
  
  const results = useMemo(() => 
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


  const handleGenerateBill = () => {
    // TODO: Navigate to billing or generate invoice
    console.log("Generate bill for:", cart);
    navigate(`/patient-insights/${patientId}/payments`);
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ''}`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={["Patient Insight", "Services"]} />
        
        {/* Header */}
        <div className="h-[80px] bg-background border-b border-border flex-shrink-0 flex items-center justify-between px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">Patient Insight</span>
          </button>

          {/* Patient Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{patient.name}</p>
              <p className="text-xs text-muted-foreground">
                GDID - {patient.gdid} • {patient.age} | {patient.gender.charAt(0)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left Side - Services List */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
            {/* Search & Filters */}
            <div className="p-4 space-y-3 border-b flex-shrink-0">
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
            </div>
            
            {/* Results */}
            <ScrollArea className="flex-1">
              {results.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8">
                  No services found
                </div>
              ) : (
                <div className="divide-y">
                  {results.map((service) => (
                    <div key={service.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{service.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                          <span className="text-xs text-muted-foreground">{service.code}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{formatPrice(service.price)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(service)}
                          className="h-8"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Right Side - Cart Summary */}
          <div className="w-[420px] flex flex-col border rounded-lg overflow-hidden bg-muted/30">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold">Order Summary</h3>
              <p className="text-xs text-muted-foreground">{cart.length} item(s) added</p>
            </div>
            
            <ScrollArea className="flex-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Receipt className="w-10 h-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No services added yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <Card key={item.itemId} className="shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.code}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.itemId)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQty(item.itemId, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              -
                            </Button>
                            <span className="text-sm w-6 text-center">{item.qty}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQty(item.itemId, item.qty + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(item.unitPrice * item.qty)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {/* Totals & Generate Bill */}
            <div className="p-4 border-t bg-background">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(totals.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(totals.netPayable)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                disabled={cart.length === 0}
                onClick={handleGenerateBill}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Generate Bill
              </Button>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default PatientServices;
