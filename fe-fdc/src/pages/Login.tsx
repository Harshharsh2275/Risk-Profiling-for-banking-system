import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Link, redirect } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Mail, Lock, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ email, password });
      redirect("/registration");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />
  
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="container max-w-md">
          <div className="glass-panel rounded-xl p-8 shadow-2xl border border-primary/30 backdrop-blur-md bg-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="h-14 w-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-md"
                >
                  <Lock className="h-7 w-7 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 text-sm">
                  Enter your credentials to access your account
                </p>
              </div>
  
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 border border-gray-600 rounded-md bg-[#1E1E1E] focus-visible:ring-primary ${
                        errors.email
                          ? "border-red-400 focus-visible:ring-red-400"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center mt-1 bg-red-50 p-1 rounded">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
  
                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      className="text-blue-500 hover:underline text-sm"
                      to="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 border border-gray-600 rounded-md bg-[#1E1E1E] focus-visible:ring-primary ${
                        errors.password
                          ? "border-red-400 focus-visible:ring-red-400"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center mt-1 bg-red-50 p-1 rounded">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
  
                {/* Sign-in Button */}
                <Button
                  type="submit"
                  className="w-full glass-button bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in securely"
                  )}
                </Button>
              </form>
  
              {/* Register Link */}
              <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account?</span>{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default Login;
