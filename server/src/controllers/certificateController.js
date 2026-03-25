import Certificate from '../models/Certificate.js';

export const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getFeaturedCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ featured: true }).sort({ order: 1 }).limit(3);
    res.json(certs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, date, description, credentialUrl, featured, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const cert = await Certificate.create({ title, issuer, date, description, credentialUrl, featured, order, image });
    res.status(201).json(cert);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateCertificate = async (req, res) => {
  try {
    const { title, issuer, date, description, credentialUrl, featured, order, existingImage } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : (existingImage || '');
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { title, issuer, date, description, credentialUrl, featured, order, image },
      { new: true, runValidators: true }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
