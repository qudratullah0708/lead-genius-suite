import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Wrapper from "./components/Wrapper";
import EmailDeliveryPage from "./pages/EmailDelivery";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Wrapper><Dashboard /></Wrapper></ProtectedRoute>} />
                <Route path="/email-delivery" element={<ProtectedRoute><Wrapper><EmailDeliveryPage /></Wrapper></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Wrapper><Settings /></Wrapper></ProtectedRoute>} />
              </Routes>
            </div>
          </NotificationsProvider>
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
