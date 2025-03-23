import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderId: string;
  senderName: string;
  selectedUser: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, senderId, selectedUser, senderName }) => {
  const [balance, setBalance] = useState<number>(0);
  const userId = JSON.parse(localStorage.getItem("user") || '""');
  const [amount, setAmount] = useState<string>('');
  const [senderBankLocation, setSenderBankLocation] = useState<string | null>(null);
  const [receiverAccount, setReceiverAccount] = useState<string>('');
  const [receiverBankLocation, setReceiverBankLocation] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  useEffect(() => {
    const storedBalance = localStorage.getItem('amount');
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          setSenderBankLocation(data.address.country || 'Unknown');
        } catch (error) {
          setSenderBankLocation('Location Error');
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setSenderBankLocation('Location Denied');
        setLoadingLocation(false);
      }
    );
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    

    const transactionData = {
      Sender_account: 1773228424,
      Receiver_account: 5711206230,
      Amount: parseFloat(amount),
      Sender_bank_location: senderBankLocation || 'Unknown',
      Receiver_bank_location: receiverBankLocation,
    };

    try {
      const fraudResponse = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      const fraudData = await fraudResponse.json();

      if (fraudData.category === "High Risk") {

        toast.error('Transaction failed due to Suspicious activities, please wait for the manual review');
        return;
      }

      if (fraudData.risk_score > 0.41) {
        await fetch('http://localhost:3001/api/auth/user/update-fraud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: {userId: userId, recieverId: selectedUser ,...transactionData, amount: transactionData.Amount, mark: fraudData.category} }),
        });
        toast.error('Transaction flagged as fraudulent! Fraud count updated.');
      } else {
        const processResponse = await fetch('http://localhost:3001/api/auth/user/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: {userId: userId, recieverId: selectedUser ,...transactionData, amount: transactionData.Amount} }),
        });

        if (!processResponse.ok) {
          throw new Error('Transaction failed due to insufficient funds or other issues.');
        }

        toast.success(`Transaction of $${amount} to ${receiverAccount} successful!`);
      }
      onClose();
    } catch (error) {
      toast.error('Failed to complete transaction.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Confirm Transaction</h2>
        </DialogHeader>
        <div className="space-y-4">
          <p>Current Balance: <strong>${balance.toFixed(2)}</strong></p>
          <Input type="text" placeholder="Receiver Bank Location" value={receiverBankLocation} onChange={(e) => setReceiverBankLocation(e.target.value)} />
          <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <p>Sender Bank Location: {loadingLocation ? 'Fetching...' : senderBankLocation}</p>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
