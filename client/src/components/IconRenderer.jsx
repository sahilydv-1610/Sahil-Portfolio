import React from 'react';
import * as LucideIcons from 'lucide-react';

const techMap = {
  'React': 'Atom',
  'Node': 'Hexagon',
  'Node.js': 'Hexagon',
  'Javascript': 'FileCode',
  'TypeScript': 'ShieldCheck',
  'Python': 'Binary',
  'HTML': 'Code2',
  'CSS': 'Palette',
  'MongoDB': 'Database',
  'SQL': 'Database',
  'Git': 'GitBranch',
  'Docker': 'Box',
  'AWS': 'Cloud',
  'UI': 'Layout',
  'UX': 'UserCheck',
  'Design': 'Figma',
  'Java': 'Coffee',
  'C++': 'Cpu',
  'Vue': 'Hexagon',
  'Angular': 'Shield',
  'Firebase': 'Flame',
  'Tailwind': 'Wind'
};

const IconRenderer = ({ name, size = 24, className = "" }) => {
  // Check tech map first
  const mappedName = techMap[name] || name;
  
  // Normalize the name
  const formattedName = mappedName ? mappedName.charAt(0).toUpperCase() + mappedName.slice(1) : '';
  
  // Check if the icon exists in Lucide
  const IconComponent = LucideIcons[formattedName] || LucideIcons[mappedName] || LucideIcons.Zap;

  return <IconComponent size={size} className={className} />;
};

export default IconRenderer;
