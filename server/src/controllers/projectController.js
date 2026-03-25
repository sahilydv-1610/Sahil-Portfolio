import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 }).limit(3);
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, featured, order } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const tech = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack || [];
    const project = await Project.create({ title, description, images, techStack: tech, githubLink, liveLink, featured, order });
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, featured, order, existingImages } = req.body;
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const existing = typeof existingImages === 'string' ? JSON.parse(existingImages || '[]') : existingImages || [];
    const tech = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack || [];
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, images: [...existing, ...newImages], techStack: tech, githubLink, liveLink, featured, order },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
