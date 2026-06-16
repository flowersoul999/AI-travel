import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { isDatabaseConnected } from '../config/database.js';

class AuthService {
  _requireDB() {
    if (!isDatabaseConnected()) throw new AppError('Database not available. Start MongoDB with: docker compose up -d', 503);
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  async register({ username, email, password }) {
    this._requireDB();
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) throw new AppError(`${existing.email === email ? 'Email' : 'Username'} already exists`, 409);
    const user = await User.create({ username, email, password });
    return { token: this.generateToken(user._id), user: user.toJSON() };
  }

  async login({ email, password }) {
    this._requireDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password', 401);
    return { token: this.generateToken(user._id), user: user.toJSON() };
  }

  async getProfile(userId) {
    this._requireDB();
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user.toJSON();
  }

  async updateProfile(userId, updates) {
    this._requireDB();
    const allowed = ['username', 'avatar'];
    const sanitized = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    if (Object.keys(sanitized).length === 0) throw new AppError('No valid fields to update', 400);
    const user = await User.findByIdAndUpdate(userId, sanitized, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found', 404);
    return user.toJSON();
  }
}

export default new AuthService();
