import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (tripId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
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