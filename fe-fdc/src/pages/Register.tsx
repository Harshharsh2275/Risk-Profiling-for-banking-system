
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, User, Mail, MapPin, Phone, Lock, Fingerprint, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Register = () => {
  const { register, isLoading, macAddresses } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    address?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!address) newErrors.address = 'Address is required';
    
    if (!mobileNumber) newErrors.mobileNumber = 'mobileNumber number is required';
    else if (!/^[0-9]{10,15}$/.test(mobileNumber.replace(/[^0-9]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobileNumber number';
    }
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register({
        name,
        email,
        address,
        mobileNumber,
        password,
        macAddresses: macAddresses || 'unknown'
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="container max-w-xl">
          <div className="bg-gray-800 rounded-2xl p-10 shadow-2xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Animated Profile Icon */}
              <motion.div
                variants={itemVariants}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center space-y-3"
              >
                <div className="h-14 w-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold">Create an Account</h1>
                <p className="text-gray-400 text-sm">
                  Join our secure blockchain fraud detection platform
                </p>
              </motion.div>

              {/* Form Fields */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {[
                  {
                    id: 'name',
                    icon: <User />,
                    label: 'Full Name',
                    placeholder: 'John Doe',
                    value: name,
                    setter: setName,
                    error: errors.name
                  },
                  {
                    id: 'email',
                    icon: <Mail />,
                    label: 'Email',
                    placeholder: 'name@example.com',
                    value: email,
                    setter: setEmail,
                    error: errors.email
                  },
                  {
                    id: 'address',
                    icon: <MapPin />,
                    label: 'Address',
                    placeholder: '123 Main St, City, Country',
                    value: address,
                    setter: setAddress,
                    error: errors.address
                  },
                  {
                    id: 'mobileNumber',
                    icon: <Phone />,
                    label: 'Mobile Number',
                    placeholder: '+1 (123) 456-7890',
                    value: mobileNumber,
                    setter: setmobileNumber,
                    error: errors.mobileNumber
                  }
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {field.icon}
                      </div>
                      <Input
                        id={field.id}
                        type={field.id === 'email' ? 'email' : 'text'}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        autoComplete={field.id}
                        className={`pl-10 bg-gray-700 text-white border-none focus:ring-primary/50 rounded-lg ${field.error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                      />
                    </div>
                    {field.error && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {field.error}
                      </p>
                    )}
                  </div>
                ))}

                {/* Create Account Button with Improved Loading Effect */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                  onClick={(e) => handleSubmit(e)}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>

              {/* Already have an account link */}
              <motion.div variants={itemVariants} className="text-center text-sm">
                <span className="text-gray-300">Already have an account?</span>{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
);


};

export default Register;
