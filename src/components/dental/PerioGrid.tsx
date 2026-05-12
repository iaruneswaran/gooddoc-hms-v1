import React from 'react';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { SiteKey, PerioSite } from '@/types/dental';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/select"; // Using shadcn components if available or just basic titles

export const PerioGrid = ({ 
  selectedTooth, 
  onToothSelect 
}: { 
  selectedTooth?: number | null; 
  onToothSelect?: (id: number) => void; 
}) => {
  const { perioExam, updatePerioSite } = useDentalConsultation();
  
  // Sites: MB, B, DB (Buccal) and ML, L, DL (Lingual)
  const buccalSites: SiteKey[] = ['MB', 'B', 'DB'];
  const lingualSites: SiteKey[] = ['ML', 'L', 'DL'];
  
  // Standard tooth range
  const upperTeeth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  const lowerTeeth = ['32', '31', '30', '29', '28', '27', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17'];

  const getSeverityColor = (pd: number | null) => {
    if (pd === null) return 'text-slate-300';
    if (pd >= 6) return 'bg-destructive/10 text-destructive font-bold';
    if (pd >= 4) return 'bg-orange-50 text-orange-600 font-bold';
    return 'text-slate-600';
  };

  const renderToothColumn = (toothNum: string) => {
    const toothData = perioExam.teeth[toothNum] || {
      sites: {
        MB: { pd: 3, gm: 0, bop: false, sup: false, plaque: false, cal: 3 },
        B:  { pd: 2, gm: 0, bop: false, sup: false, plaque: false, cal: 2 },
        DB: { pd: 3, gm: 0, bop: false, sup: false, plaque: false, cal: 3 },
        ML: { pd: 3, gm: 0, bop: false, sup: false, plaque: false, cal: 3 },
        L:  { pd: 2, gm: 0, bop: false, sup: false, plaque: false, cal: 2 },
        DL: { pd: 3, gm: 0, bop: false, sup: false, plaque: false, cal: 3 },
      }
    };

    return (
      <div key={toothNum} className="flex flex-col gap-1 min-w-[70px] group">
        <div 
          className={cn(
            "py-1.5 text-[10px] font-bold text-center border-b border-slate-100 cursor-pointer transition-colors",
            selectedTooth === parseInt(toothNum) 
              ? "bg-primary text-white" 
              : "bg-slate-50 text-slate-800 group-hover:bg-primary/5"
          )}
          onClick={() => onToothSelect?.(parseInt(toothNum))}
        >
          #{toothNum}
        </div>
        
        {/* Buccal Row */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-white rounded border border-slate-100">
          {buccalSites.map(siteKey => {
            const site = toothData.sites[siteKey];
            return (
              <div 
                key={siteKey}
                className={cn(
                  "relative flex flex-col items-center py-1.5 rounded-sm cursor-pointer transition-all hover:bg-slate-50",
                  getSeverityColor(site.pd)
                )}
                onClick={() => {
                  const newPD = site.pd !== null ? (site.pd % 9) + 1 : 1;
                  updatePerioSite(toothNum, siteKey, { pd: newPD });
                  onToothSelect?.(parseInt(toothNum));
                }}
              >
                <span className="text-[10px] leading-none">{site.pd || '-'}</span>
                
                {/* Clinical Markers */}
                <div className="flex gap-0.5 mt-1">
                  {site.bop && <div className="w-1 h-1 rounded-full bg-destructive" title="BOP" />}
                  {site.sup && <div className="w-1 h-1 rounded-full bg-yellow-400" title="SUP" />}
                  {site.plaque && <div className="w-1 h-1 rounded-full bg-blue-500" title="Plaque" />}
                </div>

                {/* GM Overlay (Subtle) */}
                <span className="absolute -bottom-2 text-[7px] font-medium text-slate-400 opacity-0 group-hover:opacity-100">
                  GM: {site.gm}
                </span>
              </div>
            );
          })}
        </div>

        {/* Lingual Row */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-slate-50/50 rounded border border-slate-100 mt-2">
          {lingualSites.map(siteKey => {
            const site = toothData.sites[siteKey];
            return (
              <div 
                key={siteKey}
                className={cn(
                  "flex flex-col items-center py-1 rounded-sm cursor-pointer hover:bg-white",
                  getSeverityColor(site.pd)
                )}
                onClick={() => {
                  const newPD = site.pd !== null ? (site.pd % 9) + 1 : 1;
                  updatePerioSite(toothNum, siteKey, { pd: newPD });
                  onToothSelect?.(parseInt(toothNum));
                }}
              >
                <span className="text-[9px]">{site.pd || '-'}</span>
              </div>
            );
          })}
        </div>

        {/* Computed CAL (Bottom) */}
        <div className="mt-1 text-center">
           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">CAL</span>
           <div className="flex justify-around text-[9px] font-medium text-slate-400 italic">
              {buccalSites.map(s => <span key={s}>{toothData.sites[s].cal || 0}</span>)}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* Grid Container */}
      <div className="flex flex-col gap-10 overflow-x-auto pb-8 scrollbar-hide">
         {/* Upper Arch Row */}
         <div className="flex items-start gap-1">
            <div className="flex-shrink-0 w-12 pt-8 flex flex-col items-center">
               <div className="h-20 w-px bg-slate-100 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-4 text-[9px] font-bold text-slate-300 [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest">Upper</span>
               </div>
            </div>
            <div className="flex gap-1.5">
               {upperTeeth.map(renderToothColumn)}
            </div>
         </div>

         {/* Lower Arch Row */}
         <div className="flex items-start gap-1">
            <div className="flex-shrink-0 w-12 pt-8 flex flex-col items-center">
               <div className="h-20 w-px bg-slate-100 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-4 text-[9px] font-bold text-slate-300 [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest">Lower</span>
               </div>
            </div>
            <div className="flex gap-1.5">
               {lowerTeeth.map(renderToothColumn)}
            </div>
         </div>
      </div>
    </div>
  );
};
