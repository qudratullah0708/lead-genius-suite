
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

// Mock data for demonstration
const mockLeads = [
  {
    id: "1",
    name: "John Smith",
    title: "Senior Realtor",
    company: "Berlin Properties Ltd",
    email: "john.smith@berlinprops.com",
    phone: "+49 30 12345678",
    source: "LinkedIn",
    location: "Berlin, Germany"
  },
  {
    id: "2",
    name: "Anna Weber",
    title: "Real Estate Agent",
    company: "City Homes Berlin",
    email: "anna.weber@cityhomes.de",
    phone: "+49 30 87654321",
    source: "Google Maps",
    location: "Berlin, Germany"
  },
  {
    id: "3",
    name: "Markus Bauer",
    title: "Property Consultant",
    company: "Luxury Real Estate Berlin",
    email: "m.bauer@luxury-berlin.de",
    phone: "+49 30 45678901",
    source: "Apollo.io",
    location: "Berlin, Germany"
  },
  {
    id: "4",
    name: "Sarah Schmidt",
    title: "Realtor",
    company: "Berlin Properties Ltd",
    email: "s.schmidt@berlinprops.com",
    phone: "+49 30 56789012",
    source: "LinkedIn",
    location: "Berlin, Germany"
  },
  {
    id: "5",
    name: "Thomas Müller",
    title: "Real Estate Agent",
    company: "Berlin Immobilien AG",
    email: "thomas.mueller@immobilien-berlin.de",
    phone: "+49 30 67890123",
    source: "Google Maps",
    location: "Berlin, Germany"
  }
];

// AI-generated data for marketing leaders/companies
const aiGeneratedLeads = [
  {
    id: "6",
    name: "Sarah Johnson",
    title: "Chief Marketing Officer",
    company: "Anthropic AI",
    email: "s.johnson@anthropic.com",
    phone: "+1 415 555 1234",
    source: "Reddit",
    location: "San Francisco, USA"
  },
  {
    id: "7",
    name: "Michael Chen",
    title: "VP of Marketing",
    company: "Scale AI",
    email: "m.chen@scaleai.com",
    phone: "+1 415 555 2345",
    source: "LinkedIn",
    location: "San Francisco, USA"
  },
  {
    id: "8",
    name: "Emma Rodriguez",
    title: "Growth Marketing Director",
    company: "Jasper AI",
    email: "e.rodriguez@jasper.ai",
    phone: "+1 650 555 3456",
    source: "Apollo.io",
    location: "Austin, USA"
  },
  {
    id: "9",
    name: "David Kim",
    title: "Head of Marketing",
    company: "Synthesia",
    email: "d.kim@synthesia.io",
    phone: "+44 20 1234 5678",
    source: "Google Maps",
    location: "London, UK"
  },
  {
    id: "10",
    name: "Laura Schmitt",
    title: "Marketing Director",
    company: "Runway ML",
    email: "l.schmitt@runwayml.com",
    phone: "+1 212 555 7890",
    source: "Apollo.io",
    location: "New York, USA"
  }
];

const ResultsTable = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");

  useEffect(() => {
    // Listen for search events from SearchBar component
    const handleSearch = (event: CustomEvent) => {
      const { query, timestamp } = event.detail;
      setIsLoading(true);
      setLastSearchQuery(query);
      
      // Simulate API fetch delay
      setTimeout(() => {
        // Check if the query is marketing related
        if (query.toLowerCase().includes('market') || 
            query.toLowerCase().includes('ai') || 
            query.toLowerCase().includes('saas') ||
            query.toLowerCase().includes('startup')) {
          setLeads(aiGeneratedLeads);
          toast.success(`Found ${aiGeneratedLeads.length} leads for "${query}"`);
        } else {
          // For other queries use the default mock data
          setLeads(mockLeads);
          toast.success(`Found ${mockLeads.length} leads for "${query}"`);
        }
        setIsLoading(false);
      }, 1000);
    };

    window.addEventListener('leadSearchCompleted', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('leadSearchCompleted', handleSearch as EventListener);
    };
  }, []);

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
          <Button variant="outline" size="sm">
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
                        lead.source === "LinkedIn" ? "bg-[#0077B5]" :
                        lead.source === "Google Maps" ? "bg-[#34A853]" :
                        lead.source === "Apollo.io" ? "bg-[#6366F1]" :
                        lead.source === "Reddit" ? "bg-[#FF4500]" :
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
