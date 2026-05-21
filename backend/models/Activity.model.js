import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  dayIndex: { type: Number, required: true }, // Which day of the trip (1, 2, 3...)
  title: { type: String, required: true },
  description: { type: String },
  location: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  startTime: { type: String },
  endTime: { type: String },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: Number, enum: [1, -1] } // 1 for upvote, -1 for downvote
  }],
  voteScore: { type: Number, default: 0 }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;