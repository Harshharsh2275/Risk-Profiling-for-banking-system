import { url } from '@/env';
import { useState, useEffect } from 'react';

export default function BlockchainViewer() {
  const [search, setSearch] = useState('');
  const [blockchainData, setBlockchainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch(`${url}/auth/user/get-transactions`, {
            method: "POST"
        });
        const data = await response.json();
        setBlockchainData(data.chain);
      } catch (err) {
        setError('Failed to fetch blockchain data');
      }
      setLoading(false);
    };
    fetchBlockchain();
  }, []);

  const filteredBlocks = blockchainData.filter(block =>
    block.hash.includes(search) || block.previousHash.includes(search) || block.validator.includes(search)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Blockchain Ledger</h2>
      <input
        type="text"
        placeholder="Search by Hash, Previous Hash, or Validator"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
      />
      {loading ? (
        <p className="text-center text-blue-500">Loading blockchain data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {(filteredBlocks || blockchainData).map((block, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg bg-gray-100">
              <p className="text-gray-700"><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
              <p className="break-all text-gray-800"><strong>Hash:</strong> {block.hash}</p>
              <p className="break-all text-gray-600"><strong>Previous Hash:</strong> {block.previousHash}</p>
              <p className="text-gray-700"><strong>Nonce:</strong> {block.nonce}</p>
              <p className="text-gray-700"><strong>Validator:</strong> {block.validator}</p>
              {/* <p className="text-gray-700"><strong>Transactions:</strong> {block.transactions[0]}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
