import React, { useState } from "react";
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

interface EmailReportButtonProps {
  leads: any[];
  searchQuery: string;
  disabled: boolean;
}

const EmailReportButton = ({
  leads,
  searchQuery,
  disabled,
}: EmailReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachCsv, setAttachCsv] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { getCsvContent } = useLeadExport();

  // Set default values when search query changes
  React.useEffect(() => {
    if (searchQuery) {
      setSubject(`Lead Report: ${searchQuery}`);
      setMessage(
        `Here is your lead report for "${searchQuery}".\n\nTotal leads found: ${leads.length}\n\nBest regards,\nLeadGen Agent`
      );
    }
  }, [searchQuery, leads.length]);

  const handleSendEmail = async () => {
    if (!recipient) {
      toast.error("Please enter a recipient email");
      return;
    }

    setIsSending(true);
    try {
      // Get CSV content if attachment is enabled
      const csvContent = attachCsv ? getCsvContent(leads) : '';

      // Prepare email data
      const emailData = {
        recipient_email: recipient,
        subject: subject || `Lead Report: ${searchQuery}`,
        message: message,
        user_email: user?.email,
        query: searchQuery,
        csvContent: csvContent
      };

      console.log("Sending email via FastAPI endpoint");

      // Send email using the local FastAPI endpoint
      const response = await fetch("http://127.0.0.1:8000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send email");
      }

      const data = await response.json();
      console.log("Email sent response:", data);
      toast.success("Email sent successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
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
                placeholder="recipient@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Lead Report: ${searchQuery}`}
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
                onCheckedChange={(checked) => setAttachCsv(checked as boolean)}
              />
              <Label htmlFor="attachCsv" className="cursor-pointer">
                Attach leads as CSV file
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
