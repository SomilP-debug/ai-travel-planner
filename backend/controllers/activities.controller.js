import Activity from '../models/Activity.model.js';

export const getTripActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ trip: req.params.tripId }).sort('dayIndex startTime');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};