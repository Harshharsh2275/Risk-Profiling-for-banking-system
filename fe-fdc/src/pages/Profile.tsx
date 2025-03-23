
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, MapPin, Phone, Fingerprint, Shield, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, isLoading, macAddresses, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    mobileNumber: ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    address?: string;
    mobileNumber?: string;
  }>({});
  
  // Redirect if not logged in
  
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        mobileNumber: user.mobileNumber || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.address) newErrors.address = 'Address is required';
    
    if (!formData.mobileNumber) newErrors.mobileNumber = 'mobileNumber number is required';
    else if (!/^[0-9]{10,15}$/.test(formData.mobileNumber.replace(/[^0-9]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobileNumber number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleEditToggle = () => {
    if (isEditing && validate()) {
      // Save changes
      handleSave();
    } else {
      setIsEditing(!isEditing);
    }
  };
  
  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      const success = await updateProfile({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        mobileNumber: formData.mobileNumber
      });
      
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
  
      <main className="flex-grow py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
  
          {/* Security Status Card */}
          <Card className="glass-card md:col-span-3 backdrop-blur-md bg-white/20 border border-gray-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-blue-400">Security Status</CardTitle>
                <CardDescription className="text-gray-300">Your account security overview</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Device Verified', 'Email Confirmed', 'Mobile Number Verified'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  
          {/* Profile Info Card */}
          <div className="md:col-span-2">
            <Card className="glass-card h-full backdrop-blur-md bg-white/20 border border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-400">Profile Information</CardTitle>
                <CardDescription className="text-gray-300">Manage your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
  
                {/* Form Fields */}
                {[
                  { label: 'Full Name', icon: <User />, value: formData.name, error: errors.name },
                  { label: 'Email', icon: <Mail />, value: formData.email, error: errors.email },
                  { label: 'Address', icon: <MapPin />, value: formData.address, error: errors.address },
                  { label: 'Mobile Number', icon: <Phone />, value: formData.mobileNumber, error: errors.mobileNumber }
                ].map(({ label, icon, value, error }) => (
                  <div key={label} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">{label}</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {icon}
                      </div>
                      <Input
                        id={label.toLowerCase().replace(/\s/g, '')}
                        name={label.toLowerCase().replace(/\s/g, '')}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`pl-10 ${!isEditing ? 'bg-gray-700/50' : ''} ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                      />
                    </div>
                    {error && (
                      <p className="text-red-400 text-xs flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {error}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
  
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={logout} className="hover:bg-red-600 hover:text-white transition-all">
                  Sign Out
                </Button>
                <Button 
                  onClick={handleEditToggle} 
                  className={`transition-all duration-200 ${isEditing ? 'glass-button' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    isEditing ? 'Save Changes' : 'Edit Profile'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
  
          {/* Device Info Card */}
          <Card className="glass-card h-full backdrop-blur-md bg-white/20 border border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-400">Device Information</CardTitle>
              <CardDescription className="text-gray-300">Your device security details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Device ID</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Fingerprint className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    value={macAddresses || 'Unknown'}
                    readOnly
                    className="pl-10 bg-gray-700/50 text-xs text-gray-300 font-mono"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  This is your unique device identifier for enhanced security.
                </p>
              </div>
  
              {/* Security Tips */}
              <div className="pt-4">
                <div className="rounded-lg bg-gray-700/50 p-4 border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-blue-400">Security Tips</span>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      {/* <Lock className="h-4 w-4 text-blue-400" />  */}
                      <span>Never share your device ID with anyone</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {/* <Key className="h-4 w-4 text-blue-400" />  */}
                      <span>Use a strong, unique password</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {/* <ShieldCheck className="h-4 w-4 text-blue-400" /> */}
                      <span>Enable two-factor authentication when available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
  
  
};

export default Profile;
