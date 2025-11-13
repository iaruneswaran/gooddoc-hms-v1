import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, CheckCircle, FileText, AlertTriangle, Upload, Plus, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface LabTest {
  id: string;
  name: string;
  loinc?: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: "H" | "L" | "C";
  delta?: number;
  priorValue?: string;
}

const mockPatient = {
  name: "Anaya Shah",
  mrn: "MRN-204983",
  age: 34,
  sex: "F",
  type: "OPD",
  physician: "Dr. Mehta",
  encounterId: "ENC-45821",
  allergies: ["Penicillin"]
};

const mockOrder = {
  id: "OR-LL-10342",
  priority: "STAT",
  panels: ["Cardiac Panel", "CBC with Diff", "CMP"],
  specimen: {
    type: "Blood (Serum)",
    barcode: "S-000239",
    collected: "Today 10:15 AM",
    received: "Today 10:30 AM",
    collectedBy: "Tech. Kumar",
    analyzer: "Cobas c702"
  }
};

const initialTests: LabTest[] = [
  {
    id: "1",
    name: "Troponin I",
    loinc: "10839-9",
    value: "0.85",
    unit: "ng/mL",
    referenceRange: "< 0.04",
    flag: "C",
    delta: 780,
    priorValue: "0.02"
  },
  {
    id: "2",
    name: "Hemoglobin",
    loinc: "718-7",
    value: "13.2",
    unit: "g/dL",
    referenceRange: "12.0 - 16.0",
    priorValue: "13.5",
    delta: -2
  },
  {
    id: "3",
    name: "WBC Count",
    loinc: "6690-2",
    value: "11.5",
    unit: "10^3/μL",
    referenceRange: "4.5 - 11.0",
    flag: "H",
    priorValue: "9.2",
    delta: 25
  },
  {
    id: "4",
    name: "Platelet Count",
    loinc: "777-3",
    value: "245",
    unit: "10^3/μL",
    referenceRange: "150 - 400",
    priorValue: "268"
  },
  {
    id: "5",
    name: "Sodium",
    loinc: "2951-2",
    value: "138",
    unit: "mmol/L",
    referenceRange: "136 - 145",
    priorValue: "140"
  },
  {
    id: "6",
    name: "Potassium",
    loinc: "2823-3",
    value: "4.2",
    unit: "mmol/L",
    referenceRange: "3.5 - 5.0",
    priorValue: "4.1"
  },
  {
    id: "7",
    name: "Creatinine",
    loinc: "2160-0",
    value: "0.9",
    unit: "mg/dL",
    referenceRange: "0.6 - 1.2",
    priorValue: "0.8"
  },
  {
    id: "8",
    name: "eGFR (calc)",
    value: "95",
    unit: "mL/min/1.73m²",
    referenceRange: "> 60",
    priorValue: "98"
  }
];

export default function LaboratoryResults() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tests, setTests] = useState<LabTest[]>(initialTests);
  const [findings, setFindings] = useState("");
  const [comments, setComments] = useState("");
  const [otherNotes, setOtherNotes] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("all");

  const handleTestValueChange = (id: string, value: string) => {
    setTests(tests.map(test => test.id === id ? { ...test, value } : test));
  };

  const handleTestUnitChange = (id: string, unit: string) => {
    setTests(tests.map(test => test.id === id ? { ...test, unit } : test));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Lab results have been saved as draft.",
    });
  };

  const handleValidate = () => {
    const criticalTests = tests.filter(t => t.flag === "C");
    if (criticalTests.length > 0) {
      toast({
        title: "Critical Values Detected",
        description: `${criticalTests.length} test(s) have critical values requiring attention.`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Validation Complete",
        description: "All results are within acceptable ranges.",
      });
    }
  };

  const handleRelease = () => {
    toast({
      title: "Results Released",
      description: "Lab results have been released and are now final.",
    });
    setTimeout(() => navigate("/diagnostics"), 1500);
  };

  const getFlagBadge = (flag?: string) => {
    if (!flag) return null;
    const colors = {
      H: "bg-orange-100 text-orange-700",
      L: "bg-blue-100 text-blue-700",
      C: "bg-destructive text-destructive-foreground"
    };
    return <Badge className={colors[flag as keyof typeof colors]}>{flag}</Badge>;
  };

  const getDeltaIndicator = (delta?: number) => {
    if (!delta) return null;
    const isPositive = delta > 0;
    const color = isPositive ? "text-orange-600" : "text-blue-600";
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
      <span className={`flex items-center gap-1 text-xs ${color}`}>
        <Icon className="h-3 w-3" />
        {Math.abs(delta)}%
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Diagnostics", "Lab Results"]} />
        
        <main className="px-6 py-6 pb-24 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          {/* Back Link */}
          <button
            onClick={() => navigate("/diagnostics")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Diagnostics</span>
          </button>

          {/* Patient Card */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Patient</div>
                  <div className="font-medium text-lg">{mockPatient.name}</div>
                  <div className="text-sm text-muted-foreground">{mockPatient.mrn} • {mockPatient.age}y | {mockPatient.sex}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <Badge variant="outline">{mockPatient.type}</Badge>
                  <div className="text-sm text-muted-foreground mt-1">Encounter: {mockPatient.encounterId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Physician</div>
                  <div className="font-medium">{mockPatient.physician}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Allergies</div>
                  <div className="flex gap-1 mt-1">
                    {mockPatient.allergies.map(a => (
                      <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-medium">{mockOrder.id}</div>
                  <Badge variant="destructive" className="mt-1">{mockOrder.priority}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Panels</div>
                  {mockOrder.panels.map(p => (
                    <div key={p} className="text-sm">{p}</div>
                  ))}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Specimen</div>
                  <div className="text-sm font-medium">{mockOrder.specimen.type}</div>
                  <div className="text-xs text-muted-foreground">Barcode: {mockOrder.specimen.barcode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Collected / Received</div>
                  <div className="text-xs">{mockOrder.specimen.collected}</div>
                  <div className="text-xs">{mockOrder.specimen.received}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Analyzer</div>
                  <div className="text-sm">{mockOrder.specimen.analyzer}</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="h-3 w-3 mr-1" />
                    Import CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {/* Results Grid - Left Column (2/3) */}
            <div className="col-span-2 space-y-6">
              {/* Panel Selector */}
              <Tabs value={selectedPanel} onValueChange={setSelectedPanel}>
                <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
                  <TabsTrigger value="all" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                    All Tests
                  </TabsTrigger>
                  <TabsTrigger value="cardiac" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                    Cardiac Panel
                  </TabsTrigger>
                  <TabsTrigger value="cbc" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                    CBC
                  </TabsTrigger>
                  <TabsTrigger value="cmp" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                    CMP
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Test Results</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calculator className="h-4 w-4 mr-1" />
                        Calculators
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Test
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Flag</TableHead>
                        <TableHead>Delta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{test.name}</div>
                              {test.loinc && (
                                <div className="text-xs text-muted-foreground">{test.loinc}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={test.value}
                              onChange={(e) => handleTestValueChange(test.id, e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={test.unit} onValueChange={(v) => handleTestUnitChange(test.id, v)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={test.unit}>{test.unit}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {test.referenceRange}
                          </TableCell>
                          <TableCell>
                            {getFlagBadge(test.flag)}
                          </TableCell>
                          <TableCell>
                            {test.priorValue && (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  Prior: {test.priorValue}
                                </div>
                                {getDeltaIndicator(test.delta)}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Narratives */}
              <Card>
                <CardHeader>
                  <CardTitle>Narratives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Findings</label>
                    <Textarea
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      placeholder="Enter key findings..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Comments</label>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Additional comments or interpretation..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Other Notes</label>
                    <Textarea
                      value={otherNotes}
                      onChange={(e) => setOtherNotes(e.target.value)}
                      placeholder="Technical notes, limitations, etc..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reference Panel - Right Column (1/3) */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Reference Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Selected Test</div>
                    <div className="text-sm font-medium">Troponin I</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Reference Range</div>
                    <div className="text-sm">{'< 0.04 ng/mL'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Normal adults</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Critical Values</div>
                    <div className="text-sm text-destructive">{'>'}0.40 ng/mL</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Prior Results</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">1 month ago</span>
                        <span>0.02 ng/mL</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">3 months ago</span>
                        <span>0.01 ng/mL</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">QC Status</div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passed
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Last calibration: Today 8:00 AM</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Footer */}
          <div className="fixed bottom-0 left-[196px] right-0 border-t bg-card p-4">
            <div className="flex items-center justify-between max-w-full">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">1 critical value detected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" onClick={handleValidate}>
                  Submit for Review
                </Button>
                <Button onClick={handleRelease}>
                  <FileText className="h-4 w-4 mr-2" />
                  Release Results
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
