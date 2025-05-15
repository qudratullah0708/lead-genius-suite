
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Bell, 
  Mail,
  Download,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/context/NotificationsContext";

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

const getNotificationIcon = (notification: Notification) => {
  if (notification.type === "email") {
    if (notification.title.includes("Failed")) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Mail className="h-5 w-5 text-green-500" />;
  } else {
    return <Download className="h-5 w-5 text-blue-500" />;
  }
};

const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Mark all as read when the dropdown opens
      markAllAsRead();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-foreground/70" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 p-0 bg-red-500 text-white text-xs" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="font-medium text-sm p-3 border-b">
          Notifications
        </div>
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 border-b hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 pt-0.5">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
