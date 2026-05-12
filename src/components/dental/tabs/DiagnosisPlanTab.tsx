import React from 'react';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const DiagnosisPlanTab = () => {
  const { diagnoses, treatmentPlan } = useDentalConsultation();

  return (
    <div className="h-full overflow-y-auto p-0 flex flex-col scrollbar-hide animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 min-h-full">
        
        {/* Left: Problem List */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Problem List</h4>
            <button className="text-primary hover:text-primary/80 transition-colors">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {diagnoses.length > 0 ? (
              diagnoses.map(dx => (
                <div key={dx.id} className="group relative pl-4 py-1 border-l-2 border-slate-100 hover:border-primary/40 transition-all">
                  <div className={cn(
                    "absolute left-[-2px] top-0 w-[2px] h-full",
                    dx.status === 'Active' ? 'bg-destructive/40' : 'bg-green-500/40'
                  )} />
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-slate-800">{dx.title}</p>
                    <span className="text-[10px] font-bold text-slate-400">{dx.code}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex gap-1.5">
                      {dx.teeth.map(t => (
                        <span key={t} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Onset: {dx.onset}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                <ClipboardList size={32} className="mb-3" />
                <p className="text-[11px] font-semibold uppercase tracking-widest">No Diagnoses</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Treatment Plan */}
        <div className="p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Treatment Plan Builder</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Phased Planning & Estimates</p>
            </div>
            <div className="flex gap-4">
              <button className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hover:text-primary transition-colors">Insurance Pre-Auth</button>
              <button className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={14} /> Add Phase
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {['Emergency', 'Phase I', 'Phase II'].map((phase, i) => (
              <div key={phase} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{phase} Treatment</h5>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="space-y-3">
                  {[1, 2].map(item => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-slate-50 group hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-md">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 w-8 h-8 flex items-center justify-center rounded">#3</span>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-slate-700">Composite Filling - One Surface</p>
                            <span className="text-[10px] font-bold text-slate-400">D2140</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium">30 mins</span>
                            <span className="text-[10px] text-slate-400 font-medium italic">High Priority</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">₹1,500.00</p>
                        </div>
                        <button className="text-slate-300 hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 border border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all">
                    Add Procedure to {phase}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer: Estimate Summary - Minimalist */}
          <div className="mt-auto pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
                  <p className="text-lg font-bold text-slate-800">₹12,400.00</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Patient</p>
                  <p className="text-lg font-bold text-primary">₹4,200.00</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Insurance</p>
                  <p className="text-lg font-bold text-green-600">₹8,200.00</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                Present to Patient <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
