import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, Notification } from "@/context/NotificationsContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead, removeNotification } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useAuth();

  const handleNotificationsOpen = (open: boolean) => {
    setNotificationsOpen(open);
    if (open) {
      // Mark all as read when notifications are opened
      setTimeout(() => markAllAsRead(), 3000);
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Format as date
    return format(date, 'MMM d, h:mm a');
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch(type) {
      case 'success': return 'bg-green-100 border-green-500 text-green-800';
      case 'error': return 'bg-red-100 border-red-500 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info': 
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  // Helper to get initials
  const getInitials = () => {
    const displayName = user?.user_metadata?.full_name;
    if (displayName) {
      return displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="border-b border-border bg-card py-3 px-4 w-full flex items-center justify-between fixed top-0 left-0 right-0 z-40">
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

      <div className="flex items-center space-x-3 ml-auto">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-foreground/70 hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <Popover open={notificationsOpen} onOpenChange={handleNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost"
              size="icon" 
              className="text-foreground/70 hover:text-foreground relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 max-h-[500px] overflow-y-auto" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Notifications</h4>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                  Mark all as read
                </Button>
              )}
            </div>
            
            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="py-6 px-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 relative ${!notification.read ? 'bg-muted/30' : ''}`}
                  >
                    <div className={`border-l-2 pl-3 ${getNotificationColor(notification.type)}`}>
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-sm">{notification.title}</h5>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatNotificationTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              className="text-foreground/70 hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Avatar className="w-8 h-8 ml-2">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
          <AvatarFallback className="font-medium text-sm">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
