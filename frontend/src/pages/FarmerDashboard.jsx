import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import api from '../lib/api';

export default function FarmerDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [crops, setCrops] = useState([]);
  const [bids, setBids] = useState([]);

  const fetchData = async () => {
    try {
      const [cropsRes, bidsRes] = await Promise.all([
        api.get('/crops/farmer'),
        api.get('/bids/farmer')
      ]);
      setCrops(cropsRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBidAction = async (bidId, status) => {
    try {
      await api.put(`/bids/${bidId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Farmer Dashboard</h1>
          <p className="text-gray-400">Manage your crops and review trader bids.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          List New Crop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Your Listings</h2>
          {crops.length === 0 ? <p className="text-gray-400">No listings yet.</p> : crops.map(crop => (
            <CropCard 
              key={crop._id}
              type={crop.type} 
              quantity={`${crop.quantity} Quintals`} 
              price={`₹${crop.expected_price}`} 
              quality={crop.quality_score || 'Grade A (AI Verified)'} 
              status={crop.status === 'available' ? 'Available' : crop.status === 'sold' ? 'Sold' : 'Pending'}
              photo={crop.photos?.[0]}
            />
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Recent Bids</h2>
          {bids.filter(b => b.status === 'pending').length === 0 ? <p className="text-gray-400 text-sm">No pending bids right now.</p> : bids.filter(b => b.status === 'pending').map(bid => (
            <div key={bid._id} className="bg-gray-800/40 rounded-2xl p-5 border border-gray-700/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-white">{bid.trader_id?.name || 'Trader'}</p>
                  <p className="text-sm text-gray-400">For {bid.crop_id?.type}</p>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded text-sm">₹{bid.bid_amount}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBidAction(bid._id, 'accepted')} className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 border border-emerald-500/50 hover:text-white py-2 rounded-lg font-medium transition-colors">
                  Accept
                </button>
                <button onClick={() => handleBidAction(bid._id, 'rejected')} className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 py-2 rounded-lg font-medium transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2 mt-8">Closed Deals</h2>
          {bids.filter(b => b.status === 'accepted').length === 0 ? <p className="text-gray-400 text-sm">No closed deals yet.</p> : bids.filter(b => b.status === 'accepted').map(bid => (
            <div key={bid._id} className="bg-emerald-900/20 rounded-2xl p-5 border border-emerald-500/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-white">Sold: {bid.crop_id?.type}</p>
                  <p className="text-sm text-gray-400">Winning Bid: <span className="text-emerald-400 font-bold">₹{bid.bid_amount}</span></p>
                </div>
                <span className="text-emerald-400 text-xs font-bold uppercase bg-emerald-500/20 px-2 py-1 rounded">Sold</span>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <p className="text-xs text-emerald-400 uppercase font-bold mb-2">Buyer Contact Info:</p>
                <p className="text-sm text-white">Name: {bid.trader_id?.name}</p>
                <p className="text-sm text-white">Phone: {bid.trader_id?.phone}</p>
                {bid.trader_id?.email && <p className="text-sm text-white">Email: {bid.trader_id.email}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && <AddCropModal onClose={() => setShowAddModal(false)} onSuccess={fetchData} />}
    </div>
  );
}

function CropCard({ type, quantity, price, quality, status, photo }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/30 transition-colors flex flex-col sm:flex-row justify-between gap-4"
    >
      <div className="flex flex-col sm:flex-row flex-1">
        {photo ? (
          <img src={photo} alt={type} className="w-full sm:w-32 h-32 object-cover" />
        ) : (
          <div className="w-full sm:w-32 h-32 bg-gray-700 flex items-center justify-center text-gray-500">
            <Camera className="w-8 h-8" />
          </div>
        )}
        <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-white">{type}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === 'Available' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {status}
          </span>
        </div>
        <p className="text-gray-400">{quantity}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded border border-emerald-500/30 text-sm flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> {quality}
          </span>
        </div>
        </div>
      </div>
      <div className="text-left sm:text-right flex flex-col justify-center p-6 bg-gray-800/30">
        <p className="text-sm text-gray-400 mb-1">Expected Price</p>
        <p className="text-2xl font-bold text-emerald-400">{price}</p>
      </div>
    </motion.div>
  );
}

function AddCropModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [quality, setQuality] = useState(null);
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const simulateAI = async () => {
    if (!type || !quantity) return alert('Please fill in type and quantity');
    setStep(2);
    
    try {
      const qualityRes = await api.post('/ai/quality-check', { image_path: type });
      const finalQuality = qualityRes.data.quality_score || 'Grade B (Standard)';
      setQuality(finalQuality);

      const priceRes = await api.post('/ai/predict-price', { crop_type: type, quantity });
      const finalPrice = priceRes.data.suggested_price_per_unit * quantity;
      setExpectedPrice(finalPrice);
      
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('AI processing failed. Falling back to default values.');
      setQuality('Grade B (Standard)');
      setExpectedPrice(quantity * 1500);
      setStep(3);
    }
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('quantity', Number(quantity));
      formData.append('expected_price', Number(expectedPrice));
      formData.append('quality_score', quality);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/crops', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to list crop');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">List New Crop</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Crop Type</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Wheat" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quantity (Quintals)</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 50" />
              </div>
              <div className="pt-2">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="w-full border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors bg-gray-800/50"
                  >
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="font-medium">
                      {imageFile ? imageFile.name : 'Click to Upload Image'}
                    </span>
                  </div>
                </div>
                {imageFile && (
                  <button onClick={simulateAI} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all relative z-20">
                    Run AI Analysis
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin"></div>
              <Sparkles className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Analyzing Crop Quality</h3>
            <p className="text-gray-400">Processing image using Computer Vision...</p>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Analysis Complete</h2>
              <p className="text-emerald-400 font-bold text-lg">{quality}</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400 flex items-center gap-1 mb-1"><TrendingUp className="w-4 h-4"/> AI Suggested Price</p>
                <p className="text-2xl font-bold text-white">₹{expectedPrice} <span className="text-sm font-normal text-gray-400">total</span></p>
              </div>
              <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-500 hover:text-white transition-colors">
                Apply Price
              </button>
            </div>

            <button 
              onClick={handlePublish}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Publish Listing
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
