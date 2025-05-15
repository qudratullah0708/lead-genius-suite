
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ScraperPage from "./pages/ScraperPage";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/layout/Sidebar";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryPage from "./pages/History";
import ExportsPage from "./pages/Exports";
import EmailDeliveryPage from "./pages/EmailDelivery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Dashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path="/scrapers/:scraperId" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <ScraperPage />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <HistoryPage />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path="/exports" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <ExportsPage />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path="/email" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <EmailDeliveryPage />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
