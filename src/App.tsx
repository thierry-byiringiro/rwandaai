import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AIChatWidget from "@/components/AIChatWidget";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import HotelsPage from "./pages/HotelsPage";
import FlightsPage from "./pages/FlightsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import AirportAssistPage from "./pages/AirportAssistPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import AdminOverview from "./pages/admin/AdminOverview";
import BookingsAdmin from "./pages/admin/BookingsAdmin";
import InquiriesAdmin from "./pages/admin/InquiriesAdmin";
import HotelsAdmin from "./pages/admin/HotelsAdmin";
import ActivitiesAdmin from "./pages/admin/ActivitiesAdmin";
import FlightsAdmin from "./pages/admin/FlightsAdmin";
import AnalyzerAdmin from "./pages/admin/AnalyzerAdmin";
import NotesAdmin from "./pages/admin/NotesAdmin";
import NotFound from "./pages/NotFound";

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
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/airport-assist" element={<AirportAssistPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><BookingsAdmin /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute><InquiriesAdmin /></ProtectedRoute>} />
            <Route path="/admin/hotels" element={<ProtectedRoute><HotelsAdmin /></ProtectedRoute>} />
            <Route path="/admin/activities" element={<ProtectedRoute><ActivitiesAdmin /></ProtectedRoute>} />
            <Route path="/admin/flights" element={<ProtectedRoute><FlightsAdmin /></ProtectedRoute>} />
            <Route path="/admin/analyzer" element={<ProtectedRoute><AnalyzerAdmin /></ProtectedRoute>} />
            <Route path="/admin/notes" element={<ProtectedRoute><NotesAdmin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
