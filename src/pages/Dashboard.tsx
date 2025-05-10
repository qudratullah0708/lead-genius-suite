
import SearchBar from "@/components/dashboard/SearchBar";
import ScraperModules from "@/components/dashboard/ScraperModules";
import ResultsTable from "@/components/dashboard/ResultsTable";
import SearchHistory from "@/components/dashboard/SearchHistory";

const Dashboard = () => {
  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold tracking-tight">LeadGen Agent Suite</h1>
        <p className="text-muted-foreground mt-2">
          Search for leads across multiple platforms or use individual scraper modules
        </p>
      </div>
      
      <SearchBar />
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Latest Results</h2>
        <ResultsTable />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-3">Lead Scrapers</h2>
          <ScraperModules />
        </div>
        <div className="md:col-span-1">
          <SearchHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
