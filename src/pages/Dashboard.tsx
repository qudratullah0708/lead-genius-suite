
import SearchBar from "@/components/dashboard/SearchBar";
import ScraperModules from "@/components/dashboard/ScraperModules";
import ResultsTable from "@/components/dashboard/ResultsTable";
import SearchHistory from "@/components/dashboard/SearchHistory";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="text-left py-8">
          <h1 className="text-3xl font-bold tracking-tight">LeadGen Agent Suite</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={signOut} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
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
