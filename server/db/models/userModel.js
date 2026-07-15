import { getDb, saveDatabase } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export const userModel = {
  create(data) {
    const db = getDb();
    const id = uuidv4();
    const { name, email, password, age, income_type, country, currency } = data;

    db.run(
      `INSERT INTO users (id, email, password, name, age, income_type, country, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, email || null, password || null, name || 'User', age || 25, income_type || 'salaried', country || 'India', currency || 'INR']
    );

    // Create related records
    if (data.finances) {
      const f = data.finances;
      db.run(
        `INSERT INTO finances (user_id, monthly_income, monthly_expenses, current_savings, existing_investments, debt_emi)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, f.monthly_income || 0, f.monthly_expenses || 0, f.current_savings || 0, f.existing_investments || 0, f.debt_emi || 0]
      );
    } else {
      db.run(`INSERT INTO finances (user_id) VALUES (?)`, [id]);
    }

    if (data.preferences) {
      const p = data.preferences;
      db.run(
        `INSERT INTO preferences (user_id, risk_appetite, preferred_assets, lifestyle_priority)
         VALUES (?, ?, ?, ?)`,
        [id, p.risk_appetite || 'medium', JSON.stringify(p.preferred_assets || []), p.lifestyle_priority || 'balance']
      );
    } else {
      db.run(`INSERT INTO preferences (user_id) VALUES (?)`, [id]);
    }

    // Create goals if provided
    if (data.goals && Array.isArray(data.goals)) {
      for (const goal of data.goals) {
        const goalId = uuidv4();
        db.run(
          `INSERT INTO goals (id, user_id, title, target_amount, timeline_months, priority)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [goalId, id, goal.title, goal.target_amount || 0, goal.timeline_months || 12, goal.priority || 'medium']
        );
      }
    }

    saveDatabase();
    return this.getFullProfile(id);
  },

  getById(id) {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  },

  getByEmail(email) {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    stmt.bind([email]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  },

  getFullProfile(id) {
    const db = getDb();
    
    // Get user
    let stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    stmt.bind([id]);
    if (!stmt.step()) {
      stmt.free();
      return null;
    }
    const user = stmt.getAsObject();
    stmt.free();

    // Get finances
    stmt = db.prepare(`SELECT * FROM finances WHERE user_id = ?`);
    stmt.bind([id]);
    const finances = stmt.step() ? stmt.getAsObject() : {};
    stmt.free();

    // Get preferences
    stmt = db.prepare(`SELECT * FROM preferences WHERE user_id = ?`);
    stmt.bind([id]);
    let preferences = stmt.step() ? stmt.getAsObject() : {};
    stmt.free();
    if (preferences.preferred_assets) {
      try { preferences.preferred_assets = JSON.parse(preferences.preferred_assets); } catch (_e) { preferences.preferred_assets = []; }
    }

    // Get goals
    stmt = db.prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC`);
    stmt.bind([id]);
    const goals = [];
    while (stmt.step()) {
      goals.push(stmt.getAsObject());
    }
    stmt.free();

    return {
      id: user.id,
      personal: {
        name: user.name,
        email: user.email,
        age: user.age,
        incomeType: user.income_type,
        country: user.country,
        currency: user.currency,
      },
      finances: {
        monthlyIncome: finances.monthly_income || 0,
        monthlyExpenses: finances.monthly_expenses || 0,
        currentSavings: finances.current_savings || 0,
        existingInvestments: finances.existing_investments || 0,
        debtEMI: finances.debt_emi || 0,
      },
      goals: goals.map(g => ({
        id: g.id,
        title: g.title,
        targetAmount: g.target_amount,
        timelineMonths: g.timeline_months,
        priority: g.priority,
        status: g.status,
        currentAmount: g.current_amount,
      })),
      preferences: {
        riskAppetite: preferences.risk_appetite || 'medium',
        preferredAssets: preferences.preferred_assets || [],
        lifestylePriority: preferences.lifestyle_priority || 'balance',
      },
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },

  update(id, data) {
    const db = getDb();

    // Update user table
    if (data.personal) {
      const p = data.personal;
      const fields = [];
      const values = [];
      if (p.name !== undefined) { fields.push('name = ?'); values.push(p.name); }
      if (p.age !== undefined) { fields.push('age = ?'); values.push(p.age); }
      if (p.incomeType !== undefined) { fields.push('income_type = ?'); values.push(p.incomeType); }
      if (p.country !== undefined) { fields.push('country = ?'); values.push(p.country); }
      if (p.currency !== undefined) { fields.push('currency = ?'); values.push(p.currency); }
      if (fields.length > 0) {
        fields.push("updated_at = datetime('now')");
        values.push(id);
        db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      }
    }

    // Update finances
    if (data.finances) {
      const f = data.finances;
      db.run(
        `INSERT INTO finances (user_id, monthly_income, monthly_expenses, current_savings, existing_investments, debt_emi, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           monthly_income = excluded.monthly_income,
           monthly_expenses = excluded.monthly_expenses,
           current_savings = excluded.current_savings,
           existing_investments = excluded.existing_investments,
           debt_emi = excluded.debt_emi,
           updated_at = excluded.updated_at`,
        [id, f.monthlyIncome || 0, f.monthlyExpenses || 0, f.currentSavings || 0, f.existingInvestments || 0, f.debtEMI || 0]
      );
    }

    // Update preferences
    if (data.preferences) {
      const pr = data.preferences;
      db.run(
        `INSERT INTO preferences (user_id, risk_appetite, preferred_assets, lifestyle_priority, updated_at)
         VALUES (?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           risk_appetite = excluded.risk_appetite,
           preferred_assets = excluded.preferred_assets,
           lifestyle_priority = excluded.lifestyle_priority,
           updated_at = excluded.updated_at`,
        [id, pr.riskAppetite || 'medium', JSON.stringify(pr.preferredAssets || []), pr.lifestylePriority || 'balance']
      );
    }

    saveDatabase();
    return this.getFullProfile(id);
  },

  delete(id) {
    const db = getDb();
    db.run(`DELETE FROM users WHERE id = ?`, [id]);
    saveDatabase();
    return true;
  },

  list() {
    const db = getDb();
    const stmt = db.prepare(`SELECT id, name, age, income_type, country, currency, created_at FROM users ORDER BY created_at DESC`);
    const users = [];
    while (stmt.step()) {
      users.push(stmt.getAsObject());
    }
    stmt.free();
    return users;
  },
};
