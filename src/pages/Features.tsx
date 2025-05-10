
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Database, FileText, Mail, Target, Users, Globe, BadgeCheck } from "lucide-react";

const Features = () => {
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
                Powerful Features for Smart Lead Generation
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover how LeadGen Suite transforms your lead acquisition process with AI-powered tools.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    Try It Now<ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Core Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive toolset helps you find, organize, and engage with potential customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Multi-Source Scraping</h3>
                <p className="text-muted-foreground mb-4">
                  Collect leads from LinkedIn, Google Maps, Apollo.io, and more using specialized AI agents.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Social media profile scraping</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Business directory extraction</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Company website contact harvesting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Smart Lead Database</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically deduplicate and organize your leads with our intelligent database system.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Automated lead deduplication</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>AI-powered lead enrichment</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Custom tagging and categorization</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Mail className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Outreach Tools</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with your leads through personalized, AI-generated outreach campaigns.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Personalized email templates</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Automated follow-up sequences</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-leadgen-primary mr-2" />
                    <span>Response tracking and analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Platform Overview</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the full power of our comprehensive lead generation ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Targeted Search</h3>
                    <p className="text-muted-foreground">
                      Our AI algorithms help you find exactly the right leads based on industry, location, company size, and other key parameters.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Team Collaboration</h3>
                    <p className="text-muted-foreground">
                      Share leads, campaigns, and insights with your team members for seamless collaboration and improved workflow.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Export & Integration</h3>
                    <p className="text-muted-foreground">
                      Export your leads to CSV/Excel or integrate with your favorite CRM tools like Salesforce, HubSpot, or Pipedrive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <Globe className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Global Coverage</h3>
                    <p className="text-muted-foreground">
                      Find leads from anywhere in the world with our comprehensive global database and location-specific search capabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <Database className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Lead Enrichment</h3>
                    <p className="text-muted-foreground">
                      Automatically enrich your leads with additional data points like social profiles, company information, and contact details.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 bg-leadgen-primary/20 rounded-full flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-leadgen-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3">Compliance Tools</h3>
                    <p className="text-muted-foreground">
                      Stay compliant with GDPR, CCPA, and other regulations with our built-in compliance features and data protection tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-leadgen-dark text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Lead Generation?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of businesses using LeadGen Suite to discover and connect with their ideal customers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/dashboard">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-leadgen-dark" asChild>
                  <Link to="/pricing">View Pricing</Link>
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

export default Features;
