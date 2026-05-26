import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (tripId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
   
    const backendUrl = apiUrl.replace('/api', '');


    const newSocket = io(backendUrl);
    setSocket(newSocket);

    if (tripId) {
      newSocket.emit('join_trip', tripId);
    }

    return () => {
      if (tripId) {
        newSocket.emit('leave_trip', tripId);
      }
      newSocket.disconnect();
    };
  }, [tripId]);

  return socket;
};