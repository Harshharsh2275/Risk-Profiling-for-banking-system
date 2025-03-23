
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateTransactions from "./pages/CreateTransactions";
import ForgetPassword from "./pages/ForgotPassword";
import { RegistrationFlow } from "./components/RegistrationFlow";
import Registration from "./pages/Registration";
import KYCVerification from "./pages/Validate";
import BlockchainViewer from "./pages/ledger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ledger" element={<BlockchainViewer />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/validate" element={<KYCVerification />} />
              <Route path="/createTransactions" element={<CreateTransactions />} />
              <Route path="/kyc" element={<Registration />} /> 
              <Route path="/registration" element={<Registration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
