export const setupTripSocket = (io) => {
  io.on('connection', (socket) => {
    
    // User opens a specific trip dashboard
    socket.on('join_trip', (tripId) => {
      socket.join(tripId);
      console.log(`Socket ${socket.id} joined trip room: ${tripId}`);
    });

    // Real-time activity sync (optimistic UI conflict resolution)
    socket.on('update_activity', ({ tripId, activityData }) => {
      socket.to(tripId).emit('activity_updated', activityData);
    });

    // Real-time voting sync
    socket.on('vote_activity', ({ tripId, activityId, newScore }) => {
      socket.to(tripId).emit('activity_voted', { activityId, newScore });
    });

    // User leaves the trip dashboard
    socket.on('leave_trip', (tripId) => {
      socket.leave(tripId);
      console.log(`Socket ${socket.id} left trip room: ${tripId}`);
    });
  });
};