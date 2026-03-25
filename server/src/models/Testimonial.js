import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String },
  company: { type: String },
  avatar: { type: String },
  message: { type: String, required: true },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
