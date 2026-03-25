import Testimonial from '../models/Testimonial.js';
import fs from 'fs';
import path from 'path';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatar = `/uploads/${req.file.filename}`;
    const testimonial = await Testimonial.create(data);
    res.status(201).json(testimonial);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });

    Object.assign(t, req.body);
    
    if (req.file) {
      if (t.avatar) {
        const oldPath = path.join(process.cwd(), t.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      t.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      t.avatar = req.body.existingImage;
    }

    await t.save();
    res.json(t);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });
    
    if (t.avatar) {
      const imgPath = path.join(process.cwd(), t.avatar);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    
    await t.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
