
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card py-3 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center">
          <div className="bg-leadgen-primary rounded-md p-1 mr-2">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2L20 7V17L12 22L4 17V7L12 2Z" 
                fill="white" 
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="font-bold text-lg">LeadGen Suite</span>
        </Link>
      </div>

      <div className={`flex-1 flex justify-center transition-all duration-300 ${isSearchOpen ? 'max-w-xl' : 'max-w-0 overflow-hidden'}`}>
        {isSearchOpen && (
          <div className="w-full px-4 max-w-xl animate-fade-in">
            <Input 
              type="text"
              placeholder="Search for leads across all platforms..."
              className="w-full"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-foreground/70 hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost"
          size="icon" 
          className="text-foreground/70 hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="text-foreground/70 hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-leadgen-primary text-white flex items-center justify-center ml-2">
          <span className="font-medium text-sm">JD</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
