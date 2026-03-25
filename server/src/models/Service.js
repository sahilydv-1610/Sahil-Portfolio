import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }, // e.g. Lucide icon name or image URL
  skills: [{ type: String }], // Optional related skills/tech stack
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
