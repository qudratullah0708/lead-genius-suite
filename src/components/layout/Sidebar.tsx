
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Database, 
  Settings,
  ArrowLeft, 
  ArrowRight, 
  History,
  FileText,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: Database,
    href: "/dashboard"
  },
  {
    title: "LinkedIn Scraper",
    icon: Search,
    href: "/scrapers/linkedin"
  },
  {
    title: "Google Maps Scraper",
    icon: Search,
    href: "/scrapers/google-maps"
  },
  {
    title: "Search History",
    icon: History,
    href: "/history"
  },
  {
    title: "Exports",
    icon: FileText,
    href: "/exports"
  },
  {
    title: "Email Delivery",
    icon: Mail,
    href: "/email"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings"
  }
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar className={cn(
      "border-r border-border",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-[60px] border-b border-sidebar-border flex items-center justify-between px-4">
        {!collapsed && (
          <div className="font-bold text-sidebar-foreground">LeadGen Suite</div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground ml-auto"
        >
          {collapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </button>
      </div>
      <SidebarContent className="py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 w-full", 
                  location.pathname === item.href ? "bg-sidebar-accent" : "",
                  collapsed ? "justify-center" : ""
                )}
              >
                <Link to={item.href} className="flex items-center">
                  <item.icon size={collapsed ? 20 : 18} className="text-sidebar-foreground" />
                  {!collapsed && <span className="ml-2 text-sidebar-foreground">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default SidebarLayout;
