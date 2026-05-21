import { useState } from 'react';
import api from '../api/axios';
import { Plane, Search, Loader2, ArrowRight, AlertCircle, DollarSign } from 'lucide-react';

export default function TicketWidget({ destination, defaultDate }) {
  const [origin, setOrigin] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const formattedDate = defaultDate ? defaultDate.split('T')[0] : '';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin) return;

    setLoading(true);
    setError('');
    setTickets([]);

    try {
      const { data } = await api.post('/tickets/search-flights', {
        originCity: origin,
        destinationCity: destination.split(',')[0],
        departureDate: formattedDate
      });
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || 'No live flights found for this route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-lg">
        <Plane className="text-indigo-600" size={22} /> Live Ticket Pricing
      </h3>

      
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter Departure City (e.g. New York)"
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-sm text-gray-900"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !origin}
          className="bg-[#0B1E36] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Find Tickets
        </button>
      </form>

    
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            
           
            <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Depart</span>
                <span className="text-xl font-black text-gray-900">{ticket.itineraries[0].departure}</span>
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(ticket.itineraries[0].departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <div className="flex flex-col items-center flex-1 sm:flex-initial">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-200/60 px-2 py-0.5 rounded-md mb-1">
                  {ticket.airline}
                </span>
                <div className="w-16 h-0.5 bg-gray-300 relative flex items-center justify-center">
                  <ArrowRight size={12} className="text-gray-400 absolute" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Arrive</span>
                <span className="text-xl font-black text-gray-900">{ticket.itineraries[0].arrival}</span>
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(ticket.itineraries[0].arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>

           
            <div className="text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider sm:block hidden">Total Price</span>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-0.5">
                <span className="text-sm font-bold">{ticket.currency === 'EUR' ? '€' : '$'}</span>
                {Math.round(ticket.price)}
              </div>
              <button className="mt-2 bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-colors border border-emerald-100">
                Select Fare
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}