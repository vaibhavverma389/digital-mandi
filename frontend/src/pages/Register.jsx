import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Phone, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Farmer', location: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      const user = JSON.parse(userString);
      navigate(user.role === 'Farmer' ? '/dashboard/farmer' : '/dashboard/trader', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate(formData.role === 'Farmer' ? '/dashboard/farmer' : '/dashboard/trader');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl p-8 rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join the smart agriculture marketplace</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'Farmer'})}
              className={`p-3 rounded-xl border-2 transition-all font-bold ${formData.role === 'Farmer' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'}`}
            >
              I am a Farmer
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'Trader'})}
              className={`p-3 rounded-xl border-2 transition-all font-bold ${formData.role === 'Trader' ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'}`}
            >
              I am a Trader
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField icon={<User />} name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <InputField icon={<Mail />} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <InputField icon={<Lock />} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <InputField icon={<Phone />} name="phone" type="text" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            <div className="md:col-span-2">
              <InputField icon={<MapPin />} name="location" type="text" placeholder="Location" value={formData.location} onChange={handleChange} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-4 mt-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${formData.role === 'Farmer' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className={`font-medium transition-colors ${formData.role === 'Farmer' ? 'text-emerald-400 hover:text-emerald-300' : 'text-teal-400 hover:text-teal-300'}`}>
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function InputField({ icon, name, type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        <div className="w-5 h-5">{icon}</div>
      </div>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-900/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
        placeholder={placeholder} 
        required
      />
    </div>
  );
}
