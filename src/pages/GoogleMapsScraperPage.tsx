import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MapPin, Search, Download, RefreshCw, Mail, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { toast } from "sonner";
import EmailReportButton from "@/components/dashboard/table/EmailReportButton";
import { useLeadExport } from "@/hooks/useLeadExport";
import { Label } from "@/components/ui/label";

interface PlaceResult {
  id: number;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  ratingCount?: number;
  category?: string;
}

const GoogleMapsScraperPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { exportToCsv } = useLeadExport();
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await fetch("https://google-maps-api-hazel.vercel.app/search-places/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location })
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch places";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // Use a local type for the raw API response
      type GoogleApiPlace = {
        title: string;
        address: string;
        phoneNumber?: string;
        website?: string;
        rating?: number;
        ratingCount?: number;
        category?: string;
      };
      const places = (data.places || []).map((place: GoogleApiPlace, idx: number) => ({
        id: idx + 1,
        name: place.title,
        address: place.address,
        phone: place.phoneNumber,
        website: place.website,
        rating: place.rating,
        ratingCount: place.ratingCount,
        category: place.category
      }));
      setResults(places);
      addNotification({
        title: "Search Completed",
        message: `Found ${places.length} places for "${query}" in ${location}`,
        type: 'success',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Error fetching places:", errorMsg);
      setError(errorMsg || "Unknown error");
      addNotification({
        title: "Search Failed",
        message: errorMsg || "Failed to fetch places",
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    exportToCsv(results, `${query}-${location}`);
  };

  return (
    <div className="container py-6 max-w-7xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Google Maps Scraper</h1>
        <p className="text-muted-foreground mt-1">Find local businesses and contact info. Configure your search below.</p>
      </div>
      {/* Responsive grid: form left, features right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4 bg-card rounded-lg border shadow-sm p-6">
          <div>
            <Label htmlFor="search-query">Search Query</Label>
            <Input id="search-query" value={query} onChange={e => setQuery(e.target.value)} placeholder={'e.g. "Fast Food"'} disabled={isLoading} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Islamabad, Pakistan" disabled={isLoading} />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? "Searching..." : "Search"}</Button>
        </form>
        {/* Features Card */}
        <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Google Maps Scraper Features
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Extract real-time business listings from Google Maps</li>
              <li>Get business name, address, phone, website, rating, and category</li>
              <li>Export results to CSV for offline use</li>
              <li>Email reports directly from the dashboard</li>
              <li>Fast, reliable, and easy to use</li>
              <li>Works for any city or business type</li>
              <li>Results are not limited to your current location</li>
            </ul>
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="bg-card border rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-lg">Results</h3>
          <div className="ml-2 flex gap-2">
            {/* Export Button beside Email Report */}
            <Button variant="outline" size="sm" onClick={() => exportToCsv(results, `${query}-${location}`)} disabled={results.length === 0}>
              Export CSV
            </Button>
            <EmailReportButton leads={results as unknown as Record<string, unknown>[]} searchQuery={query} disabled={results.length === 0} />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader size={24} className="animate-spin mr-2 text-leadgen-primary" />
              <span className="text-leadgen-primary font-medium">Fetching places...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No results yet. Try a search above.</div>
          ) : (
            <div>
              <div className="mb-2 text-sm font-semibold text-leadgen-primary text-right">
                Showing {results.length} lead{results.length !== 1 ? 's' : ''}
              </div>
              {/* Sort results by rating descending */}
              {(() => {
                const sortedResults = [...results].sort((a, b) => {
                  const ratingA = typeof a.rating === 'number' ? a.rating : 0;
                  const ratingB = typeof b.rating === 'number' ? b.rating : 0;
                  return ratingB - ratingA;
                });
                return (
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
                      {sortedResults.map((place) => (
                        <TableRow key={place.id}>
                          <TableCell className="font-medium">{place.name}</TableCell>
                          <TableCell>{place.address}</TableCell>
                          <TableCell>{place.phone || 'N/A'}</TableCell>
                          <TableCell>{place.website ? <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit</a> : 'N/A'}</TableCell>
                          <TableCell>{place.rating ? `${place.rating}${place.ratingCount ? ` (${place.ratingCount})` : ''}` : 'N/A'}</TableCell>
                          <TableCell>{place.category || 'Uncategorized'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsScraperPage;
