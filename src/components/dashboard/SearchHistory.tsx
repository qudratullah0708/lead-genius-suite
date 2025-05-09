
import { Button } from "@/components/ui/button";
import { ArrowRight, History } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockSearchHistory = [
  {
    id: "1",
    query: "Realtors in Berlin",
    date: "2025-05-09T10:30:00Z",
    results: 147,
  },
  {
    id: "2",
    query: "Software engineers in San Francisco",
    date: "2025-05-08T15:45:00Z",
    results: 258,
  },
  {
    id: "3",
    query: "Marketing managers in London",
    date: "2025-05-07T09:15:00Z",
    results: 126,
  }
];

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
        {mockSearchHistory.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
            <div>
              <div className="font-medium">{item.query}</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(item.date)} · {item.results} results
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
