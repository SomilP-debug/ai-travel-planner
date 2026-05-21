import { useMemo, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem' 
};

export default function TripMap({ daysData }) {
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

  return (
    <div className="h-full w-full z-0 relative">
      
      {/* Filters UI */}
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

      {/* New Google Maps Official Implementation */}
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map 
          style={containerStyle} 
          defaultCenter={center} 
          defaultZoom={13}
          mapId="DEMO_MAP_ID" // Google strictly requires a Map ID for Advanced Markers now
          disableDefaultUI={true}
          onClick={() => setActiveMarker(null)} 
        >
          
          {visibleActivities.map((act) => {
            const position = { lat: Number(act.location.lat), lng: Number(act.location.lng) };
            const uniqueId = act._id || `${act.title}-${act.startTime}`;
            
            return (
              <div key={uniqueId}>
                <AdvancedMarker 
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

        </Map>
      </APIProvider>
    </div>
  );
}