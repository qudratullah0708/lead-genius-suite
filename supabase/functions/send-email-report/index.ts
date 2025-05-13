
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Email report function called");

  try {
    // Get the Resend API key from the environment
    const resendApiKey = Deno.env.get("RESEND");
    if (!resendApiKey) {
      console.error("Resend API key not found in environment");
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsing request body");
    // Parse the request body
    const body = await req.json();
    const { recipient_email, subject, message, user_email, csvContent, query } = body;

    console.log(`Sending email report to: ${recipient_email}`);

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Create a nice HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Lead Generation Report</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>${message}</p>
              <p>This report was generated for the search query: <strong>${query || 'All Leads'}</strong></p>
              <p>Best regards,</p>
              <p>LeadGen Suite Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} LeadGen Suite. All rights reserved.</p>
              <p>This email was sent from ${user_email || 'LeadGen Suite'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email with Resend
    const { data, error } = await resend.emails.send({
      from: "LeadGen Suite <onboarding@resend.dev>",
      to: [recipient_email],
      subject: subject || `Lead Report: ${query || 'All Leads'}`,
      html: htmlContent,
      attachments: csvContent ? [
        {
          filename: `leads_report_${Date.now()}.csv`,
          content: csvContent
        }
      ] : undefined
    });

    if (error) {
      console.error(`Resend error: ${error}`);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully: ${data?.id}`);

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", id: data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log the detailed error
    console.error(`Email sending error: ${error.message}`);
    if (error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    
    // Return any errors
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
