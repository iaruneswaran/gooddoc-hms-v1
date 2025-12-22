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
  AlertCircle
} from "lucide-react";

interface DischargeSummaryProps {
  patientName?: string;
  mrn?: string;
  age?: string;
  gender?: string;
}

const DischargeSummary = ({ 
  patientName = "Siva Karthikeyan",
  mrn = "GDID-009",
  age = "34Y",
  gender = "M"
}: DischargeSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Discharge Summary</h2>
          <p className="text-sm text-muted-foreground">Clinical summary for patient discharge</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
          Pending Approval
        </Badge>
      </div>

      {/* Patient & Admission Info */}
      <Card className="p-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{patientName}</p>
                <p className="text-sm text-muted-foreground">{mrn} • {age} / {gender}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">+91 98765 12345</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-medium">B+</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Admission:</span>
              <span className="font-medium">18 Dec 2025, 15:00</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Discharge:</span>
              <span className="font-medium">22 Dec 2025, 11:00</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bed className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ward/Bed:</span>
              <span className="font-medium">Cardiac Care / CC-207 / Bed A</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Attending:</span>
              <span className="font-medium">Dr. Arun Kumar</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Diagnosis */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Diagnosis</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="mt-0.5">Primary</Badge>
            <div>
              <p className="font-medium">Acute Coronary Syndrome (I21.9)</p>
              <p className="text-sm text-muted-foreground">ST-elevation myocardial infarction, anterior wall</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">Secondary</Badge>
            <div>
              <p className="font-medium">Essential Hypertension (I10)</p>
              <p className="text-sm text-muted-foreground">Controlled with medication</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Procedures Performed */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Syringe className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Procedures Performed</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="font-medium">Cardiac Catheterization</p>
              <p className="text-sm text-muted-foreground">19 Dec 2025 • Dr. Arun Kumar</p>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="font-medium">2D Echocardiography</p>
              <p className="text-sm text-muted-foreground">19 Dec 2025 • Dr. Arun Kumar</p>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">CT Coronary Angiography</p>
              <p className="text-sm text-muted-foreground">19 Dec 2025 • Dr. Ramesh</p>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge>
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
                <th className="text-left py-2 font-medium text-muted-foreground">Medication</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Dosage</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Frequency</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">Aspirin 75mg</td>
                <td className="py-2">1 tablet</td>
                <td className="py-2">Once daily (morning)</td>
                <td className="py-2">Lifelong</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">Clopidogrel 75mg</td>
                <td className="py-2">1 tablet</td>
                <td className="py-2">Once daily</td>
                <td className="py-2">12 months</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">Atorvastatin 40mg</td>
                <td className="py-2">1 tablet</td>
                <td className="py-2">At bedtime</td>
                <td className="py-2">Lifelong</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">Metoprolol 25mg</td>
                <td className="py-2">1 tablet</td>
                <td className="py-2">Twice daily</td>
                <td className="py-2">As advised</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Ramipril 2.5mg</td>
                <td className="py-2">1 tablet</td>
                <td className="py-2">Once daily</td>
                <td className="py-2">As advised</td>
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
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">1</div>
            <p className="text-sm">Follow-up with Dr. Arun Kumar in <span className="font-medium">1 week</span> (Cardiology OPD)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">2</div>
            <p className="text-sm">Repeat ECG and blood tests before follow-up visit</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">3</div>
            <p className="text-sm">Cardiac rehabilitation program recommended - details provided separately</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">4</div>
            <p className="text-sm">Contact emergency if experiencing chest pain, breathlessness, or palpitations</p>
          </div>
        </div>
      </Card>

      {/* Lifestyle Advice */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Lifestyle Advice</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Low salt, low fat diet
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Regular light exercise as tolerated
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Take medications as prescribed
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-red-500">✗</span>
              No smoking or tobacco use
            </p>
            <p className="flex items-center gap-2">
              <span className="text-red-500">✗</span>
              Avoid alcohol consumption
            </p>
            <p className="flex items-center gap-2">
              <span className="text-red-500">✗</span>
              Avoid strenuous activity for 4 weeks
            </p>
          </div>
        </div>
      </Card>

      {/* Warning Signs */}
      <Card className="p-5 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-700">Warning Signs - Seek Immediate Care</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-amber-800">
          <p>• Chest pain or discomfort</p>
          <p>• Severe breathlessness</p>
          <p>• Palpitations or irregular heartbeat</p>
          <p>• Dizziness or fainting</p>
          <p>• Swelling in legs or feet</p>
          <p>• Unusual fatigue</p>
        </div>
      </Card>

      {/* Attending Physician Signature */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Prepared by</p>
            <p className="font-medium">Dr. Arun Kumar</p>
            <p className="text-sm text-muted-foreground">Consultant Cardiologist</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">22 Dec 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DischargeSummary;
