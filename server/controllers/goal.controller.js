import { goalModel } from '../db/models/goalModel.js';

export const goalController = {
  async create(req, res) {
    try {
      const goal = goalModel.create(req.params.userId, req.body);
      res.status(201).json({ success: true, data: goal });
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ success: false, message: 'Failed to create goal' });
    }
  },

  async list(req, res) {
    try {
      const goals = goalModel.getByUser(req.params.userId);
      res.json({ success: true, data: goals });
    } catch (error) {
      console.error('List goals error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch goals' });
    }
  },

  async update(req, res) {
    try {
      const existing = goalModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Goal not found' });
      }
      const goal = goalModel.update(req.params.id, req.body);
      res.json({ success: true, data: goal });
    } catch (error) {
      console.error('Update goal error:', error);
      res.status(500).json({ success: false, message: 'Failed to update goal' });
    }
  },

  async remove(req, res) {
    try {
      const existing = goalModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Goal not found' });
      }
      goalModel.delete(req.params.id);
      res.json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Delete goal error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete goal' });
    }
  },
};
