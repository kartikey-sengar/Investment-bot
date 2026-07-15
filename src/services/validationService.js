export function validateProfileStep(step, data) {
  const errors = {};

  switch (step) {
    case 0: // Basic Info
      if (!data.name || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
      if (!data.age || data.age < 16 || data.age > 100) errors.age = 'Age must be between 16 and 100';
      if (!data.incomeType) errors.incomeType = 'Please select income type';
      if (!data.country) errors.country = 'Please select country';
      break;

    case 1: // Salary & Expenses
      if (!data.monthlyIncome || data.monthlyIncome <= 0) errors.monthlyIncome = 'Income must be positive';
      if (data.monthlyExpenses < 0) errors.monthlyExpenses = 'Expenses cannot be negative';
      if (data.monthlyExpenses >= data.monthlyIncome) errors.monthlyExpenses = 'Expenses should be less than income';
      if (data.debtEMI < 0) errors.debtEMI = 'EMI cannot be negative';
      if (data.debtEMI > data.monthlyIncome * 0.5) errors.debtEMI = 'EMI exceeds 50% of income — very risky';
      break;

    case 2: // Savings & Investments
      if (data.currentSavings < 0) errors.currentSavings = 'Savings cannot be negative';
      if (data.existingInvestments < 0) errors.existingInvestments = 'Investments cannot be negative';
      break;

    case 3: // Goals
      // Goals are optional but validate if present
      break;

    case 4: // Risk Appetite
      if (!data.riskAppetite) errors.riskAppetite = 'Please select your risk tolerance';
      break;

    case 5: // Lifestyle
      if (!data.lifestylePriority) errors.lifestylePriority = 'Please select lifestyle priority';
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateGoal(data) {
  const errors = {};
  if (!data.title || data.title.trim().length < 2) errors.title = 'Title must be at least 2 characters';
  if (!data.target_amount || data.target_amount <= 0) errors.target_amount = 'Amount must be positive';
  if (!data.timeline_months || data.timeline_months < 1) errors.timeline_months = 'Timeline must be at least 1 month';
  if (data.timeline_months > 600) errors.timeline_months = 'Timeline cannot exceed 50 years';
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateExpense(data) {
  const errors = {};
  if (!data.category) errors.category = 'Category is required';
  if (!data.amount || data.amount <= 0) errors.amount = 'Amount must be positive';
  return { isValid: Object.keys(errors).length === 0, errors };
}
