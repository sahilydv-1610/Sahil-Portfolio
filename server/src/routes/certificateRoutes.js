import express from 'express';
import { getCertificates, getFeaturedCertificates, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getCertificates);
router.get('/featured', getFeaturedCertificates);
router.post('/', protect, upload.single('image'), createCertificate);
router.put('/:id', protect, upload.single('image'), updateCertificate);
router.delete('/:id', protect, deleteCertificate);
export default router;
