import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  techStack: [{ type: String }],
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  duration: { type: String, default: '' },
  organization: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
