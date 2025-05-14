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

interface EmailReportButtonProps {
  leads: Record<string, any>[];
  searchQuery: string;
  disabled: boolean;
}

const EmailReportButton = ({ leads, searchQuery, disabled }: EmailReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachCsv, setAttachCsv] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { user } = useAuth();
  const { getCsvContent } = useLeadExport();

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
      toast.error("Please enter a recipient email.");
      return;
    }

    setIsSending(true);

    try {
      const emailData = {
        recipient_email: recipient,
        subject: subject || `Lead Report: ${searchQuery}`,
        message,
        user_email: user?.email || "",
        query: searchQuery,
        leads, 
        attachCsv, 
        csvContent: attachCsv ? getCsvContent(leads) : "",
      };

      const response = await fetch("https://email-service-bice.vercel.app/send-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to send email");
      }

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
                placeholder="recipient@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
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
