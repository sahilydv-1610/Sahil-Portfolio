import * as jsonDb from '../utils/jsonDb.js';
import fs from 'fs';
import path from 'path';

export const getBlogs = async (req, res) => {
  try {
    const blogs = await jsonDb.read('blogs');
    blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await jsonDb.findOne('blogs', { slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags, readTime, published, featured } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : '';
    
    // Parse tags array
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try { parsedTags = JSON.parse(tags); } 
        catch { parsedTags = tags.split(',').map(t => t.trim()); }
      } else { parsedTags = tags; }
    }

    const blog = await jsonDb.create('blogs', { title, slug, content, excerpt, tags: parsedTags, readTime, published, featured, coverImage });
    res.status(201).json(blog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await jsonDb.findOne('blogs', { _id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const updateData = { ...req.body };
    
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try { updateData.tags = JSON.parse(req.body.tags); } 
        catch { updateData.tags = req.body.tags.split(',').map(t => t.trim()); }
      } else { updateData.tags = req.body.tags; }
    }

    if (req.file) {
      // Remove old image
      if (blog.coverImage) {
        const oldPath = path.join(process.cwd(), blog.coverImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      updateData.coverImage = req.body.existingImage;
    }

    const updatedBlog = await jsonDb.findByIdAndUpdate('blogs', req.params.id, updateData);
    res.json(updatedBlog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await jsonDb.findOne('blogs', { _id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    if (blog.coverImage) {
      const imgPath = path.join(process.cwd(), blog.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    
    await jsonDb.findByIdAndDelete('blogs', req.params.id);
    res.json({ message: 'Blog removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

