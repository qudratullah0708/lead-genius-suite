
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Mail, Search, FileText } from "lucide-react";

const Index = () => {
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
                The Ultimate AI Lead Generation Suite
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover and collect leads from multiple sources using AI-powered scraping, all in one unified platform.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    Get Started<ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Your All-in-One Lead Generation Platform</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the right leads from multiple sources without the hassle of using different tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Multi-Source Scraping</h3>
                <p className="text-muted-foreground">
                  Collect leads from LinkedIn, Google Maps, Apollo.io, and more using specialized AI agents.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Smart Lead Database</h3>
                <p className="text-muted-foreground">
                  Automatically deduplicate and organize your leads with our intelligent database system.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Export & Integration</h3>
                <p className="text-muted-foreground">
                  Export your leads to CSV/Excel or integrate with your favorite CRM tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-leadgen-dark text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Supercharge Your Lead Generation?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of businesses using LeadGen Suite to discover and connect with their ideal customers.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">Get Started Now</Link>
              </Button>
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

export default Index;
