import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getProfile);
router.put('/', protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cvFile', maxCount: 1 }]), updateProfile);
export default router;
