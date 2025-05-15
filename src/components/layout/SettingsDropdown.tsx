
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  LogOut, 
  User
} from "lucide-react";

const SettingsDropdown = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Check if user has avatar from Supabase auth metadata
  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.display_name || user?.email;
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (user?.user_metadata?.display_name) {
      return user.user_metadata.display_name.substring(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-foreground/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start p-2">
          <Avatar className="h-9 w-9 mr-2">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName || "User"} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-[150px]">
              {displayName}
            </span>
            {user?.email && (
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {user.email}
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigate("/settings")}>
          <User className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
