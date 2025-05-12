
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Filter, Loader, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

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
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { user } = useAuth();
  
  // Filter states
  const [companyFilter, setCompanyFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    // Listen for search events from SearchBar component
    const handleSearch = (event: CustomEvent) => {
      const { query, timestamp, results } = event.detail;
      setIsLoading(true);
      setLastSearchQuery(query);
      
      // Clear previous results
      setLeads([]);
      setFilteredLeads([]);
      setCompanyFilter("");
      setSourceFilter("");
      setLocationFilter("");
      
      setTimeout(() => {
        if (results && Array.isArray(results)) {
          setLeads(results);
          setFilteredLeads(results);
          setIsLoading(false);
        } else {
          console.error("Invalid search results format:", results);
          toast.error("Received invalid results format from search API");
          setLeads([]);
          setFilteredLeads([]);
          setIsLoading(false);
        }
      }, 300); // Small delay for UX
    };

    window.addEventListener('leadSearchCompleted', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('leadSearchCompleted', handleSearch as EventListener);
    };
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (leads.length === 0) return;
    
    let filtered = [...leads];
    
    if (companyFilter) {
      filtered = filtered.filter(lead => 
        lead.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    
    if (sourceFilter) {
      filtered = filtered.filter(lead => 
        lead.source?.toLowerCase().includes(sourceFilter.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(lead => 
        lead.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    setFilteredLeads(filtered);
  }, [leads, companyFilter, sourceFilter, locationFilter]);

  const handleExport = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    try {
      // Convert leads to CSV
      const headers = ["Name", "Title", "Company", "Email", "Phone", "Source", "Location"];
      const csvContent = [
        headers.join(","),
        ...filteredLeads.map(lead => [
          `"${lead.name || ''}"`,
          `"${lead.title || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.source || ''}"`,
          `"${lead.location || ''}"`
        ].join(","))
      ].join("\n");
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${lastSearchQuery.replace(/\s+/g, "_")}_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Leads exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export leads");
    }
  };

  const clearFilters = () => {
    setCompanyFilter("");
    setSourceFilter("");
    setLocationFilter("");
  };

  const renderLoadingState = () => (
    <div className="p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted/30 rounded"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border rounded-lg shadow-sm">
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
            onClick={handleExport}
            disabled={filteredLeads.length === 0}
          >
            <FileText size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {isFiltering && (
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
          
          {companyFilter || sourceFilter || locationFilter ? (
            <div className="mt-2 text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          ) : null}
        </div>
      )}
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader size={24} className="animate-spin mr-2 text-leadgen-primary" />
            <span className="text-leadgen-primary font-medium">Fetching leads...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {lastSearchQuery ? (
              <>
                <p>No leads found for "{lastSearchQuery}"</p>
                <p className="text-sm mt-1">Try a different search query</p>
              </>
            ) : (
              <p>Use the search bar above to find leads</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.title}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        lead.source?.toLowerCase().includes("linkedin") ? "bg-[#0077B5]" :
                        lead.source?.toLowerCase().includes("google") ? "bg-[#34A853]" :
                        lead.source?.toLowerCase().includes("apollo") ? "bg-[#6366F1]" :
                        lead.source?.toLowerCase().includes("reddit") ? "bg-[#FF4500]" :
                        lead.source?.toLowerCase().includes("twitter") ? "bg-[#1DA1F2]" :
                        "bg-gray-400"
                      }`}></div>
                      {lead.source}
                    </div>
                  </TableCell>
                  <TableCell>{lead.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
