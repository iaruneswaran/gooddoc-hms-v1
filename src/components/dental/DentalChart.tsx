import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import "@/dental-chart.css";

export type ToothCondition = 
  | 'healthy' 
  | 'cavity' 
  | 'missing' 
  | 'root_canal' 
  | 'crown' 
  | 'implant' 
  | 'extraction_planned' 
  | 'sensitive';

export interface ToothData {
  id: number;
  condition: ToothCondition;
  surfaces: string[]; // O, M, D, I, L, B
  notes: string;
}

interface DentalChartProps {
  teethData: Record<number, ToothData>;
  onToothClick: (toothId: number) => void;
  selectedTeeth: number[];
  onToggleSelection: (toothId: number, multi?: boolean) => void;
}

const getToothName = (id: number): string => {
  const names: Record<number, string> = {
    1: "Upper Right 3rd Molar", 2: "Upper Right 2nd Molar", 3: "Upper Right 1st Molar",
    4: "Upper Right 2nd Premolar", 5: "Upper Right 1st Premolar", 6: "Upper Right Canine",
    7: "Upper Right Lateral Incisor", 8: "Upper Right Central Incisor",
    9: "Upper Left Central Incisor", 10: "Upper Left Lateral Incisor", 11: "Upper Left Canine",
    12: "Upper Left 1st Premolar", 13: "Upper Left 2nd Premolar", 14: "Upper Left 1st Molar",
    15: "Upper Left 2nd Molar", 16: "Upper Left 3rd Molar",
    17: "Lower Left 3rd Molar", 18: "Lower Left 2nd Molar", 19: "Lower Left 1st Molar",
    20: "Lower Left 2nd Premolar", 21: "Lower Left 1st Premolar", 22: "Lower Left Canine",
    23: "Lower Left Lateral Incisor", 24: "Lower Left Central Incisor",
    25: "Lower Right Central Incisor", 26: "Lower Right Lateral Incisor", 27: "Lower Right Canine",
    28: "Lower Right 1st Premolar", 29: "Lower Right 2nd Premolar", 30: "Lower Right 1st Molar",
    31: "Lower Right 2nd Molar", 32: "Lower Right 3rd Molar"
  };
  return names[id] || `Tooth #${id}`;
};

const DentalChart: React.FC<DentalChartProps> = ({ 
  teethData, 
  onToothClick, 
  selectedTeeth,
  onToggleSelection 
}) => {
  // Tooth numbers: 1-16 (top), 17-32 (bottom)
  const topRow = Array.from({ length: 16 }, (_, i) => i + 1);
  const bottomRow = Array.from({ length: 16 }, (_, i) => 32 - i);

  const renderTooth = (id: number) => {
    const data = teethData[id] || { condition: 'healthy' };
    const isSelected = selectedTeeth.includes(id);

    return (
      <div 
        key={id}
        className={cn(
          "flex flex-col items-center gap-1 cursor-pointer group transition-all p-1 rounded-lg hover:bg-muted/50 relative",
          isSelected && "bg-primary/10 ring-1 ring-primary/30"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelection(id, e.shiftKey || e.ctrlKey || e.metaKey);
        }}
        onDoubleClick={() => onToothClick(id)}
      >
        <span className="text-[10px] font-medium text-muted-foreground">{id}</span>
        <div className="relative w-10 h-14 flex items-center justify-center">
           {/* SVG Tooth representation */}
           <svg viewBox="0 0 40 60" className="w-full h-full overflow-visible">
             {/* Root/Base */}
             <path 
               d="M5,40 Q5,55 20,60 Q35,55 35,40" 
               fill="none"
               stroke={isSelected ? "var(--primary)" : "#E2E8F0"}
               strokeWidth="2"
             />
             
             {/* Crown with Surfaces */}
             <g className={cn("transition-colors duration-200", `tooth-${data.condition}`)}>
               {/* Occlusal (Center) */}
               <rect x="12" y="12" width="16" height="16" className="tooth-surface" fill="currentColor" fillOpacity="0.4" />
               
               {/* Mesial (Left) */}
               <path d="M5,10 Q5,5 12,12 L12,28 Q5,35 5,40 L12,28 Z" className="tooth-surface" fill="currentColor" fillOpacity="0.6" />
               
               {/* Distal (Right) */}
               <path d="M35,10 Q35,5 28,12 L28,28 Q35,35 35,40 L28,28 Z" className="tooth-surface" fill="currentColor" fillOpacity="0.6" />
               
               {/* Buccal/Labial (Top) */}
               <path d="M10,10 Q20,0 30,10 L28,12 L12,12 Z" className="tooth-surface" fill="currentColor" fillOpacity="0.8" />
               
               {/* Lingual (Bottom) */}
               <path d="M12,28 L28,28 L35,40 Q20,45 5,40 Z" className="tooth-surface" fill="currentColor" fillOpacity="0.2" />
             </g>

             {/* Selection Highlight */}
             {isSelected && (
               <path 
                 d="M10,10 Q20,0 30,10 L35,40 Q35,55 20,60 Q5,55 5,40 Z" 
                 fill="none"
                 stroke="var(--primary)"
                 strokeWidth="2"
                 className="pointer-events-none"
               />
             )}
           </svg>
        </div>
        
        {/* Hover Label - Tooth Name */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all z-30 pointer-events-none whitespace-nowrap scale-95 group-hover:scale-100">
           {getToothName(id)}
           {/* Tooltip Arrow */}
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-bottom-slate-900 border-b-slate-900" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 dental-chart-container bg-white p-8 rounded-2xl border border-border shadow-sm">
      {/* Top Row */}
      <div className="flex gap-1">
        {topRow.map(renderTooth)}
      </div>

      {/* Center midline */}
      <div className="w-full h-px bg-muted relative" />

      {/* Bottom Row */}
      <div className="flex gap-1">
        {bottomRow.map(renderTooth)}
      </div>
      
      {/* Legend */}
      <div className="mt-8 grid grid-cols-4 gap-4 w-full">
        {(['healthy', 'cavity', 'missing', 'root_canal', 'crown', 'implant', 'extraction_planned', 'sensitive'] as ToothCondition[]).map(cond => (
          <div key={cond} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", `tooth-${cond}`)} />
            <span className="text-xs capitalize font-medium text-muted-foreground">
              {cond.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DentalChart;
