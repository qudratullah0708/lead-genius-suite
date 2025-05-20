import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const EmailDeliveryPage = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Set recipient to logged-in user's email
  const recipient = user?.email || "";

  const handleSendEmail = async () => {
    if (!recipient) {
      toast.error("No recipient email found for your account.");
      return;
    }

    setIsSending(true);

    try {
      // Get the email service URL from the environment variables
      const emailServiceUrl = import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://email-service-bice.vercel.app';
      
      const emailData = {
        recipient_email: recipient,
        subject: subject || "Message from LeadGen Suite",
        message,
        user_email: user?.email || "",
      };

      console.log("Sending email with data:", emailData);
      console.log("Email service URL:", emailServiceUrl);

      const response = await fetch(`${emailServiceUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send email");
      }

      toast.success("Email sent successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Email Delivery</h1>
          <p className="text-muted-foreground mt-2">
            Send emails and manage your email campaigns
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Email</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
              <CardDescription>Create and send an email to your leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-medium">
                  Recipient Email
                </label>
                <Input
                  id="recipient"
                  value={recipient}
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Type your message here"
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendEmail} 
                disabled={isSending}
                className="flex items-center"
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Alert variant="outline">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email Service Information</AlertTitle>
            <AlertDescription>
              Emails are sent through our secure email service. Make sure your recipient's email is valid to avoid delivery issues.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Create and manage reusable email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No templates yet</h3>
                <p className="text-muted-foreground mt-2">
                  Create your first email template to speed up your outreach process.
                </p>
                <Button className="mt-4">Create Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Email Analytics</CardTitle>
              <CardDescription>Track the performance of your email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No email analytics yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start sending emails to see analytics on opens, clicks, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailDeliveryPage;
