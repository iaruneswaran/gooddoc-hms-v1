import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CODE_PREFIX_LEGEND } from "@/data/code-prefix-legend";

interface CodePrefixListProps {
  className?: string;
}

export function CodePrefixList({ className }: CodePrefixListProps) {
  const [search, setSearch] = useState("");
  const [expandedPrefix, setExpandedPrefix] = useState<string | null>(null);

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
    <Card className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-foreground mb-3">Code Prefix Legend</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 h-[400px]">
        <div className="p-2 space-y-1">
          {filteredCategories.map((category) => {
            const isExpanded = expandedPrefix === category.prefix;
            const filteredItems = search
              ? category.items.filter(
                  (item) =>
                    item.code.toLowerCase().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase())
                )
              : category.items;

            return (
              <div key={category.prefix}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    isExpanded
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                  onClick={() =>
                    setExpandedPrefix(isExpanded ? null : category.prefix)
                  }
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs px-2"
                  >
                    {category.prefix}
                  </Badge>
                  <span className="text-sm font-medium flex-1 truncate">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.items.length}
                  </span>
                </div>

                {isExpanded && (
                  <div className="ml-6 mt-1 mb-2 border-l-2 border-muted pl-3 space-y-0.5">
                    {filteredItems.slice(0, 10).map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between py-1.5 px-2 rounded text-sm hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded shrink-0">
                            {item.code}
                          </code>
                          <span className="truncate text-muted-foreground">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {item.unit}
                        </span>
                      </div>
                    ))}
                    {filteredItems.length > 10 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{filteredItems.length - 10} more items
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No categories found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30">
        <p className="text-[10px] text-muted-foreground">
          <strong>UOM:</strong> per visit, per session, per day, per hour, per procedure, per test
        </p>
      </div>
    </Card>
  );
}
