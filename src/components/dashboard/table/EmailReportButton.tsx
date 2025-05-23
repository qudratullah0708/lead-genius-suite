import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLeadExport } from "@/hooks/useLeadExport";
import { useNotifications } from "@/context/NotificationsContext";

interface EmailReportButtonProps {
  leads: Record<string, unknown>[];
  searchQuery: string;
  disabled: boolean;
}

const EmailReportButton = ({ leads, searchQuery, disabled }: EmailReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachCsv, setAttachCsv] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { user } = useAuth();
  const { getCsvContent } = useLeadExport();
  const { addNotification } = useNotifications();

  // Set recipient to logged-in user's email
  const recipient = user?.email || "";

  // Automatically update subject and message based on search query or leads
  useEffect(() => {
    setSubject(`Lead Report: ${searchQuery}`);
    setMessage(
      `Here is your lead report for "${searchQuery}".\n\n` +
      `Total leads found: ${leads.length}\n\nBest regards,\nLeadGen Agent`
    );
  }, [searchQuery, leads.length]);

  const handleSendEmail = async () => {
    if (!recipient) {
      toast.error("No recipient email found for your account.");
      return;
    }

    setIsSending(true);

    try {
      const csvContent = attachCsv ? getCsvContent(leads) : "";
      
      console.log(`Preparing to send email report to ${recipient} with ${leads.length} leads`);
      
      // Get the email service URL from the environment variables
      const emailServiceUrl = import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://email-service-bice.vercel.app';
      
      const emailData = {
        recipient_email: recipient,
        to: recipient,
        subject: subject || `Lead Report: ${searchQuery}`,
        message,
        user_email: user?.email || "",
        query: searchQuery,
        leads, 
        attachCsv, 
        csvContent,
        csvData: csvContent
      };

      console.log("Sending email with service URL:", emailServiceUrl);

      // Call the FastAPI endpoint
      const response = await fetch(`${emailServiceUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Email API Error Response:", errorData);
        throw new Error(errorData.detail || "Failed to send email");
      }

      const data = await response.json();
      console.log("Email function response:", data);

      toast.success("Email sent successfully!");
      addNotification({
        title: "Email Sent Successfully",
        message: `Report sent to ${recipient}`,
        type: 'success',
      });

      setIsOpen(false);
    } catch (error: unknown) {
      console.error("Error sending email:", error);
      const errorMessage = (error instanceof Error && error.message) ? error.message : "Failed to send email. Please try again.";
      
      toast.error(errorMessage);
      addNotification({
        title: "Email Send Failed",
        message: `Failed to send report to ${recipient}: ${errorMessage}`,
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} disabled={disabled}>
        <Mail size={14} className="mr-1" />
        Email Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Lead Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                value={recipient}
                disabled
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder={`Lead Report: ${searchQuery}`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachCsv"
                checked={attachCsv}
                onCheckedChange={(checked) => setAttachCsv(!!checked)}
              />
              <Label htmlFor="attachCsv" className="cursor-pointer">
                Attach leads as CSV file
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailReportButton;
