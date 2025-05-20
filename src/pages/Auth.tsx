import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const features = [
  {
    title: "Automated Lead Generation",
    description: "Save hours by letting our AI find and qualify leads for you."
  },
  {
    title: "Integrated Email Outreach",
    description: "Send personalized emails to your leads directly from the dashboard."
  },
  {
    title: "Real-Time Analytics",
    description: "Track open rates, responses, and campaign performance in real time."
  },
  {
    title: "Team Collaboration",
    description: "Invite your team and manage leads together efficiently."
  }
];

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Error logging in: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup with email and password
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Error signing up: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left: Auth Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">LeadGen Agent Suite</h1>
            <p className="mt-2 text-gray-600">Sign in or create an account to access your leads</p>
          </div>

          <div className="mt-8 bg-white p-8 shadow rounded-lg">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-leadgen-primary hover:bg-leadgen-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-leadgen-primary hover:bg-leadgen-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm">
              <Link to="/" className="text-leadgen-primary hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Features Panel (hidden on small screens) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-leadgen-primary text-white p-12">
        <h2 className="text-2xl font-bold mb-6">Why LeadGen Agent Suite?</h2>
        <ul className="space-y-6 w-full max-w-xs">
          {features.map((feature, idx) => (
            <li key={idx} className="">
              <div className="font-semibold text-lg mb-1">{feature.title}</div>
              <div className="text-sm opacity-90">{feature.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Auth;
