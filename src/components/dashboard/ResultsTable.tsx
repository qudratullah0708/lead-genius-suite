
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
import { FileText, Filter, Loader } from "lucide-react";
import { toast } from "sonner";

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
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");

  useEffect(() => {
    // Listen for search events from SearchBar component
    const handleSearch = (event: CustomEvent) => {
      const { query, timestamp, results } = event.detail;
      setIsLoading(true);
      setLastSearchQuery(query);
      
      setTimeout(() => {
        if (results && Array.isArray(results)) {
          setLeads(results);
          setIsLoading(false);
        } else {
          console.error("Invalid search results format:", results);
          toast.error("Received invalid results format from search API");
          setLeads([]);
          setIsLoading(false);
        }
      }, 300); // Small delay for UX
    };

    window.addEventListener('leadSearchCompleted', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('leadSearchCompleted', handleSearch as EventListener);
    };
  }, []);

  const handleExport = () => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    try {
      // Convert leads to CSV
      const headers = ["Name", "Title", "Company", "Email", "Phone", "Source", "Location"];
      const csvContent = [
        headers.join(","),
        ...leads.map(lead => [
          `"${lead.name}"`,
          `"${lead.title}"`,
          `"${lead.company}"`,
          `"${lead.email}"`,
          `"${lead.phone}"`,
          `"${lead.source}"`,
          `"${lead.location}"`
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
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={leads.length === 0}
          >
            <FileText size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader size={24} className="animate-spin mr-2" />
            <span>Fetching leads...</span>
          </div>
        ) : leads.length === 0 ? (
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
              {leads.map((lead) => (
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
