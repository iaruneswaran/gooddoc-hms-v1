import React from "react";
import {
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  value: number;
  timestamp: string;
  label?: string;
}

interface TrendSparklineProps {
  data: TrendDataPoint[];
  refLow?: number | null;
  refHigh?: number | null;
  currentFlag?: "N" | "L" | "H" | "C";
  onClick?: () => void;
  className?: string;
}

export function TrendSparkline({
  data,
  refLow,
  refHigh,
  currentFlag = "N",
  onClick,
  className,
}: TrendSparklineProps) {
  if (data.length < 2) {
    return (
      <div className={cn("w-16 h-6 flex items-center justify-center", className)}>
        <span className="text-xs text-muted-foreground">—</span>
      </div>
    );
  }

  const lineColor =
    currentFlag === "C"
      ? "hsl(0, 72%, 51%)"
      : currentFlag === "H"
      ? "hsl(25, 95%, 53%)"
      : currentFlag === "L"
      ? "hsl(200, 95%, 53%)"
      : "hsl(160, 60%, 45%)";

  const formattedData = data.map((d, idx) => ({
    ...d,
    index: idx,
  }));

  return (
    <div
      className={cn(
        "w-16 h-6 cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="View trend details"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {refHigh !== null && refHigh !== undefined && (
            <ReferenceLine
              y={refHigh}
              stroke="hsl(25, 95%, 53%)"
              strokeDasharray="2 2"
              strokeWidth={0.5}
            />
          )}
          {refLow !== null && refLow !== undefined && (
            <ReferenceLine
              y={refLow}
              stroke="hsl(200, 95%, 53%)"
              strokeDasharray="2 2"
              strokeWidth={0.5}
            />
          )}
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), "Value"]}
            labelFormatter={(idx) => formattedData[idx]?.label || formattedData[idx]?.timestamp}
            contentStyle={{
              fontSize: "10px",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 2, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
