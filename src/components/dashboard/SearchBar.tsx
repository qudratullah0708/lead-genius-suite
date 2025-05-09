
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // In a real implementation, this would trigger the search process
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
          />
          <Button type="submit" className="rounded-md bg-leadgen-primary hover:bg-leadgen-primary/90">
            <span className="mr-2">Find Leads</span>
            <ArrowRight size={16} />
          </Button>
        </form>
      </div>
      <div className="text-center mt-2 text-muted-foreground text-sm">
        Searches across LinkedIn, Google Maps, and more. Results are deduplicated automatically.
      </div>
    </div>
  );
};

export default SearchBar;
