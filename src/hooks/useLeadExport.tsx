
import { toast } from "sonner";

// Define the Lead interface for strict typing
export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  location: string;
}

export function useLeadExport() {
  // Convert leads to CSV content as string - accept more generic types
  const getCsvContent = (leads: Record<string, any>[]): string => {
    if (leads.length === 0) return "";
    
    const headers = ["Name", "Title", "Company", "Email", "Phone", "Source", "Location"];
    const csvContent = [
      headers.join(","),
      ...leads.map((lead) =>
        [
          `"${lead.name || ''}"`,
          `"${lead.title || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.source || ''}"`,
          `"${lead.location || ''}"`
        ].join(",")
      )
    ].join("\n");
    
    return csvContent;
  };

  const exportToCsv = (leads: Record<string, any>[], searchQuery: string) => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    try {
      // Get the CSV content
      const csvContent = getCsvContent(leads);
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${searchQuery.replace(/\s+/g, "_")}_${Date.now()}.csv`);
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

  return { exportToCsv, getCsvContent };
}
