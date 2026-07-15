import { getDb, saveDatabase } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export const expenseModel = {
  create(userId, data) {
    const db = getDb();
    const id = uuidv4();
    const { category, amount, description, month, year } = data;

    const now = new Date();
    db.run(
      `INSERT INTO expenses (id, user_id, category, amount, description, month, year)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, category, amount || 0, description || '', month || now.getMonth() + 1, year || now.getFullYear()]
    );

    saveDatabase();
    return this.getById(id);
  },

  getById(id) {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM expenses WHERE id = ?`);
    stmt.bind([id]);
    const e = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    if (e) {
      return {
        id: e.id,
        userId: e.user_id,
        category: e.category,
        amount: e.amount,
        description: e.description,
        month: e.month,
        year: e.year,
        createdAt: e.created_at,
      };
    }
    return null;
  },

  getByUser(userId, month, year) {
    const db = getDb();
    let sql = `SELECT * FROM expenses WHERE user_id = ?`;
    const params = [userId];

    if (month) { sql += ` AND month = ?`; params.push(month); }
    if (year) { sql += ` AND year = ?`; params.push(year); }

    sql += ` ORDER BY created_at DESC`;

    const stmt = db.prepare(sql);
    stmt.bind(params);
    const expenses = [];
    while (stmt.step()) {
      const e = stmt.getAsObject();
      expenses.push({
        id: e.id,
        userId: e.user_id,
        category: e.category,
        amount: e.amount,
        description: e.description,
        month: e.month,
        year: e.year,
        createdAt: e.created_at,
      });
    }
    stmt.free();
    return expenses;
  },

  getSummary(userId) {
    const db = getDb();
    const stmt = db.prepare(
      `SELECT category, SUM(amount) as total, COUNT(*) as count
       FROM expenses WHERE user_id = ?
       GROUP BY category ORDER BY total DESC`
    );
    stmt.bind([userId]);
    const summary = [];
    while (stmt.step()) {
      summary.push(stmt.getAsObject());
    }
    stmt.free();
    return summary;
  },

  delete(id) {
    const db = getDb();
    db.run(`DELETE FROM expenses WHERE id = ?`, [id]);
    saveDatabase();
    return true;
  },
};
