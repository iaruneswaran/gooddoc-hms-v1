import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  ChevronLeft, Search, Plus, Minus, Trash2, Receipt, User, 
  Stethoscope, FlaskConical, ScanLine, Pill, HeartPulse, BedDouble, 
  UserRound, Package, Clock, FileText, AlertCircle, CheckCircle2
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServicesCart } from "@/hooks/useServicesCart";
import { searchServices, SERVICE_CATEGORIES, getSubCategories, getServicesByCategory } from "@/data/services.mock";
import { ServiceCategory } from "@/types/booking/ipAdmission";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Procedure': return Stethoscope;
    case 'Lab': return FlaskConical;
    case 'Radiology': return ScanLine;
    case 'Pharmacy': return Pill;
    case 'Nursing': return HeartPulse;
    case 'Room': return BedDouble;
    case 'Consultation': return UserRound;
    default: return Package;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Procedure': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'Lab': return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'Radiology': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'Pharmacy': return 'bg-green-500/10 text-green-600 border-green-200';
    case 'Nursing': return 'bg-pink-500/10 text-pink-600 border-pink-200';
    case 'Room': return 'bg-cyan-500/10 text-cyan-600 border-cyan-200';
    case 'Consultation': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

const PatientServices = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const { cart, totals, addToCart, updateQty, removeFromCart } = useServicesCart();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "GDID-001",
    age: 44,
    gender: "Male",
    admissionDate: "18 Dec 2025",
    ward: "Cardiology Ward",
    bed: "Bed 12A",
    doctor: "Dr. Arun Kumar",
  };

  const subCategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    return getSubCategories(selectedCategory);
  }, [selectedCategory]);
  
  const results = useMemo(() => {
    const categoryFilter = selectedCategory === "all" ? [] : [selectedCategory];
    let filtered = searchServices(debouncedSearch, categoryFilter);
    
    if (selectedSubCategory !== "all" && selectedSubCategory) {
      filtered = filtered.filter(s => s.subCategory === selectedSubCategory);
    }
    
    return filtered;
  }, [debouncedSearch, selectedCategory, selectedSubCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory("all");
  };

  const handleGenerateBill = () => {
    console.log("Generate bill for:", cart);
    navigate(`/patient-insights/${patientId}/payments`);
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ''}`);
  };

  const isInCart = (serviceId: string) => cart.some(item => item.itemId === serviceId);
  const getCartItem = (serviceId: string) => cart.find(item => item.itemId === serviceId);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={["Patient Services", "Add Services"]} />
        
        {/* Compact Header */}
        <div className="h-[72px] bg-background border-b border-border flex-shrink-0 flex items-center justify-between px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Patient</span>
          </button>

          {/* Patient Info Card */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                <p className="text-xs text-muted-foreground">{patient.gdid} • {patient.age}Y / {patient.gender.charAt(0)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Category Sidebar */}
          <div className="w-[200px] border-r border-border bg-muted/30 flex flex-col">
            <div className="p-3 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    selectedCategory === "all" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Package className="w-4 h-4" />
                  All Services
                </button>
                {SERVICE_CATEGORIES
                  .filter((cat) => !['Lab', 'Radiology', 'Pharmacy'].includes(cat.id))
                  .map((cat) => {
                  const Icon = getCategoryIcon(cat.id);
                  const count = getServicesByCategory(cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        selectedCategory === cat.id 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{cat.name}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        selectedCategory === cat.id 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Center - Services List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Sub-category Filters */}
            <div className="p-4 space-y-3 border-b border-border flex-shrink-0 bg-background">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service name, code, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              
              {/* Sub-category Pills */}
              {subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedSubCategory === "all" ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => setSelectedSubCategory("all")}
                  >
                    All
                  </Badge>
                  {subCategories.map((sub) => (
                    <Badge
                      key={sub}
                      variant={selectedSubCategory === sub ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => setSelectedSubCategory(sub)}
                    >
                      {sub}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Results Header */}
            <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{results.length}</span> services
                {selectedCategory !== "all" && (
                  <> in <span className="font-medium text-foreground">{selectedCategory}</span></>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Prices as of today
              </div>
            </div>

            {/* Results List */}
            <ScrollArea className="flex-1">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground">No services found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {results.map((service) => {
                    const inCart = isInCart(service.id);
                    const cartItem = getCartItem(service.id);
                    const Icon = getCategoryIcon(service.category);
                    
                    return (
                      <div 
                        key={service.id} 
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 transition-colors",
                          inCart ? "bg-primary/5" : "hover:bg-muted/50"
                        )}
                      >
                        {/* Service Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center border",
                          getCategoryColor(service.category)
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                            {inCart && (
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {service.code}
                            </span>
                            {service.subCategory && (
                              <span className="text-xs text-muted-foreground">{service.subCategory}</span>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">{service.description}</p>
                          )}
                        </div>
                        
                        {/* Price & Actions */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{formatPrice(service.price)}</p>
                            {service.taxPct > 0 && (
                              <p className="text-xs text-muted-foreground">+{service.taxPct}% GST</p>
                            )}
                          </div>
                          
                          {inCart && cartItem ? (
                            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (cartItem.qty === 1) {
                                    removeFromCart(cartItem.itemId);
                                  } else {
                                    updateQty(cartItem.itemId, cartItem.qty - 1);
                                  }
                                }}
                              >
                                {cartItem.qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-destructive" /> : <Minus className="w-3.5 h-3.5" />}
                              </Button>
                              <span className="text-sm font-semibold w-8 text-center">{cartItem.qty}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => updateQty(cartItem.itemId, cartItem.qty + 1)}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(service)}
                              className="h-8 gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Right Side - Order Summary */}
          <div className="w-[450px] border-l border-border flex flex-col bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border bg-primary">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-primary-foreground">Order Summary</h3>
                  <p className="text-xs text-primary-foreground/80 mt-0.5">{cart.length} item(s) • {patient.gdid}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            {/* Cart Items */}
            <ScrollArea className="flex-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No services added</p>
                  <p className="text-xs text-muted-foreground mt-1">Select services from the catalog to add them to the bill</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {cart.map((item) => {
                    const Icon = getCategoryIcon(item.category);
                    return (
                      <Card key={item.itemId} className="shadow-sm border-border">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border",
                              getCategoryColor(item.category)
                            )}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.code}</p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                                  onClick={() => removeFromCart(item.itemId)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 bg-muted rounded p-0.5">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => updateQty(item.itemId, item.qty - 1)}
                                    disabled={item.qty <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-xs font-medium w-6 text-center">{item.qty}</span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => updateQty(item.itemId, item.qty + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold">
                                    {formatPrice(item.unitPrice * item.qty)}
                                  </span>
                                  {item.qty > 1 && (
                                    <p className="text-xs text-muted-foreground">
                                      {formatPrice(item.unitPrice)} × {item.qty}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
            
            {/* Totals & Actions */}
            <div className="p-4 border-t border-border bg-background">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-green-600">- {formatPrice(totals.discountTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST)</span>
                  <span className="font-medium">{formatPrice(totals.taxTotal)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-base font-semibold">Total Amount</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(totals.netPayable)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full h-11" 
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={handleGenerateBill}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Bill
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={cart.length === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default PatientServices;
