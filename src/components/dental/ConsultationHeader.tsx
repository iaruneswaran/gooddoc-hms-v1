import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientChip } from '@/components/patient-insights/PatientChip';
import { useDentalConsultation } from '@/contexts/DentalConsultationContext';
import { cn } from '@/lib/utils';

// Mock patient data for the banner
const PATIENT = {
  id: "GD3042",
  name: "Aditya Verma",
  age: 28,
  sex: "M",
  phone: "+91 98765 43210",
  email: "aditya.v@example.com",
  allergies: ["Penicillin", "Latex"],
  vitals: {
    bp: "120/80",
    hr: "72",
    temp: "98.6"
  }
};


export const PatientBanner = ({ onFinalize }: { onFinalize: () => void }) => {
  const { isDirty, saveConsultation, lastSaved } = useDentalConsultation();
  const navigate = useNavigate();

  return (
    <div className="relative bg-white border-b border-border flex-shrink-0 shadow-sm text-foreground overflow-hidden">
      <div className="relative z-10 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6">
              <PatientChip
                name={PATIENT.name}
                gdid={PATIENT.id}
                age={PATIENT.age}
                gender={PATIENT.sex === "M" ? "Male" : "Female"}
                showBackButton
                backPath="/dental/procedures"
                variant="default"
              />
              <div className="border-l border-border pl-5">
                <p className="text-xs font-medium text-foreground">{PATIENT.phone}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{PATIENT.email}</p>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => saveConsultation()}
                disabled={!isDirty}
                className={cn(
                  "h-8 px-3 text-sm font-medium rounded-[12px] transition-all",
                  isDirty ? "bg-primary text-white hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Save size={14} className="mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-[12px]"
                onClick={() => {
                  if (isDirty && !window.confirm("Unsaved changes will be lost. Cancel?")) return;
                  navigate('/dental/procedures');
                }}
              >
                Cancel Session
              </Button>
              <Button 
                onClick={onFinalize}
                className="h-8 px-3 text-sm font-medium bg-green-500 hover:bg-green-600 text-white border-none rounded-[12px]"
              >
                <CheckCircle2 size={14} className="mr-2" />
                Finalize Visit
              </Button>

              {lastSaved && (
                <div className="ml-4 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Last saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px] text-left">
                <p className="text-[11px] text-muted-foreground">Vitals (BP)</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{PATIENT.vitals.bp}</p>
             </div>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px] text-left">
                <p className="text-[11px] text-muted-foreground">Heart Rate</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{PATIENT.vitals.hr} bpm</p>
             </div>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px] text-left">
                <p className="text-[11px] text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-green-600 mt-0.5">In Progress</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
