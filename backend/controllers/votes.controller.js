import Activity from '../models/Activity.model.js';

export const voteOnActivity = async (req, res) => {
  const { voteType } = req.body; // 1 or -1
  try {
    const activity = await Activity.findById(req.params.id);
    
    
    const existingVoteIndex = activity.votes.findIndex(v => v.user.toString() === req.user._id.toString());
    
    if (existingVoteIndex >= 0) {
      
      if (activity.votes[existingVoteIndex].voteType === voteType) {
        activity.votes.splice(existingVoteIndex, 1);
        activity.voteScore -= voteType;
      } else {
        activity.votes[existingVoteIndex].voteType = voteType;
        activity.voteScore += (voteType * 2); // Flip vote
      }
    } else {
      // New vote
      activity.votes.push({ user: req.user._id, voteType });
      activity.voteScore += voteType;
    }
    
    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};