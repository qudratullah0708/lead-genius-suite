
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Zap, Shield } from "lucide-react";

const About = () => {
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
                About LeadGen Suite
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your AI-powered partner for discovering and connecting with new business opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  LeadGen Suite was founded in 2023 with a simple mission: make lead generation 
                  accessible, efficient, and intelligent for businesses of all sizes.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our team of AI experts, sales professionals, and developers came together to solve 
                  one of the most challenging aspects of growing a business - finding and connecting 
                  with quality leads.
                </p>
                <p className="text-lg text-muted-foreground">
                  By harnessing the latest advancements in artificial intelligence, we've created a 
                  platform that transforms how businesses discover and engage with potential customers.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-md bg-leadgen-primary/20 text-leadgen-primary">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Expert Team</h3>
                      <p className="text-muted-foreground">
                        Our team combines decades of experience in sales, marketing, and AI development.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-md bg-leadgen-primary/20 text-leadgen-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                      <p className="text-muted-foreground">
                        Serving clients across 20+ countries with localized lead discovery capabilities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-md bg-leadgen-primary/20 text-leadgen-primary">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cutting-edge AI</h3>
                      <p className="text-muted-foreground">
                        Leveraging the latest AI technologies to deliver intelligent lead generation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do at LeadGen Suite.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Data Privacy & Ethics</h3>
                <p className="text-muted-foreground">
                  We believe in responsible data usage and maintaining the highest ethical standards in lead generation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of what's possible in AI-powered lead generation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-leadgen-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Customer Success</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We're committed to helping businesses grow through quality leads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-leadgen-dark text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Join the LeadGen Revolution</h2>
              <p className="text-xl opacity-90 mb-8">
                Experience the future of lead generation with our AI-powered platform.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
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

export default About;
