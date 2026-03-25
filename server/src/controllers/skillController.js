import * as jsonDb from '../utils/jsonDb.js';

export const getSkills = async (req, res) => {
  try {
    const skills = await jsonDb.read('skills');
    skills.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const skill = await jsonDb.create('skills', req.body);
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await jsonDb.findByIdAndUpdate('skills', req.params.id, req.body);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await jsonDb.findByIdAndDelete('skills', req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

