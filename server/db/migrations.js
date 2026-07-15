import { getDb, saveDatabase } from './database.js';

export function runMigrations() {
  const db = getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL DEFAULT 25,
      income_type TEXT NOT NULL DEFAULT 'salaried',
      country TEXT NOT NULL DEFAULT 'India',
      currency TEXT NOT NULL DEFAULT 'INR',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS finances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      monthly_income REAL NOT NULL DEFAULT 0,
      monthly_expenses REAL NOT NULL DEFAULT 0,
      current_savings REAL NOT NULL DEFAULT 0,
      existing_investments REAL NOT NULL DEFAULT 0,
      debt_emi REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      target_amount REAL NOT NULL DEFAULT 0,
      timeline_months INTEGER NOT NULL DEFAULT 12,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'active',
      current_amount REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      risk_appetite TEXT NOT NULL DEFAULT 'medium',
      preferred_assets TEXT NOT NULL DEFAULT '[]',
      lifestyle_priority TEXT NOT NULL DEFAULT 'balance',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      description TEXT,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ai_insights_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      prompt_hash TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Add auth columns to existing users table (will fail silently if columns already exist)
  try {
    db.exec(`
      ALTER TABLE users ADD COLUMN email TEXT;
      ALTER TABLE users ADD COLUMN password TEXT;
    `);
  } catch (_err) {
    // Columns likely already exist
  }

  // Create indexes for performance and uniqueness
  db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_expenses_month ON expenses(user_id, year, month);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_cache_user ON ai_insights_cache(user_id, prompt_hash);`);

  saveDatabase();
  console.log('✅ Database migrations completed successfully');
}
