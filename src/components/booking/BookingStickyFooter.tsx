import { Button } from "@/components/ui/button";

interface BookingStickyFooterProps {
  onAskConfirmation: () => void;
  onSchedule: () => void;
  isScheduleDisabled?: boolean;
}

export function BookingStickyFooter({
  onAskConfirmation,
  onSchedule,
  isScheduleDisabled = false,
}: BookingStickyFooterProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-10">
      <div className="container max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onAskConfirmation}>
            Ask Confirmation
          </Button>
          <Button onClick={onSchedule} disabled={isScheduleDisabled}>
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
