import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { AddItemForm } from "@/components/pricing/AddItemForm";

export default function AddPricingItem() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <PageContent>
        <AppHeader breadcrumbs={["Pricing Catalog", "Add Item"]} />

        <main className="p-6 pb-6">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("/pricing-catalog")}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Back to Catalog</span>
            </button>


            {/* Form */}
            <AddItemForm mode="create" />
          </div>
        </main>
      </PageContent>
    </div>
  );
}
