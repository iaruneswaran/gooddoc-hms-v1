import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Bed, 
  Stethoscope, 
  Pill, 
  ClipboardList, 
  FileText, 
  Activity,
  HeartPulse,
  Syringe,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building2,
  Phone,
  Mail
} from "lucide-react";

interface DischargeSummaryProps {
  patientName?: string;
  mrn?: string;
  age?: string;
  gender?: string;
}

const DischargeSummary = ({ 
  patientName = "Harish Kalyan",
  mrn = "GDID-001",
  age = "44 Years",
  gender = "Male"
}: DischargeSummaryProps) => {
  const timelineEvents = [
    { event: "Patient Admitted", date: "18/12/2025, 10:30 AM", icon: Bed },
    { event: "Initial Assessment", date: "18/12/2025, 11:00 AM", icon: ClipboardList },
    { event: "Cardiac Catheterization", date: "18/12/2025, 02:00 PM", icon: Syringe },
    { event: "Cardiologist Consultation", date: "19/12/2025, 09:00 AM", icon: Stethoscope },
    { event: "Echocardiography", date: "19/12/2025, 11:30 AM", icon: HeartPulse },
    { event: "Lab Tests", date: "20/12/2025, 08:00 AM", icon: FileText },
    { event: "CT Coronary Angiography", date: "21/12/2025, 10:00 AM", icon: Activity },
    { event: "Patient Discharged", date: "22/12/2025, 02:45 PM", icon: CheckCircle2 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Hospital Header */}
      <div className="bg-primary/5 border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Baines International Healthcare</h1>
              <p className="text-sm text-muted-foreground">123 Healthcare Avenue, Medical District, Chennai - 600001</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  +91 44 2345 6789
                </span>
                <span>GSTIN: 33XXXXX1234X1Z5</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            Pending Approval
          </Badge>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">IP Discharge Summary</h2>
          <Badge variant="secondary" className="font-mono">ADM-2025-0142</Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Patient & Admission Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Patient Information */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient Name</p>
                <p className="font-semibold text-foreground">{patientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">UHID</p>
                <p className="font-semibold text-foreground">{mrn}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age / Gender</p>
                <p className="font-semibold text-foreground">{age} / {gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-semibold text-foreground">B+</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-semibold text-foreground">+91 98765 12345</p>
              </div>
              <div>
                <p className="text-muted-foreground">Emergency Contact</p>
                <p className="font-semibold text-foreground">+91 98765 67890</p>
              </div>
            </div>
          </Card>

          {/* Admission Details */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Admission Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Admission</p>
                <p className="font-semibold text-foreground">18/12/2025, 10:30 AM</p>
              </div>
              <div>
                <p className="text-muted-foreground">Discharge</p>
                <p className="font-semibold text-foreground">22/12/2025, 02:45 PM</p>
              </div>
              <div>
                <p className="text-muted-foreground">Length of Stay</p>
                <p className="font-semibold text-foreground">4 Days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ward</p>
                <p className="font-semibold text-foreground">Deluxe Room - 302</p>
              </div>
              <div>
                <p className="text-muted-foreground">Attending Physician</p>
                <p className="font-semibold text-foreground">Dr. Arun Kumar</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-semibold text-foreground">Cardiology</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnosis */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Diagnosis</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/30">Primary</Badge>
              </div>
              <p className="font-medium text-foreground">Unstable Angina (ICD-10: I20.0)</p>
              <p className="text-sm text-muted-foreground mt-1">Characterized by chest discomfort at rest with ECG changes</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Secondary</Badge>
              </div>
              <ul className="space-y-1">
                <li className="font-medium text-foreground">Hypertension (I10)</li>
                <li className="font-medium text-foreground">Type 2 Diabetes Mellitus (E11.9)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Clinical Summary */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Clinical Summary</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Chief Complaints</p>
              <p className="text-muted-foreground">Chest pain radiating to left arm for 2 hours, associated with sweating and breathlessness. History of similar episodes in the past 1 week, relieved by rest.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">History of Present Illness</p>
              <p className="text-muted-foreground">44-year-old male presented to emergency with acute onset chest pain. Pain was crushing in nature, radiating to left arm and jaw. Associated symptoms included diaphoresis, nausea, and dyspnea. Patient is a known case of hypertension and diabetes for the past 5 years.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Course in Hospital</p>
              <p className="text-muted-foreground">Patient was admitted and managed as a case of Unstable Angina. Cardiac catheterization revealed 70% stenosis in LAD. Managed conservatively with dual antiplatelet therapy, statins, and beta-blockers. Patient showed significant improvement and is now hemodynamically stable.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Condition at Discharge</p>
              <p className="text-muted-foreground">Stable. Patient is afebrile, vitals are within normal limits. No chest pain or breathlessness at rest. Able to perform activities of daily living without symptoms.</p>
            </div>
          </div>
        </Card>

        {/* Visit Timeline */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Visit Timeline</h3>
          </div>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-4">
              {timelineEvents.map((item, index) => (
                <div key={index} className="flex items-center gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    index === timelineEvents.length - 1 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-between py-2">
                    <p className="font-medium text-foreground">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Procedures Performed */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Procedures Performed</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Procedure</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Performed By</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Findings</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-medium">Cardiac Catheterization</td>
                  <td className="py-3">18/12/2025</td>
                  <td className="py-3">Dr. Arun Kumar</td>
                  <td className="py-3 text-muted-foreground">70% stenosis in LAD</td>
                  <td className="py-3"><Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 font-medium">2D Echocardiography</td>
                  <td className="py-3">19/12/2025</td>
                  <td className="py-3">Dr. Arun Kumar</td>
                  <td className="py-3 text-muted-foreground">LVEF 55%, no regional wall motion abnormality</td>
                  <td className="py-3"><Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">CT Coronary Angiography</td>
                  <td className="py-3">21/12/2025</td>
                  <td className="py-3">Dr. Ramesh</td>
                  <td className="py-3 text-muted-foreground">Confirms LAD stenosis, RCA 40% stenosis</td>
                  <td className="py-3"><Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Investigation Results */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Investigation Results</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-foreground mb-2">Laboratory Tests (20/12/2025)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Hemoglobin</span>
                  <span className="font-medium">13.5 g/dL</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Troponin I</span>
                  <span className="font-medium text-amber-600">0.8 ng/mL (↑)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">HbA1c</span>
                  <span className="font-medium text-amber-600">7.2% (↑)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Creatinine</span>
                  <span className="font-medium">1.0 mg/dL</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">LDL Cholesterol</span>
                  <span className="font-medium text-amber-600">145 mg/dL (↑)</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Vitals at Discharge</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Blood Pressure</span>
                  <span className="font-medium">126/82 mmHg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Heart Rate</span>
                  <span className="font-medium">72 bpm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">SpO2</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">98.4°F</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">78 kg</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Discharge Medications */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Discharge Medications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">S.No</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Medication</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Dosage</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Frequency</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Instructions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2">1</td>
                  <td className="py-2 font-medium">Tab. Aspirin</td>
                  <td className="py-2">75 mg</td>
                  <td className="py-2">Once daily</td>
                  <td className="py-2">Lifelong</td>
                  <td className="py-2 text-muted-foreground">After breakfast</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">2</td>
                  <td className="py-2 font-medium">Tab. Clopidogrel</td>
                  <td className="py-2">75 mg</td>
                  <td className="py-2">Once daily</td>
                  <td className="py-2">12 months</td>
                  <td className="py-2 text-muted-foreground">After lunch</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">3</td>
                  <td className="py-2 font-medium">Tab. Atorvastatin</td>
                  <td className="py-2">40 mg</td>
                  <td className="py-2">Once daily</td>
                  <td className="py-2">Lifelong</td>
                  <td className="py-2 text-muted-foreground">At bedtime</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">4</td>
                  <td className="py-2 font-medium">Tab. Metoprolol</td>
                  <td className="py-2">25 mg</td>
                  <td className="py-2">Twice daily</td>
                  <td className="py-2">As advised</td>
                  <td className="py-2 text-muted-foreground">Morning & evening</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">5</td>
                  <td className="py-2 font-medium">Tab. Ramipril</td>
                  <td className="py-2">2.5 mg</td>
                  <td className="py-2">Once daily</td>
                  <td className="py-2">As advised</td>
                  <td className="py-2 text-muted-foreground">Morning</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">6</td>
                  <td className="py-2 font-medium">Tab. Metformin</td>
                  <td className="py-2">500 mg</td>
                  <td className="py-2">Twice daily</td>
                  <td className="py-2">Continuous</td>
                  <td className="py-2 text-muted-foreground">After meals</td>
                </tr>
                <tr>
                  <td className="py-2">7</td>
                  <td className="py-2 font-medium">Tab. Pantoprazole</td>
                  <td className="py-2">40 mg</td>
                  <td className="py-2">Once daily</td>
                  <td className="py-2">2 weeks</td>
                  <td className="py-2 text-muted-foreground">Before breakfast</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Follow-up Instructions */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Follow-up Instructions</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">Follow-up Appointments</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">1</span>
                    <span>Cardiology OPD - Dr. Arun Kumar in <span className="font-medium">1 week</span> (29/12/2025)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">2</span>
                    <span>Diabetology review in <span className="font-medium">2 weeks</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">3</span>
                    <span>Cardiac rehabilitation program enrollment</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Tests Before Follow-up</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• ECG (12 lead)</li>
                  <li>• Lipid Profile</li>
                  <li>• Fasting Blood Sugar</li>
                  <li>• Renal Function Tests</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Lifestyle Recommendations</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-green-600 font-medium mb-1">Do's</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Low salt, low fat, diabetic diet</li>
                    <li>✓ Walk 30 mins daily after 2 weeks</li>
                    <li>✓ Take medications as prescribed</li>
                    <li>✓ Monitor blood sugar regularly</li>
                    <li>✓ Maintain healthy weight</li>
                  </ul>
                </div>
                <div>
                  <p className="text-red-600 font-medium mb-1">Don'ts</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✗ No smoking or tobacco use</li>
                    <li>✗ Avoid alcohol consumption</li>
                    <li>✗ No strenuous activity for 6 weeks</li>
                    <li>✗ Avoid fried and processed foods</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Warning Signs */}
        <Card className="p-5 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-700">Warning Signs - Seek Immediate Medical Care</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-amber-800">
            <p>• Chest pain or pressure</p>
            <p>• Severe breathlessness</p>
            <p>• Palpitations</p>
            <p>• Dizziness or fainting</p>
            <p>• Excessive sweating</p>
            <p>• Swelling in legs</p>
            <p>• Pain radiating to arm/jaw</p>
            <p>• Unusual fatigue</p>
            <p>• Nausea or vomiting</p>
          </div>
          <p className="text-sm text-amber-700 mt-3 font-medium">
            Emergency Contact: 108 (Ambulance) | Hospital: +91 44 2345 6789
          </p>
        </Card>

        {/* Signature Section */}
        <Card className="p-5">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Prepared by</p>
              <p className="font-semibold mt-1">Dr. Priya Sharma</p>
              <p className="text-sm text-muted-foreground">Resident Doctor</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Reviewed by</p>
              <p className="font-semibold mt-1">Dr. Arun Kumar</p>
              <p className="text-sm text-muted-foreground">Consultant Cardiologist</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Discharge Date</p>
              <p className="font-semibold mt-1">22/12/2025, 02:45 PM</p>
              <p className="text-sm text-muted-foreground">Summary ID: DS-2025-0142</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DischargeSummary;
