import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { Plus, LogOut, Calendar, Trash2, Sparkles, Map, Globe, MessageCircle, Mail, Heart } from 'lucide-react';

export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data);
      } catch (error) {
        console.error("Failed to fetch trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await api.delete(`/trips/${id}`);
        setTrips(trips.filter(t => t._id !== id));
      } catch (error) {
        console.error("Failed to delete trip", error);
      }
    }
  };

  return (
   
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      
      <div 
        className="relative h-85 w-full bg-cover bg-center shadow-md" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop")' }}
      >
        
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-indigo-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-10">
            
           
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
                <Map size={14} /> Your Adventures
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-100 to-purple-200 tracking-tight mb-2 drop-shadow-sm">
                AI TRAVEL PLANNER
              </h1>
              <p className="text-indigo-200/90 text-lg font-medium flex items-center gap-2">
                Welcome back, {user?.name || 'Explorer'} <Sparkles size={18} className="text-pink-400" />
              </p>
            </div>

           
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/create-trip')} 
                className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
              >
                <Plus size={20} /> New Trip
              </button>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-3 rounded-xl hover:bg-white/20 transition-all font-medium"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>

      
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
            <Sparkles className="animate-pulse mb-4 text-indigo-500" size={32} />
            <p className="text-lg font-bold text-gray-500">Loading your adventures...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center bg-white py-24 px-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips planned yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Your itinerary is empty. Let our AI build the perfect custom vacation for you in seconds.</p>
            <button 
              onClick={() => navigate('/create-trip')} 
              className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Create your first AI itinerary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div 
                key={trip._id} 
                onClick={() => navigate(`/trip/${trip._id}`)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1.5 cursor-pointer flex flex-col h-75"
              >
               
                <div className="h-2.5 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {trip.destination}
                    </h2>
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest border border-indigo-100">
                      {(trip.status || 'PLANNED').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-1">
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-blue-500" />
                      </div>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium line-clamp-1">
                      <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mr-3 shrink-0">
                        <Sparkles size={16} className="text-pink-500" />
                      </div>
                      <span className="truncate">{trip.interests || 'General Explorer'}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-400 text-xs font-bold tracking-wider uppercase">Est. Budget</span>
                    <span className="text-gray-900 text-xl font-black flex items-center gap-4">
                      ${trip.budget}
                      <button 
                        onClick={(e) => handleDelete(e, trip._id)} 
                        className="text-gray-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
                      >
                        <Trash2 size={18} />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      
      <footer className="bg-white border-t border-gray-200 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
                AI TRAVEL PLANNER
              </h3>
              <p className="text-gray-500 max-w-sm font-medium">
                Your personal, intelligent travel companion. Build, vote, and finalize your perfect itinerary in seconds.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 tracking-wide uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/')} className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">Dashboard</button>
                </li>
                <li>
                  <button onClick={() => navigate('/create-trip')} className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">New Trip</button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 tracking-wide uppercase text-sm">Connect</h4>
              <div className="flex gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                
                  <Globe size={18} /> 
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all">
                  
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-medium">
              © {new Date().getFullYear()} AI Travel Planner. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm font-medium flex items-center gap-1">
              Built with <Heart size={14} className="text-rose-500 fill-rose-500" /> by Somil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}