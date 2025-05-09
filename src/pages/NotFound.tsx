
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border">
        <div className="bg-red-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <h1 className="text-3xl font-bold text-red-500">404</h1>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="bg-leadgen-primary hover:bg-leadgen-primary/90">
            <Link to="/dashboard">
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Path: <code className="bg-slate-100 px-1 py-0.5 rounded">{location.pathname}</code>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
