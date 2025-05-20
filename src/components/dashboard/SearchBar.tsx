import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const GOOGLE_MAPS_API_URL = "https://google-maps-api-hazel.vercel.app/search-places/";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
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
    if (!query.trim() || !location.trim()) {
      toast.error("Please enter both a search query and location");
      return;
    }
    setIsSearching(true);
    const searchStartEvent = new CustomEvent('leadSearchStarted', {
      detail: { query: `${query} in ${location}` }
    });
    window.dispatchEvent(searchStartEvent);
    toast.info(`Searching for: ${query} in ${location}`);
    try {
      const response = await fetch(GOOGLE_MAPS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location })
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
      // Map Google Maps API response to ResultsTable format
      const results = (data.places || []).map((place, idx) => ({
        id: idx + 1,
        name: place.title,
        address: place.address,
        phone: place.phoneNumber,
        website: place.website,
        rating: place.rating,
        ratingCount: place.ratingCount,
        category: place.category
      }));
      // Dispatch the search event with the mapped results
      const searchEvent = new CustomEvent('leadSearchCompleted', {
        detail: {
          query: `${query} in ${location}`,
          timestamp: new Date().toISOString(),
          results: results
        }
      });
      window.dispatchEvent(searchEvent);
      toast.success(`Found ${results.length} places for: "${query} in ${location}"`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      const searchEvent = new CustomEvent('leadSearchCompleted', {
        detail: {
          query: `${query} in ${location}`,
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
      <Card className="mb-4 shadow-md">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
          <form id="search-form" onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 w-full items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <Input
                id="search-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'Fast Food'"
                className="w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                autoFocus
                disabled={isSearching}
              />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="search-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                id="search-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 'Islamabad, Pakistan'"
                className="w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                disabled={isSearching}
              />
            </div>
            <Button 
              type="submit" 
              className="rounded-md bg-leadgen-primary hover:bg-leadgen-primary/90 flex items-center gap-2 px-6 h-12 mt-4 md:mt-0"
              disabled={isSearching}
            >
              <Search size={18} />
              <span>{isSearching ? 'Searching...' : 'Find Leads'}</span>
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center mt-2 text-muted-foreground text-sm">
        Searches Google Maps for real-time business listings. Results include name, address, phone, website, rating, and category.
      </div>
    </div>
  );
};

export default SearchBar;
