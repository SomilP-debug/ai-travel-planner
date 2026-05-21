import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['editor', 'viewer'], default: 'viewer' }
  }],
  photos: {
    type: [String], // Array of Cloudinary image URLs
    default: []
  },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverPhoto: { type: String },
  status: { type: String, enum: ['planning', 'upcoming', 'past'], default: 'planning' },
  budget: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;