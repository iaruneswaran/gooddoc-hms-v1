import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { CODE_PREFIX_LEGEND, CODE_PREFIXES } from "@/data/code-prefix-legend";

export function CodePrefixLegend() {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (prefix: string) => {
    setExpandedCategories((prev) =>
      prev.includes(prefix)
        ? prev.filter((p) => p !== prefix)
        : [...prev, prefix]
    );
  };

  const filteredCategories = CODE_PREFIX_LEGEND.filter((category) => {
    const searchLower = search.toLowerCase();
    if (
      category.prefix.toLowerCase().includes(searchLower) ||
      category.name.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    return category.items.some(
      (item) =>
        item.code.toLowerCase().includes(searchLower) ||
        item.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Book className="h-4 w-4" />
          Code Legend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Code Prefix Legend</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Reference */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Quick Reference</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CODE_PREFIXES).slice(0, 16).map(([prefix, name]) => (
                <Badge
                  key={prefix}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSearch(prefix);
                    setExpandedCategories([prefix]);
                  }}
                >
                  <span className="font-mono font-semibold mr-1">{prefix}</span>
                  <span className="text-muted-foreground">{name.split("/")[0]}</span>
                </Badge>
              ))}
              <Badge variant="secondary" className="text-xs">
                +{Object.keys(CODE_PREFIXES).length - 16} more
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search codes or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories List */}
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2 pr-4">
              {filteredCategories.map((category) => (
                <Collapsible
                  key={category.prefix}
                  open={expandedCategories.includes(category.prefix)}
                  onOpenChange={() => toggleCategory(category.prefix)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        {expandedCategories.includes(category.prefix) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Badge variant="secondary" className="font-mono">
                          {category.prefix}
                        </Badge>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category.items.length} items
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 ml-7 border-l-2 border-muted pl-4 py-2">
                      <div className="grid gap-1">
                        {category.items
                          .filter(
                            (item) =>
                              !search ||
                              item.code.toLowerCase().includes(search.toLowerCase()) ||
                              item.name.toLowerCase().includes(search.toLowerCase())
                          )
                          .map((item) => (
                            <div
                              key={item.code}
                              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {item.code}
                                </code>
                                <span>{item.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {item.unit}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No categories found matching "{search}"
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer Note */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <strong>Note on Units (UOM):</strong> per visit, per session, per day, per hour, per km, per procedure, per test, per dose, per unit, SKU
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
