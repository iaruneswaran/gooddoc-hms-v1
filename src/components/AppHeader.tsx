import { useState, useRef, useEffect } from "react";
import { Bell, User, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatientSearchCard } from "@/components/header/PatientSearchCard";
import { mockPatientsByPhone } from "@/data/header-search.mock";

type BreadcrumbItem = string | { label: string; onClick: () => void };

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [validationError, setValidationError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizePhone = (value: string) => value.replace(/[\s\-]/g, "");

  const handleSearch = () => {
    const normalized = normalizePhone(searchValue);
    setValidationError("");
    setShowNotFound(false);
    setSearchResult(null);

    if (!normalized) {
      setValidationError("Please enter a phone number");
      return;
    }

    if (!/^\d{10}$/.test(normalized)) {
      setValidationError("Enter a valid 10-digit phone number");
      return;
    }

    const patient = mockPatientsByPhone[normalized];
    if (patient) {
      setSearchResult(patient);
    } else {
      setShowNotFound(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    setSearchResult(null);
    setShowNotFound(false);
    setSearchValue("");
    setValidationError("");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (searchResult || showNotFound) {
          handleClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchResult, showNotFound]);

  return (
    <header className="relative h-16 border-b border-border bg-card flex items-center justify-between px-8" ref={containerRef}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

      <div className="flex items-center gap-4">
        {/* Patient Search */}
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by phone number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-[200px] h-10 pr-8"
              aria-label="Search patients"
            />
            {searchValue && (
              <button
                onClick={handleClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button size="sm" onClick={handleSearch} className="h-10">
            <Search className="w-4 h-4" />
          </Button>
          {validationError && (
            <p className="absolute top-full left-0 mt-1 text-xs text-destructive">{validationError}</p>
          )}
        </div>

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

      {/* Search Result Card */}
      {searchResult && (
        <PatientSearchCard patient={searchResult} onClose={handleClose} />
      )}

      {/* Not Found State */}
      {showNotFound && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-8 p-6 bg-card border border-border rounded-lg shadow-lg z-50 text-center">
          <p className="text-foreground font-medium">No patient found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different phone number</p>
        </div>
      )}
    </header>
  );
}
