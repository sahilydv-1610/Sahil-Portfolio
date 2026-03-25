import jwt from 'jsonwebtoken';
import * as jsonDb from '../utils/jsonDb.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await jsonDb.findOne('users', { _id: decoded.id });
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
    
    // Remove password
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

