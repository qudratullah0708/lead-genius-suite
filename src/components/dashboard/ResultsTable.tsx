
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import TableHeader from "./table/TableHeader";
import TableFilters from "./table/TableFilters";
import TableContent from "./table/TableContent";
import EmailReportButton from "./table/EmailReportButton";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useLeadExport } from "@/hooks/useLeadExport";

// Define the lead type
interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  location: string;
}

const ResultsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { user } = useAuth();
  
  const {
    filteredLeads,
    setFilteredLeads,
    companyFilter,
    setCompanyFilter,
    sourceFilter,
    setSourceFilter,
    locationFilter,
    setLocationFilter,
    isFiltering,
    setIsFiltering,
    clearFilters
  } = useTableFilters(leads);

  const { exportToCsv } = useLeadExport();

  useEffect(() => {
    // Listen for search start event (new)
    const handleSearchStart = (event: CustomEvent) => {
      const { query } = event.detail;
      setIsLoading(true);
      setLastSearchQuery(query);
      
      // Clear previous results
      setLeads([]);
      setFilteredLeads([]);
      clearFilters();
    };
    
    // Listen for search completion event
    const handleSearch = (event: CustomEvent) => {
      const { query, timestamp, results } = event.detail;
      setLastSearchQuery(query);
      
      setTimeout(() => {
        if (results && Array.isArray(results)) {
          setLeads(results);
          setFilteredLeads(results);
          setIsLoading(false);
        } else {
          console.error("Invalid search results format:", results);
          setLeads([]);
          setFilteredLeads([]);
          setIsLoading(false);
        }
      }, 300); // Small delay for UX
    };

    window.addEventListener('leadSearchStarted', handleSearchStart as EventListener);
    window.addEventListener('leadSearchCompleted', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('leadSearchStarted', handleSearchStart as EventListener);
      window.removeEventListener('leadSearchCompleted', handleSearch as EventListener);
    };
  }, []);

  const handleExport = () => {
    exportToCsv(filteredLeads, lastSearchQuery);
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <TableHeader
          lastSearchQuery={lastSearchQuery}
          isFiltering={isFiltering}
          setIsFiltering={setIsFiltering}
          filteredLeads={filteredLeads}
          onExport={handleExport}
        />
        <div className="ml-2">
          <EmailReportButton 
            leads={filteredLeads}
            searchQuery={lastSearchQuery}
            disabled={filteredLeads.length === 0}
          />
        </div>
      </div>
      
      {isFiltering && (
        <TableFilters
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          clearFilters={clearFilters}
          leadsCount={leads.length}
          filteredLeadsCount={filteredLeads.length}
        />
      )}
      
      <div className="overflow-x-auto">
        <TableContent
          isLoading={isLoading}
          lastSearchQuery={lastSearchQuery}
          filteredLeads={filteredLeads}
        />
      </div>
    </div>
  );
};

export default ResultsTable;
