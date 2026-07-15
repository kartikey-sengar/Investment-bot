import { getDb, saveDatabase } from '../database.js';
import crypto from 'crypto';

export const insightsCacheModel = {
  generateHash(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  },

  get(userId, promptHash) {
    const db = getDb();
    const stmt = db.prepare(
      `SELECT * FROM ai_insights_cache 
       WHERE user_id = ? AND prompt_hash = ? AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`
    );
    stmt.bind([userId, promptHash]);
    const row = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();

    if (row) {
      try {
        return JSON.parse(row.response);
      } catch {
        return null;
      }
    }
    return null;
  },

  set(userId, promptHash, response, ttlHours = 6) {
    const db = getDb();
    db.run(
      `INSERT INTO ai_insights_cache (user_id, prompt_hash, response, expires_at)
       VALUES (?, ?, ?, datetime('now', '+' || ? || ' hours'))`,
      [userId, promptHash, JSON.stringify(response), ttlHours]
    );
    saveDatabase();
  },

  clearExpired() {
    const db = getDb();
    db.run(`DELETE FROM ai_insights_cache WHERE expires_at < datetime('now')`);
    saveDatabase();
  },

  clearForUser(userId) {
    const db = getDb();
    db.run(`DELETE FROM ai_insights_cache WHERE user_id = ?`, [userId]);
    saveDatabase();
  },
};
