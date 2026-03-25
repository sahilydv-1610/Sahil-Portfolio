import jwt from 'jsonwebtoken';
import * as jsonDb from '../utils/jsonDb.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await jsonDb.findOne('users', { username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ token: generateToken(user._id), username: user.username });
  } catch (err) {

    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ username: req.user.username, id: req.user._id });
};

