import Trip from '../models/Trip.model.js';
import Activity from '../models/Activity.model.js';
import { generateItinerary } from '../services/ai.service.js';
import { sendInviteEmail } from '../services/email.service.js';

export const createTrip = async (req, res) => {
  const { destination, startDate, endDate, budget, interests } = req.body;
  
  try {
   
    const itinerary = await generateItinerary(destination, startDate, endDate, interests, budget);

    const trip = await Trip.create({
      owner: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      interests, 
      status: 'planning'
    });

   
    for (const day of itinerary.days) {
      for (const act of day.activities) {
        await Activity.create({
          trip: trip._id,
          dayIndex: day.dayIndex,
          title: act.title,
          description: act.description,
          location: act.location,
          startTime: act.startTime,
          endTime: act.endTime
        });
      }
    }

    res.status(201).json(trip);
    
  } catch (error) {
    console.error("Trip generation aborted:", error.message);
    res.status(500).json({ message: "Failed to generate AI itinerary. Please try again." });
  }
};

export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ 
      $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }] 
    }).where('isDeleted').equals(false);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteCollaborator = async (req, res) => {
  const { email, role } = req.body;
  const tripId = req.params.id;

  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the trip owner can invite collaborators' });
    }
   
    await sendInviteEmail(email, tripId, req.user.name);
    res.json({ message: 'Invite sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

   
    const isCollaborator = trip.collaborators.find(c => c.user.toString() === req.user._id.toString());
    const isOwner = trip.owner.toString() === req.user._id.toString();

    if (!isCollaborator && !isOwner) {
      trip.collaborators.push({ user: req.user._id, role: 'editor' });
      await trip.save();
    }
    
    res.json({ message: 'Successfully joined trip' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
   
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTripById = async (req, res) => {
  try {
   
    const trip = await Trip.findById(req.params.id).populate('collaborators.user', 'name email');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

   
    const isOwner = trip.owner.toString() === req.user._id.toString();
    const isCollaborator = trip.collaborators.some(
      (c) => c.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to view this trip' });
    }

    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: 'Server error while fetching trip details' });
  }
};

export const addPhotoToTrip = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    
    trip.photos.push(photoUrl);
    await trip.save();

    res.json(trip.photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};