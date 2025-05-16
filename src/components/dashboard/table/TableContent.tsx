
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";

// Using a more generic type for leads
interface TableContentProps {
  isLoading: boolean;
  lastSearchQuery: string;
  filteredLeads: Record<string, any>[];
}

const TableContent = ({
  isLoading,
  lastSearchQuery,
  filteredLeads,
}: TableContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader size={24} className="animate-spin mr-2 text-leadgen-primary" />
        <span className="text-leadgen-primary font-medium">
          Fetching leads...
        </span>
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
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
    );
  }

  return (
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
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    lead.source?.toLowerCase().includes("linkedin")
                      ? "bg-[#0077B5]"
                      : lead.source?.toLowerCase().includes("google")
                      ? "bg-[#34A853]"
                      : lead.source?.toLowerCase().includes("apollo")
                      ? "bg-[#6366F1]"
                      : lead.source?.toLowerCase().includes("reddit")
                      ? "bg-[#FF4500]"
                      : lead.source?.toLowerCase().includes("twitter")
                      ? "bg-[#1DA1F2]"
                      : "bg-gray-400"
                  }`}
                ></div>
                {lead.source}
              </div>
            </TableCell>
            <TableCell>{lead.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableContent;
