
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.6.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Checkout function called");

  try {
    // Get the stripe secret key from the environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("Stripe secret key not found in environment");
      return new Response(
        JSON.stringify({ error: "Stripe secret key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsing request body");
    // Parse the request body
    const body = await req.json();
    const { priceId, tierName, isTrial, successUrl, cancelUrl } = body;

    console.log(`Processing checkout for tier: ${tierName}, priceId: ${priceId}, isTrial: ${isTrial}`);

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Configure checkout parameters
    const checkoutParams = {
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "subscription", // Always use subscription mode
      success_url: successUrl || `${req.headers.get("origin")}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/pricing?checkout=cancelled`,
      metadata: {
        tier: tierName
      }
    };

    // Add trial_period_days for the starter tier if it's marked as trial
    if (isTrial) {
      console.log("Adding 14-day trial period");
      checkoutParams.subscription_data = {
        trial_period_days: 14
      };
    }

    console.log("Creating checkout session");
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(checkoutParams);
    console.log(`Checkout session created: ${session.id}`);

    // Return the session ID and URL
    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log the detailed error
    console.error(`Checkout error: ${error.message}`);
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
