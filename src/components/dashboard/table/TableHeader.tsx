
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Filter } from "lucide-react";

interface TableHeaderProps {
  lastSearchQuery: string;
  isFiltering: boolean;
  setIsFiltering: (value: boolean) => void;
  filteredLeads: any[];
  onExport: () => void;
}

const TableHeader = ({
  lastSearchQuery,
  isFiltering,
  setIsFiltering,
  filteredLeads,
  onExport,
}: TableHeaderProps) => {
  return (
    <div className="p-4 flex justify-between items-center border-b">
      <div>
        <h3 className="font-medium text-lg">Search Results</h3>
        {lastSearchQuery && (
          <p className="text-sm text-muted-foreground mt-1">
            Showing results for: "{lastSearchQuery}"
          </p>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFiltering(!isFiltering)}
        >
          <Filter size={14} className="mr-1" />
          {isFiltering ? "Hide Filters" : "Filter"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={filteredLeads.length === 0}
        >
          <FileText size={14} className="mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default TableHeader;
