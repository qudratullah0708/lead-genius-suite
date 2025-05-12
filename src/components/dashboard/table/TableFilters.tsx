
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TableFiltersProps {
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  clearFilters: () => void;
  leadsCount: number;
  filteredLeadsCount: number;
}

const TableFilters = ({
  companyFilter,
  setCompanyFilter,
  sourceFilter,
  setSourceFilter,
  locationFilter,
  setLocationFilter,
  clearFilters,
  leadsCount,
  filteredLeadsCount,
}: TableFiltersProps) => {
  const hasActiveFilters = companyFilter || sourceFilter || locationFilter;

  return (
    <div className="p-4 border-b bg-muted/30">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <Label htmlFor="company-filter">Company</Label>
          <Input
            id="company-filter"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder="Filter by company..."
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <Label htmlFor="source-filter">Source</Label>
          <Input
            id="source-filter"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            placeholder="Filter by source..."
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <Label htmlFor="location-filter">Location</Label>
          <Input
            id="location-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location..."
            className="h-8"
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8"
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 text-sm text-muted-foreground">
          Showing {filteredLeadsCount} of {leadsCount} leads
        </div>
      ) : null}
    </div>
  );
};

export default TableFilters;
