import React, { useState } from 'react';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { ToothSVG } from '@/components/dental/ToothSVG';
import { PerioGrid } from '@/components/dental/PerioGrid';
import { Surface, ToothCondition, ToothNotation } from '@/types/dental';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Info, 
  Plus, 
  Trash2, 
  History, 
  ChevronRight,
  Stethoscope,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const DentalChartTab = () => {
  const { teethData, updateTooth, perioExam } = useDentalConsultation();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<Surface[]>([]);
  const [notation, setNotation] = useState<ToothNotation>('Universal');
  const [showPerio, setShowPerio] = useState(false);

  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  const getToothLabel = (id: number): string => {
    if (notation === 'Universal') return id.toString();
    
    if (notation === 'FDI') {
      if (id <= 8) return (10 + (9 - id)).toString(); // 1-8 -> 18-11
      if (id <= 16) return (20 + (id - 8)).toString(); // 9-16 -> 21-28
      if (id <= 24) return (30 + (25 - id)).toString(); // 17-24 -> 38-31
      if (id <= 32) return (40 + (id - 24)).toString(); // 25-32 -> 41-48
      return id.toString();
    }
    
    if (notation === 'Palmer') {
      if (id <= 8) return `${9 - id}┘`;
      if (id <= 16) return `└${id - 8}`;
      if (id <= 24) return `┌${25 - id}`;
      if (id <= 32) return `${id - 24}┐`;
    }
    
    return id.toString();
  };

  const handleToothClick = (id: number, surface?: Surface) => {
    if (selectedTooth === id) {
      if (surface) {
        setSelectedSurfaces(prev => 
          prev.includes(surface) ? prev.filter(s => s !== surface) : [...prev, surface]
        );
      } else {
        setSelectedTooth(null);
        setSelectedSurfaces([]);
      }
    } else {
      setSelectedTooth(id);
      setSelectedSurfaces(surface ? [surface] : []);
    }
  };
  
  const calculatePerioStats = () => {
    let totalPD = 0;
    let siteCount = 0;
    let bopCount = 0;
    
    Object.values(perioExam.teeth).forEach(tooth => {
      Object.values(tooth.sites).forEach(site => {
        if (site.pd !== null) {
          totalPD += site.pd;
          siteCount++;
          if (site.bop) bopCount++;
        }
      });
    });
    
    // Fallback to sample values if no data yet to match user's request
    return {
      avgPD: siteCount > 0 ? (totalPD / siteCount).toFixed(1) : '2.4',
      bopPercent: siteCount > 0 ? Math.round((bopCount / siteCount) * 100) : 12
    };
  };

  const { avgPD, bopPercent } = calculatePerioStats();

  const calculatePerioCounts = () => {
    let pockets6plus = 0;
    let pockets45 = 0;
    let plaqueCount = 0;
    let bopCount = 0;
    let totalSites = 0;
    
    Object.values(perioExam.teeth).forEach(tooth => {
      Object.values(tooth.sites).forEach(site => {
        if (site.pd !== null) {
          totalSites++;
          if (site.pd >= 6) pockets6plus++;
          else if (site.pd >= 4) pockets45++;
          if (site.plaque) plaqueCount++;
          if (site.bop) bopCount++;
        }
      });
    });

    // Mock values if no data yet to keep UI populated
    if (totalSites === 0) {
      return { pockets6plus: 12, pockets45: 24, plaqueCount: 18, bopCount: 15, totalSites: 192 };
    }

    return { pockets6plus, pockets45, plaqueCount, bopCount, totalSites };
  };

  const { pockets6plus, pockets45, plaqueCount, bopCount: bopSites } = calculatePerioCounts();

  const addCondition = (cond: ToothCondition) => {
    if (!selectedTooth) return;
    const tooth = teethData[selectedTooth] || { condition: [], surfaces: {} };
    
    if (selectedSurfaces.length > 0) {
      const newSurfaces = { ...tooth.surfaces };
      selectedSurfaces.forEach(s => {
        if (newSurfaces[s] === cond) {
          delete newSurfaces[s];
        } else {
          newSurfaces[s] = cond;
        }
      });
      updateTooth(selectedTooth, { surfaces: newSurfaces });
    } else {
      updateTooth(selectedTooth, { 
        condition: tooth.condition.includes(cond) 
          ? tooth.condition.filter(c => c !== cond) 
          : [...tooth.condition, cond] 
      });
    }
  };

  const clearConditions = () => {
    if (!selectedTooth) return;
    if (selectedSurfaces.length > 0) {
      const tooth = teethData[selectedTooth];
      if (!tooth) return;
      const newSurfaces = { ...tooth.surfaces };
      selectedSurfaces.forEach(s => {
        delete newSurfaces[s];
      });
      updateTooth(selectedTooth, { surfaces: newSurfaces });
    } else {
      updateTooth(selectedTooth, { condition: [] });
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden animate-in fade-in duration-500">
      {/* Left: Main Chart Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 scrollbar-hide">
        {/* View Switcher */}
        <div className="flex justify-end px-4 -mb-9 relative z-20">
          <div className="h-11 bg-muted/50 p-1 gap-0.5 rounded-md justify-start w-auto inline-flex border border-border/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "gap-2 text-[13px] font-medium px-4 h-9 rounded-sm transition-all",
                !showPerio 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
              )}
              onClick={() => setShowPerio(false)}
            >
              <Activity size={15} />
              Dental Chart
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "gap-2 text-[13px] font-medium px-4 h-9 rounded-sm transition-all",
                showPerio 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
              )}
              onClick={() => setShowPerio(true)}
            >
              <Activity size={15} className="rotate-180" />
              Perio Chart
            </Button>
          </div>
        </div>

        <div className="p-10 relative overflow-visible">

          {!showPerio ? (
            <div className="flex flex-col items-center gap-10 mt-4">
               {/* Upper Arch */}
               <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 w-24 flex flex-col items-start">
                     <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-[8px] shadow-sm">
                        <img src="/images/Teeth Icon.svg" alt="" className="w-4 h-4" />
                        <span className="text-[12px] font-medium text-slate-500 tracking-tight">Upper</span>
                     </div>
                  </div>
                  <div className="flex-1 flex justify-center gap-2">
                     {upperTeeth.map(id => (
                       <ToothSVG 
                         key={id}
                         id={id}
                         label={getToothLabel(id)}
                         conditions={teethData[id]?.condition || []}
                         surfaces={teethData[id]?.surfaces || {}}
                         isSelected={selectedTooth === id}
                         selectedSurfaces={selectedTooth === id ? selectedSurfaces : []}
                         onClick={(s) => handleToothClick(id, s)}
                       />
                     ))}
                  </div>
                  <div className="w-24" /> {/* Spacer to balance left indicator */}
               </div>

               {/* Midline Indicator */}
               <div className="w-full h-px bg-slate-100 relative" />

               {/* Lower Arch */}
               <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 w-24 flex flex-col items-start">
                     <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-[8px] shadow-sm">
                        <img src="/images/Teeth Icon.svg" alt="" className="w-4 h-4" />
                        <span className="text-[12px] font-medium text-slate-500 tracking-tight">Lower</span>
                     </div>
                  </div>
                  <div className="flex-1 flex justify-center gap-2">
                     {lowerTeeth.map(id => (
                       <ToothSVG 
                         key={id}
                         id={id}
                         label={getToothLabel(id)}
                         conditions={teethData[id]?.condition || []}
                         surfaces={teethData[id]?.surfaces || {}}
                         isSelected={selectedTooth === id}
                         selectedSurfaces={selectedTooth === id ? selectedSurfaces : []}
                         onClick={(s) => handleToothClick(id, s)}
                       />
                     ))}
                  </div>
                  <div className="w-24" /> {/* Spacer to balance left indicator */}
               </div>
            </div>
          ) : (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <PerioGrid 
                 selectedTooth={selectedTooth}
                 onToothSelect={(id) => setSelectedTooth(id)}
               />
            </div>
          )}
        </div>
      </div>

      {/* Right: Details Drawer */}
      <div className="w-[340px] border-l border-border bg-muted/10 flex flex-col h-full overflow-hidden">
        <header className="p-4 border-b border-border bg-white flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 tracking-tight">Tooth Details</h3>
            {selectedTooth && (
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-medium">#{selectedTooth}</Badge>
            )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scrollbar-hide">
          {showPerio ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-500">Periodontal Summary</p>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col items-center">
                        <p className="text-[10px] font-medium text-slate-400 tracking-tight">Avg. PD</p>
                        <p className="text-lg font-medium text-slate-700">{avgPD}mm</p>
                     </div>
                     <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col items-center">
                        <p className="text-[10px] font-medium text-slate-400 tracking-tight">% BOP</p>
                        <p className="text-lg font-medium text-destructive">{bopPercent}%</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-500">Periodontal Charting (6-Site)</p>
                  <div className="grid grid-cols-2 gap-2">
                     {[
                       { label: 'Pockets ≥ 6mm', value: pockets6plus, color: 'bg-destructive' },
                       { label: 'Pockets 4-5mm', value: pockets45, color: 'bg-amber-500' },
                       { label: 'Plaque', value: `${plaqueCount}`, color: 'bg-blue-500' },
                       { label: 'BOP', value: `${bopSites}`, color: 'bg-rose-500' }
                     ].map((item, idx) => (
                       <div key={idx} className="h-10 flex items-center justify-between px-3 border border-slate-100 bg-white transition-all duration-200 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                             <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.color)} />
                             <span className="text-[10px] font-medium text-slate-600 truncate">{item.label}</span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 ml-2">{item.value}</span>
                       </div>
                     ))}
                  </div>
               </div>

            </div>
          ) : (
            <>
              {selectedTooth ? (
                <>
                  {/* Selected Surfaces */}
                   {selectedSurfaces.length > 0 && (
                     <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                           {selectedSurfaces.map(s => (
                             <Badge key={s} variant="outline" className="h-6 px-2 text-[10px] font-medium border-primary/20 text-primary uppercase bg-primary/[0.02]">{s} Surface</Badge>
                           ))}
                        </div>
                     </div>
                   )}

                  {/* Quick Actions / Conditions */}
                   <div className="space-y-3">
                      <p className="text-xs font-medium text-slate-500">Mark Condition</p>
                      <div className="grid grid-cols-2 gap-2">
                         {[
                           { id: 'caries', label: 'Caries', icon: '/images/Caries.svg' },
                           { id: 'restoration', label: 'Restoration', icon: '/images/Restoration.svg' },
                           { id: 'root_canal', label: 'Root Canal', icon: '/images/Root Canal.svg' },
                           { id: 'crown', label: 'Crown/Bridge', icon: '/images/CrownBridge.svg' },
                           { id: 'missing', label: 'Missing', icon: '/images/Missing.svg' },
                           { id: 'implant', label: 'Implant', icon: '/images/Implant.svg' }
                         ].map(c => {
                           const isActive = selectedTooth && (
                             selectedSurfaces.length > 0 
                               ? teethData[selectedTooth]?.surfaces[selectedSurfaces[0]] === c.id
                               : teethData[selectedTooth]?.condition.includes(c.id as ToothCondition)
                           );
                           return (
                             <Button 
                               key={c.id} 
                               variant="ghost" 
                               className={cn(
                                 "h-9 text-[10px] font-medium justify-start px-3 border transition-all duration-200 rounded-lg group shadow-sm",
                                 isActive 
                                   ? "bg-primary/5 border-primary/30 text-primary" 
                                   : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900"
                               )}
                               onClick={() => addCondition(c.id as ToothCondition)}
                             >
                               <img src={c.icon} alt={c.label} className="w-4 h-4 mr-2" />
                               {c.label}
                             </Button>
                           );
                         })}
                      </div>
                   </div>

                  {/* Procedure Cart */}
                   <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                         <p className="text-xs font-medium text-slate-500">Planned Procedures</p>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/5 rounded-full"><Plus size={14} /></Button>
                      </div>
                      
                      {/* Empty State */}
                      <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                            <Plus size={16} />
                         </div>
                         <p className="text-[10px] font-medium text-slate-400">No procedures added to cart</p>
                      </div>
                   </div>

                  {/* Notes */}
                   <div className="space-y-3">
                      <p className="text-xs font-medium text-slate-500">Clinical Notes</p>
                      <textarea 
                         className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none resize-none transition-all placeholder:text-slate-300"
                         placeholder="Enter tooth-specific notes..."
                      />
                   </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                   <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 rotate-3 shadow-sm">
                      <Plus size={32} className="text-primary/60 -rotate-3" />
                   </div>
                   <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-[200px] mx-auto mb-8">
                     Select a tooth or specific surface from the chart to view clinical details and plan procedures.
                   </p>
                   
                   <div className="w-full space-y-2">
                     <Button className="w-full h-11 text-[11px] font-medium uppercase tracking-widest shadow-lg shadow-primary/10">
                       Start Selection
                     </Button>
                     <Button variant="ghost" className="w-full h-11 text-[11px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600">
                       Quick Note
                     </Button>
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
