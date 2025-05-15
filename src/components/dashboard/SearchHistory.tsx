
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, History, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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

const SearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchSearchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(3);

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error("Error fetching search history:", error);
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
  };

  return (
    <div className="leadgen-card">
      <div className="leadgen-card-header">
        <div className="flex items-center">
          <History size={18} className="mr-2 text-muted-foreground" />
          <h3 className="leadgen-card-title">Recent Searches</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/history" className="flex items-center">
            <span>View All</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-2">
              <div className="w-full">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : history.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No search history yet</p>
            <p className="text-xs mt-1">Your recent searches will appear here</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer">
              <div onClick={() => handleSearchClick(item.query)}>
                <div className="font-medium">{item.query}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(item.timestamp)} · {item.result_count} results
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => handleSearchClick(item.query)}
              >
                <ArrowRight size={14} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
