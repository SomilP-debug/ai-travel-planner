import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';
import { ArrowLeft, MapPin, Clock, ThumbsUp, ThumbsDown, UserPlus, X, Sparkles } from 'lucide-react';
import TripMap from '../components/TripMap';
import useAuthStore from '../store/authStore';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
import BudgetTracker from '../components/BudgetTracker';
import PhotoWall from '../components/PhotoWall';
import TicketWidget from '../components/TicketWidget';

export default function TripViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useSocket(id);
  const componentRef = useRef();
  
 
  const [activeTab, setActiveTab] = useState('itinerary');
  const [tripInfo, setTripInfo] = useState(null); 
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');

  useEffect(() => {
    const fetchTripData = async () => {
      try {
     
        const { data: acts } = await api.get(`/activities/trip/${id}`);
        setActivities(acts);
        
        
        const { data: tripData } = await api.get(`/trips/${id}`);
        setTripInfo(tripData); 
        
      } catch (error) {
        console.error("Failed to fetch trip data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [id]);
  
  const days = activities.reduce((acc, activity) => {
    const day = activity.dayIndex;
    if (!acc[day]) acc[day] = [];
    acc[day].push(activity);
    return acc;
  }, {});

  const handleVote = async (activityId, voteType) => {
    try {
      const { data } = await api.post(`/votes/${activityId}`, { voteType });
      setActivities(activities.map(act => act._id === activityId ? { ...act, voteScore: data.voteScore } : act));
      if (socket) {
        socket.emit('vote_activity', { tripId: id, activityId, newScore: data.voteScore });
      }
    } catch (error) {
      console.error("Failed to vote", error);
    }
  };
 
  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: tripInfo ? `${tripInfo.destination}_Itinerary` : 'My_Trip',
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus('loading');
    try {
      await api.post(`/trips/${id}/invite`, { email: inviteEmail, role: 'editor' });
      setInviteStatus('success');
      setInviteEmail('');
      setTimeout(() => {
        setIsInviteOpen(false);
        setInviteStatus('');
      }, 2000);
    } catch (error) {
      console.error(error);
      setInviteStatus('error');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-purple-600">
      <Sparkles className="animate-pulse mb-4" size={32} />
      <div className="text-xl font-bold text-gray-600">Loading your adventure...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative min-h-screen">
      
    
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-gray-500 hover:text-purple-700 mb-6 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

     
      <div className="relative bg-linear-to-br from-indigo-900 via-purple-900 to-black rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl overflow-hidden border border-purple-800/50">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
              <Sparkles size={12} /> AI Generated Itinerary
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
              {tripInfo ? tripInfo.destination : "Your Journey"}
            </h1>
            
            <p className="text-purple-200/80 font-medium text-lg sm:text-xl max-w-xl">
              Collaborate, vote, and plan your perfect trip in real-time.
            </p>
          </div>
          
          {tripInfo && tripInfo.owner === user?._id && (
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 bg-white text-purple-900 hover:bg-gray-100 px-6 py-3.5 rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              <UserPlus size={20} /> Invite Friends
            </button>

          )}
          <button 
            onClick={handlePrint} 
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition"
          >
            <Download size={20} /> Export PDF
          </button>
        </div>
      </div>

      
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl w-fit mb-10 border border-gray-200/50 shadow-inner">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          Itinerary & Map
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={`px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'budget' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          Budget Tracker
        </button>
        <button 
          onClick={() => setActiveTab('photos')}
          className={`px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'photos' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          Photo Wall
        </button>
      </div>

      
      {activeTab === 'itinerary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          
          <div ref={componentRef} className="lg:col-span-7 space-y-10">
            {tripInfo && (
        <TicketWidget 
          destination={tripInfo.destination} 
          defaultDate={tripInfo.startDate} 
        />
      )}
            {Object.keys(days).sort().map((dayIndex) => (
              <div key={dayIndex} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group/day">
                
                
                <div className="bg-linear-to-r from-purple-50/80 to-pink-50/80 px-8 py-6 border-b border-purple-100/50 flex items-center justify-between backdrop-blur-sm">
                  <h2 className="font-extrabold text-2xl text-purple-900 tracking-tight">Day {dayIndex}</h2>
                  <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600 font-black text-sm">
                    {days[dayIndex].length}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-50">
                  {days[dayIndex].map((act) => (
                    <div key={act._id} className="p-6 sm:p-8 flex gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors group/act">
                      
                     
                      <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-full p-2 h-fit border border-gray-100 shadow-sm shrink-0 mt-1">
                        <button onClick={() => handleVote(act._id, 1)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all">
                          <ThumbsUp size={18} />
                        </button>
                        <span className="font-extrabold text-sm text-gray-700 w-6 text-center">{act.voteScore || 0}</span>
                        <button onClick={() => handleVote(act._id, -1)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                          <ThumbsDown size={18} />
                        </button>
                      </div>

                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover/act:text-purple-700 transition-colors">
                          {act.title}
                        </h3>
                        <p className="text-gray-500 mt-2 leading-relaxed text-sm sm:text-base">
                          {act.description}
                        </p>
                        
                        
                        <div className="flex flex-wrap items-center gap-3 mt-5 text-xs font-bold text-gray-600 tracking-wide">
                          <span className="flex items-center gap-1.5 bg-blue-50/80 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100/50">
                            <Clock size={14} /> {act.startTime} - {act.endTime}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200/50">
                            <MapPin size={14} className="text-gray-400" /> {act.location?.address || 'TBD'}
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-8 h-125 lg:h-[calc(100vh-8rem)] min-h-125 w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
               <TripMap daysData={days} />
            </div>
          </div>
        </div>
      )}

      
      {activeTab === 'budget' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <BudgetTracker tripId={id} totalBudget={tripInfo?.budget || 0} />
        </div>
      )}

      
      {activeTab === 'photos' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PhotoWall tripId={id} />
        </div>
      )}

      
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsInviteOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Invite a Collaborator</h2>
            <p className="text-gray-500 mb-8 font-medium">Send an email invite so they can vote and edit this trip with you.</p>
            
            <form onSubmit={handleInvite}>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-4 mb-2 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all font-medium" 
                placeholder="friend@example.com"
              />
              
              <div className="h-6 mb-4">
                {inviteStatus === 'success' && <p className="text-emerald-600 text-sm font-bold flex items-center gap-1"><Sparkles size={14}/> Invite sent successfully!</p>}
                {inviteStatus === 'error' && <p className="text-rose-600 text-sm font-bold">Failed to send invite. Please try again.</p>}
              </div>
              
              <button 
                type="submit" 
                disabled={inviteStatus === 'loading'}
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              >
                {inviteStatus === 'loading' ? 'Sending...' : 'Send Invite'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}