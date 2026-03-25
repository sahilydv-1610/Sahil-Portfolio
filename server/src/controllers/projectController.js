import * as jsonDb from '../utils/jsonDb.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await jsonDb.read('projects');
    projects.sort((a, b) => (a.order - b.order) || (new Date(b.createdAt) - new Date(a.createdAt)));
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await jsonDb.find('projects', { featured: true });
    projects.sort((a, b) => (a.order - b.order));
    res.json(projects.slice(0, 3));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await jsonDb.findOne('projects', { _id: req.params.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, featured, order } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const tech = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack || [];
    const project = await jsonDb.create('projects', { title, description, images, techStack: tech, githubLink, liveLink, featured, order: Number(order || 0) });
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, featured, order, existingImages } = req.body;
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const existing = typeof existingImages === 'string' ? JSON.parse(existingImages || '[]') : existingImages || [];
    const tech = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack || [];
    
    const updateData = { title, description, images: [...existing, ...newImages], techStack: tech, githubLink, liveLink, featured: featured === 'true' || featured === true, order: Number(order || 0) };
    const project = await jsonDb.findByIdAndUpdate('projects', req.params.id, updateData);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await jsonDb.findByIdAndDelete('projects', req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

