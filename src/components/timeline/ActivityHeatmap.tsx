import { useState, useMemo } from "react";
import { HeatmapMode, HeatmapPalette, DailyCount, EventType } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
  dailyCounts: DailyCount[];
  admissionDate: string;
  dischargeDate: string | null;
  onDateClick: (date: string) => void;
  onRangeSelect: (startDate: string, endDate: string) => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Admission: "hsl(var(--info))",
  Laboratory: "hsl(var(--accent))",
  Medication: "hsl(var(--success))",
  Imaging: "hsl(var(--info-light))",
  Procedure: "hsl(var(--warning))",
  Notes: "hsl(var(--muted-foreground))",
  Discharge: "hsl(var(--success))",
};

export function ActivityHeatmap({
  dailyCounts,
  admissionDate,
  dischargeDate,
  onDateClick,
  onRangeSelect,
}: ActivityHeatmapProps) {
  const [mode, setMode] = useState<HeatmapMode>("density");
  const [palette, setPalette] = useState<HeatmapPalette>("greens");
  const [brushStart, setBrushStart] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Generate all dates in range
  const allDates = useMemo(() => {
    const start = new Date(admissionDate);
    const end = dischargeDate ? new Date(dischargeDate) : new Date();
    const dates: string[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }
    
    return dates;
  }, [admissionDate, dischargeDate]);

  // Organize dates by week
  const weeks = useMemo(() => {
    const weekMap = new Map<string, string[]>();
    
    allDates.forEach(date => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1); // Monday
      const weekKey = weekStart.toISOString().split("T")[0];
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      weekMap.get(weekKey)!.push(date);
    });
    
    return Array.from(weekMap.values());
  }, [allDates]);

  // Get color for a cell based on mode and palette
  const getCellColor = (date: string): string => {
    const count = dailyCounts.find(d => d.date === date);
    if (!count || count.total === 0) return "hsl(var(--muted))";

    if (mode === "density") {
      const intensity = count.total;
      if (palette === "greens") {
        if (intensity === 0) return "hsl(var(--muted))";
        if (intensity <= 2) return "hsl(142 76% 90%)";
        if (intensity <= 5) return "hsl(142 76% 73%)";
        if (intensity <= 10) return "hsl(142 71% 45%)";
        return "hsl(142 71% 25%)";
      }
    }

    if (mode === "byType") {
      // Find dominant type
      let maxType: EventType = "Admission";
      let maxCount = 0;
      
      Object.entries(count.byType).forEach(([type, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          maxType = type as EventType;
        }
      });
      
      return EVENT_TYPE_COLORS[maxType];
    }

    return "hsl(var(--primary))";
  };

  const handleCellClick = (date: string) => {
    if (brushStart) {
      onRangeSelect(brushStart, date);
      setBrushStart(null);
    } else {
      onDateClick(date);
    }
  };

  const handleCellMouseDown = (date: string) => {
    setBrushStart(date);
  };

  return (
    <div className="sticky top-[120px] z-10 bg-card border-b border-border">
      <div className="px-6 py-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Activity Heatmap</h2>
          
          <div className="flex items-center gap-4">
            {/* Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mode:</span>
              <div className="flex gap-1">
                <Button
                  variant={mode === "density" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("density")}
                >
                  Density
                </Button>
                <Button
                  variant={mode === "byType" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("byType")}
                >
                  By Type
                </Button>
                <Button
                  variant={mode === "status" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("status")}
                >
                  Status
                </Button>
              </div>
            </div>

            {/* Palette Selector */}
            {mode === "density" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Palette:</span>
                <div className="flex gap-1">
                  <Button
                    variant={palette === "greens" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPalette("greens")}
                  >
                    Greens
                  </Button>
                  <Button
                    variant={palette === "blues" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPalette("blues")}
                  >
                    Blues
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap Grid */}
        <TooltipProvider>
          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col justify-around text-[10px] text-muted-foreground mr-2 py-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const date = week.find(d => {
                      const day = new Date(d).getDay();
                      return day === (dayIndex + 1) % 7;
                    });

                    if (!date) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }

                    const count = dailyCounts.find(d => d.date === date);
                    const isToday = date === today;

                    return (
                      <Tooltip key={date}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-primary cursor-pointer",
                              isToday && "ring-2 ring-info"
                            )}
                            style={{ backgroundColor: getCellColor(date) }}
                            onClick={() => handleCellClick(date)}
                            onMouseDown={() => handleCellMouseDown(date)}
                            aria-label={`${date}: ${count?.total || 0} events`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-muted-foreground">{count?.total || 0} events</p>
                            {count && count.total > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {Object.entries(count.byType)
                                  .filter(([, cnt]) => cnt > 0)
                                  .slice(0, 2)
                                  .map(([type, cnt]) => (
                                    <p key={type} className="text-[10px]">
                                      {type}: {cnt}
                                    </p>
                                  ))}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1 ml-4">
              <span className="text-[10px] text-muted-foreground">Less</span>
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor:
                      mode === "density"
                        ? level === 0
                          ? "hsl(var(--muted))"
                          : `hsl(142 ${76 - level * 10}% ${90 - level * 15}%)`
                        : "hsl(var(--primary))",
                  }}
                />
              ))}
              <span className="text-[10px] text-muted-foreground">More</span>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
