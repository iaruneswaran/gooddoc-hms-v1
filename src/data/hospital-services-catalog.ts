// Hospital Services Master Catalog
// Code prefix legend and comprehensive service items

export interface HospitalService {
  code: string;
  name: string;
  category: string;
  department: string;
  unit: string;
  mrp: number; // in INR
}

// Administration & Registration (ADM)
export const ADMIN_SERVICES: HospitalService[] = [
  { code: "ADM001", name: "Front desk registration (new patient)", category: "Procedure", department: "Administration", unit: "registration", mrp: 100 },
  { code: "ADM002", name: "Re-registration (OPD card re-issue)", category: "Procedure", department: "Administration", unit: "visit", mrp: 50 },
  { code: "ADM003", name: "Emergency registration", category: "Procedure", department: "Administration", unit: "visit", mrp: 150 },
  { code: "ADM004", name: "File creation/medical record initiation", category: "Procedure", department: "Administration", unit: "file", mrp: 75 },
  { code: "ADM005", name: "Appointment no-show fee", category: "Procedure", department: "Administration", unit: "instance", mrp: 200 },
  { code: "ADM006", name: "Admission processing", category: "Procedure", department: "Administration", unit: "admission", mrp: 500 },
  { code: "ADM007", name: "Discharge processing", category: "Procedure", department: "Administration", unit: "discharge", mrp: 300 },
  { code: "ADM008", name: "TPA/Insurance coordination fee", category: "Procedure", department: "Administration", unit: "admission", mrp: 1000 },
  { code: "ADM009", name: "Attendant pass", category: "Procedure", department: "Administration", unit: "pass", mrp: 100 },
  { code: "ADM010", name: "Visitor pass", category: "Procedure", department: "Administration", unit: "pass", mrp: 50 },
];

// Outpatient & Consultation (OPD/CON)
export const OPD_SERVICES: HospitalService[] = [
  { code: "OPD001", name: "General physician consultation", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 500 },
  { code: "OPD002", name: "Specialist consultation", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 800 },
  { code: "OPD003", name: "Super-specialist consultation", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 1500 },
  { code: "OPD004", name: "Emergency consultation (off-hours)", category: "Consultation", department: "Emergency", unit: "visit", mrp: 2000 },
  { code: "OPD005", name: "Follow-up visit (within X days)", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 300 },
  { code: "OPD006", name: "Teleconsultation (audio/video)", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 400 },
  { code: "OPD007", name: "Second opinion review", category: "Consultation", department: "General Medicine", unit: "visit", mrp: 1000 },
  { code: "OPD008", name: "Nursing triage (OPD)", category: "Nursing", department: "Nursing", unit: "event", mrp: 100 },
];

// Nursing Services (NRS)
export const NURSING_SERVICES: HospitalService[] = [
  { code: "NRS001", name: "Injection IM/SC", category: "Nursing", department: "Nursing", unit: "dose", mrp: 50 },
  { code: "NRS002", name: "Injection IV push", category: "Nursing", department: "Nursing", unit: "dose", mrp: 100 },
  { code: "NRS003", name: "IV cannulation", category: "Nursing", department: "Nursing", unit: "event", mrp: 150 },
  { code: "NRS004", name: "IV fluid infusion setup", category: "Nursing", department: "Nursing", unit: "infusion", mrp: 200 },
  { code: "NRS005", name: "Nebulisation", category: "Nursing", department: "Nursing", unit: "session", mrp: 100 },
  { code: "NRS006", name: "Wound dressing – small", category: "Nursing", department: "Nursing", unit: "dressing", mrp: 150 },
  { code: "NRS007", name: "Wound dressing – large/complex", category: "Nursing", department: "Nursing", unit: "dressing", mrp: 350 },
  { code: "NRS008", name: "Suture application (minor)", category: "Nursing", department: "Nursing", unit: "wound", mrp: 500 },
  { code: "NRS009", name: "Suture removal", category: "Nursing", department: "Nursing", unit: "wound", mrp: 150 },
  { code: "NRS010", name: "Catheterisation (urinary)", category: "Nursing", department: "Nursing", unit: "event", mrp: 300 },
  { code: "NRS011", name: "Catheter care/change", category: "Nursing", department: "Nursing", unit: "event", mrp: 200 },
  { code: "NRS012", name: "NG/Ryle's tube insertion", category: "Nursing", department: "Nursing", unit: "event", mrp: 250 },
  { code: "NRS013", name: "Enema", category: "Nursing", department: "Nursing", unit: "event", mrp: 200 },
  { code: "NRS014", name: "Tracheostomy care", category: "Nursing", department: "Nursing", unit: "day", mrp: 500 },
  { code: "NRS015", name: "Stoma care", category: "Nursing", department: "Nursing", unit: "day", mrp: 400 },
  { code: "NRS016", name: "Vital signs monitoring (enhanced)", category: "Nursing", department: "Nursing", unit: "day", mrp: 300 },
  { code: "NRS017", name: "Nursing escort within hospital", category: "Nursing", department: "Nursing", unit: "hour", mrp: 200 },
  { code: "NRS018", name: "Patient attendant/care giver (nursing aide)", category: "Nursing", department: "Nursing", unit: "shift", mrp: 800 },
];

// Rooms, Beds, ICU (BED/ICU)
export const BED_SERVICES: HospitalService[] = [
  { code: "BED001", name: "General ward bed", category: "Room", department: "Inpatient", unit: "day", mrp: 1500 },
  { code: "BED002", name: "Semi-private room", category: "Room", department: "Inpatient", unit: "day", mrp: 3000 },
  { code: "BED003", name: "Private room", category: "Room", department: "Inpatient", unit: "day", mrp: 5000 },
  { code: "BED004", name: "Deluxe/Suite room", category: "Room", department: "Inpatient", unit: "day", mrp: 8000 },
  { code: "BED005", name: "Daycare bed (≤8 hrs)", category: "Room", department: "Inpatient", unit: "day", mrp: 1000 },
  { code: "BED006", name: "Isolation room surcharge", category: "Room", department: "Inpatient", unit: "day", mrp: 2000 },
  { code: "ICU001", name: "ICU bed", category: "Room", department: "ICU", unit: "day", mrp: 15000 },
  { code: "ICU002", name: "HDU bed", category: "Room", department: "ICU", unit: "day", mrp: 10000 },
  { code: "ICU003", name: "PICU bed", category: "Room", department: "ICU", unit: "day", mrp: 12000 },
  { code: "ICU004", name: "NICU bed", category: "Room", department: "ICU", unit: "day", mrp: 12000 },
  { code: "ICU005", name: "Step-down ICU", category: "Room", department: "ICU", unit: "day", mrp: 8000 },
  { code: "BED007", name: "Extra attendant bed", category: "Room", department: "Inpatient", unit: "day", mrp: 500 },
];

// Equipment & Monitoring (EQP)
export const EQUIPMENT_SERVICES: HospitalService[] = [
  { code: "EQP001", name: "Cardiac monitor", category: "Procedure", department: "ICU", unit: "day", mrp: 1000 },
  { code: "EQP002", name: "Infusion pump", category: "Procedure", department: "ICU", unit: "day", mrp: 500 },
  { code: "EQP003", name: "Syringe pump", category: "Procedure", department: "ICU", unit: "day", mrp: 400 },
  { code: "EQP004", name: "CPAP", category: "Procedure", department: "Pulmonology", unit: "day", mrp: 2000 },
  { code: "EQP005", name: "BiPAP", category: "Procedure", department: "Pulmonology", unit: "day", mrp: 3000 },
  { code: "EQP006", name: "Ventilator (if not bundled in ICU)", category: "Procedure", department: "ICU", unit: "day", mrp: 5000 },
  { code: "EQP007", name: "Defibrillator standby", category: "Procedure", department: "Emergency", unit: "case", mrp: 1500 },
  { code: "EQP008", name: "DVT pump", category: "Procedure", department: "ICU", unit: "day", mrp: 800 },
  { code: "EQP009", name: "Physiologic multi-parameter monitor", category: "Procedure", department: "ICU", unit: "day", mrp: 1200 },
  { code: "EQP010", name: "Patient warmer", category: "Procedure", department: "ICU", unit: "day", mrp: 600 },
];

// Medical Gases & Oxygen (GAS)
export const GAS_SERVICES: HospitalService[] = [
  { code: "GAS001", name: "Oxygen therapy", category: "Procedure", department: "Pulmonology", unit: "hour", mrp: 100 },
  { code: "GAS002", name: "High-flow nasal cannula (HFNC)", category: "Procedure", department: "Pulmonology", unit: "hour", mrp: 300 },
  { code: "GAS003", name: "Cylinder rental (ward use)", category: "Procedure", department: "Inpatient", unit: "day", mrp: 500 },
  { code: "GAS004", name: "Medical air", category: "Procedure", department: "Pulmonology", unit: "hour", mrp: 50 },
  { code: "GAS005", name: "Nebuliser kit (disposable)", category: "Procedure", department: "Pulmonology", unit: "kit", mrp: 150 },
];

// Minor Procedures / Procedure Room (MIN)
export const MINOR_PROCEDURES: HospitalService[] = [
  { code: "MIN001", name: "Incision & drainage (I&D)", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 2000 },
  { code: "MIN002", name: "Wound debridement", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 3000 },
  { code: "MIN003", name: "Nail avulsion", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 1500 },
  { code: "MIN004", name: "Corn/wart cautery", category: "Procedure", department: "Dermatology", unit: "lesion", mrp: 500 },
  { code: "MIN005", name: "Foreign body removal (skin/soft tissue)", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 2000 },
  { code: "MIN006", name: "Lumbar puncture", category: "Procedure", department: "Neurology", unit: "procedure", mrp: 3500 },
  { code: "MIN007", name: "Pleural tapping (diagnostic)", category: "Procedure", department: "Pulmonology", unit: "procedure", mrp: 2500 },
  { code: "MIN008", name: "Ascitic tapping (diagnostic)", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 2500 },
  { code: "MIN009", name: "Intercostal drain insertion", category: "Procedure", department: "Pulmonology", unit: "procedure", mrp: 5000 },
  { code: "MIN010", name: "Central line insertion", category: "Procedure", department: "ICU", unit: "procedure", mrp: 4000 },
  { code: "MIN011", name: "Arterial line insertion", category: "Procedure", department: "ICU", unit: "procedure", mrp: 3000 },
  { code: "MIN012", name: "Peritoneal dialysis catheter placement (bedside)", category: "Procedure", department: "Nephrology", unit: "procedure", mrp: 8000 },
  { code: "MIN013", name: "POP slab/application", category: "Procedure", department: "Orthopaedics", unit: "limb", mrp: 1500 },
  { code: "MIN014", name: "POP removal", category: "Procedure", department: "Orthopaedics", unit: "limb", mrp: 500 },
  { code: "MIN015", name: "Joint aspiration/injection (large joint)", category: "Procedure", department: "Orthopaedics", unit: "joint", mrp: 2000 },
];

// Operation Theatre (OT usage)
export const OT_SERVICES: HospitalService[] = [
  { code: "OT001", name: "OT charges – Minor", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 5000 },
  { code: "OT002", name: "OT charges – Intermediate", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 10000 },
  { code: "OT003", name: "OT charges – Major", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 20000 },
  { code: "OT004", name: "OT charges – Super major", category: "Procedure", department: "Surgery", unit: "procedure", mrp: 35000 },
  { code: "OT005", name: "OT time – additional 30 min", category: "Procedure", department: "Surgery", unit: "block", mrp: 3000 },
  { code: "OT006", name: "C-arm usage", category: "Procedure", department: "Surgery", unit: "case", mrp: 5000 },
  { code: "OT007", name: "Operating microscope usage", category: "Procedure", department: "Surgery", unit: "case", mrp: 8000 },
  { code: "OT008", name: "Laparoscopy tower usage", category: "Procedure", department: "Surgery", unit: "case", mrp: 10000 },
  { code: "OT009", name: "Endoscopy tower usage", category: "Procedure", department: "Surgery", unit: "case", mrp: 8000 },
  { code: "OT010", name: "Laser usage (OR)", category: "Procedure", department: "Surgery", unit: "case", mrp: 15000 },
  { code: "OT011", name: "OT consumable pack – Minor", category: "Procedure", department: "Surgery", unit: "case", mrp: 2000 },
  { code: "OT012", name: "OT consumable pack – Major", category: "Procedure", department: "Surgery", unit: "case", mrp: 5000 },
  { code: "OT013", name: "OT sterilisation surcharge (implant cases)", category: "Procedure", department: "Surgery", unit: "case", mrp: 3000 },
];

// Anaesthesia (ANE)
export const ANAESTHESIA_SERVICES: HospitalService[] = [
  { code: "ANE001", name: "Local anaesthesia", category: "Procedure", department: "Anaesthesia", unit: "case", mrp: 1000 },
  { code: "ANE002", name: "Regional block (single)", category: "Procedure", department: "Anaesthesia", unit: "case", mrp: 3000 },
  { code: "ANE003", name: "Spinal/Epidural", category: "Procedure", department: "Anaesthesia", unit: "case", mrp: 5000 },
  { code: "ANE004", name: "General anaesthesia – up to 1 hr", category: "Procedure", department: "Anaesthesia", unit: "case", mrp: 8000 },
  { code: "ANE005", name: "GA – each additional 30 min", category: "Procedure", department: "Anaesthesia", unit: "block", mrp: 3000 },
  { code: "ANE006", name: "Sedation/MAC", category: "Procedure", department: "Anaesthesia", unit: "case", mrp: 4000 },
  { code: "ANE007", name: "Ultrasound-guided nerve block", category: "Procedure", department: "Anaesthesia", unit: "block", mrp: 5000 },
  { code: "ANE008", name: "Anaesthetist consultation (pre-anaesthesia check)", category: "Consultation", department: "Anaesthesia", unit: "visit", mrp: 500 },
];

// Endoscopy (GI)
export const ENDOSCOPY_SERVICES: HospitalService[] = [
  { code: "END001", name: "Upper GI endoscopy (diagnostic)", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 5000 },
  { code: "END002", name: "Colonoscopy (diagnostic)", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 8000 },
  { code: "END003", name: "Sigmoidoscopy", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 4000 },
  { code: "END004", name: "ERCP (diagnostic)", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 15000 },
  { code: "END005", name: "ERCP with stenting", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 25000 },
  { code: "END006", name: "Endoscopic polypectomy", category: "Procedure", department: "Gastroenterology", unit: "polyp", mrp: 5000 },
  { code: "END007", name: "Endoscopic band ligation", category: "Procedure", department: "Gastroenterology", unit: "session", mrp: 8000 },
  { code: "END008", name: "Endoscopic biopsy", category: "Procedure", department: "Gastroenterology", unit: "site", mrp: 2000 },
  { code: "END009", name: "Capsule endoscopy", category: "Procedure", department: "Gastroenterology", unit: "procedure", mrp: 35000 },
  { code: "END010", name: "Endoscopic dilatation", category: "Procedure", department: "Gastroenterology", unit: "session", mrp: 6000 },
];

// Bronchoscopy (BRN)
export const BRONCHOSCOPY_SERVICES: HospitalService[] = [
  { code: "BRN001", name: "Flexible bronchoscopy (diagnostic)", category: "Procedure", department: "Pulmonology", unit: "procedure", mrp: 8000 },
  { code: "BRN002", name: "Bronchoalveolar lavage (BAL)", category: "Procedure", department: "Pulmonology", unit: "add-on", mrp: 3000 },
  { code: "BRN003", name: "Endobronchial biopsy", category: "Procedure", department: "Pulmonology", unit: "site", mrp: 4000 },
  { code: "BRN004", name: "Transbronchial lung biopsy", category: "Procedure", department: "Pulmonology", unit: "site", mrp: 6000 },
  { code: "BRN005", name: "EBUS (diagnostic)", category: "Procedure", department: "Pulmonology", unit: "procedure", mrp: 25000 },
];

// Urology procedures (URO)
export const UROLOGY_SERVICES: HospitalService[] = [
  { code: "URO001", name: "Cystoscopy (diagnostic)", category: "Procedure", department: "Urology", unit: "procedure", mrp: 5000 },
  { code: "URO002", name: "Cystoscopy with biopsy", category: "Procedure", department: "Urology", unit: "procedure", mrp: 8000 },
  { code: "URO003", name: "DJ stent insertion", category: "Procedure", department: "Urology", unit: "procedure", mrp: 10000 },
  { code: "URO004", name: "DJ stent removal", category: "Procedure", department: "Urology", unit: "procedure", mrp: 5000 },
  { code: "URO005", name: "Urethral dilatation", category: "Procedure", department: "Urology", unit: "session", mrp: 3000 },
  { code: "URO006", name: "Ureteroscopy (URS)", category: "Procedure", department: "Urology", unit: "procedure", mrp: 25000 },
  { code: "URO007", name: "TURP", category: "Procedure", department: "Urology", unit: "procedure", mrp: 45000 },
  { code: "URO008", name: "TURBT", category: "Procedure", department: "Urology", unit: "procedure", mrp: 35000 },
  { code: "URO009", name: "PCNL", category: "Procedure", department: "Urology", unit: "procedure", mrp: 60000 },
  { code: "URO010", name: "ESWL (lithotripsy)", category: "Procedure", department: "Urology", unit: "session", mrp: 25000 },
  { code: "URO011", name: "Suprapubic catheter insertion", category: "Procedure", department: "Urology", unit: "procedure", mrp: 5000 },
];

// ENT procedures (ENT)
export const ENT_SERVICES: HospitalService[] = [
  { code: "ENT001", name: "Nasal endoscopy", category: "Procedure", department: "ENT", unit: "procedure", mrp: 2000 },
  { code: "ENT002", name: "Laryngoscopy (DL)", category: "Procedure", department: "ENT", unit: "procedure", mrp: 3000 },
  { code: "ENT003", name: "Ear syringing", category: "Procedure", department: "ENT", unit: "ear", mrp: 500 },
  { code: "ENT004", name: "Foreign body removal (ENT)", category: "Procedure", department: "ENT", unit: "case", mrp: 2000 },
  { code: "ENT005", name: "Myringotomy with grommet", category: "Procedure", department: "ENT", unit: "ear", mrp: 15000 },
  { code: "ENT006", name: "FESS", category: "Procedure", department: "ENT", unit: "procedure", mrp: 45000 },
  { code: "ENT007", name: "Tonsillectomy", category: "Procedure", department: "ENT", unit: "procedure", mrp: 25000 },
  { code: "ENT008", name: "Septoplasty", category: "Procedure", department: "ENT", unit: "procedure", mrp: 35000 },
  { code: "ENT009", name: "Tracheostomy", category: "Procedure", department: "ENT", unit: "procedure", mrp: 20000 },
];

// Ophthalmology (OPH)
export const OPHTHALMOLOGY_SERVICES: HospitalService[] = [
  { code: "OPH001", name: "Cataract surgery – Phaco with monofocal IOL", category: "Procedure", department: "Ophthalmology", unit: "eye", mrp: 25000 },
  { code: "OPH002", name: "Cataract surgery – Premium IOL", category: "Procedure", department: "Ophthalmology", unit: "eye", mrp: 50000 },
  { code: "OPH003", name: "YAG capsulotomy", category: "Procedure", department: "Ophthalmology", unit: "eye", mrp: 5000 },
  { code: "OPH004", name: "Pterygium excision", category: "Procedure", department: "Ophthalmology", unit: "eye", mrp: 15000 },
  { code: "OPH005", name: "Intravitreal injection (drug extra)", category: "Procedure", department: "Ophthalmology", unit: "injection", mrp: 5000 },
  { code: "OPH006", name: "LASIK (both eyes)", category: "Package", department: "Ophthalmology", unit: "package", mrp: 80000 },
  { code: "OPH007", name: "Corneal foreign body removal", category: "Procedure", department: "Ophthalmology", unit: "eye", mrp: 2000 },
];

// Obstetrics & Gynaecology (OBS)
export const OBS_SERVICES: HospitalService[] = [
  { code: "OBS001", name: "Normal vaginal delivery", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "delivery", mrp: 25000 },
  { code: "OBS002", name: "Assisted delivery (forceps/vacuum)", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "delivery", mrp: 35000 },
  { code: "OBS003", name: "LSCS (Caesarean)", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "delivery", mrp: 60000 },
  { code: "OBS004", name: "MTP/D&E", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 15000 },
  { code: "OBS005", name: "D&C", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 10000 },
  { code: "OBS006", name: "Hysteroscopy (diagnostic)", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 12000 },
  { code: "OBS007", name: "Hysteroscopy with polypectomy", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 20000 },
  { code: "OBS008", name: "IUCD insertion", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 2000 },
  { code: "OBS009", name: "Copper-T removal", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 1000 },
  { code: "OBS010", name: "Laparoscopic diagnostic", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 25000 },
  { code: "OBS011", name: "Laparoscopic ovarian cystectomy", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 45000 },
  { code: "OBS012", name: "Hysterectomy (Abdominal/Vaginal/Laparoscopic)", category: "Procedure", department: "Obstetrics & Gynaecology", unit: "procedure", mrp: 75000 },
];

// Orthopaedics (ORT)
export const ORTHO_SERVICES: HospitalService[] = [
  { code: "ORT001", name: "Plaster application – slab/cast", category: "Procedure", department: "Orthopaedics", unit: "limb", mrp: 1500 },
  { code: "ORT002", name: "Traction application", category: "Procedure", department: "Orthopaedics", unit: "limb/day", mrp: 500 },
  { code: "ORT003", name: "Joint injection (USG-guided if applicable)", category: "Procedure", department: "Orthopaedics", unit: "joint", mrp: 2500 },
  { code: "ORT004", name: "Arthroscopy – diagnostic", category: "Procedure", department: "Orthopaedics", unit: "joint", mrp: 25000 },
  { code: "ORT005", name: "Arthroscopy with meniscectomy/repair", category: "Procedure", department: "Orthopaedics", unit: "joint", mrp: 50000 },
  { code: "ORT006", name: "Open reduction & internal fixation (ORIF)", category: "Procedure", department: "Orthopaedics", unit: "bone", mrp: 40000 },
  { code: "ORT007", name: "THR (Total hip replacement)", category: "Procedure", department: "Orthopaedics", unit: "side", mrp: 150000 },
  { code: "ORT008", name: "TKR (Total knee replacement)", category: "Procedure", department: "Orthopaedics", unit: "side", mrp: 150000 },
  { code: "ORT009", name: "External fixator application", category: "Procedure", department: "Orthopaedics", unit: "limb", mrp: 20000 },
  { code: "ORT010", name: "Implant removal", category: "Procedure", department: "Orthopaedics", unit: "implant", mrp: 15000 },
];

// Cardiology diagnostics & Cath Lab (CAR)
export const CARDIOLOGY_SERVICES: HospitalService[] = [
  { code: "CAR001", name: "ECG 12-lead", category: "Procedure", department: "Cardiology", unit: "test", mrp: 300 },
  { code: "CAR002", name: "TMT (Stress test)", category: "Procedure", department: "Cardiology", unit: "test", mrp: 1500 },
  { code: "CAR003", name: "2D Echo with Doppler", category: "Procedure", department: "Cardiology", unit: "test", mrp: 2500 },
  { code: "CAR004", name: "Stress Echo", category: "Procedure", department: "Cardiology", unit: "test", mrp: 5000 },
  { code: "CAR005", name: "Holter monitoring 24-hr", category: "Procedure", department: "Cardiology", unit: "study", mrp: 3000 },
  { code: "CAR006", name: "ABPM 24-hr", category: "Procedure", department: "Cardiology", unit: "study", mrp: 2000 },
  { code: "CAR007", name: "Coronary angiography", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 25000 },
  { code: "CAR008", name: "Coronary angioplasty (single vessel; stent extra)", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 80000 },
  { code: "CAR009", name: "Peripheral angiography", category: "Procedure", department: "Cardiology", unit: "limb", mrp: 20000 },
  { code: "CAR010", name: "Peripheral angioplasty", category: "Procedure", department: "Cardiology", unit: "limb", mrp: 60000 },
  { code: "CAR011", name: "Pacemaker implantation (single chamber)", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 80000 },
  { code: "CAR012", name: "Pacemaker implantation (dual chamber)", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 120000 },
  { code: "CAR013", name: "ICD/CRT implantation", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 300000 },
  { code: "CAR014", name: "EP study", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 50000 },
  { code: "CAR015", name: "RFA (arrhythmia ablation)", category: "Procedure", department: "Cardiology", unit: "procedure", mrp: 100000 },
];

// Pulmonology diagnostics (PUL)
export const PULMONOLOGY_SERVICES: HospitalService[] = [
  { code: "PUL001", name: "Spirometry", category: "Procedure", department: "Pulmonology", unit: "test", mrp: 500 },
  { code: "PUL002", name: "Spirometry with bronchodilator", category: "Procedure", department: "Pulmonology", unit: "test", mrp: 800 },
  { code: "PUL003", name: "DLCO", category: "Procedure", department: "Pulmonology", unit: "test", mrp: 1500 },
  { code: "PUL004", name: "FeNO", category: "Procedure", department: "Pulmonology", unit: "test", mrp: 1000 },
  { code: "PUL005", name: "6-minute walk test", category: "Procedure", department: "Pulmonology", unit: "test", mrp: 500 },
  { code: "PUL006", name: "Sleep study (Level 1 PSG)", category: "Procedure", department: "Pulmonology", unit: "night", mrp: 15000 },
  { code: "PUL007", name: "Sleep study (Level 3 HSAT)", category: "Procedure", department: "Pulmonology", unit: "night", mrp: 5000 },
];

// Neurology diagnostics (NEU)
export const NEUROLOGY_SERVICES: HospitalService[] = [
  { code: "NEU001", name: "EEG", category: "Procedure", department: "Neurology", unit: "test", mrp: 2000 },
  { code: "NEU002", name: "Video EEG (up to 2 hrs)", category: "Procedure", department: "Neurology", unit: "test", mrp: 5000 },
  { code: "NEU003", name: "NCS (nerve conduction study)", category: "Procedure", department: "Neurology", unit: "limb", mrp: 3000 },
  { code: "NEU004", name: "EMG", category: "Procedure", department: "Neurology", unit: "muscle group", mrp: 3000 },
  { code: "NEU005", name: "VEP", category: "Procedure", department: "Neurology", unit: "test", mrp: 1500 },
  { code: "NEU006", name: "BAER/BERA", category: "Procedure", department: "Neurology", unit: "test", mrp: 2000 },
  { code: "NEU007", name: "Autonomic function tests", category: "Procedure", department: "Neurology", unit: "battery", mrp: 3000 },
];

// Urodynamics/Pelvic floor (UDY)
export const URODYNAMICS_SERVICES: HospitalService[] = [
  { code: "UDY001", name: "Uroflowmetry", category: "Procedure", department: "Urology", unit: "test", mrp: 500 },
  { code: "UDY002", name: "Urodynamic study", category: "Procedure", department: "Urology", unit: "test", mrp: 5000 },
  { code: "UDY003", name: "Post-void residual (bladder scan)", category: "Procedure", department: "Urology", unit: "test", mrp: 300 },
  { code: "UDY004", name: "Pelvic floor biofeedback session", category: "Procedure", department: "Urology", unit: "session", mrp: 1500 },
];

// Dialysis/Nephrology (DIAL)
export const DIALYSIS_SERVICES: HospitalService[] = [
  { code: "DIAL001", name: "Hemodialysis session (4 hrs) – dialyser reuse", category: "Procedure", department: "Nephrology", unit: "session", mrp: 2000 },
  { code: "DIAL002", name: "Hemodialysis session (4 hrs) – dialyser new", category: "Procedure", department: "Nephrology", unit: "session", mrp: 3500 },
  { code: "DIAL003", name: "SLED", category: "Procedure", department: "Nephrology", unit: "session", mrp: 8000 },
  { code: "DIAL004", name: "CRRT", category: "Procedure", department: "Nephrology", unit: "hour", mrp: 2000 },
  { code: "DIAL005", name: "Heparin charge", category: "Procedure", department: "Nephrology", unit: "session", mrp: 200 },
  { code: "DIAL006", name: "Bicarbonate/dialysate charge", category: "Procedure", department: "Nephrology", unit: "session", mrp: 500 },
  { code: "DIAL007", name: "AV fistula cannulation", category: "Procedure", department: "Nephrology", unit: "session", mrp: 300 },
  { code: "DIAL008", name: "Dialyser reprocessing", category: "Procedure", department: "Nephrology", unit: "cycle", mrp: 200 },
];

// Physiotherapy & Rehabilitation (PHY)
export const PHYSIOTHERAPY_SERVICES: HospitalService[] = [
  { code: "PHY001", name: "Physiotherapy assessment", category: "Consultation", department: "Physiotherapy", unit: "visit", mrp: 500 },
  { code: "PHY002", name: "Exercise therapy session (OPD)", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 400 },
  { code: "PHY003", name: "Manual therapy session", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 500 },
  { code: "PHY004", name: "Electrotherapy (TENS/IFT/US)", category: "Procedure", department: "Physiotherapy", unit: "modality/session", mrp: 300 },
  { code: "PHY005", name: "Traction (cervical/lumbar)", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 400 },
  { code: "PHY006", name: "Gait training", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 500 },
  { code: "PHY007", name: "Post-operative rehab (IPD)", category: "Procedure", department: "Physiotherapy", unit: "day", mrp: 800 },
  { code: "PHY008", name: "Neuro-rehab session", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 600 },
  { code: "PHY009", name: "Paediatric physio session", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 500 },
  { code: "PHY010", name: "Occupational therapy session", category: "Procedure", department: "Physiotherapy", unit: "session", mrp: 500 },
];

// Speech & Hearing (SPH)
export const SPEECH_SERVICES: HospitalService[] = [
  { code: "SPH001", name: "Speech-language evaluation", category: "Consultation", department: "Speech Therapy", unit: "visit", mrp: 800 },
  { code: "SPH002", name: "Speech therapy session", category: "Procedure", department: "Speech Therapy", unit: "session", mrp: 500 },
  { code: "SPH003", name: "Audiometry (Pure tone)", category: "Procedure", department: "Audiology", unit: "test", mrp: 500 },
  { code: "SPH004", name: "Impedance audiometry (Tympanometry)", category: "Procedure", department: "Audiology", unit: "test", mrp: 400 },
  { code: "SPH005", name: "OAE", category: "Procedure", department: "Audiology", unit: "test", mrp: 600 },
  { code: "SPH006", name: "BERA", category: "Procedure", department: "Audiology", unit: "test", mrp: 2000 },
  { code: "SPH007", name: "Hearing aid fitting/programming", category: "Procedure", department: "Audiology", unit: "session", mrp: 1000 },
];

// Dietetics & Nutrition (DIE)
export const DIETETICS_SERVICES: HospitalService[] = [
  { code: "DIE001", name: "Dietician assessment (OPD)", category: "Consultation", department: "Dietetics", unit: "visit", mrp: 500 },
  { code: "DIE002", name: "Diet follow-up", category: "Consultation", department: "Dietetics", unit: "visit", mrp: 300 },
  { code: "DIE003", name: "Inpatient diet counselling", category: "Consultation", department: "Dietetics", unit: "admission", mrp: 500 },
  { code: "DIE004", name: "Special diet (renal/diabetic)", category: "Procedure", department: "Dietetics", unit: "day", mrp: 300 },
  { code: "DIE005", name: "Nutrition plan package (4-week)", category: "Package", department: "Dietetics", unit: "package", mrp: 3000 },
];

// Vaccination & Immunisation (VAC)
export const VACCINATION_SERVICES: HospitalService[] = [
  { code: "VAC001", name: "Vaccine administration charge", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 100 },
  { code: "VAC010", name: "Hepatitis B (adult)", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 500 },
  { code: "VAC011", name: "Tdap", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1500 },
  { code: "VAC012", name: "Influenza (quadrivalent)", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1500 },
  { code: "VAC013", name: "Pneumococcal PCV13", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 4000 },
  { code: "VAC014", name: "Pneumococcal PPSV23", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 2500 },
  { code: "VAC015", name: "MMR", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 500 },
  { code: "VAC016", name: "Varicella", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 2000 },
  { code: "VAC017", name: "HPV (quadrivalent/nonavalent)", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 4000 },
  { code: "VAC018", name: "Typhoid (Vi/Conjugate)", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1000 },
  { code: "VAC019", name: "Hepatitis A", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1500 },
  { code: "VAC020", name: "Rabies (cell culture)", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 500 },
  { code: "VAC021", name: "Rotavirus", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1500 },
  { code: "VAC022", name: "JE", category: "Procedure", department: "Vaccination", unit: "dose", mrp: 1000 },
];

// Blood bank & transfusion (BBK)
export const BLOOD_BANK_SERVICES: HospitalService[] = [
  { code: "BBK001", name: "PRBC unit", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 1500 },
  { code: "BBK002", name: "Platelet concentrate", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 1000 },
  { code: "BBK003", name: "FFP", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 800 },
  { code: "BBK004", name: "Cryoprecipitate", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 500 },
  { code: "BBK005", name: "Crossmatch charges", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 300 },
  { code: "BBK006", name: "Bedside transfusion charges", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 500 },
  { code: "BBK007", name: "Blood component processing fee", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 500 },
  { code: "BBK008", name: "Blood warming", category: "Procedure", department: "Blood Bank", unit: "unit", mrp: 200 },
];

// Pharmacy, Materials & Implants (PHA)
export const PHARMACY_SERVICES: HospitalService[] = [
  { code: "PHA001", name: "Drug – Tablet/Capsule", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 10 },
  { code: "PHA002", name: "Drug – Injection/Vial", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 100 },
  { code: "PHA003", name: "Drug – IV fluid", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 150 },
  { code: "PHA004", name: "Consumable – Syringe/Needle", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 20 },
  { code: "PHA005", name: "Consumable – IV set/Cannula", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 100 },
  { code: "PHA006", name: "Consumable – Dressing/Gauze/Bandage", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 50 },
  { code: "PHA007", name: "Suture – Absorbable/Non-absorbable", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 300 },
  { code: "PHA008", name: "Catheter/Drain", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 500 },
  { code: "PHA009", name: "PPE kit", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 500 },
  { code: "PHA010", name: "Ortho implant (plates/screws/nails)", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 15000 },
  { code: "PHA011", name: "Cardiac stent (DES/BMS)", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 50000 },
  { code: "PHA012", name: "Intraocular lens (IOL)", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 5000 },
  { code: "PHA013", name: "Mesh (hernia)", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 8000 },
  { code: "PHA014", name: "Pacemaker/ICD/CRT device", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 150000 },
  { code: "PHA015", name: "Dialyser/Blood tubing", category: "Pharmacy", department: "Pharmacy", unit: "SKU", mrp: 2000 },
];

// CSSD / Sterilisation (CSSD)
export const CSSD_SERVICES: HospitalService[] = [
  { code: "CSSD001", name: "Instrument set sterilisation – Steam", category: "Procedure", department: "CSSD", unit: "set", mrp: 200 },
  { code: "CSSD002", name: "ETO sterilisation", category: "Procedure", department: "CSSD", unit: "cycle", mrp: 500 },
  { code: "CSSD003", name: "Wraps/Indicators", category: "Procedure", department: "CSSD", unit: "set", mrp: 100 },
  { code: "CSSD004", name: "Loaner set sterilisation", category: "Procedure", department: "CSSD", unit: "set", mrp: 1000 },
  { code: "CSSD005", name: "Linen pack sterilisation", category: "Procedure", department: "CSSD", unit: "pack", mrp: 100 },
];

// Ambulance & Transport (AMB)
export const AMBULANCE_SERVICES: HospitalService[] = [
  { code: "AMB001", name: "Ambulance – BLS (within city, up to X km)", category: "Procedure", department: "Transport", unit: "trip", mrp: 2000 },
  { code: "AMB002", name: "Ambulance – ALS (within city, up to X km)", category: "Procedure", department: "Transport", unit: "trip", mrp: 4000 },
  { code: "AMB003", name: "Ambulance per km (beyond base)", category: "Procedure", department: "Transport", unit: "km", mrp: 30 },
  { code: "AMB004", name: "Oxygen in ambulance", category: "Procedure", department: "Transport", unit: "trip", mrp: 500 },
  { code: "AMB005", name: "Paramedic escort", category: "Procedure", department: "Transport", unit: "hour", mrp: 500 },
  { code: "AMB006", name: "Inter-facility transfer (city-to-city)", category: "Procedure", department: "Transport", unit: "trip", mrp: 10000 },
];

// Home care & Equipment rental (HME)
export const HOME_CARE_SERVICES: HospitalService[] = [
  { code: "HME001", name: "Home nurse (GDA)", category: "Nursing", department: "Home Care", unit: "8-hr shift", mrp: 1500 },
  { code: "HME002", name: "Home physiotherapy", category: "Procedure", department: "Home Care", unit: "session", mrp: 1000 },
  { code: "HME003", name: "Doctor home visit", category: "Consultation", department: "Home Care", unit: "visit", mrp: 2000 },
  { code: "HME004", name: "Sample/home injection visit", category: "Nursing", department: "Home Care", unit: "visit", mrp: 500 },
  { code: "HME005", name: "Oxygen concentrator rental", category: "Procedure", department: "Home Care", unit: "day", mrp: 500 },
  { code: "HME006", name: "BiPAP/CPAP rental", category: "Procedure", department: "Home Care", unit: "day", mrp: 800 },
  { code: "HME007", name: "Wheelchair rental", category: "Procedure", department: "Home Care", unit: "day", mrp: 200 },
  { code: "HME008", name: "Hospital bed rental", category: "Procedure", department: "Home Care", unit: "day", mrp: 500 },
];

// Mortuary (MOR)
export const MORTUARY_SERVICES: HospitalService[] = [
  { code: "MOR001", name: "Cold chamber storage", category: "Procedure", department: "Mortuary", unit: "day", mrp: 1000 },
  { code: "MOR002", name: "Embalming", category: "Procedure", department: "Mortuary", unit: "procedure", mrp: 5000 },
  { code: "MOR003", name: "Body packing/preparation", category: "Procedure", department: "Mortuary", unit: "case", mrp: 2000 },
  { code: "MOR004", name: "Coffin", category: "Procedure", department: "Mortuary", unit: "unit", mrp: 10000 },
  { code: "MOR005", name: "Hearse van (within city)", category: "Procedure", department: "Mortuary", unit: "trip", mrp: 3000 },
];

// Documentation & Certificates (DOC)
export const DOCUMENTATION_SERVICES: HospitalService[] = [
  { code: "DOC001", name: "Discharge summary duplicate", category: "Procedure", department: "Medical Records", unit: "copy", mrp: 100 },
  { code: "DOC002", name: "Medical certificate", category: "Procedure", department: "Medical Records", unit: "certificate", mrp: 200 },
  { code: "DOC003", name: "Fitness certificate", category: "Procedure", department: "Medical Records", unit: "certificate", mrp: 300 },
  { code: "DOC004", name: "Vaccination card/record", category: "Procedure", department: "Medical Records", unit: "card", mrp: 50 },
  { code: "DOC005", name: "Medico-legal report copy", category: "Procedure", department: "Medical Records", unit: "copy", mrp: 500 },
  { code: "DOC006", name: "Imaging/CD copy (non-radiology diagnostics)", category: "Procedure", department: "Medical Records", unit: "copy", mrp: 200 },
];

// Miscellaneous & Hospital Policy (MSC)
export const MISC_SERVICES: HospitalService[] = [
  { code: "MSC001", name: "Biomedical waste handling", category: "Procedure", department: "Hospital Services", unit: "admission", mrp: 200 },
  { code: "MSC002", name: "PPE surcharge (high-risk cases)", category: "Procedure", department: "Hospital Services", unit: "case", mrp: 500 },
  { code: "MSC003", name: "Consumables surcharge (minor OPD procedures)", category: "Procedure", department: "Hospital Services", unit: "case", mrp: 300 },
  { code: "MSC004", name: "Stat/Rush reporting surcharge (non-lab/non-radio)", category: "Procedure", department: "Hospital Services", unit: "case", mrp: 500 },
  { code: "MSC005", name: "Late discharge fee (after cutoff)", category: "Procedure", department: "Hospital Services", unit: "hour", mrp: 500 },
  { code: "MSC006", name: "Damage/loss of hospital property", category: "Procedure", department: "Hospital Services", unit: "item", mrp: 1000 },
];

// X-ray (XR—Digital radiography)
export const XRAY_SERVICES: HospitalService[] = [
  { code: "XR001", name: "Chest – PA", category: "Imaging", department: "Radiology", unit: "study", mrp: 300 },
  { code: "XR002", name: "Chest – AP (Portable)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR003", name: "Chest – PA + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR004", name: "Chest – Decubitus view", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR010", name: "Abdomen – Erect", category: "Imaging", department: "Radiology", unit: "study", mrp: 350 },
  { code: "XR011", name: "Abdomen – Supine", category: "Imaging", department: "Radiology", unit: "study", mrp: 350 },
  { code: "XR012", name: "Abdomen – Erect + Supine", category: "Imaging", department: "Radiology", unit: "study", mrp: 600 },
  { code: "XR013", name: "KUB (Kidney–Ureter–Bladder)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR020", name: "PNS – Waters view", category: "Imaging", department: "Radiology", unit: "study", mrp: 350 },
  { code: "XR021", name: "Face/PNS series (Waters + Caldwell + Lateral)", category: "Imaging", department: "Radiology", unit: "study", mrp: 600 },
  { code: "XR022", name: "Skull – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR023", name: "Skull base – Towne's", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR030", name: "Cervical spine – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR031", name: "Cervical spine – Flexion/Extension (dynamic)", category: "Imaging", department: "Radiology", unit: "study", mrp: 700 },
  { code: "XR032", name: "Dorsal/Thoracic spine – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR033", name: "Lumbosacral spine – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR034", name: "Lumbosacral spine – AP + Lateral + Obliques", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "XR035", name: "Sacrum/Coccyx – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR040", name: "Pelvis – AP", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR041", name: "Pelvis with both hips – AP", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR042", name: "Hip – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR043", name: "Hip – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR044", name: "SI joints – AP + Obliques", category: "Imaging", department: "Radiology", unit: "study", mrp: 600 },
  { code: "XR050", name: "Knee – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR051", name: "Knee – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR052", name: "Both knees – Weight-bearing AP", category: "Imaging", department: "Radiology", unit: "study", mrp: 600 },
  { code: "XR053", name: "Patella – Skyline/Sunrise", category: "Imaging", department: "Radiology", unit: "study", mrp: 350 },
  { code: "XR060", name: "Ankle – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR061", name: "Ankle – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR062", name: "Foot – AP + Lateral + Oblique (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR063", name: "Foot – AP + Lateral + Oblique (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR064", name: "Calcaneum – Axial + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR070", name: "Femur – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR071", name: "Femur – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR072", name: "Tibia/Fibula – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR073", name: "Tibia/Fibula – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR080", name: "Humerus – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR081", name: "Humerus – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR082", name: "Forearm – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR083", name: "Forearm – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR084", name: "Elbow – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR085", name: "Elbow – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR086", name: "Shoulder – AP + Axillary (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR087", name: "Shoulder – AP + Axillary (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR088", name: "Clavicle – AP (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 350 },
  { code: "XR089", name: "AC joints – bilateral (weight-bearing)", category: "Imaging", department: "Radiology", unit: "study", mrp: 600 },
  { code: "XR090", name: "Wrist – AP + Lateral (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR091", name: "Wrist – AP + Lateral (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR092", name: "Hand – PA + Oblique (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR093", name: "Hand – PA + Oblique (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
  { code: "XR094", name: "Fingers – (specify digit) AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 300 },
  { code: "XR095", name: "Thumb – AP + Lateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 300 },
  { code: "XR096", name: "Toes – (specify digit) AP + Oblique", category: "Imaging", department: "Radiology", unit: "study", mrp: 300 },
  { code: "XR100", name: "OPG (Orthopantomogram)", category: "Imaging", department: "Radiology", unit: "study", mrp: 500 },
  { code: "XR101", name: "Lateral Cephalogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 400 },
];

// Ultrasound (US—USG)
export const ULTRASOUND_SERVICES: HospitalService[] = [
  { code: "US001", name: "USG Abdomen (Upper)", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US002", name: "USG Whole Abdomen", category: "Imaging", department: "Radiology", unit: "study", mrp: 1000 },
  { code: "US003", name: "USG KUB", category: "Imaging", department: "Radiology", unit: "study", mrp: 700 },
  { code: "US004", name: "USG Pelvis – Transabdominal (TA)", category: "Imaging", department: "Radiology", unit: "study", mrp: 700 },
  { code: "US005", name: "USG Pelvis – Transvaginal (TVS)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1000 },
  { code: "US006", name: "USG Abdomen + Pelvis (TA)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1200 },
  { code: "US007", name: "USG Abdomen + Pelvis (TA + TVS)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "US010", name: "Early Pregnancy Viability (≤12 weeks)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1000 },
  { code: "US011", name: "NT Scan (11–14 weeks)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "US012", name: "Anomaly Scan (TIFFA) (18–22 weeks)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "US013", name: "Growth Scan (2nd/3rd trimester)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "US014", name: "Biophysical Profile (BPP)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1200 },
  { code: "US015", name: "Fetal Well-being + Doppler (as indicated)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "US016", name: "Multiple Pregnancy Scan", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "US017", name: "Follicular Monitoring (cycle package)", category: "Imaging", department: "Radiology", unit: "package", mrp: 3000 },
  { code: "US020", name: "Thyroid USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US021", name: "Neck USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US022", name: "Breast USG – Unilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US023", name: "Breast USG – Bilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 1200 },
  { code: "US024", name: "Scrotal/Testicular USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US025", name: "Prostate USG (TA)", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US026", name: "TRUS – Prostate (Transrectal)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "US027", name: "Small Parts/Soft Tissue (region)", category: "Imaging", department: "Radiology", unit: "study", mrp: 700 },
  { code: "US028", name: "Hernia Region USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US029", name: "Musculoskeletal USG (Shoulder/Knee/Ankle — per joint)", category: "Imaging", department: "Radiology", unit: "joint", mrp: 1000 },
  { code: "US030", name: "Renal Transplant Evaluation", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "US031", name: "Pediatric Neurosonogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 1200 },
  { code: "US032", name: "Neonatal Hip Screening", category: "Imaging", department: "Radiology", unit: "study", mrp: 1000 },
  { code: "US033", name: "Ocular/Orbit USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 800 },
  { code: "US034", name: "Ascites assessment USG", category: "Imaging", department: "Radiology", unit: "study", mrp: 700 },
];

// Doppler (DOP—Vascular/Fetal)
export const DOPPLER_SERVICES: HospitalService[] = [
  { code: "DOP001", name: "Carotid & Vertebral Doppler", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "DOP002", name: "Lower Limb Venous Doppler – Unilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP003", name: "Lower Limb Venous Doppler – Bilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "DOP004", name: "Lower Limb Arterial Doppler – Unilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP005", name: "Lower Limb Arterial Doppler – Bilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "DOP006", name: "Upper Limb Venous Doppler – Unilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP007", name: "Upper Limb Arterial Doppler – Unilateral", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP008", name: "Renal Artery Doppler", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "DOP009", name: "Portal/Hepatic Venous Doppler", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP010", name: "Obstetric Fetal Doppler (Umbilical ± MCA/Uterine)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP011", name: "Scrotal/Testicular Doppler", category: "Imaging", department: "Radiology", unit: "study", mrp: 1200 },
  { code: "DOP012", name: "Transcranial Doppler (TCD)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "DOP013", name: "AV Fistula Doppler (maturity/surveillance)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "DOP014", name: "Mesenteric Artery Doppler", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
];

// Mammography (MG)
export const MAMMOGRAPHY_SERVICES: HospitalService[] = [
  { code: "MG001", name: "Mammography – Bilateral Screening (FFDM)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "MG002", name: "Mammography – Unilateral Diagnostic (Right)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "MG003", name: "Mammography – Unilateral Diagnostic (Left)", category: "Imaging", department: "Radiology", unit: "study", mrp: 1500 },
  { code: "MG004", name: "Mammography – Bilateral with Tomosynthesis (DBT)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "MG006", name: "Additional Mammographic Views (per breast)", category: "Imaging", department: "Radiology", unit: "breast", mrp: 800 },
];

// CT (CT—Multislice)
export const CT_SERVICES: HospitalService[] = [
  { code: "CT001", name: "NCCT Head (Plain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "CT002", name: "CECT Head", category: "Imaging", department: "Radiology", unit: "study", mrp: 5000 },
  { code: "CT003", name: "CT PNS/Face", category: "Imaging", department: "Radiology", unit: "study", mrp: 3500 },
  { code: "CT004", name: "HRCT Temporal Bone", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "CT005", name: "CT Orbit", category: "Imaging", department: "Radiology", unit: "study", mrp: 3500 },
  { code: "CT006", name: "CT Neck (Plain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3500 },
  { code: "CT007", name: "CECT Neck", category: "Imaging", department: "Radiology", unit: "study", mrp: 5500 },
  { code: "CT010", name: "HRCT Chest (ILD protocol)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "CT011", name: "CT Chest (Plain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3500 },
  { code: "CT012", name: "CECT Chest", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "CT013", name: "CT Pulmonary Angiography (CTPA)", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "CT020", name: "CT Abdomen (Plain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "CT021", name: "CECT Abdomen", category: "Imaging", department: "Radiology", unit: "study", mrp: 7000 },
  { code: "CT022", name: "CECT Abdomen + Pelvis", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "CT023", name: "Triphasic Liver (Arterial/Portal/Delayed)", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "CT024", name: "CT KUB (Stone protocol – Plain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "CT025", name: "CT Urography", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "CT026", name: "CT Enterography", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "CT027", name: "CT Colonography", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "CT028", name: "CT Pelvis (Plain/Contrast)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "CT029", name: "CT Whole Abdomen (Plain/Contrast)", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "CT030", name: "CT Angiography – Aorta (Thoracic/Abdominal)", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "CT031", name: "CT Angiography – Carotid/Vertebral", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "CT032", name: "CT Angiography – Cerebral", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "CT033", name: "CT Angiography – Renal Arteries", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "CT034", name: "CT Peripheral Angiography – Lower Limbs", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "CT035", name: "CT Peripheral Angiography – Upper Limbs", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "CT036", name: "CT Coronary Angiography (Cardiac CTA)", category: "Imaging", department: "Radiology", unit: "study", mrp: 15000 },
  { code: "CT037", name: "CT Perfusion – Brain", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "CT038", name: "3D Reconstructions/Post-processing (add-on per region)", category: "Imaging", department: "Radiology", unit: "region", mrp: 2000 },
];

// MRI (MR—1.5T/3T)
export const MRI_SERVICES: HospitalService[] = [
  { code: "MR001", name: "MRI Brain – Plain", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR002", name: "MRI Brain – With Contrast", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "MR003", name: "MRI Brain – With & Without Contrast", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "MR004", name: "MRI Pituitary – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR005", name: "MRI Orbits – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR006", name: "MRI IAC/CPA – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR007", name: "MR Venography (Brain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR008", name: "MR Angiography (Brain)", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR009", name: "MR Angiography (Neck Vessels)", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR010", name: "MRI Cervical Spine – Plain", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR011", name: "MRI Cervical Spine – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "MR012", name: "MRI Dorsal/Thoracic Spine – Plain", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR013", name: "MRI Dorsal/Thoracic Spine – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "MR014", name: "MRI Lumbar Spine – Plain", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR015", name: "MRI Lumbar Spine – With & Without", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "MR016", name: "MRI Whole Spine Screening", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "MR017", name: "MR Myelography", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "MR020", name: "MRI Shoulder (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR021", name: "MRI Knee (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR022", name: "MRI Hip (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR023", name: "MRI Wrist (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR024", name: "MRI Ankle/Foot (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR025", name: "MRI Elbow (R/L)", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR026", name: "MRI SI Joints", category: "Imaging", department: "Radiology", unit: "study", mrp: 6000 },
  { code: "MR027", name: "MRI Brachial Plexus", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR028", name: "MRI Pelvis (Female) – Uterus/Ovaries", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR029", name: "MRI Pelvis (Male) – Prostate (mpMRI)", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "MR030", name: "MRI Abdomen – Plain/Contrast", category: "Imaging", department: "Radiology", unit: "study", mrp: 9000 },
  { code: "MR031", name: "MRI Liver – With Contrast (Dynamic)", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
  { code: "MR032", name: "MRCP", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR033", name: "MR Enterography", category: "Imaging", department: "Radiology", unit: "study", mrp: 10000 },
  { code: "MR034", name: "MRI Fistulogram – Perianal", category: "Imaging", department: "Radiology", unit: "study", mrp: 8000 },
  { code: "MR035", name: "Cardiac MRI (CMR) – Basic", category: "Imaging", department: "Radiology", unit: "study", mrp: 15000 },
  { code: "MR036", name: "Foetal MRI (Advanced)", category: "Imaging", department: "Radiology", unit: "study", mrp: 12000 },
];

// Fluoroscopy/Contrast studies (FL)
export const FLUOROSCOPY_SERVICES: HospitalService[] = [
  { code: "FL001", name: "Barium Swallow", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "FL002", name: "Barium Meal", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "FL003", name: "Barium Meal Follow-Through (BMFT)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "FL004", name: "Barium Enema", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "FL005", name: "MCU/VCUG (Micturating Cystourethrogram)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "FL006", name: "RGU (Retrograde Urethrogram)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "FL007", name: "RGU + MCU (Combined)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
  { code: "FL008", name: "HSG (Hysterosalpingography)", category: "Imaging", department: "Radiology", unit: "study", mrp: 3500 },
  { code: "FL009", name: "Fistulogram (specify site)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "FL010", name: "Sinogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "FL011", name: "Sialogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "FL012", name: "T-tube Cholangiogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 3000 },
  { code: "FL013", name: "Loopogram", category: "Imaging", department: "Radiology", unit: "study", mrp: 2500 },
  { code: "FL014", name: "Dacryocystography (DCG)", category: "Imaging", department: "Radiology", unit: "study", mrp: 2000 },
  { code: "FL015", name: "Videofluoroscopic Swallow Study (VFSS)", category: "Imaging", department: "Radiology", unit: "study", mrp: 4000 },
];

// Interventional Radiology (IR)
export const INTERVENTIONAL_RADIOLOGY_SERVICES: HospitalService[] = [
  { code: "IR001", name: "USG-guided FNAC (Superficial)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 2000 },
  { code: "IR002", name: "USG-guided Core Biopsy (Breast/Thyroid/Nodes)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 5000 },
  { code: "IR003", name: "USG-guided Liver Biopsy", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 8000 },
  { code: "IR004", name: "USG-guided Renal Biopsy", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 10000 },
  { code: "IR005", name: "CT-guided Biopsy (Lung/Retroperitoneum/Bone)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 12000 },
  { code: "IR006", name: "USG-guided Abscess Drainage", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 8000 },
  { code: "IR007", name: "Pigtail Catheter – Pleural", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 5000 },
  { code: "IR008", name: "Pigtail Catheter – Peritoneal/Ascites", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 5000 },
  { code: "IR009", name: "Thoracentesis", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 3000 },
  { code: "IR010", name: "Paracentesis", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 3000 },
  { code: "IR011", name: "PICC Line Insertion", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 8000 },
  { code: "IR012", name: "Percutaneous Nephrostomy (PCN)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 15000 },
  { code: "IR013", name: "Percutaneous Transhepatic Biliary Drainage (PTBD)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 20000 },
  { code: "IR014", name: "IVC Filter – Insertion", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 50000 },
  { code: "IR015", name: "Embolization – Uterine Fibroid (UFE)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 80000 },
  { code: "IR016", name: "Embolization – Varicocele", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 40000 },
  { code: "IR017", name: "Embolization – Visceral/Pseudoaneurysm", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 60000 },
  { code: "IR018", name: "TACE (Liver Chemoembolization)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 80000 },
  { code: "IR019", name: "AV Fistula Angioplasty", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 40000 },
  { code: "IR020", name: "Peripheral Angiography (Diagnostic)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 25000 },
  { code: "IR021", name: "Peripheral Angioplasty/Stenting", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 80000 },
  { code: "IR022", name: "Carotid Angiography", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 30000 },
  { code: "IR023", name: "Cerebral DSA", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 35000 },
  { code: "IR024", name: "Vertebroplasty/Kyphoplasty", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 60000 },
  { code: "IR025", name: "Nerve Root/Facet/Epidural Injection (Pain)", category: "Procedure", department: "Radiology", unit: "procedure", mrp: 8000 },
];

// Nuclear Medicine (NM)
export const NUCLEAR_MEDICINE_SERVICES: HospitalService[] = [
  { code: "NM001", name: "Thyroid Scan (Tc-99m)", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 3000 },
  { code: "NM002", name: "Renal Dynamic Scan (DTPA/MAG3)", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 5000 },
  { code: "NM003", name: "Renal Cortical Scan (DMSA)", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 5000 },
  { code: "NM004", name: "Bone Scan – Whole Body", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 8000 },
  { code: "NM005", name: "Hepatobiliary (HIDA) Scan", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 6000 },
  { code: "NM006", name: "MUGA Scan", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 8000 },
  { code: "NM007", name: "Lymphoscintigraphy", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 6000 },
  { code: "NM008", name: "Parathyroid Scan (Sestamibi)", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 8000 },
  { code: "NM009", name: "Myocardial Perfusion SPECT", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 15000 },
  { code: "NM010", name: "PET-CT Whole Body (FDG)", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 25000 },
  { code: "NM011", name: "PET-CT Limited Region", category: "Imaging", department: "Nuclear Medicine", unit: "study", mrp: 18000 },
];

// Dental/CBCT (DEN)
export const DENTAL_SERVICES: HospitalService[] = [
  { code: "DEN001", name: "CBCT Maxillofacial – Full", category: "Imaging", department: "Dental", unit: "study", mrp: 5000 },
  { code: "DEN002", name: "CBCT Mandible", category: "Imaging", department: "Dental", unit: "study", mrp: 3500 },
  { code: "DEN003", name: "CBCT Maxilla", category: "Imaging", department: "Dental", unit: "study", mrp: 3500 },
  { code: "DEN004", name: "CBCT TMJ (Both sides)", category: "Imaging", department: "Dental", unit: "study", mrp: 4000 },
  { code: "DEN005", name: "CBCT Cephalometric Volume", category: "Imaging", department: "Dental", unit: "study", mrp: 3000 },
];

// Add-ons/charges
export const RADIOLOGY_ADDONS: HospitalService[] = [
  { code: "ADD001", name: "Non-ionic Contrast Charge – 50 mL", category: "Procedure", department: "Radiology", unit: "dose", mrp: 1500 },
  { code: "ADD002", name: "Non-ionic Contrast Charge – 100 mL", category: "Procedure", department: "Radiology", unit: "dose", mrp: 2500 },
  { code: "ADD003", name: "Sedation/Anesthesia (CT/MRI)", category: "Procedure", department: "Radiology", unit: "case", mrp: 3000 },
  { code: "ADD004", name: "3D MPR/VR Post-processing (per region)", category: "Procedure", department: "Radiology", unit: "region", mrp: 1500 },
  { code: "ADD005", name: "Images on CD/USB", category: "Procedure", department: "Radiology", unit: "copy", mrp: 200 },
  { code: "ADD006", name: "STAT/Rush Reporting Fee", category: "Procedure", department: "Radiology", unit: "case", mrp: 500 },
];

// Combined export of all hospital services
export const ALL_HOSPITAL_SERVICES: HospitalService[] = [
  ...ADMIN_SERVICES,
  ...OPD_SERVICES,
  ...NURSING_SERVICES,
  ...BED_SERVICES,
  ...EQUIPMENT_SERVICES,
  ...GAS_SERVICES,
  ...MINOR_PROCEDURES,
  ...OT_SERVICES,
  ...ANAESTHESIA_SERVICES,
  ...ENDOSCOPY_SERVICES,
  ...BRONCHOSCOPY_SERVICES,
  ...UROLOGY_SERVICES,
  ...ENT_SERVICES,
  ...OPHTHALMOLOGY_SERVICES,
  ...OBS_SERVICES,
  ...ORTHO_SERVICES,
  ...CARDIOLOGY_SERVICES,
  ...PULMONOLOGY_SERVICES,
  ...NEUROLOGY_SERVICES,
  ...URODYNAMICS_SERVICES,
  ...DIALYSIS_SERVICES,
  ...PHYSIOTHERAPY_SERVICES,
  ...SPEECH_SERVICES,
  ...DIETETICS_SERVICES,
  ...VACCINATION_SERVICES,
  ...BLOOD_BANK_SERVICES,
  ...PHARMACY_SERVICES,
  ...CSSD_SERVICES,
  ...AMBULANCE_SERVICES,
  ...HOME_CARE_SERVICES,
  ...MORTUARY_SERVICES,
  ...DOCUMENTATION_SERVICES,
  ...MISC_SERVICES,
  ...XRAY_SERVICES,
  ...ULTRASOUND_SERVICES,
  ...DOPPLER_SERVICES,
  ...MAMMOGRAPHY_SERVICES,
  ...CT_SERVICES,
  ...MRI_SERVICES,
  ...FLUOROSCOPY_SERVICES,
  ...INTERVENTIONAL_RADIOLOGY_SERVICES,
  ...NUCLEAR_MEDICINE_SERVICES,
  ...DENTAL_SERVICES,
  ...RADIOLOGY_ADDONS,
];
