import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Tech', 'Soft'],
    required: true
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  color: {
    type: String,
    default: '#007aff'
  },
  description: {
    type: String,
    default: ''
  },
  learnedAt: {
    type: Date,
    default: Date.now
  },
  projects: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);
