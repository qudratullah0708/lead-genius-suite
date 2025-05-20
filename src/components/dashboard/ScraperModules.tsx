import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScraperModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColor: string;
}

const ScraperModule = ({ title, description, icon, href, accentColor }: ScraperModuleProps) => {
  return (
    <div className="leadgen-card hover:border-primary/50">
      <div className="leadgen-card-header">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white`} style={{ backgroundColor: accentColor }}>
          {icon}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={href} className="flex items-center">
            <span>Open</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </Button>
      </div>
      <h3 className="leadgen-card-title">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
  );
};

const ScraperModules = () => {
  const scrapers = [
    {
      title: "LinkedIn Scraper",
      description: "Extract professional profiles from LinkedIn",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/scrapers/linkedin",
      accentColor: "#0077B5"
    },
    {
      title: "Google Maps Scraper",
      description: "Find local businesses and contact info",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/scrapers/google-maps",
      accentColor: "#34A853"
    },
    {
      title: "Apollo.io Scraper",
      description: "Extract contacts from Apollo database",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 14.25V11.25C19.5 9.5 18.9 8 18 6.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14.25V11.25C4 6.75 6 3.5 12 3.5C13.7131 3.5 15.1402 3.88 16.2667 4.46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 10.4999C8.5 11.0499 8.159 11.4999 7.75 11.4999C7.341 11.4999 7 11.0499 7 10.4999C7 9.9499 7.341 9.4999 7.75 9.4999C8.159 9.4999 8.5 9.9499 8.5 10.4999Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M17 10.4999C17 11.0499 16.659 11.4999 16.25 11.4999C15.841 11.4999 15.5 11.0499 15.5 10.4999C15.5 9.9499 15.841 9.4999 16.25 9.4999C16.659 9.4999 17 9.9499 17 10.4999Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 20.5C12 20.5 16.5 18.5 16.5 14.25V11.25L12 10.5L7.5 11.25V14.25C7.5 18.5 12 20.5 12 20.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/scrapers/apolloio",
      accentColor: "#6366F1"
    },
    {
      title: "Facebook Groups Scraper",
      description: "Extract profiles from Facebook groups",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8C15 8.53043 14.7893 9.03914 14.4142 9.41421C14.0391 9.78929 13.5304 10 13 10C12.4696 10 11.9609 9.78929 11.5858 9.41421C11.2107 9.03914 11 8.53043 11 8C11 7.46957 11.2107 6.96086 11.5858 6.58579C11.9609 6.21071 12.4696 6 13 6C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 22V18C15 17.4696 14.7893 16.9609 14.4142 16.5858C14.0391 16.2107 13.5304 16 13 16H6C5.46957 16 4.96086 16.2107 4.58579 16.5858C4.21071 16.9609 4 17.4696 4 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 8C9 8.53043 8.78929 9.03914 8.41421 9.41421C8.03914 9.78929 7.53043 10 7 10C6.46957 10 5.96086 9.78929 5.58579 9.41421C5.21071 9.03914 5 8.53043 5 8C5 7.46957 5.21071 6.96086 5.58579 6.58579C5.96086 6.21071 6.46957 6 7 6C7.53043 6 8.03914 6.21071 8.41421 6.58579C8.78929 6.96086 9 7.46957 9 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 8C21 8.53043 20.7893 9.03914 20.4142 9.41421C20.0391 9.78929 19.5304 10 19 10C18.4696 10 17.9609 9.78929 17.5858 9.41421C17.2107 9.03914 17 8.53043 17 8C17 7.46957 17.2107 6.96086 17.5858 6.58579C17.9609 6.21071 18.4696 6 19 6C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 22V18C16.9996 17.4696 16.7889 16.9609 16.4138 16.5858C16.0387 16.2107 15.5304 16 15 16H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/scrapers/facebook",
      accentColor: "#1877F2"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {scrapers.map((scraper) => (
        <ScraperModule
          key={scraper.title}
          title={scraper.title}
          description={scraper.description}
          icon={scraper.icon}
          href={scraper.href}
          accentColor={scraper.accentColor}
        />
      ))}
    </div>
  );
};

export default ScraperModules;
