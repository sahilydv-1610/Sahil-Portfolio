import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: Date },
  description: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
