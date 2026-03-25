import * as jsonDb from '../utils/jsonDb.js';

export const getServices = async (req, res) => {
  try {
    const services = await jsonDb.read('services');
    services.sort((a, b) => (a.order - b.order) || (new Date(a.createdAt) - new Date(b.createdAt)));
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createService = async (req, res) => {
  try {
    const service = await jsonDb.create('services', req.body);
    res.status(201).json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateService = async (req, res) => {
  try {
    const service = await jsonDb.findByIdAndUpdate('services', req.params.id, req.body);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteService = async (req, res) => {
  try {
    const service = await jsonDb.findByIdAndDelete('services', req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

