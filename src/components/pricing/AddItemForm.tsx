import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepHeader } from "./StepHeader";
import { BasicsStep } from "./steps/BasicsStep";
import { PricingStep } from "./steps/PricingStep";
import { PricingItemSchema, PricingItemFormData } from "@/types/pricing-item";
import { useCreatePricingItem } from "@/api/pricingApi";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, name: "Basics" },
  { id: 2, name: "Pricing" },
];

interface AddItemFormProps {
  mode: "create" | "edit";
  initialData?: Partial<PricingItemFormData>;
}

export function AddItemForm({ mode, initialData }: AddItemFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saveAction, setSaveAction] = useState<"draft" | "publish" | "saveAndAdd">("draft");

  const createMutation = useCreatePricingItem();

  const methods = useForm<PricingItemFormData>({
    resolver: zodResolver(PricingItemSchema),
    defaultValues: {
      status: "Draft",
      visibility: "staff",
      autoCalcNet: true,
      pricing: {
        currency: "INR",
        basePrice: 0,
        markupPct: 0,
        discountPct: 0,
        taxPct: 0,
        netPrice: 0,
      },
      requiresDoctorOrder: false,
      availability: "In Stock",
      tags: [],
      branchOverrides: [],
      ...initialData,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = methods;

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: PricingItemFormData) => {
    try {
      // Calculate standard price (base - discount)
      const basePrice = data.pricing.basePrice || 0;
      const discountPct = data.pricing.discountPct || 0;
      data.pricing.netPrice = basePrice - (basePrice * discountPct / 100);

      // Set status based on save action
      data.status = saveAction === "publish" ? "Published" : "Draft";

      const result = await createMutation.mutateAsync(data);

      toast({
        title: saveAction === "publish" ? "Item published!" : "Draft saved!",
        description: `${result.name} has been ${saveAction === "publish" ? "published" : "saved as draft"}.`,
      });

      if (saveAction === "saveAndAdd") {
        // Reset form but preserve category and department
        reset({
          ...methods.getValues(),
          name: "",
          description: "",
          codes: { internal: "" },
          patientDescription: "",
          tags: [],
          pricing: {
            ...methods.getValues().pricing,
            basePrice: 0,
            cost: 0,
            netPrice: 0,
          },
        });
        setCurrentStep(1);
        toast({
          title: "Ready for next item",
          description: "Add another pricing item with the same category and department.",
        });
      } else {
        navigate("/pricing-catalog");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pricing item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicsStep />;
      case 2:
        return <PricingStep />;
      default:
        return <BasicsStep />;
    }
  };

  const canPublish = Object.keys(errors).length === 0;
  const isSubmitting = createMutation.isPending;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        handleBack();
      } else if (e.key === "Enter" && !e.shiftKey && currentStep < STEPS.length) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName !== "TEXTAREA" && activeElement.tagName !== "BUTTON") {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <StepHeader steps={STEPS} currentStep={currentStep} />

        <div className="min-h-[400px]">{renderStep()}</div>

        {/* Footer */}
        <div className="p-4 pb-6 z-10 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/pricing-catalog")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {STEPS.length}
              </span>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => setSaveAction("draft")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && saveAction === "draft" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save as Draft
                  </Button>

                  <Button
                    type="submit"
                    onClick={() => setSaveAction("publish")}
                    disabled={!canPublish || isSubmitting}
                  >
                    {isSubmitting && saveAction === "publish" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Publish
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
