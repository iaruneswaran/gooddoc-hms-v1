import React from 'react';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const VisitNotesTab = () => {
  const { notes, updateNotes } = useDentalConsultation();

  const handleUpdate = (section: string, field: string, value: any) => {
    updateNotes({ [section]: { ...(notes as any)[section], [field]: value } });
  };

  return (
    <div className="h-full overflow-y-auto p-0 flex flex-col scrollbar-hide animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* SOAP Grid - Full Width, No Top Stroke */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full border-b border-slate-200 bg-white">
        
        {/* Subjective (S) */}
        <div className="p-8 border-b md:border-r border-slate-200 flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <h4 className="text-sm font-semibold text-slate-800">Subjective (S)</h4>
           </div>
           
           <div className="space-y-5 flex-1">
              <div className="space-y-2">
                 <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Chief Complaint & HPI</label>
                 <textarea 
                    className="w-full min-h-[100px] p-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none resize-none transition-all placeholder:text-slate-300"
                    placeholder="Why is the patient here today?"
                    value={notes.subjective.complaint}
                    onChange={(e) => handleUpdate('subjective', 'complaint', e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                 <div className="space-y-3">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pain Scale (0-10)</label>
                    <div className="flex gap-1.5">
                       {[0, 2, 4, 6, 8, 10].map(val => (
                         <button 
                            key={val}
                            onClick={() => handleUpdate('subjective', 'painScale', val)}
                            className={cn(
                              "flex-1 h-8 rounded-md text-[11px] font-semibold transition-all border",
                              notes.subjective.painScale === val 
                                ? "bg-primary text-white border-primary shadow-sm" 
                                : "bg-white text-slate-400 border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                            )}
                         >
                           {val}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="flex flex-col justify-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer group/check">
                       <div 
                          className={cn(
                             "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                             notes.subjective.historyReviewed ? "bg-primary border-primary text-white shadow-sm" : "bg-white border-slate-300 group-hover/check:border-primary/40"
                          )}
                          onClick={() => handleUpdate('subjective', 'historyReviewed', !notes.subjective.historyReviewed)}
                       >
                          {notes.subjective.historyReviewed && <CheckCircle2 size={14} strokeWidth={2.5} />}
                       </div>
                       <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Medical History Reviewed</span>
                    </label>
                 </div>
              </div>
           </div>
        </div>

        {/* Objective (O) */}
        <div className="p-8 border-b border-slate-200 flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <h4 className="text-sm font-semibold text-slate-800">Objective (O)</h4>
           </div>

           <div className="space-y-5 flex-1">
              <div className="grid grid-cols-4 gap-4">
                 {[
                   { id: 'bp', label: 'BP (mmHg)', val: notes.objective.vitals.bp },
                   { id: 'hr', label: 'HR (bpm)', val: notes.objective.vitals.hr },
                   { id: 'temp', label: 'Temp (°F)', val: notes.objective.vitals.temp },
                   { id: 'spo2', label: 'SpO2 (%)', val: notes.objective.vitals.spo2 }
                 ].map(v => (
                   <div key={v.id} className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">{v.label}</label>
                      <input 
                         type="text" 
                         className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none transition-all"
                         value={v.val}
                         onChange={(e) => handleUpdate('objective', 'vitals', { ...notes.objective.vitals, [v.id]: e.target.value })}
                      />
                   </div>
                 ))}
              </div>

              <div className="space-y-2 pt-4">
                 <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Extra & Intra-oral Exam Findings</label>
                 <textarea 
                    className="w-full min-h-[100px] p-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none resize-none transition-all placeholder:text-slate-300"
                    placeholder="Hard and soft tissue evaluation..."
                    value={notes.objective.examFindings}
                    onChange={(e) => handleUpdate('objective', 'examFindings', e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Assessment (A) */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <h4 className="text-sm font-semibold text-slate-800">Assessment (A)</h4>
           </div>
           
           <div className="space-y-2 flex-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Clinical Summary</label>
              <textarea 
                 className="w-full min-h-[120px] p-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none resize-none transition-all placeholder:text-slate-300"
                 placeholder="Professional evaluation..."
                 value={notes.assessment.summary}
                 onChange={(e) => handleUpdate('assessment', 'summary', e.target.value)}
              />
           </div>
        </div>

        {/* Plan (P) - Fits Left to Right, No Bold Fonts */}
        <div className="p-8 flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <h4 className="text-sm font-medium text-slate-700">Plan (P)</h4>
           </div>
           
           <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <label className="text-[12px] font-normal text-slate-500 whitespace-nowrap">Post-Op & Follow-up</label>
                 <textarea 
                    className="w-full min-h-[120px] p-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-normal text-slate-600 focus:ring-1 focus:ring-primary/20 focus:bg-white outline-none resize-none transition-all placeholder:text-slate-300"
                    placeholder="Planned care and follow-up intervals..."
                    value={notes.plan.proposed}
                    onChange={(e) => handleUpdate('plan', 'proposed', e.target.value)}
                 />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
