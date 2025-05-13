
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const tiers = [
    {
      name: "Starter",
      id: "starter",
      price: "49",
      priceId: "price_1OsREjLnUappsqgThTq7R5Mm", // Demo Stripe price ID - replace with actual
      description: "Perfect for small businesses and freelancers just getting started with lead generation.",
      features: [
        "100 leads per month",
        "LinkedIn basic scraper",
        "Google Maps basic scraper",
        "Email verification",
        "CSV exports",
      ],
      notIncluded: [
        "AI lead enrichment",
        "Email outreach campaigns",
        "Team collaboration",
        "Custom integrations",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: false,
      trial: true,
    },
    {
      name: "Professional",
      id: "professional",
      price: "149",
      priceId: "price_1OsRFgLnUappsqgTnEeoVqYT", // Demo Stripe price ID - replace with actual
      description: "Ideal for growing businesses with regular lead generation needs.",
      features: [
        "500 leads per month",
        "All basic scrapers",
        "Advanced LinkedIn scraper",
        "AI lead enrichment",
        "Email verification",
        "CSV and CRM exports",
        "Basic email outreach",
        "Team collaboration (3 users)",
      ],
      notIncluded: [
        "Custom integrations",
        "Priority support",
      ],
      cta: "Subscribe Now",
      popular: true,
      trial: false,
    },
    {
      name: "Enterprise",
      id: "enterprise",
      price: "399",
      priceId: "price_1OsRGBLnUappsqgTW38ogUUO", // Demo Stripe price ID - replace with actual
      description: "For organizations with high volume lead generation requirements.",
      features: [
        "2,000 leads per month",
        "All scrapers and features",
        "Advanced AI lead enrichment",
        "Full email outreach campaigns",
        "Team collaboration (unlimited)",
        "Custom integrations",
        "Priority support",
        "Dedicated account manager",
        "Compliance tools and training",
      ],
      notIncluded: [],
      cta: "Subscribe Now",
      popular: false,
      trial: false,
    },
  ];

  const handleSubscribe = async (tier: any) => {
    setIsLoading(tier.id);
    
    try {
      // Call the Supabase Edge Function instead of the FastAPI endpoint
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: tier.priceId,
          tierName: tier.name,
          isTrial: tier.trial,
          successUrl: window.location.origin + '/dashboard?checkout=success',
          cancelUrl: window.location.origin + '/pricing?checkout=cancelled',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "There was a problem processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
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
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the plan that's right for your business. All plans include support and regular updates.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <div key={index} className={`rounded-xl border ${tier.popular ? 'border-leadgen-primary shadow-lg relative' : 'border-gray-200'} overflow-hidden`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-leadgen-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  {tier.trial && (
                    <div className="absolute top-0 left-0">
                      <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                        14-DAY FREE TRIAL
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold">{tier.name}</h2>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="ml-2 text-gray-500">/month</span>
                    </div>
                    <p className="mt-4 text-muted-foreground">{tier.description}</p>
                    <Button 
                      className={`mt-6 w-full ${tier.popular ? 'bg-leadgen-primary hover:bg-leadgen-primary/90' : ''}`} 
                      variant={tier.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(tier)}
                      disabled={isLoading === tier.id}
                    >
                      {isLoading === tier.id ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          {tier.cta}
                          {(tier.popular || tier.trial) && <ArrowRight className="ml-2 h-4 w-4" />}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">What's included:</h3>
                    <ul className="mt-3 space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                          <span className="ml-3 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                      {tier.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start text-gray-400">
                          <X className="h-5 w-5 flex-shrink-0" />
                          <span className="ml-3 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have questions about our pricing? We've got answers.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-medium">What happens after my free trial?</h3>
                  <p className="mt-2 text-muted-foreground">
                    After your 14-day free trial ends, you'll be automatically billed at the regular monthly rate. You can cancel anytime before the trial ends if you decide not to continue.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-medium">Can I change plans later?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Plan changes take effect at the start of your next billing cycle.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-medium">Do you offer annual billing?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Yes, we offer a 20% discount for annual billing. Contact our sales team to switch to annual billing.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-medium">What happens if I exceed my monthly lead limit?</h3>
                  <p className="mt-2 text-muted-foreground">
                    You can purchase additional leads as needed, or we'll suggest upgrading to a higher plan if you consistently exceed your limit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-leadgen-dark text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
              <p className="text-xl opacity-90 mb-8">
                Our team can build a customized plan tailored to your specific lead generation needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-leadgen-dark" asChild>
                  <Link to="/dashboard">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-leadgen-dark text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
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
              </div>
              <p className="mt-2 text-sm text-gray-400 max-w-xs">
                The AI-powered lead generation platform for discovering and collecting leads from multiple online sources.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} LeadGen Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
