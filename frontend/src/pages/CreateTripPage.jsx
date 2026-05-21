import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Sparkles, MapPin, Calendar, DollarSign, Lightbulb, Loader2 } from 'lucide-react';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    interests: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     
      const { data } = await api.post('/trips', formData);
      navigate(`/trip/${data._id}`); 
    } catch (error) {
      console.error(error);
      if (error.response?.status === 429) {
        alert("The AI is currently generating too many trips. Please wait 1 minute and try again!");
      } else {
        alert('Failed to generate trip. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
     
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/20 mix-blend-multiply filter blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 mix-blend-multiply filter blur-[80px] animate-pulse delay-700"></div>

     
      <div className="w-full max-w-2xl relative z-10 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors w-fit bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

    
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white p-8 sm:p-12 relative z-10">
        
      
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-inner border border-white">
            <Sparkles className="text-purple-600" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Generate AI Itinerary</h1>
            <p className="text-gray-500 font-medium mt-1">Tell us your dream trip, and our AI will build it.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
         
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                placeholder="e.g. Tokyo, Japan"
              />
            </div>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input 
                  type="date" 
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input 
                  type="date" 
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                />
              </div>
            </div>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Budget ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input 
                  type="number" 
                  name="budget"
                  required
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="1500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Interests</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lightbulb size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="interests"
                  required
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                  placeholder="Food, Museums, Hiking..."
                />
              </div>
            </div>
          </div>

        
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70 shadow-[0_10px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_25px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Drafting Itinerary...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Itinerary
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}