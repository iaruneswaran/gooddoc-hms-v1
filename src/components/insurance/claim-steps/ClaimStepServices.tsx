import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface ClaimStepServicesProps {
  data: any;
  onChange: (data: any) => void;
  errors: string[];
}

export function ClaimStepServices({ data, onChange, errors }: ClaimStepServicesProps) {
  const services = data.services || [];

  const addService = () => {
    const newService = {
      id: `s${Date.now()}`,
      type: "Consultation",
      description: "",
      code: "",
      units: 1,
      unitCost: 0,
      tax: 0,
      discount: 0,
      total: 0
    };
    onChange({ ...data, services: [...services, newService] });
  };

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate total
    const unitCost = updated[index].unitCost || 0;
    const units = updated[index].units || 1;
    const tax = updated[index].tax || 0;
    const discount = updated[index].discount || 0;
    updated[index].total = (unitCost * units) + tax - discount;
    
    onChange({ ...data, services: updated });
  };

  const removeService = (index: number) => {
    const updated = services.filter((_: any, i: number) => i !== index);
    onChange({ ...data, services: updated });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Services</h2>
        <Button onClick={addService} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No services added yet</p>
          <Button onClick={addService} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="w-20">Units</TableHead>
                <TableHead className="w-28">Unit Cost</TableHead>
                <TableHead className="w-28">Tax</TableHead>
                <TableHead className="w-28">Discount</TableHead>
                <TableHead className="w-28">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service: any, index: number) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Select
                      value={service.type}
                      onValueChange={(value) => updateService(index, "type", value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Imaging">Imaging</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Description"
                      value={service.description}
                      onChange={(e) => updateService(index, "description", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Code"
                      value={service.code}
                      onChange={(e) => updateService(index, "code", e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={service.units}
                      onChange={(e) => updateService(index, "units", parseInt(e.target.value) || 1)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      placeholder="₹"
                      value={service.unitCost / 100}
                      onChange={(e) => updateService(index, "unitCost", (parseFloat(e.target.value) || 0) * 100)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      placeholder="₹"
                      value={service.tax / 100}
                      onChange={(e) => updateService(index, "tax", (parseFloat(e.target.value) || 0) * 100)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      placeholder="₹"
                      value={service.discount / 100}
                      onChange={(e) => updateService(index, "discount", (parseFloat(e.target.value) || 0) * 100)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatINR(service.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
