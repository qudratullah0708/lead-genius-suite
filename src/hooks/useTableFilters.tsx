
import { useState, useEffect } from "react";

export function useTableFilters(leads: Record<string, any>[]) {
  const [filteredLeads, setFilteredLeads] = useState<Record<string, any>[]>(leads);
  const [companyFilter, setCompanyFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (leads.length === 0) return;

    let filtered = [...leads];

    if (companyFilter) {
      filtered = filtered.filter((lead) =>
        lead.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (sourceFilter) {
      filtered = filtered.filter((lead) =>
        lead.source?.toLowerCase().includes(sourceFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((lead) =>
        lead.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  }, [leads, companyFilter, sourceFilter, locationFilter]);

  const clearFilters = () => {
    setCompanyFilter("");
    setSourceFilter("");
    setLocationFilter("");
  };

  return {
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
  };
}
