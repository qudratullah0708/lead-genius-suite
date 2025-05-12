
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function IndexCTA() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button asChild size="lg" className="bg-leadgen-primary hover:bg-leadgen-primary/90">
        <Link to="/auth" className="flex items-center">
          <span>Get Started</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link to="/features">
          Learn More
        </Link>
      </Button>
    </div>
  );
}
