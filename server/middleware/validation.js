export function validateUserProfile(req, res, next) {
  const { name, age, income_type } = req.body.personal || req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (age !== undefined) {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 16 || numAge > 100) {
      errors.push('Age must be between 16 and 100');
    }
  }

  const validIncomeTypes = ['salaried', 'freelancer', 'business', 'student'];
  if (income_type && !validIncomeTypes.includes(income_type)) {
    errors.push(`Income type must be one of: ${validIncomeTypes.join(', ')}`);
  }

  // Validate finances if present
  const finances = req.body.finances;
  if (finances) {
    if (finances.monthlyIncome !== undefined && Number(finances.monthlyIncome) < 0) {
      errors.push('Monthly income cannot be negative');
    }
    if (finances.monthlyExpenses !== undefined && Number(finances.monthlyExpenses) < 0) {
      errors.push('Monthly expenses cannot be negative');
    }
    if (finances.currentSavings !== undefined && Number(finances.currentSavings) < 0) {
      errors.push('Current savings cannot be negative');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

export function validateGoal(req, res, next) {
  const { title, target_amount, timeline_months } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.push('Goal title must be at least 2 characters');
  }
  if (target_amount !== undefined && Number(target_amount) <= 0) {
    errors.push('Target amount must be positive');
  }
  if (timeline_months !== undefined && (Number(timeline_months) < 1 || Number(timeline_months) > 600)) {
    errors.push('Timeline must be between 1 and 600 months');
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (req.body.priority && !validPriorities.includes(req.body.priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

export function validateExpense(req, res, next) {
  const { category, amount } = req.body;
  const errors = [];

  const validCategories = [
    'housing', 'food', 'transport', 'utilities', 'healthcare',
    'entertainment', 'education', 'shopping', 'insurance', 'emi', 'other'
  ];

  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }
  if (amount === undefined || Number(amount) <= 0) {
    errors.push('Amount must be positive');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}
