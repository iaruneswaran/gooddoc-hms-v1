import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSVRow {
  testName: string;
  loinc: string;
  value: string;
  unit: string;
  refLow?: string;
  refHigh?: string;
  flag?: string;
  measuredAt?: string;
  analyzer?: string;
  priorValue?: string;
  isValid: boolean;
  errors: string[];
}

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (rows: CSVRow[]) => void;
}

export function ImportCSVModal({
  open,
  onClose,
  onImport,
}: ImportCSVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const parseCSV = useCallback((content: string): CSVRow[] => {
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: CSVRow = {
        testName: values[headers.indexOf("testname")] || values[headers.indexOf("test_name")] || "",
        loinc: values[headers.indexOf("loinc")] || "",
        value: values[headers.indexOf("value")] || "",
        unit: values[headers.indexOf("unit")] || "",
        refLow: values[headers.indexOf("reflow")] || values[headers.indexOf("ref_low")] || undefined,
        refHigh: values[headers.indexOf("refhigh")] || values[headers.indexOf("ref_high")] || undefined,
        flag: values[headers.indexOf("flag")] || undefined,
        measuredAt: values[headers.indexOf("measuredat")] || values[headers.indexOf("measured_at")] || undefined,
        analyzer: values[headers.indexOf("analyzer")] || undefined,
        priorValue: values[headers.indexOf("priorvalue")] || values[headers.indexOf("prior_value")] || undefined,
        isValid: true,
        errors: [],
      };

      // Validate required fields
      if (!row.testName && !row.loinc) {
        row.isValid = false;
        row.errors.push("Missing test name or LOINC code");
      }
      if (!row.value) {
        row.isValid = false;
        row.errors.push("Missing value");
      }
      if (row.value && isNaN(parseFloat(row.value))) {
        row.isValid = false;
        row.errors.push("Invalid numeric value");
      }

      rows.push(row);
    }

    return rows;
  }, []);

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setIsProcessing(true);

      try {
        const content = await selectedFile.text();
        const rows = parseCSV(content);
        setParsedRows(rows);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setParsedRows([]);
      } finally {
        setIsProcessing(false);
      }
    },
    [parseCSV]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    onImport(validRows);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import CSV Results
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with lab results. Required columns: testName or loinc, value, unit.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
            >
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop a CSV file here, or
              </p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Expected columns: testName, loinc, value, unit, refLow, refHigh, flag, measuredAt, analyzer, priorValue
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {parsedRows.length} rows parsed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {validCount} valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      {invalidCount} errors
                    </Badge>
                  )}
                </div>
              </div>

              <ScrollArea className="h-64 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>LOINC</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Ref Range</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row, idx) => (
                      <TableRow
                        key={idx}
                        className={cn(!row.isValid && "bg-destructive/5")}
                      >
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{row.testName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.loinc}
                        </TableCell>
                        <TableCell className="font-mono">{row.value}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.refLow && row.refHigh
                            ? `${row.refLow} - ${row.refHigh}`
                            : row.refHigh
                            ? `< ${row.refHigh}`
                            : row.refLow
                            ? `> ${row.refLow}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {row.errors.length > 0 && (
                            <span className="text-xs text-destructive">
                              {row.errors.join(", ")}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <Button variant="ghost" size="sm" onClick={handleReset}>
                Choose different file
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || validCount === 0 || isProcessing}
          >
            Import {validCount} Results
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
