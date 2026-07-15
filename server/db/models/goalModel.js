import { getDb, saveDatabase } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export const goalModel = {
  create(userId, data) {
    const db = getDb();
    const id = uuidv4();
    const { title, target_amount, timeline_months, priority, current_amount } = data;

    db.run(
      `INSERT INTO goals (id, user_id, title, target_amount, timeline_months, priority, current_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, title, target_amount || 0, timeline_months || 12, priority || 'medium', current_amount || 0]
    );

    saveDatabase();
    return this.getById(id);
  },

  getById(id) {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM goals WHERE id = ?`);
    stmt.bind([id]);
    const goal = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    if (goal) {
      return {
        id: goal.id,
        userId: goal.user_id,
        title: goal.title,
        targetAmount: goal.target_amount,
        timelineMonths: goal.timeline_months,
        priority: goal.priority,
        status: goal.status,
        currentAmount: goal.current_amount,
        createdAt: goal.created_at,
      };
    }
    return null;
  },

  getByUser(userId) {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY priority DESC, created_at DESC`);
    stmt.bind([userId]);
    const goals = [];
    while (stmt.step()) {
      const g = stmt.getAsObject();
      goals.push({
        id: g.id,
        userId: g.user_id,
        title: g.title,
        targetAmount: g.target_amount,
        timelineMonths: g.timeline_months,
        priority: g.priority,
        status: g.status,
        currentAmount: g.current_amount,
        createdAt: g.created_at,
      });
    }
    stmt.free();
    return goals;
  },

  update(id, data) {
    const db = getDb();
    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.target_amount !== undefined) { fields.push('target_amount = ?'); values.push(data.target_amount); }
    if (data.timeline_months !== undefined) { fields.push('timeline_months = ?'); values.push(data.timeline_months); }
    if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.current_amount !== undefined) { fields.push('current_amount = ?'); values.push(data.current_amount); }

    if (fields.length === 0) return this.getById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    db.run(`UPDATE goals SET ${fields.join(', ')} WHERE id = ?`, values);
    saveDatabase();
    return this.getById(id);
  },

  delete(id) {
    const db = getDb();
    db.run(`DELETE FROM goals WHERE id = ?`, [id]);
    saveDatabase();
    return true;
  },
};
