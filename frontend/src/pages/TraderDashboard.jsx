import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Scale, Sparkles, Filter } from 'lucide-react';
import api from '../lib/api';

export default function TraderDashboard() {
  const [crops, setCrops] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [search, setSearch] = useState('');

  const fetchCrops = async () => {
    try {
      const [cropsRes, bidsRes] = await Promise.all([
        api.get(`/crops?search=${search}`),
        api.get('/bids/trader')
      ]);
      setCrops(cropsRes.data);
      setMyBids(bidsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [search]);

  const handleBid = async (cropId) => {
    const amount = window.prompt("Enter your bid amount (₹):");
    if (!amount) return;
    
    try {
      await api.post('/bids', {
        crop_id: cropId,
        bid_amount: Number(amount)
      });
      alert('Bid placed successfully!');
      fetchCrops();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place bid');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Browse and bid on AI-verified crops.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops, locations, or grades..."
            className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 backdrop-blur-sm"
          />
        </div>
        <button className="px-6 py-4 bg-gray-800/80 border border-gray-700/80 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Available Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crops.length === 0 ? <p className="text-gray-400">No crops found.</p> : crops.map((crop, i) => (
              <MarketCard 
                key={crop._id}
                cropId={crop._id}
                type={crop.type}
                farmer={crop.farmer_id?.name || 'Farmer'}
                location={crop.farmer_id?.location || 'India'}
                quantity={`${crop.quantity} Quintals`}
                quality={crop.quality_score || 'Grade A (Premium)'}
                price={`₹${crop.expected_price}`}
                delay={i * 0.1}
                onBid={handleBid}
                photo={crop.photos?.[0]}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">My Bids</h2>
          {myBids.length === 0 ? <p className="text-gray-400">You haven't placed any bids yet.</p> : myBids.map(bid => (
            <div key={bid._id} className={`bg-gray-800/40 rounded-2xl p-5 border ${bid.status === 'accepted' ? 'border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'border-gray-700/50'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-white">{bid.crop_id?.type || 'Crop'}</p>
                  <p className="text-sm text-gray-400">Bid Amount: <span className="text-teal-400 font-bold">₹{bid.bid_amount}</span></p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bid.status === 'accepted' ? 'bg-teal-500/20 text-teal-400' : bid.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {bid.status}
                </span>
              </div>
              
              {bid.status === 'accepted' && bid.crop_id?.farmer_id && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-teal-400 uppercase font-bold mb-2">Deal Closed! Contact Farmer:</p>
                  <p className="text-sm text-white">Name: {bid.crop_id.farmer_id.name}</p>
                  <p className="text-sm text-white">Phone: {bid.crop_id.farmer_id.phone}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketCard({ cropId, type, farmer, location, quantity, quality, price, delay, onBid, photo }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-colors overflow-hidden group flex flex-col"
    >
      {photo ? (
        <div className="h-48 w-full overflow-hidden">
          <img src={photo} alt={type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-700 flex items-center justify-center border-b border-gray-700/50">
           <Scale className="w-12 h-12 text-gray-500" />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">{type}</h3>
          <span className="bg-teal-500/10 text-teal-400 px-2 py-1 rounded text-xs font-bold border border-teal-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {quality.split(' ')[0]}
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">{farmer[0]}</div>
            <span>{farmer}</span>
            <span className="flex items-center gap-1 ml-auto"><MapPin className="w-4 h-4"/> {location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Scale className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{quantity}</span>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-4 mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Asking Price</p>
            <p className="text-xl font-bold text-white">{price}</p>
          </div>
          <button onClick={() => onBid(cropId)} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all transform hover:-translate-y-0.5">
            Place Bid
          </button>
        </div>
      </div>
    </motion.div>
  );
}
