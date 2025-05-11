
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// const API_URL = "http://localhost:8000/api/search";  // Update this with your actual API URL
   const API_URL = "https://vercel-test-phi-three.vercel.app/";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
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
      
      // Dispatch the search event with the actual API results
      const searchEvent = new CustomEvent('leadSearchCompleted', { 
        detail: { 
          query,
          timestamp: new Date().toISOString(),
          results: data.results
        } 
      });
      window.dispatchEvent(searchEvent);
      
      toast.success(`Found ${data.results.length} leads for: "${query}"`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
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
