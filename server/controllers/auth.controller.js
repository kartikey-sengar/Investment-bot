import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../db/models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'finpilot_super_secret_dev_key_2026';

export const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }

      const existingUser = userModel.getByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const profile = userModel.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: profile.id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({ success: true, token, data: profile });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = userModel.getByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (!user.password) {
        return res.status(401).json({ success: false, message: 'Account exists but is missing a password (legacy account)' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      const profile = userModel.getFullProfile(user.id);

      res.json({ success: true, token, data: profile });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  },

  async validate(req, res) {
    try {
      const profile = userModel.getFullProfile(req.userId);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: profile });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ success: false, message: 'Validation failed' });
    }
  }
};
