import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  ChevronLeft, Search, Plus, 
  Stethoscope, FlaskConical, ScanLine, Pill, HeartPulse, BedDouble, 
  UserRound, Package, Clock, AlertCircle, CheckCircle2,
  Square, CheckSquare, ShoppingCart
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useUndoableCart } from "@/hooks/useUndoableCart";
import { searchServices, SERVICE_CATEGORIES, getSubCategories, getServicesByCategory } from "@/data/services.mock";
import { getPendingServicesForPatient } from "@/data/pending-services.mock";
import { getPendingBedChargesForPatient } from "@/data/pending-bed-charges.mock";
import { getTransferHistoryForPatient } from "@/data/transfer-history.mock";
import { ServiceItem } from "@/types/booking/ipAdmission";
import { useDebounce } from "@/hooks/useDebounce";
import { RoomBedTab, ServiceCatalogRow, OrderSummaryPanel } from "@/components/services";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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

type ViewMode = 'pending' | 'catalog';

const PatientServices = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [selectedPendingIds, setSelectedPendingIds] = useState<Set<string>>(new Set());
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const { cart, totals, globalDiscountAmt, addToCart, updateQty, updateDiscount, updateAddedAt, removeFromCart, updateGlobalDiscount } = useUndoableCart();
  
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

  // Get pending services and bed charges
  const pendingServices = useMemo(() => {
    return getPendingServicesForPatient(patientId || '');
  }, [patientId]);

  // Get pending bed charges from transfers
  const pendingBedCharges = useMemo(() => {
    return getPendingBedChargesForPatient(patientId || '');
  }, [patientId]);

  // Combined pending items count
  const totalPendingCount = pendingServices.length + pendingBedCharges.length;

  // Get transfer count for Room category
  const transferHistory = useMemo(() => {
    return getTransferHistoryForPatient(patientId || '');
  }, [patientId]);
  const transferCount = transferHistory.length;
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

  const handleGenerateBill = async () => {
    setIsGeneratingBill(true);
    console.log("Generate bill for:", cart);
    // Simulate bill generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGeneratingBill(false);
    navigate(`/patient-insights/${patientId}?tab=collect-payment`);
  };

  const handleBack = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ''}`);
  };

  const isInCart = (serviceId: string) => cart.some(item => item.itemId === serviceId);
  const getCartItem = (serviceId: string) => cart.find(item => item.itemId === serviceId);

  // Pending services selection handlers
  const togglePendingSelection = (id: string) => {
    setSelectedPendingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllPending = () => {
    const allIds = [
      ...pendingServices.map(s => s.id),
      ...pendingBedCharges.map(bc => bc.id)
    ];
    if (selectedPendingIds.size === allIds.length) {
      setSelectedPendingIds(new Set());
    } else {
      setSelectedPendingIds(new Set(allIds));
    }
  };

  const addSelectedToCart = () => {
    // Add pending services
    pendingServices
      .filter(ps => selectedPendingIds.has(ps.id))
      .forEach(ps => {
        // Add with quantity from pending service
        for (let i = 0; i < ps.quantity; i++) {
          if (!isInCart(ps.service.id) || i > 0) {
            addToCart(ps.service);
          } else {
            const cartItem = getCartItem(ps.service.id);
            if (cartItem) {
              updateQty(cartItem.itemId, cartItem.qty + 1);
            }
          }
        }
      });
    
    // Add bed charges as Room services
    pendingBedCharges
      .filter(bc => selectedPendingIds.has(bc.id))
      .forEach(bc => {
        const bedService: ServiceItem = {
          id: bc.id,
          code: `BED-${bc.fromBedName}`,
          name: `Bed Charges - ${bc.fromBedName} (${bc.daysStayed} days)`,
          category: 'Room',
          subCategory: 'Bed Transfer',
          price: bc.totalAmount,
          taxPct: bc.taxPct,
          description: `${bc.fromUnitName} • ${bc.fromRoomName} • ₹${bc.fromTariff.toLocaleString('en-IN')}/day × ${bc.daysStayed} days`,
        };
        addToCart(bedService);
      });
    
    setSelectedPendingIds(new Set());
  };

  const allSelected = totalPendingCount > 0 && selectedPendingIds.size === totalPendingCount;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={["Patient Services", "Add Services"]} />
        
        {/* Compact Header */}
        <div className="h-[72px] bg-background border-b border-border flex-shrink-0 flex items-center px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Patient</span>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - View Mode & Category Sidebar */}
          <div className="w-[220px] border-r border-border bg-muted/30 flex flex-col">
            {/* View Mode Toggle */}
            <div className="p-4 border-b border-border">
              <div className="flex bg-muted/60 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode('catalog')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all",
                    viewMode === 'catalog'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Catalog
                </button>
                <button
                  onClick={() => setViewMode('pending')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all",
                    viewMode === 'pending'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Pending
                  {totalPendingCount > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
                      {totalPendingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {viewMode === 'catalog' && (
              <>
                <div className="p-2 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider">Categories</p>
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
                      // For Room category, show transfer count in red; otherwise show service count
                      const isRoom = cat.id === 'Room';
                      const count = isRoom ? transferCount : getServicesByCategory(cat.id).length;
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
                            "min-w-[22px] h-[22px] flex items-center justify-center rounded-full text-[11px] font-medium",
                            isRoom 
                              ? "bg-destructive/10 text-destructive"
                              : selectedCategory === cat.id 
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
              </>
            )}

            {viewMode === 'pending' && (
              <div className="flex-1 flex flex-col p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Services performed by nursing staff that need to be billed.
                </p>
                <div className="mt-auto pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setViewMode('catalog')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add from Catalog
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Center - Services List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Show Room & Bed transfer history when Room category is selected */}
            {viewMode === 'catalog' && selectedCategory === 'Room' ? (
              <RoomBedTab
                patientId={patientId || ''}
                onAddToCart={addToCart}
                isInCart={isInCart}
              />
            ) : viewMode === 'pending' ? (
              <>
                {/* Pending Services Header */}
                <div className="p-4 border-b border-border bg-background flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={selectAllPending}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {allSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                    </button>
                    {selectedPendingIds.size > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedPendingIds.size} selected
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={addSelectedToCart} 
                    className="h-10 gap-1.5"
                    disabled={!allSelected || totalPendingCount === 0}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Bill ({selectedPendingIds.size})
                  </Button>
                </div>

                {/* Pending Services List */}
                <ScrollArea className="flex-1">
                  {totalPendingCount === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <CheckCircle2 className="w-12 h-12 text-primary/50 mb-3" />
                      <p className="text-sm font-medium text-foreground">No pending services</p>
                      <p className="text-xs text-muted-foreground mt-1">All services have been billed</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setViewMode('catalog')}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Services from Catalog
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {/* Pending Services Section */}
                      {pendingServices.length > 0 && (
                        <>
                          {pendingServices.map((ps) => {
                            const isSelected = selectedPendingIds.has(ps.id);
                            const inCart = isInCart(ps.service.id);
                            
                            return (
                              <div 
                                key={ps.id}
                                onClick={() => togglePendingSelection(ps.id)}
                                className={cn(
                                  "flex items-start gap-4 px-4 py-3 cursor-pointer transition-colors",
                                  isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                                  inCart && "opacity-60"
                                )}
                              >
                                {/* Checkbox */}
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => togglePendingSelection(ps.id)}
                                  className="mt-0.5"
                                />
                                
                                {/* Service Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">{ps.service.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-mono text-muted-foreground">
                                      {ps.service.code}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{ps.service.subCategory}</span>
                                    {ps.quantity > 1 && (
                                      <Badge variant="outline" className="text-xs">
                                        ×{ps.quantity}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                                    <span>{format(new Date(ps.performedAt), 'dd MMM, HH:mm')}</span>
                                    <span>•</span>
                                    <span>{ps.performedBy}</span>
                                    {ps.notes && (
                                      <>
                                        <span>•</span>
                                        <span>"{ps.notes}"</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Price & Add Button */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">
                                      {formatPrice(ps.service.price * ps.quantity)}
                                    </p>
                                    {ps.quantity > 1 && (
                                      <p className="text-xs text-muted-foreground">
                                        {formatPrice(ps.service.price)} × {ps.quantity}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={inCart ? "secondary" : "default"}
                                    disabled={inCart}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!inCart) {
                                        addToCart(ps.service);
                                        if (ps.quantity > 1) {
                                          updateQty(ps.service.id, ps.quantity);
                                        }
                                      }
                                    }}
                                    className="h-8 px-3"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    {inCart ? "Added" : "Add"}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </>
            ) : (
              <>
                {/* Catalog: Search & Sub-category Filters */}
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
                      {results.map((service) => (
                        <ServiceCatalogRow
                          key={service.id}
                          service={service}
                          cartItem={getCartItem(service.id)}
                          onAdd={addToCart}
                          onUpdateQty={updateQty}
                          onRemove={removeFromCart}
                          formatPrice={formatPrice}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </div>
          
          {/* Right Side - Order Summary */}
          <OrderSummaryPanel
            cart={cart}
            totals={totals}
            globalDiscountAmt={globalDiscountAmt}
            patientId={patient.gdid}
            isGeneratingBill={isGeneratingBill}
            onUpdateQty={updateQty}
            onUpdateDiscount={updateDiscount}
            onUpdateAddedAt={updateAddedAt}
            onRemove={removeFromCart}
            onUpdateGlobalDiscount={updateGlobalDiscount}
            onGenerateBill={handleGenerateBill}
            formatPrice={formatPrice}
          />
        </div>
      </PageContent>
    </div>
  );
};

export default PatientServices;
