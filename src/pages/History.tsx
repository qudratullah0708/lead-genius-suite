import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, History, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  result_count: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const HistoryPage = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSearchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error("Error fetching search history:", error);
        toast.error("Failed to load search history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchHistory();
  }, [user]);

  const handleSearchClick = (query: string) => {
    // Create a custom event to trigger the search with this query
    const searchEvent = new CustomEvent('rerunSearch', {
      detail: { query }
    });
    window.dispatchEvent(searchEvent);
    navigate('/dashboard');
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="text-left py-8">
        <h1 className="text-3xl font-bold tracking-tight">Search History</h1>
        <p className="text-muted-foreground mt-2">
          View all your previous searches
        </p>
      </div>

      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-muted/30 flex items-center">
          <History size={18} className="mr-2 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Searches</h2>
        </div>

        <div className="p-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg">No search history yet</p>
              <p className="text-sm mt-1">Your searches will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">{item.query}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.timestamp)} · {item.result_count} results
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => handleSearchClick(item.query)}
                  >
                    <ArrowRight size={16} />
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

export default HistoryPage;
