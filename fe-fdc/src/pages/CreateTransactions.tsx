import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { url } from '@/env';
import TransactionModal from '@/components/ui/modal';

const API_URL = url;

const CreateTransactions = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSendMoney = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '""');
        const response = await fetch(`${API_URL}/auth/users/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, token]);

  const userId = JSON.parse(localStorage.getItem('user') || '""');

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
      <Navbar />
      <div className="max-w-5xl mt-16 mx-auto w-full shadow-2xl rounded-2xl bg-indigo-900 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center">User Information</h1>
  
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="h-12 w-12 animate-spin text-yellow-400" />
          </div>
        ) : error ? (
          <div className="text-yellow-300 flex items-center justify-center py-10">
            <AlertTriangle className="h-6 w-6 mr-2" /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-indigo-800 rounded-xl p-4 shadow-md hover:bg-indigo-600 transition-all"
              >
                <h2 className="text-lg font-bold text-yellow-400">{user.name}</h2>
                <p className="text-sm truncate max-w-full text-white/80">{user.email}</p>
                <p className="text-sm text-white/70">📞 {user.mobileNumber}</p>
                <p className="text-yellow-300 font-bold">💰 ${user.amountAvailable}</p>
  
                <Button
                  onClick={() => handleSendMoney(user)}
                  className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
                >
                  Transfer Funds
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
  
      {selectedUser && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            toast.success(`Funds successfully sent to ${selectedUser.name}!`);
            setIsModalOpen(false);
          }}
          senderId={userId}
          userName={selectedUser.name}
          selectedUser={selectedUser._id}
        />
      )}
    </div>
  );
  
  
};

export default CreateTransactions;
