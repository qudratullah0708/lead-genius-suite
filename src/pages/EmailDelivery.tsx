
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useRequireAuth from "@/hooks/useRequireAuth";

interface EmailItem {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: "delivered" | "failed";
  query: string;
  lead_count: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const EmailDeliveryPage = () => {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useRequireAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('email_history')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setEmails(data || []);
      } catch (error) {
        console.error("Error fetching emails:", error);
        toast.error("Failed to load email history");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchEmails();
    }
  }, [user]);

  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="text-left py-8">
        <h1 className="text-3xl font-bold tracking-tight">Email Delivery</h1>
        <p className="text-muted-foreground mt-2">
          Track all emails sent from your account
        </p>
      </div>

      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-muted/30 flex items-center">
          <Mail size={18} className="mr-2 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Email History</h2>
        </div>

        <div className="p-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : emails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg">No emails sent yet</p>
              <p className="text-sm mt-1">Your sent emails will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{item.subject}</div>
                    <div className="text-sm text-muted-foreground">
                      To: {item.recipient} · Query: {item.query} · {item.lead_count} leads · {formatDate(item.timestamp)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${item.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status === 'delivered' ? 'Delivered' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDeliveryPage;
