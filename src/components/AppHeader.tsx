import { useState, useRef, useEffect } from "react";
import { Bell, User, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type BreadcrumbItem = string | { label: string; onClick: () => void };

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const normalizePhone = (value: string) => value.replace(/[\s\-]/g, "");

  const handleSearch = () => {
    const normalized = normalizePhone(searchValue);
    setValidationError("");

    if (!normalized) {
      setValidationError("Please enter a phone number");
      return;
    }

    if (!/^\d{10}$/.test(normalized)) {
      setValidationError("Enter a valid 10-digit phone number");
      return;
    }

    // Navigate to search results page
    navigate(`/patients/search?q=${normalized}`);
    setSearchValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setValidationError("");
  };

  return (
    <header className="relative h-16 border-b border-border bg-card flex items-center px-8">
      {/* Breadcrumbs - Left */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[200px]">
        {breadcrumbs.map((crumb, index) => {
          const isClickable = typeof crumb === "object";
          const label = isClickable ? crumb.label : crumb;
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {isClickable && !isLast ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ) : (
                <span className={isLast ? "text-foreground font-medium" : ""}>
                  {label}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Patient Search - Center */}
      <div className="flex-1 flex justify-center">
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by phone number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-[500px] h-11 pl-10 pr-8 text-sm border-2 border-muted focus:border-primary shadow-sm"
              aria-label="Search patients"
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} className="h-11 px-4">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          {validationError && (
            <p className="absolute top-full left-0 mt-1 text-xs text-destructive">{validationError}</p>
          )}
        </div>
      </div>

      {/* Icons - Right */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
            1
          </Badge>
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <User className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
