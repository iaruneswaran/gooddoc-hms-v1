import { User, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface IPPatientData {
  type: "IP";
  name: string;
  gdid: string;
  age: string;
  gender: string;
  lastActivityShort: string;
  ipInfo: {
    doctor: string;
    ward: string;
    bed: string;
    emergencyContact: string;
  };
  pending: { item: string; status: string }[];
  pendingAmount: {
    outstanding: string;
    advance: string;
    bills: string;
    balance: string;
  };
  options: string[];
}

interface OPPatientData {
  type: "OP";
  name: string;
  gdid: string;
  age: string;
  gender: string;
  lastActivityShort: string;
  pendingReports: string;
  pendingAmountNote: string;
  options: string[];
}

type PatientData = IPPatientData | OPPatientData;

interface PatientSearchCardProps {
  patient: PatientData;
  onClose: () => void;
}

export function PatientSearchCard({ patient, onClose }: PatientSearchCardProps) {
  const navigate = useNavigate();

  const handleGoTo360 = () => {
    navigate(`/patient360/${patient.gdid}?from=search`);
    onClose();
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 mx-8 p-4 shadow-lg z-50 bg-card border border-border">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              GDID – {patient.gdid} • {patient.age} • {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{patient.lastActivityShort}</span>
          <Button variant="link" size="sm" className="text-primary p-0" onClick={handleGoTo360}>
            go to 360 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      {patient.type === "IP" ? (
        <IPPatientContent patient={patient} />
      ) : (
        <OPPatientContent patient={patient} />
      )}
    </Card>
  );
}

function IPPatientContent({ patient }: { patient: IPPatientData }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* IP Info Card */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">IP Info</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">Doctor name: <span className="text-foreground">{patient.ipInfo.doctor}</span></p>
          <p className="text-muted-foreground">Ward: <span className="text-foreground">{patient.ipInfo.ward}</span> Bed: <span className="text-foreground">{patient.ipInfo.bed}</span></p>
          <p className="text-muted-foreground">Emergency contact: <span className="text-foreground">{patient.ipInfo.emergencyContact}</span></p>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Pending</h4>
        <div className="space-y-2">
          {patient.pending.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.item}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Pending amount</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Outstanding Total</p>
            <p className="font-medium text-foreground">{patient.pendingAmount.outstanding}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Advance Amount</p>
            <p className="font-medium text-foreground">{patient.pendingAmount.advance}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bills Amount</p>
            <p className="font-medium text-foreground">{patient.pendingAmount.bills}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Balance Amount</p>
            <p className="font-medium text-foreground">{patient.pendingAmount.balance}</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Options</h4>
        <div className="space-y-2">
          {patient.options.map((opt, idx) => (
            <Button key={idx} variant="outline" size="sm" className="w-full justify-start text-sm">
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Visit History */}
      <div className="col-span-4 mt-2 bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Visit History</h4>
        <p className="text-sm text-muted-foreground">{patient.lastActivityShort}</p>
      </div>
    </div>
  );
}

function OPPatientContent({ patient }: { patient: OPPatientData }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Visit History */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Visit history</h4>
        <p className="text-sm text-muted-foreground">{patient.lastActivityShort}</p>
        <Button variant="link" size="sm" className="text-primary p-0 mt-2 text-xs">
          Add item to the visit
        </Button>
      </div>

      {/* Pending Reports */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Pending reports</h4>
        <p className="text-sm text-muted-foreground">{patient.pendingReports}</p>
        <Button variant="outline" size="sm" className="mt-2 text-xs">
          Book now
        </Button>
      </div>

      {/* Pending Amount */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Pending amount</h4>
        <p className="text-sm text-muted-foreground">{patient.pendingAmountNote}</p>
      </div>

      {/* Options */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Options</h4>
        <div className="space-y-1">
          {patient.options.map((opt, idx) => (
            <Button key={idx} variant="link" size="sm" className="p-0 h-auto text-xs text-primary justify-start">
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
