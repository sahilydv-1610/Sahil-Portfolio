import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, upload.single('coverImage'), createBlog);

router.get('/slug/:slug', getBlogBySlug);

router.route('/:id')
  .put(protect, upload.single('coverImage'), updateBlog)
  .delete(protect, deleteBlog);

export default router;
