import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  Send, 
  AlertCircle,
  History,
  Info,
  CheckCircle2,
  ChevronDown,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const PrescriptionsTab = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-0 flex flex-col scrollbar-hide animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 min-h-full">
        
        {/* Left: Medication Builder & Active Rx */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Digital Prescription</h4>
            <button 
              className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History size={14} /> {showHistory ? "Hide History" : "View Previous Rx"}
            </button>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Medication Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Generic or brand name..." 
                  className="w-full h-11 pl-11 pr-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Dosage</label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-semibold text-slate-700 outline-none cursor-pointer">
                  <option>300 mg</option>
                  <option>600 mg</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Frequency</label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-semibold text-slate-700 outline-none cursor-pointer">
                  <option>TID (3x daily)</option>
                  <option>BID (2x daily)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Duration</label>
                <div className="flex gap-2">
                  <input type="number" className="w-14 h-10 px-3 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-semibold text-center" defaultValue={5} />
                  <select className="flex-1 h-10 px-3 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-semibold outline-none">
                    <option>Days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Special Instructions</label>
              <textarea 
                className="w-full h-24 p-4 rounded-md border border-slate-200 bg-slate-50/30 text-sm font-normal text-slate-600 focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none resize-none transition-all"
                placeholder="Take with food, avoid alcohol..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-primary transition-all" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Substitution</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-primary transition-all" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Refills (0)</span>
                </label>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                Add to List
              </button>
            </div>
          </div>

          {/* Active List Section */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Medications</h4>
            {[
              { drug: 'Clindamycin 300mg', type: 'Antibiotic', dose: '1 cap', freq: 'Three times daily', dur: '5 days' },
              { drug: 'Ibuprofen 600mg', type: 'NSAID', dose: '1 tab', freq: 'Every 8 hours PRN', dur: '3 days' }
            ].map((rx, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 group hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-500 border border-green-100">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-slate-800">{rx.drug}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{rx.type}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">{rx.dose} • {rx.freq} • {rx.dur}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-300 hover:text-primary transition-colors p-2"><Printer size={16} /></button>
                  <button className="text-slate-300 hover:text-destructive transition-colors p-2"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pharmacy & Interactions */}
        <div className="p-8 flex flex-col gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pharmacy Details</h4>
            </div>
            <div className="p-6 border border-slate-100 rounded-lg relative group">
              <span className="absolute top-[-8px] left-4 bg-white px-2 text-[9px] font-bold text-primary uppercase tracking-widest">Preferred</span>
              <p className="text-sm font-semibold text-slate-800">CVS Pharmacy #4820</p>
              <p className="text-[11px] text-slate-400 mt-1">120 Main St, Anna Nagar</p>
              <p className="text-[11px] text-slate-400">+91 44 2345 6789</p>
              <button className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider">Change Pharmacy</button>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Interactions Check</h4>
            <div className="flex items-start gap-3 p-4 bg-green-50/50 rounded-lg border border-green-100/50">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              <p className="text-[11px] font-medium text-green-700">No drug-drug interactions detected between selected medications.</p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button className="w-full bg-slate-900 text-white py-4 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              E-Prescribe to Pharmacy <Send size={14} />
            </button>
            <button className="w-full border border-slate-200 text-slate-600 py-4 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Print Paper Prescription <Printer size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
