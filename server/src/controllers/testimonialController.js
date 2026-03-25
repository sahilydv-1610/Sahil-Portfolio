import * as jsonDb from '../utils/jsonDb.js';
import fs from 'fs';
import path from 'path';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await jsonDb.read('testimonials');
    testimonials.sort((a, b) => (a.order - b.order) || (new Date(b.createdAt) - new Date(a.createdAt)));
    res.json(testimonials);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatar = `/uploads/${req.file.filename}`;
    const testimonial = await jsonDb.create('testimonials', data);
    res.status(201).json(testimonial);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateTestimonial = async (req, res) => {
  try {
    const t = await jsonDb.findOne('testimonials', { _id: req.params.id });
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });

    const updateData = { ...req.body };
    
    if (req.file) {
      if (t.avatar) {
        const oldPath = path.join(process.cwd(), t.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      updateData.avatar = req.body.existingImage;
    }

    const updatedT = await jsonDb.findByIdAndUpdate('testimonials', req.params.id, updateData);
    res.json(updatedT);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const t = await jsonDb.findOne('testimonials', { _id: req.params.id });
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });
    
    if (t.avatar) {
      const imgPath = path.join(process.cwd(), t.avatar);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    
    await jsonDb.findByIdAndDelete('testimonials', req.params.id);
    res.json({ message: 'Testimonial removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

