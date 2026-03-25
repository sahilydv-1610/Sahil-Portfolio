import mongoose from 'mongoose';
import Skill from './models/Skill.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import connectDB from './config/db.js';

const seedSkills = async () => {
  await connectDB();

  const skills = [
    { name: 'React', category: 'Tech', level: 90, color: '#61dafb', icon: 'code' },
    { name: 'Node.js', category: 'Tech', level: 85, color: '#339933', icon: 'code' },
    { name: 'Three.js', category: 'Tech', level: 75, color: '#000000', icon: 'box' },
    { name: 'JavaScript', category: 'Tech', level: 95, color: '#f7df1e', icon: 'code' },
    { name: 'TypeScript', category: 'Tech', level: 80, color: '#3178c6', icon: 'code' },
    { name: 'MongoDB', category: 'Tech', level: 80, color: '#47a248', icon: 'database' },
    { name: 'Communication', category: 'Soft', level: 90, color: '#ff9500', icon: 'brain' },
    { name: 'Problem Solving', category: 'Soft', level: 95, color: '#ff2d55', icon: 'brain' },
    { name: 'Leadership', category: 'Soft', level: 80, color: '#af52de', icon: 'brain' },
    { name: 'Teamwork', category: 'Soft', level: 85, color: '#34c759', icon: 'brain' },
  ];

  try {
    await Skill.deleteMany();
    await Skill.insertMany(skills);
    console.log('✅ Skills seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding skills:', err);
    process.exit(1);
  }
};

seedSkills();
