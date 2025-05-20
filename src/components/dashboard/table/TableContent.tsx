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
  filteredLeads: Record<string, unknown>[];
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

  // Sort by rating descending (treat missing as 0)
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const ratingA = typeof a.rating === 'number' ? a.rating : 0;
    const ratingB = typeof b.rating === 'number' ? b.rating : 0;
    return ratingB - ratingA;
  });

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-leadgen-primary text-right">
        Showing {sortedLeads.length} lead{sortedLeads.length !== 1 ? 's' : ''}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow key={lead.id as React.Key}>
              <TableCell className="font-medium">{String(lead.name)}</TableCell>
              <TableCell>{String(lead.address)}</TableCell>
              <TableCell>{lead.phone ? String(lead.phone) : 'N/A'}</TableCell>
              <TableCell>{lead.website ? <a href={String(lead.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit</a> : 'N/A'}</TableCell>
              <TableCell>{lead.rating ? `${lead.rating}${lead.ratingCount ? ` (${lead.ratingCount})` : ''}` : 'N/A'}</TableCell>
              <TableCell>{lead.category ? String(lead.category) : 'Uncategorized'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableContent;
