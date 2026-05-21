import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Mail, Lock, User, Compass, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match. Please try again.');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
     
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Failed to create account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

 
  const handleType = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col items-center justify-center p-4 relative overflow-hidden border-b-[16px] border-[#0F9D58] py-12">
      
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{ 
          backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      ></div>

      
      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 z-20">
        <Compass size={28} className="text-[#0B1E36]" />
        <span className="text-xl font-black text-[#0B1E36] tracking-tight hidden sm:block">AI TRAVEL PLANNER</span>
      </div>

      <div className="w-full max-w-md relative z-10">
        
       
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">
            Your Trip, Your Vibe
          </h1>
          <p className="text-gray-600 font-medium">
            Create an account to let our AI build your perfect itinerary.
          </p>
        </div>

       
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
          
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 animate-pulse">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={handleType(setName)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={handleType(setEmail)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="explorer@journey.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={handleType(setPassword)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={handleType(setConfirmPassword)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-[#0B1E36] text-white font-extrabold py-4 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-70 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0B1E36] font-bold hover:underline transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}