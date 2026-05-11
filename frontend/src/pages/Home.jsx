import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Cpu, Image as ImageIcon } from 'lucide-react';
import api from '../lib/api';

export default function Home() {
  const [recentCrops, setRecentCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get('/crops');
        // Only show up to 3 available crops on home page
        setRecentCrops(res.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          AI-Powered Agriculture Marketplace
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          Empowering Farmers with <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Smart Trading
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect directly with traders, get AI-driven price suggestions, and assess your crop quality instantly. A premium marketplace built for the modern era.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transform hover:-translate-y-1">
            Start Trading Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center">
            Sign In
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
        <FeatureCard 
          icon={<Cpu className="w-8 h-8 text-emerald-400" />}
          title="AI Quality Check"
          description="Upload an image of your crop and let our AI instantly grade the quality before listing."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Activity className="w-8 h-8 text-teal-400" />}
          title="Smart Pricing"
          description="Get dynamic price suggestions based on historical market trends and data."
          delay={0.4}
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-cyan-400" />}
          title="Secure Bidding"
          description="A transparent bidding system connecting farmers to verified traders instantly."
          delay={0.6}
        />
      </div>

      {recentCrops.length > 0 && (
        <div className="w-full max-w-5xl mt-32 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fresh Market Listings</h2>
            <p className="text-gray-400">Discover top quality crops directly from farmers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCrops.map((crop, index) => (
              <CropCard key={crop._id} crop={crop} delay={0.2 * (index + 1)} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-medium transition-colors">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function CropCard({ crop, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl bg-gray-800/50 border border-gray-700/50 overflow-hidden hover:bg-gray-800 transition-all text-left backdrop-blur-sm shadow-lg hover:shadow-emerald-500/10 flex flex-col"
    >
      <div className="relative h-48 w-full bg-gray-900">
        {crop.photos && crop.photos.length > 0 ? (
          <img src={crop.photos[0]} alt={crop.type} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
          Available to Sell
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 capitalize">{crop.type}</h3>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700/50">
          <div>
            <p className="text-xs text-gray-400">Expected Price</p>
            <p className="text-lg font-bold text-emerald-400">₹{crop.expected_price} <span className="text-xs text-gray-500 font-normal">/ Qtl</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Quantity</p>
            <p className="text-sm font-semibold text-gray-200">{crop.quantity} <span className="text-xs text-gray-500">Qtl</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors text-left backdrop-blur-sm"
    >
      <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
