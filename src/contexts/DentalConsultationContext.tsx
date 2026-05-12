import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ToothData, PerioExam, ToothPerio, SiteKey, PerioSite, Diagnosis, TreatmentPlanItem, SOAPNote, ImagingStudy, ToothNotation
} from '@/types/dental';
import { toast } from 'sonner';

interface DentalConsultationContextType {
  // State
  teethData: Record<number, ToothData>;
  perioExam: PerioExam;
  diagnoses: Diagnosis[];
  treatmentPlan: TreatmentPlanItem[];
  notes: SOAPNote;
  imaging: ImagingStudy[];
  
  // Actions
  updateTooth: (id: number, data: Partial<ToothData>) => void;
  updatePerioTooth: (toothNumber: string, data: Partial<ToothPerio>) => void;
  updatePerioSite: (toothNumber: string, site: SiteKey, data: Partial<PerioSite>) => void;
  setNotation: (notation: ToothNotation) => void;
  addDiagnosis: (dx: Diagnosis) => void;
  updateTreatmentPlan: (item: TreatmentPlanItem) => void;
  updateNotes: (data: Partial<SOAPNote>) => void;
  saveConsultation: () => Promise<void>;
  isDirty: boolean;
  lastSaved: Date | null;
}

const DEFAULT_PERIO_SITE: PerioSite = { pd: 3, gm: 0, bop: false, sup: false, plaque: false, cal: 3 };

const createEmptyToothPerio = (toothNumber: string): ToothPerio => ({
  toothNumber,
  sites: {
    MB: { ...DEFAULT_PERIO_SITE },
    B: { ...DEFAULT_PERIO_SITE },
    DB: { ...DEFAULT_PERIO_SITE },
    ML: { ...DEFAULT_PERIO_SITE },
    L: { ...DEFAULT_PERIO_SITE },
    DL: { ...DEFAULT_PERIO_SITE },
  }
});

const DentalConsultationContext = createContext<DentalConsultationContextType | undefined>(undefined);

export const DentalConsultationProvider: React.FC<{ patientId: string; children: React.ReactNode }> = ({ patientId, children }) => {
  const [teethData, setTeethData] = useState<Record<number, ToothData>>({});
  const [perioExam, setPerioExam] = useState<PerioExam>({
    examId: `ex_${new Date().toISOString().split('T')[0]}`,
    patientId,
    providerId: 'dr_456',
    numberingSystem: 'Universal',
    date: new Date().toISOString(),
    teeth: {}
  });
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlanItem[]>([]);
  const [notes, setNotes] = useState<SOAPNote>({
    subjective: { complaint: '', hpi: '', painScale: 0, historyReviewed: false },
    objective: { vitals: { bp: '', hr: '', temp: '', spo2: '' }, examFindings: '' },
    assessment: { summary: '', diagnoses: [] },
    plan: { proposed: '', education: '', consentSigned: false, followUp: '' }
  });
  const [imaging, setImaging] = useState<ImagingStudy[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateTooth = (id: number, data: Partial<ToothData>) => {
    setTeethData(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { id, condition: [], surfaces: {}, notes: '', images: [] }), ...data }
    }));
    setIsDirty(true);
  };

  const updatePerioTooth = (toothNumber: string, data: Partial<ToothPerio>) => {
    setPerioExam(prev => ({
      ...prev,
      teeth: {
        ...prev.teeth,
        [toothNumber]: { ...(prev.teeth[toothNumber] || createEmptyToothPerio(toothNumber)), ...data }
      }
    }));
    setIsDirty(true);
  };

  const updatePerioSite = (toothNumber: string, site: SiteKey, data: Partial<PerioSite>) => {
    setPerioExam(prev => {
      const tooth = prev.teeth[toothNumber] || createEmptyToothPerio(toothNumber);
      const currentSite = tooth.sites[site];
      const newPD = data.pd !== undefined ? data.pd : currentSite.pd;
      const newGM = data.gm !== undefined ? data.gm : currentSite.gm;
      
      // Auto-compute CAL
      const cal = (newPD !== null && newGM !== null) ? newPD + newGM : null;

      return {
        ...prev,
        teeth: {
          ...prev.teeth,
          [toothNumber]: {
            ...tooth,
            sites: {
              ...tooth.sites,
              [site]: { ...currentSite, ...data, cal }
            }
          }
        }
      };
    });
    setIsDirty(true);
  };

  const setNotation = (notation: ToothNotation) => {
    setPerioExam(prev => ({ ...prev, numberingSystem: notation }));
    setIsDirty(true);
  };

  const addDiagnosis = (dx: Diagnosis) => {
    setDiagnoses(prev => [...prev, dx]);
    setIsDirty(true);
  };

  const updateTreatmentPlan = (item: TreatmentPlanItem) => {
    setTreatmentPlan(prev => {
      const index = prev.findIndex(p => p.id === item.id);
      if (index > -1) {
        const newPlan = [...prev];
        newPlan[index] = item;
        return newPlan;
      }
      return [...prev, item];
    });
    setIsDirty(true);
  };

  const updateNotes = (data: Partial<SOAPNote>) => {
    setNotes(prev => ({ ...prev, ...data }));
    setIsDirty(true);
  };

  const saveConsultation = useCallback(async () => {
    if (!isDirty) return;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsDirty(false);
        setLastSaved(new Date());
        toast.success("Progress saved automatically");
        resolve();
      }, 500);
    });
  }, [isDirty]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) saveConsultation();
    }, 30000);
    return () => clearInterval(timer);
  }, [isDirty, saveConsultation]);

  return (
    <DentalConsultationContext.Provider value={{
      teethData,
      perioExam,
      diagnoses,
      treatmentPlan,
      notes,
      imaging,
      updateTooth,
      updatePerioTooth,
      updatePerioSite,
      setNotation,
      addDiagnosis,
      updateTreatmentPlan,
      updateNotes,
      saveConsultation,
      isDirty,
      lastSaved
    }}>
      {children}
    </DentalConsultationContext.Provider>
  );
};

export const useDentalConsultation = () => {
  const context = useContext(DentalConsultationContext);
  if (!context) throw new Error('useDentalConsultation must be used within a DentalConsultationProvider');
  return context;
};
