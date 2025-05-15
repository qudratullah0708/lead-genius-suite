
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotificationsDropdown from "./NotificationsDropdown";
import SettingsDropdown from "./SettingsDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.user_metadata?.display_name) {
      return user.user_metadata.display_name.substring(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

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
        
        <NotificationsDropdown />
        
        <SettingsDropdown />
        
        <Avatar className="h-8 w-8 ml-2">
          {user?.user_metadata?.avatar_url ? (
            <AvatarImage 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata.display_name || user.email || "User"} 
            />
          ) : (
            <AvatarFallback className="bg-leadgen-primary text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
