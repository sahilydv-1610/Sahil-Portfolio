import Blog from '../models/Blog.js';
import fs from 'fs';
import path from 'path';

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
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

    const blog = await Blog.create({ title, slug, content, excerpt, tags: parsedTags, readTime, published, featured, coverImage });
    res.status(201).json(blog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    Object.assign(blog, req.body);
    
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try { blog.tags = JSON.parse(req.body.tags); } 
        catch { blog.tags = req.body.tags.split(',').map(t => t.trim()); }
      } else { blog.tags = req.body.tags; }
    }

    if (req.file) {
      // Remove old image
      if (blog.coverImage) {
        const oldPath = path.join(process.cwd(), blog.coverImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      blog.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      blog.coverImage = req.body.existingImage;
    }

    await blog.save();
    res.json(blog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    if (blog.coverImage) {
      const imgPath = path.join(process.cwd(), blog.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
