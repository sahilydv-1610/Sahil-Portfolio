import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Profile from './models/Profile.js';

const seed = async () => {
  await connectDB();

  // Create admin user
  const existingUser = await User.findOne({ username: 'admin' });
  if (!existingUser) {
    await User.create({ username: 'admin', password: 'admin123' });
    console.log('✅ Admin user created (username: admin, password: admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create default profile
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      name: 'Sahil',
      role: 'Full Stack Developer',
      bio: 'Passionate developer building premium digital experiences.',
      about: 'I am a full stack developer with expertise in React, Node.js, and MongoDB. I love creating beautiful, performant web applications.',
      email: 'sahil@example.com',
      location: 'India',
      github: 'https://github.com/sahil',
      linkedin: 'https://linkedin.com/in/sahil',
      skills: [
        { name: 'React', level: 90, category: 'Frontend' },
        { name: 'JavaScript', level: 88, category: 'Frontend' },
        { name: 'Tailwind CSS', level: 85, category: 'Frontend' },
        { name: 'Node.js', level: 80, category: 'Backend' },
        { name: 'Express.js', level: 78, category: 'Backend' },
        { name: 'MongoDB', level: 75, category: 'Backend' },
        { name: 'Git', level: 85, category: 'Tools' },
        { name: 'VS Code', level: 90, category: 'Tools' },
      ],
      experience: [
        {
          role: 'Full Stack Developer',
          company: 'Freelance',
          duration: '2023 – Present',
          description: 'Building premium web applications for clients worldwide using modern JavaScript stack.',
          current: true,
          order: 0,
        },
      ],
      education: [
        {
          degree: 'Bachelor of Technology – Computer Science',
          institution: 'Your University',
          duration: '2020 – 2024',
          description: 'Focused on software engineering, data structures, and web technologies.',
          order: 0,
        },
      ],
    });
    console.log('✅ Default profile created');
  }

  console.log('🌱 Seeding complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
