
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MapPin, Search, Download, RefreshCw, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { toast } from "sonner";
import EmailReportButton from "@/components/dashboard/table/EmailReportButton";
import { useLeadExport } from "@/hooks/useLeadExport";

interface Place {
  title: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: string;
  category?: string;
  location: string;
  source: string;
  name: string;  // For compatibility with EmailReportButton
  company?: string; // For compatibility with EmailReportButton
  email?: string; // For compatibility with EmailReportButton
}

const GoogleMapsScraperPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [timeframe, setTimeframe] = useState("qdr:y");
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { exportToCsv } = useLeadExport();
  const { user } = useAuth();

  const timeframeOptions = [
    { value: "qdr:h", label: "Past hour" },
    { value: "qdr:d", label: "Past day" },
    { value: "qdr:w", label: "Past week" },
    { value: "qdr:m", label: "Past month" },
    { value: "qdr:y", label: "Past year" },
  ];

  const handleSearch = async () => {
    if (!query.trim() || !location.trim()) {
      toast.error("Please enter both a search query and location");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // The API URL might be different in production vs development
      const apiUrl = import.meta.env.VITE_API_URL || 'https://email-service-bice.vercel.app';
      
      const response = await fetch(`${apiUrl}/search-places/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          location: location,
          tbs: timeframe
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.places && Array.isArray(data.places)) {
        const formattedPlaces = data.places.map((place: any) => ({
          name: place.title || 'Unknown',
          title: place.title || 'Unknown',
          address: place.address || 'Unknown',
          phone: place.phone || '',
          website: place.website || '',
          rating: place.rating ? `${place.rating}/5` : 'No ratings',
          category: place.categories?.join(', ') || 'Uncategorized',
          location: location,
          source: 'Google Maps',
          company: place.title || 'Unknown',
          email: '' // Google Maps doesn't usually provide emails
        }));
        
        setPlaces(formattedPlaces);
        addNotification({
          title: "Search Completed",
          message: `Found ${formattedPlaces.length} places for "${query}" in ${location}`,
          type: 'success',
        });
      } else {
        setPlaces([]);
        addNotification({
          title: "No Results",
          message: "No places found for your search query",
          type: 'warning',
        });
      }
    } catch (err: any) {
      console.error("Error fetching places:", err);
      setError(err.message || "Failed to fetch places");
      addNotification({
        title: "Search Failed",
        message: err.message || "Failed to fetch places",
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    exportToCsv(places, `${query}-${location}`);
  };

  return (
    <div className="container py-6 max-w-7xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Google Maps Scraper</h1>
        <p className="text-muted-foreground mt-1">
          Find and extract business data from Google Maps
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="results">Results ({places.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="animate-slide-in">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 bg-card rounded-lg border shadow-sm p-6">
              <div>
                <label htmlFor="search-query" className="block text-sm font-medium mb-1">
                  Search Query
                </label>
                <Input
                  id="search-query"
                  placeholder="e.g. restaurants, hotels, plumbers"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="e.g. New York, Berlin, Tokyo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium mb-1">
                  Time Frame
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full flex items-center"
                  disabled={isLoading}
                  onClick={handleSearch}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Places
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Google Maps Scraper Info
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    This scraper extracts business information from Google Maps
                    including names, addresses, phone numbers, websites, and ratings.
                  </p>
                  <p>
                    Results are delivered in real-time and can be exported to CSV
                    or sent via email.
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data source:</span>
                    <span className="font-medium">Google Maps</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Results limit:</span>
                    <span className="font-medium">20 per search</span>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="animate-slide-in">
          {places.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">
                    {places.length} Results for "{query}" in {location}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Showing all extracted business listings
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={handleExport}
                  >
                    <Download size={14} className="mr-1" />
                    Export CSV
                  </Button>
                  <EmailReportButton
                    leads={places}
                    searchQuery={`${query} in ${location}`}
                    disabled={places.length === 0}
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {places.map((place, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{place.title}</TableCell>
                            <TableCell>{place.address}</TableCell>
                            <TableCell>{place.phone || 'N/A'}</TableCell>
                            <TableCell>
                              {place.website ? (
                                <a
                                  href={place.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Visit
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell>{place.rating || 'N/A'}</TableCell>
                            <TableCell>{place.category || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No results yet</h3>
              <p className="text-muted-foreground mt-2">
                Search for places on Google Maps to see results here
              </p>
              <Button className="mt-4" onClick={() => document.querySelector('[value="search"]')?.click()}>
                Start a search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleMapsScraperPage;
