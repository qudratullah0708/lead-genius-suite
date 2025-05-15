
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Download, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ExportItem {
  id: string;
  query: string;
  timestamp: string;
  file_name: string;
  download_url?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// For demo purposes only - in a real app, this would come from the database
const mockExports = [
  {
    id: "1",
    query: "marketing agencies in new york",
    timestamp: new Date().toISOString(),
    file_name: "marketing_agencies_ny.csv"
  },
  {
    id: "2",
    query: "software developers in san francisco",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    file_name: "sf_developers.csv"
  },
  {
    id: "3",
    query: "healthcare providers in chicago",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    file_name: "chicago_healthcare.csv"
  }
];

const ExportsPage = () => {
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // This is a placeholder for actual database fetching
    // In a real application, you would fetch from Supabase here
    const fetchExports = async () => {
      try {
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExports(mockExports);
      } catch (error) {
        console.error("Error fetching exports:", error);
        toast.error("Failed to load exports");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchExports();
    }
  }, [user]);

  const handleDownload = (fileItem: ExportItem) => {
    // In a real app, this would download the file from a storage bucket
    toast.success(`Downloading ${fileItem.file_name}`);
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="text-left py-8">
        <h1 className="text-3xl font-bold tracking-tight">Exports</h1>
        <p className="text-muted-foreground mt-2">
          Access all your exported data files
        </p>
      </div>

      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-muted/30 flex items-center">
          <FileText size={18} className="mr-2 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Exports</h2>
        </div>

        <div className="p-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : exports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg">No exports yet</p>
              <p className="text-sm mt-1">Your exported files will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {exports.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">{item.query}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.timestamp)} · {item.file_name}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => handleDownload(item)}
                  >
                    <Download size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportsPage;
