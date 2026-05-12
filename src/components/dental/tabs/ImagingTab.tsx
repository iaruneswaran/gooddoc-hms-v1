import React, { useState } from 'react';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Ruler, 
  Sun, 
  Contrast, 
  Maximize2, 
  Download, 
  Printer,
  ChevronRight,
  Grid,
  FileText,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ImagingTab = () => {
  const [selectedStudy, setSelectedStudy] = useState(0);
  const [activeTool, setActiveTool] = useState('move');

  const studies = [
    { id: 'S1', date: '07-May-2026', type: 'Bitewing (BW)', teeth: '3, 4, 13, 14', count: 4, label: 'Standard BW Series' },
    { id: 'S2', date: '07-May-2026', type: 'Periapical (PA)', teeth: '3', count: 1, label: 'PA - Tooth #3' },
    { id: 'S3', date: '15-Apr-2026', type: 'Panoramic (Pan)', teeth: 'Full Arch', count: 1, label: 'Screening OPG' }
  ];

  const tools = [
    { id: 'zoom-in', icon: ZoomIn, label: 'Zoom In' },
    { id: 'zoom-out', icon: ZoomOut, label: 'Zoom Out' },
    { id: 'move', icon: Move, label: 'Pan' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
    { id: 'brightness', icon: Sun, label: 'Brightness' },
    { id: 'contrast', icon: Contrast, label: 'Contrast' }
  ];

  return (
    <div className="h-full overflow-hidden flex animate-in fade-in duration-500 bg-white">
      {/* Left: Study List */}
      <div className="w-[320px] border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200">
           <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Imaging Studies</h4>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col scrollbar-hide">
           {studies.map((study, idx) => (
             <div 
                key={study.id} 
                className={cn(
                  "p-6 border-b border-slate-100 transition-all cursor-pointer group relative",
                  selectedStudy === idx ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                )}
                onClick={() => setSelectedStudy(idx)}
             >
                {selectedStudy === idx && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                )}
                <div className="flex justify-between items-start mb-3">
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-wide",
                     selectedStudy === idx ? "text-primary" : "text-slate-400"
                   )}>
                      {study.type}
                   </span>
                   <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      {study.date}
                   </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{study.label}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Teeth: {study.teeth}</p>
                
                <div className="flex gap-2 mt-4">
                   {Array.from({ length: study.count }).map((_, i) => (
                     <div key={i} className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden border border-slate-200/50">
                        <img 
                          src={`https://images.unsplash.com/photo-1551076805-e1869033e561?w=100&h=100&fit=crop`} 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-opacity" 
                          alt="X-ray Thumb"
                        />
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
        
        <div className="p-6 border-t border-slate-200">
           <button className="w-full py-3 border border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all">
             Upload DICOM/Photos
           </button>
        </div>
      </div>

      {/* Right: Imaging Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 relative">
        {/* Toolset Overlay */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 z-20">
           {tools.map(tool => (
             <Button 
                key={tool.id} 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-10 w-10 rounded-xl transition-all",
                  activeTool === tool.id ? "bg-primary text-white shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setActiveTool(tool.id)}
             >
                <tool.icon size={20} />
             </Button>
           ))}
           <div className="h-px w-6 bg-white/10 mx-auto my-1" />
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white">
              <Maximize2 size={20} />
           </Button>
        </div>

        {/* Top Controls */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
           <div className="flex flex-col">
              <h4 className="text-white font-bold text-sm">{studies[selectedStudy].label}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Image 1 of {studies[selectedStudy].count} • Raw DICOM Data</p>
           </div>
           <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="h-9 px-4 text-white/60 hover:text-white hover:bg-white/10 text-[11px] font-bold">
                 <FileText size={16} className="mr-2" /> View Report
              </Button>
              <div className="w-px h-6 bg-white/10 mx-1 self-center" />
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
                 <Download size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
                 <Printer size={18} />
              </Button>
           </div>
        </header>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative group">
           <div className="relative max-w-full max-h-full shadow-2xl shadow-black/60 rounded-xl overflow-hidden border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=800&fit=crop" 
                className="max-w-full max-h-full object-contain grayscale"
                alt="Radiograph Main"
              />
              {/* Mock Annotation */}
              <div className="absolute top-1/4 left-1/3 p-2 rounded-full border-2 border-primary/60 bg-primary/20 backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 text-[9px] font-bold text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Caries Suspected #3
                 </div>
              </div>
           </div>

           {/* Coordinates / Metadata Overlay */}
           <div className="absolute bottom-6 right-6 flex flex-col gap-1 text-right pointer-events-none">
              <p className="text-[10px] font-mono text-white/30 uppercase">Pos: 1042, 893 • Zoom: 1.2x</p>
              <p className="text-[10px] font-mono text-white/30 uppercase">Window: 1200 • Level: 450</p>
           </div>
        </div>

        {/* Bottom Film Strip */}
        <div className="h-24 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center gap-4 overflow-x-auto scrollbar-hide">
           {Array.from({ length: 8 }).map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "h-16 aspect-square rounded-lg border-2 cursor-pointer transition-all flex-shrink-0 relative group/thumb",
                 i === 0 ? "border-primary" : "border-white/5 hover:border-white/20"
               )}
             >
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=100&h=100&fit=crop" 
                  className={cn("w-full h-full object-cover grayscale rounded-md", i === 0 ? "opacity-100" : "opacity-40 group-hover/thumb:opacity-100")} 
                  alt="Film Thumb"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 text-[8px] font-bold text-white px-1 rounded">
                   {i + 1}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
