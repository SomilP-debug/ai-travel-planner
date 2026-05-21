import { useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem' 
};

const ROUTE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function TripMap({ daysData }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [selectedDay, setSelectedDay] = useState('All');
  
  
  const [activeMarker, setActiveMarker] = useState(null);

  const visibleActivities = useMemo(() => {
    let activities = [];
    if (selectedDay === 'All') {
      Object.entries(daysData).forEach(([dayIndex, dayList]) => {
        dayList.forEach(act => {
          activities.push({ ...act, dynamicDayIndex: dayIndex });
        });
      });
    } else {
      if (daysData[selectedDay]) {
        daysData[selectedDay].forEach(act => {
          activities.push({ ...act, dynamicDayIndex: selectedDay });
        });
      }
    }
    return activities.filter(act => act.location?.lat && act.location?.lng);
  }, [daysData, selectedDay]);

  const center = useMemo(() => {
    if (visibleActivities.length > 0) {
      return { 
        lat: Number(visibleActivities[0].location.lat), 
        lng: Number(visibleActivities[0].location.lng) 
      };
    }
    return { lat: 24.5854, lng: 73.7125 }; 
  }, [visibleActivities]);

  if (!isLoaded) return <div className="h-full w-full bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center font-bold text-slate-400">Loading Map...</div>;

  return (
    <div className="h-full w-full z-0 relative">
      
      
      <div className="absolute top-4 left-4 z-10 flex gap-2 overflow-x-auto max-w-[90%] pb-2">
        <button 
          onClick={() => { setSelectedDay('All'); setActiveMarker(null); }}
          className={`px-5 py-2 rounded-xl text-sm font-extrabold transition-all shadow-sm ${selectedDay === 'All' ? 'bg-slate-900 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white'}`}
        >
          All Days
        </button>
        {Object.keys(daysData).sort((a, b) => Number(a) - Number(b)).map((dayIndex) => (
          <button 
            key={dayIndex}
            onClick={() => { setSelectedDay(dayIndex); setActiveMarker(null); }}
            className={`px-5 py-2 rounded-xl text-sm font-extrabold transition-all shadow-sm whitespace-nowrap ${selectedDay === dayIndex ? 'bg-indigo-600 text-white' : 'bg-white/90 backdrop-blur-sm text-indigo-600 hover:bg-white'}`}
          >
            Day {dayIndex}
          </button>
        ))}
      </div>

      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={center} 
        zoom={13}
        onClick={() => setActiveMarker(null)} 
        options={{ disableDefaultUI: true, zoomControl: true }} 
      >
        
        {visibleActivities.map((act) => {
          const position = { lat: Number(act.location.lat), lng: Number(act.location.lng) };
          const uniqueId = act._id || `${act.title}-${act.startTime}`;
          
          return (
            <div key={uniqueId}>
              <Marker 
                position={position} 
                onClick={() => setActiveMarker(uniqueId)} 
              />
              
              
              {activeMarker === uniqueId && (
                <InfoWindow 
                  position={position}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-2 max-w-45">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{act.title}</p>
                    <p className="text-xs text-indigo-600 font-bold">{act.startTime}</p>
                  </div>
                </InfoWindow>
              )}
            </div>
          );
        })}

      </GoogleMap>
    </div>
  );
}