
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultsTable from "@/components/dashboard/ResultsTable";

const ScraperPage = () => {
  const { scraperId } = useParams();

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
              <div>
                <Label htmlFor="search-query">Search Query</Label>
                <Input id="search-query" placeholder={`e.g. "Realtors in Berlin"`} />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Berlin, Germany" />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry/Keywords</Label>
                <Input id="industry" placeholder="e.g. real estate, property" />
              </div>
              
              <div>
                <Label htmlFor="filters">Advanced Filters</Label>
                <Textarea id="filters" placeholder="Add any specific filters or criteria" />
              </div>
              
              <div className="pt-2">
                <Button className="w-full">Start Scraping</Button>
              </div>
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
