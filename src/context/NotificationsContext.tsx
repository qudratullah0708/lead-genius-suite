
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  type: "email" | "export";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      // Fetch the latest email notifications
      const { data: emailData, error: emailError } = await supabase
        .from('email_history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
        
      if (emailError) throw emailError;
      
      // Convert the email data to notifications
      const emailNotifications: Notification[] = (emailData || []).map(email => ({
        id: email.id,
        type: "email",
        title: email.status === 'delivered' ? 'Email Delivered' : 'Email Failed',
        message: `${email.subject} to ${email.recipient}`,
        timestamp: email.timestamp,
        read: false // We'll consider all as unread initially since we don't store read status yet
      }));
      
      setNotifications(emailNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
