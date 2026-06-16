import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { isDatabaseConnected } from '../config/database.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Start MongoDB with: docker compose up -d',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], config.jwt.secret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired, please login again' : 'Invalid token';
    return res.status(401).json({ success: false, message });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], config.jwt.secret);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch { /* ignore */ }
  next();
};
