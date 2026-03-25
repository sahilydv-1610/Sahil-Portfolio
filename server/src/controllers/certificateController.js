import * as jsonDb from '../utils/jsonDb.js';

export const getCertificates = async (req, res) => {
  try {
    const certs = await jsonDb.read('certificates');
    certs.sort((a, b) => (a.order - b.order) || (new Date(b.createdAt) - new Date(a.createdAt)));
    res.json(certs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getFeaturedCertificates = async (req, res) => {
  try {
    const certs = await jsonDb.find('certificates', { featured: true });
    certs.sort((a, b) => (a.order - b.order));
    res.json(certs.slice(0, 3));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, date, description, credentialUrl, featured, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const cert = await jsonDb.create('certificates', { title, issuer, date, description, credentialUrl, featured: featured === 'true' || featured === true, order: Number(order || 0), image });
    res.status(201).json(cert);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateCertificate = async (req, res) => {
  try {
    const { title, issuer, date, description, credentialUrl, featured, order, existingImage } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : (existingImage || '');
    const updateData = { title, issuer, date, description, credentialUrl, featured: featured === 'true' || featured === true, order: Number(order || 0), image };
    const cert = await jsonDb.findByIdAndUpdate('certificates', req.params.id, updateData);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await jsonDb.findByIdAndDelete('certificates', req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

