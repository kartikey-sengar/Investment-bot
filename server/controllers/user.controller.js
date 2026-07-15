import { userModel } from '../db/models/userModel.js';

export const userController = {
  async create(req, res) {
    try {
      const profile = userModel.create(req.body);
      res.status(201).json({ success: true, data: profile });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Failed to create user profile' });
    }
  },

  async getProfile(req, res) {
    try {
      const profile = userModel.getFullProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: profile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
    }
  },

  async update(req, res) {
    try {
      const existing = userModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const profile = userModel.update(req.params.id, req.body);
      res.json({ success: true, data: profile });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Failed to update user profile' });
    }
  },

  async remove(req, res) {
    try {
      const existing = userModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      userModel.delete(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  },

  async list(req, res) {
    try {
      const users = userModel.list();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ success: false, message: 'Failed to list users' });
    }
  },
};
