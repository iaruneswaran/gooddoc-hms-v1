import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { AddItemForm } from "@/components/pricing/AddItemForm";

export default function AddPricingItem() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Pricing Catalog", "Add Item"]} />

        <main className="p-6 pb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/pricing-catalog")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Catalog</span>
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Add New Pricing Item</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete all required fields to add a new item to the pricing catalog
            </p>
          </div>

          {/* Form */}
          <div className="max-w-5xl mx-auto">
            <AddItemForm mode="create" />
          </div>
        </main>
      </div>
    </div>
  );
}
