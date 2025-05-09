
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Filter } from "lucide-react";

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

const ResultsTable = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-medium text-lg">Search Results</h3>
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
      </div>
    </div>
  );
};

export default ResultsTable;
