import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ScraperPage from "./pages/ScraperPage";
import NotFound from "./pages/NotFound";
import Wrapper from "./components/Wrapper";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryPage from "./pages/History";
import ExportsPage from "./pages/Exports";
import EmailDeliveryPage from "./pages/EmailDelivery";
import Settings from "./pages/Settings";
import GoogleMapsScraperPage from "./pages/GoogleMapsScraperPage";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NotificationsProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Protected routes with sidebar/layout */}
              <Route
                path="/dashboard"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <Dashboard />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/scrapers/:scraperId"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <ScraperPage />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/scrapers/google-maps"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <GoogleMapsScraperPage />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/history"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <HistoryPage />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/exports"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <ExportsPage />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/email"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <EmailDeliveryPage />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route
                path="/settings"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <ProtectedRoute>
                        <Wrapper>
                          <Settings />
                        </Wrapper>
                      </ProtectedRoute>
                    </div>
                  </SidebarProvider>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
