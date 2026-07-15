import { expenseModel } from '../db/models/expenseModel.js';

export const expenseController = {
  async create(req, res) {
    try {
      const expense = expenseModel.create(req.params.userId, req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({ success: false, message: 'Failed to create expense' });
    }
  },

  async list(req, res) {
    try {
      const { month, year } = req.query;
      const expenses = expenseModel.getByUser(
        req.params.userId,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json({ success: true, data: expenses });
    } catch (error) {
      console.error('List expenses error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch expenses' });
    }
  },

  async summary(req, res) {
    try {
      const summary = expenseModel.getSummary(req.params.userId);
      res.json({ success: true, data: summary });
    } catch (error) {
      console.error('Expense summary error:', error);
      res.status(500).json({ success: false, message: 'Failed to get expense summary' });
    }
  },

  async remove(req, res) {
    try {
      const existing = expenseModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      expenseModel.delete(req.params.id);
      res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Delete expense error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete expense' });
    }
  },
};
