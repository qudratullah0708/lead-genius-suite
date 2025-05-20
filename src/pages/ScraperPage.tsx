import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultsTable from "@/components/dashboard/ResultsTable";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const ScraperPage = () => {
  const { scraperId } = useParams();
  const { user } = useAuth();

  // Add state for form fields
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Convert the scraperID to a properly formatted name
  const getScraperName = (id: string | undefined) => {
    if (!id) return "Scraper";
    
    const names: Record<string, string> = {
      "linkedin": "LinkedIn",
      "google-maps": "Google Maps",
      "apolloio": "Apollo.io",
      "facebook": "Facebook Groups"
    };
    
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1) + " Scraper";
  };
  
  const scraperName = getScraperName(scraperId);
  
  // Helper to build the query string for LinkedIn
  const buildLinkedInQuery = () => {
    let q = query;
    if (location) q += ` in ${location}`;
    return q;
  };

  // Handler for Start Scraping
  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      window.dispatchEvent(new CustomEvent('leadSearchCompleted', { detail: { query, timestamp: new Date().toISOString(), results: [] } }));
      return;
    }
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('leadSearchStarted', { detail: { query } }));
    try {
      let results = [];
      if (scraperId === "linkedin") {
        const response = await fetch("https://linked-in-service.vercel.app/extract-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: buildLinkedInQuery() })
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to fetch leads";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.detail || errorMessage;
          } catch {
            // ignore JSON parse error
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        // Map backend fields to frontend fields
        results = (data.leads || []).map((lead: unknown, idx: number) => {
          const l = lead as {
            name: string | null;
            title: string | null;
            organization: string | null;
            email: string | null;
            phone: string | null;
            url: string | null;
            location: string | null;
          };
          return {
            id: idx + 1,
            name: l.name,
            title: l.title,
            company: l.organization,
            email: l.email,
            phone: l.phone,
            source: l.url,
            location: l.location
          };
        });
      } else {
        results = [];
      }
      window.dispatchEvent(new CustomEvent('leadSearchCompleted', { detail: { query: buildLinkedInQuery(), timestamp: new Date().toISOString(), results } }));
    } catch (error: unknown) {
      window.dispatchEvent(new CustomEvent('leadSearchCompleted', { detail: { query: buildLinkedInQuery(), timestamp: new Date().toISOString(), results: [] } }));
      alert(error instanceof Error ? error.message : JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 max-w-7xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{scraperName}</h1>
        <p className="text-muted-foreground mt-1">Extract leads from {scraperName}. Configure your search parameters below.</p>
      </div>
      
      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="animate-slide-in">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 bg-card rounded-lg border shadow-sm p-6">
              <form onSubmit={handleStartScraping} className="space-y-4">
                <div>
                  <Label htmlFor="search-query">Search Query</Label>
                  <Input id="search-query" value={query} onChange={e => setQuery(e.target.value)} placeholder={'e.g. "Realtors"'} disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Berlin, Germany" disabled={isLoading} />
                </div>
                <div className="pt-2">
                  <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? "Scraping..." : "Start Scraping"}</Button>
                </div>
              </form>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-medium mb-2">Scraper Information</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>This scraper extracts data from {scraperName} including contact information, company details, and professional backgrounds.</p>
                  <p>Results will be deduplicated against your existing database.</p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rate limit:</span>
                    <span className="font-medium">100 searches/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Results limit:</span>
                    <span className="font-medium">500 per search</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last updated:</span>
                    <span className="font-medium">May 1, 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-medium mb-2">Tips</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use specific keywords to narrow down your search</li>
                  <li>• Include location for better targeting</li>
                  <li>• Try different variations of your query</li>
                  <li>• Results are automatically saved to your history</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="animate-slide-in">
          <ResultsTable />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Results are automatically saved to your account and can be exported at any time.
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-slide-in">
          <div className="space-y-6 max-w-2xl">
            <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-medium mb-2">Scraper Settings</h3>
              
              <div>
                <Label htmlFor="delay">Request Delay (ms)</Label>
                <Input id="delay" type="number" defaultValue={1000} />
              </div>
              
              <div>
                <Label htmlFor="proxy">Proxy Configuration (optional)</Label>
                <Input id="proxy" placeholder="http://username:password@proxy.example.com:port" />
              </div>
              
              <div>
                <Label htmlFor="userAgent">Custom User Agent (optional)</Label>
                <Input id="userAgent" placeholder="Mozilla/5.0..." />
              </div>
              
              <div className="pt-2">
                <Button>Save Settings</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScraperPage;
