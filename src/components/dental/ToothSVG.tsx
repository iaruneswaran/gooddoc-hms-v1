import React from 'react';
import { cn } from "@/lib/utils";
import { ToothCondition, Surface } from '@/types/dental';
import { Badge } from '@/components/ui/badge';

interface ToothSVGProps {
  id: number;
  label: string;
  conditions: ToothCondition[];
  surfaces: Record<Surface, ToothCondition | 'healthy'>;
  isSelected: boolean;
  selectedSurfaces: Surface[];
  onClick: (surface?: Surface) => void;
  isAdult?: boolean;
}

const getToothName = (id: number): string => {
  const names: Record<number, string> = {
    1: "Third Molar (Wisdom Tooth)", 2: "Second Molar", 3: "First Molar", 4: "Second Premolar", 
    5: "First Premolar", 6: "Canine (Cuspid)", 7: "Lateral Incisor", 8: "Central Incisor",
    9: "Central Incisor", 10: "Lateral Incisor", 11: "Canine", 12: "First Premolar", 
    13: "Second Premolar", 14: "First Molar", 15: "Second Molar", 16: "Third Molar (Wisdom Tooth)",
    17: "Third Molar (Wisdom Tooth)", 18: "Second Molar", 19: "First Molar", 20: "Second Premolar", 
    21: "First Premolar", 22: "Canine", 23: "Lateral Incisor", 24: "Central Incisor",
    25: "Central Incisor", 26: "Lateral Incisor", 27: "Canine", 28: "First Premolar", 
    29: "Second Premolar", 30: "First Molar", 31: "Second Molar", 32: "Third Molar (Wisdom Tooth)"
  };
  return names[id] || `Tooth ${id}`;
};

export const ToothSVG: React.FC<ToothSVGProps> = ({
  id,
  label,
  conditions,
  surfaces,
  isSelected,
  selectedSurfaces,
  onClick,
  isAdult = true
}) => {
  const getConditionColor = (condition: ToothCondition) => {
    switch (condition) {
      case 'caries': return 'bg-destructive';
      case 'restoration': return 'bg-primary';
      case 'root_canal': return 'bg-amber-500';
      case 'crown': return 'bg-slate-400';
      case 'implant': return 'bg-slate-800';
      case 'missing': return 'bg-slate-200';
      default: return 'bg-slate-300';
    }
  };

  const toothImagePath = `/images/Frame ${id}.svg`;
  const toothName = getToothName(id);

  return (
    <div className="flex flex-col items-center gap-1.5 group relative">
      {/* Selected Tooth Badge - Appears above the tooth */}
      {isSelected && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 pointer-events-none">
           <Badge className="whitespace-nowrap bg-white text-primary shadow-none border-none h-6 px-2.5 text-[10px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {toothName}
           </Badge>
           <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}

      {/* Hover Tooltip - Now below the tooth */}
      <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none -translate-y-1 group-hover:translate-y-0">
         {!isSelected && (
           <div className="bg-slate-800 text-white text-[9px] font-normal px-2 py-1 rounded-md shadow-xl whitespace-nowrap flex items-center gap-1.5 relative">
              {toothName}
              {/* Tooltip Arrow */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
           </div>
         )}
      </div>

      <span className={cn(
        "text-[9px] font-medium transition-all duration-300 tracking-tight",
        isSelected ? "text-primary scale-110" : "text-slate-400"
      )}>
        {label}
      </span>
      
      <div 
        className={cn(
          "relative w-12 h-14 transition-all duration-300 cursor-pointer rounded-lg flex items-center justify-center p-1 group/tooth",
          isSelected 
            ? "border border-primary/40 shadow-sm" 
            : "border border-transparent hover:border-slate-200 hover:bg-slate-50/50",
          conditions.includes('missing') && "opacity-20 grayscale"
        )}
        onClick={() => onClick()}
      >
        {/* Base Tooth Image - Always visible and clear */}
        <img 
          src={toothImagePath} 
          alt={toothName}
          className={cn(
            "w-full h-full object-contain transition-all duration-500",
            isSelected ? "scale-105" : "scale-100"
          )}
        />

        {/* Minimal Surface/Condition Tints (Optional/Subtle) */}
        {Object.keys(surfaces).length > 0 && !conditions.includes('missing') && (
           <div className="absolute inset-0 bg-primary/5 rounded-xl mix-blend-multiply pointer-events-none" />
        )}

        {/* Status Indicators (Dots) */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 px-1.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100">
           {conditions.map(c => (
             c !== 'missing' && (
               <div 
                 key={c} 
                 className={cn("w-1 h-1 rounded-full", getConditionColor(c))} 
               />
             )
           ))}
           {Object.keys(surfaces).length > 0 && conditions.length === 0 && (
             <div className="w-1 h-1 rounded-full bg-primary" />
           )}
        </div>
      </div>
    </div>
  );
};
