import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertTriangle, Loader, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_URL = 'http://localhost:3001/api/auth';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Email not found');
      setStep(2);
    } catch (err) {
      setError('Email not found');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) throw new Error('Invalid OTP');
      setStep(3);
    } catch (err) {
      setError('Invalid OTP');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) throw new Error('Password reset failed');
      navigate('/login');
    } catch (err) {
      setError('Password reset failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-800 to-blue-600 text-white flex flex-col">
      <Navbar />
  
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="container max-w-lg">
          <div className="rounded-xl p-10 shadow-2xl bg-blue-900/90 backdrop-blur-md border border-blue-500">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center space-y-5">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="h-14 w-14 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto shadow-md"
                >
                  <Key className="h-7 w-7 text-yellow-300" />
                </motion.div>
  
                <h1 className="text-3xl font-bold tracking-wide">
                  {step === 1 && 'Forgot Your Password?'}
                  {step === 2 && 'Verify OTP'}
                  {step === 3 && 'Set New Password'}
                </h1>
  
                <p className="text-blue-200 text-sm">
                  {step === 1 && 'Provide your email address to receive the OTP.'}
                  {step === 2 && 'Enter the OTP code sent to your email.'}
                  {step === 3 && 'Create a strong new password for your account.'}
                </p>
              </div>
  
              {error && (
                <p className="text-red-300 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </p>
              )}
  
              {step === 1 && (
                <div className="space-y-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-blue-800 border-blue-500 text-white"
                  />
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                  >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                  </Button>
                </div>
              )}
  
              {step === 2 && (
                <div className="space-y-4">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-blue-800 border-blue-500 text-white"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                  >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                  </Button>
                </div>
              )}
  
              {step === 3 && (
                <div className="space-y-4">
                  <Label htmlFor="newPassword">Create Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-blue-800 border-blue-500 text-white"
                  />
                  <Button
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                  >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Reset Password'}
                  </Button>
                </div>
              )}
  
              <div className="text-center text-sm">
                <span className="text-blue-200">Already have your password?</span>{' '}
                <Link to="/login" className="text-yellow-300 hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default ForgetPassword;
