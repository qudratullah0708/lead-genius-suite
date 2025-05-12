
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// const API_URL = "http://localhost:8000/api/search";  // Update this with your actual API URL
const API_URL = "https://vercel-test-phi-three.vercel.app/api/search";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Listen for rerunSearch events from SearchHistory
    const handleRerunSearch = (event: CustomEvent) => {
      const { query } = event.detail;
      setQuery(query);
      
      // Automatically submit the search
      const searchForm = document.getElementById('search-form') as HTMLFormElement;
      if (searchForm) {
        searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    };

    window.addEventListener('rerunSearch', handleRerunSearch as EventListener);
    
    return () => {
      window.removeEventListener('rerunSearch', handleRerunSearch as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    // Start loading immediately
    setIsSearching(true);
    
    // Dispatch a preliminary search event to trigger the loader in ResultsTable
    const searchStartEvent = new CustomEvent('leadSearchStarted', {
      detail: { query }
    });
    window.dispatchEvent(searchStartEvent);
    
    toast.info(`Searching for: ${query}`);
    
    try {
      console.log("Searching for:", query);
      
      // Make API call to the FastAPI backend
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || 'Failed to fetch search results';
        } catch (e) {
          errorMessage = errorText || 'Failed to fetch search results';
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const results = data.results || [];
      
      // Store the search in search history
      if (user) {
        try {
          await supabase.from('search_history').insert({
            user_id: user.id,
            query: query,
            result_count: results.length
          });
        } catch (error) {
          console.error("Failed to save search history:", error);
        }
      }

      // Store each search result in the leads table
      if (user && results.length > 0) {
        try {
          const leadsToInsert = results.map((lead: any) => ({
            user_id: user.id,
            query: query,
            name: lead.name || null,
            title: lead.title || null,
            company: lead.company || null,
            email: lead.email || null,
            phone: lead.phone || null,
            source: lead.source || null,
            location: lead.location || null
          }));
          
          await supabase.from('leads').insert(leadsToInsert);
        } catch (error) {
          console.error("Failed to save leads:", error);
        }
      }
      
      // Dispatch the search event with the actual API results
      const searchEvent = new CustomEvent('leadSearchCompleted', { 
        detail: { 
          query,
          timestamp: new Date().toISOString(),
          results: results
        } 
      });
      window.dispatchEvent(searchEvent);
      
      toast.success(`Found ${results.length} leads for: "${query}"`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Dispatch empty results to stop the loader
      const searchEvent = new CustomEvent('leadSearchCompleted', { 
        detail: { 
          query,
          timestamp: new Date().toISOString(),
          results: []
        } 
      });
      window.dispatchEvent(searchEvent);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto transition-all search-transition">
      <div className="bg-white rounded-lg shadow-lg p-1 border flex items-center">
        <div className="px-3 text-muted-foreground">
          <Search size={20} />
        </div>
        <form id="search-form" onSubmit={handleSubmit} className="flex-1 flex items-center">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for leads (e.g. 'realtors in Berlin')"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
            disabled={isSearching}
          />
          <Button 
            type="submit" 
            className="rounded-md bg-leadgen-primary hover:bg-leadgen-primary/90"
            disabled={isSearching}
          >
            <span className="mr-2">{isSearching ? 'Searching...' : 'Find Leads'}</span>
            <ArrowRight size={16} />
          </Button>
        </form>
      </div>
      <div className="text-center mt-2 text-muted-foreground text-sm">
        Searches across LinkedIn, Google Maps, and more using Tavily and Groq AI. Results are deduplicated automatically.
      </div>
    </div>
  );
};

export default SearchBar;
