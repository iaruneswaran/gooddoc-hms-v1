import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, MessageSquare, User, Clock, CheckCircle2 } from "lucide-react";
import type { CriticalCategory, CommunicationMethod, CriticalCommunication } from "@/types/radiology-staff";

interface CriticalResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: string;
  patientName: string;
  study: string;
  onSubmit: (data: Omit<CriticalCommunication, "id" | "documentedBy">) => void;
}

const CRITICAL_CATEGORIES: CriticalCategory[] = [
  "Stroke", "PE", "Aortic Dissection", "Mass/Malignancy", "Fracture", "Other"
];

const COMMUNICATION_METHODS: CommunicationMethod[] = [
  "Phone", "Page", "In Person", "HIPAA Secure Message"
];

export function CriticalResultsModal({
  open,
  onOpenChange,
  examId,
  patientName,
  study,
  onSubmit,
}: CriticalResultsModalProps) {
  const [category, setCategory] = useState<CriticalCategory | "">("");
  const [contact, setContact] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [method, setMethod] = useState<CommunicationMethod | "">("");
  const [readbackConfirmed, setReadbackConfirmed] = useState(false);
  const [notes, setNotes] = useState("");
  const [timestamp, setTimestamp] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  });

  const isValid = category && contact && contactRole && method && readbackConfirmed;

  const handleSubmit = () => {
    if (!isValid) return;
    
    onSubmit({
      examId,
      category: category as CriticalCategory,
      contact,
      contactRole,
      method: method as CommunicationMethod,
      readbackConfirmed,
      timestamp,
      notes,
    });

    // Reset form
    setCategory("");
    setContact("");
    setContactRole("");
    setMethod("");
    setReadbackConfirmed(false);
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Document Critical Result Communication
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{patientName}</Badge>
              <Badge variant="secondary">{study}</Badge>
            </div>
            <p className="text-sm mt-2">
              Critical results require documented read-back confirmation before report release.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">
              Critical Finding Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as CriticalCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {CRITICAL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Person Reached */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="contact">
                <User className="h-3 w-3 inline mr-1" />
                Person Reached <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact"
                placeholder="e.g., Dr. Smith"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
              <Input
                id="role"
                placeholder="e.g., Attending Physician"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
              />
            </div>
          </div>

          {/* Method & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="method">
                <Phone className="h-3 w-3 inline mr-1" />
                Method <span className="text-destructive">*</span>
              </Label>
              <Select value={method} onValueChange={(v) => setMethod(v as CommunicationMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method..." />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timestamp">
                <Clock className="h-3 w-3 inline mr-1" />
                Time of Communication
              </Label>
              <Input
                id="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            </div>
          </div>

          {/* Read-back Script */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
              📋 Read-back Script
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p>"I have a critical finding to report for patient <strong>{patientName}</strong>."</p>
              <p>"The {study} shows [describe critical finding]."</p>
              <p>"Can you please read back the patient name and finding to confirm?"</p>
            </div>
          </div>

          {/* Read-back Confirmation */}
          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
            <Checkbox
              id="readback"
              checked={readbackConfirmed}
              onCheckedChange={(checked) => setReadbackConfirmed(!!checked)}
              className="mt-0.5"
            />
            <div className="grid gap-1">
              <Label htmlFor="readback" className="font-medium">
                Read-back confirmed <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                I confirm that the recipient read back the patient identifiers and critical finding accurately.
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">
              <MessageSquare className="h-3 w-3 inline mr-1" />
              Additional Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about the communication..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid}
            className="bg-destructive hover:bg-destructive/90"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Log Critical Communication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
