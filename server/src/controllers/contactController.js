import * as jsonDb from '../utils/jsonDb.js';

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const msg = await jsonDb.create('messages', { name, email, message, read: false });
    res.status(201).json({ message: 'Message sent successfully', data: msg });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await jsonDb.read('messages');
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(messages);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markAsRead = async (req, res) => {
  try {
    const msg = await jsonDb.findByIdAndUpdate('messages', req.params.id, { read: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteMessage = async (req, res) => {
  try {
    await jsonDb.findByIdAndDelete('messages', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

