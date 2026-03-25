import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: String,
  level: { type: Number, default: 80 }, // 0-100
  category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Other'], default: 'Other' },
});

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  duration: String,
  description: String,
  current: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  duration: String,
  description: String,
  order: { type: Number, default: 0 },
});

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Sahil' },
  role: { type: String, default: 'Full Stack Developer' },
  bio: { type: String, default: '' },
  about: { type: String, default: '' },
  avatar: { type: String, default: '' },
  cvFile: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  website: { type: String, default: '' },
  skills: [skillSchema],
  experience: [experienceSchema],
  education: [educationSchema],
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
