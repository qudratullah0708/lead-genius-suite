
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

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NotificationsProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <Dashboard />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/scrapers/:scraperId" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <ScraperPage />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <HistoryPage />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/exports" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <ExportsPage />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/email-delivery" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <EmailDeliveryPage />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Wrapper>
                      <Settings />
                    </Wrapper>
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </NotificationsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
