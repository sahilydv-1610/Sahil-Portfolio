import express from 'express';
import { getProjects, getFeaturedProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);
router.post('/', protect, upload.array('images', 10), createProject);
router.put('/:id', protect, upload.array('images', 10), updateProject);
router.delete('/:id', protect, deleteProject);
export default router;
