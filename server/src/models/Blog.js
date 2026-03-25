import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // Markdown content
  excerpt: { type: String },
  coverImage: { type: String },
  tags: [{ type: String }],
  readTime: { type: Number, default: 5 }, // minutes
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Pre-save to auto-generate slug if not provided, or ensure it is URL safe
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Blog', blogSchema);
