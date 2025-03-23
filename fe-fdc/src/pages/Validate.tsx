import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KYCVerification() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {user} = useAuth();

  useEffect(() => {
    const checkKYC = async () => {
        console.log(user);
      try {
        const response = await fetch(`http://localhost:3000/api/verification/initial/${user._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status === 201) {
          const data = await response.json();
          if (data.status === 'verified') {
            navigate('/Profile');
          } else {
            setError('KYC verification in progress. Please wait.');
          }
        } else {
          setError('Invalid response from server.');
        }
      } catch (err) {
        setError('Network error, please try again.');
      }
      setLoading(false);
    };
    
    checkKYC();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h2 className="text-xl font-bold">KYC Verification</h2>
      {loading ? (
        <p className="text-blue-500">Checking KYC status...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">Redirecting...</p>
      )}
      <button disabled className="bg-gray-500 text-white px-4 py-2 rounded">
        Checking...
      </button>
    </div>
  );
}