import { useState } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel, Button, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Checkbox, FormGroup, FormControlLabel, RadioGroup, Radio, Chip, Alert, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '../context/UserContext.jsx';
import { INCOME_TYPES, RISK_LEVELS, ASSET_CATEGORIES, GOAL_PRESETS, LIFESTYLE_PRIORITIES, COUNTRIES } from '../utils/constants.js';
import { validateProfileStep } from '../services/validationService.js';
import './ProfileSetup.css';

const steps = ['Basic Info', 'Income & Expenses', 'Savings', 'Goals', 'Risk Profile', 'Lifestyle'];
const stepIcons = ['👤', '💰', '🏦', '🎯', '📊', '🌟'];

const defaultGoal = { title: '', target_amount: '', timeline_months: 12, priority: 'medium' };

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile, profile, isOnboarded } = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: profile?.personal?.name || '',
    age: profile?.personal?.age || 25,
    incomeType: profile?.personal?.incomeType || 'salaried',
    country: profile?.personal?.country || 'India',
    currency: profile?.personal?.currency || 'INR',
    monthlyIncome: profile?.finances?.monthlyIncome || '',
    monthlyExpenses: profile?.finances?.monthlyExpenses || '',
    debtEMI: profile?.finances?.debtEMI || 0,
    currentSavings: profile?.finances?.currentSavings || '',
    existingInvestments: profile?.finances?.existingInvestments || 0,
    riskAppetite: profile?.preferences?.riskAppetite || 'medium',
    preferredAssets: profile?.preferences?.preferredAssets || [],
    lifestylePriority: profile?.preferences?.lifestylePriority || 'balance',
  });

  const [goals, setGoals] = useState(profile?.goals?.map(g => ({
    title: g.title, target_amount: g.targetAmount, timeline_months: g.timelineMonths, priority: g.priority
  })) || [{ ...defaultGoal }]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleCountryChange = (country) => {
    const c = COUNTRIES.find(ct => ct.value === country);
    setFormData(prev => ({ ...prev, country, currency: c?.currency || 'INR' }));
  };

  const addGoal = () => setGoals(prev => [...prev, { ...defaultGoal }]);
  const removeGoal = (i) => setGoals(prev => prev.filter((_, idx) => idx !== i));
  const updateGoal = (i, field, value) => {
    setGoals(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: value } : g));
  };

  const handleNext = () => {
    const validation = validateProfileStep(activeStep, formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        personal: {
          name: formData.name,
          age: Number(formData.age),
          incomeType: formData.incomeType,
          country: formData.country,
          currency: formData.currency,
        },
        finances: {
          monthlyIncome: Number(formData.monthlyIncome) || 0,
          monthlyExpenses: Number(formData.monthlyExpenses) || 0,
          currentSavings: Number(formData.currentSavings) || 0,
          existingInvestments: Number(formData.existingInvestments) || 0,
          debtEMI: Number(formData.debtEMI) || 0,
        },
        goals: goals.filter(g => g.title && g.target_amount).map(g => ({
          title: g.title,
          target_amount: Number(g.target_amount),
          timeline_months: Number(g.timeline_months),
          priority: g.priority,
        })),
        preferences: {
          riskAppetite: formData.riskAppetite,
          preferredAssets: formData.preferredAssets,
          lifestylePriority: formData.lifestylePriority,
        },
      };

      // Always send standardized 'payload' to the update endpoint
      await updateProfile(payload);
      
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleAsset = (val) => {
    setFormData(prev => ({
      ...prev,
      preferredAssets: prev.preferredAssets.includes(val)
        ? prev.preferredAssets.filter(a => a !== val)
        : [...prev.preferredAssets, val],
    }));
  };

  const currencySymbol = COUNTRIES.find(c => c.value === formData.country)?.symbol || '₹';

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={3} fontWeight={600}>Tell us about yourself</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name" value={formData.name} onChange={e => updateField('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Age" type="number" value={formData.age} onChange={e => updateField('age', Number(e.target.value))} error={!!errors.age} helperText={errors.age} inputProps={{ min: 16, max: 100 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Income Type</InputLabel>
                  <Select value={formData.incomeType} onChange={e => updateField('incomeType', e.target.value)} label="Income Type">
                    {INCOME_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select value={formData.country} onChange={e => handleCountryChange(e.target.value)} label="Country">
                    {COUNTRIES.map(c => <MenuItem key={c.value} value={c.value}>{c.value} ({c.symbol})</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={3} fontWeight={600}>Your Income & Expenses</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={`Monthly Income (${currencySymbol})`} type="number" value={formData.monthlyIncome} onChange={e => updateField('monthlyIncome', e.target.value)} error={!!errors.monthlyIncome} helperText={errors.monthlyIncome} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={`Monthly Expenses (${currencySymbol})`} type="number" value={formData.monthlyExpenses} onChange={e => updateField('monthlyExpenses', e.target.value)} error={!!errors.monthlyExpenses} helperText={errors.monthlyExpenses} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label={`Debt / EMI per month (${currencySymbol})`} type="number" value={formData.debtEMI} onChange={e => updateField('debtEMI', e.target.value)} error={!!errors.debtEMI} helperText={errors.debtEMI || 'Enter 0 if no loans'} />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={3} fontWeight={600}>Your Savings & Investments</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={`Current Savings (${currencySymbol})`} type="number" value={formData.currentSavings} onChange={e => updateField('currentSavings', e.target.value)} error={!!errors.currentSavings} helperText={errors.currentSavings || 'Total liquid savings'} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={`Existing Investments (${currencySymbol})`} type="number" value={formData.existingInvestments} onChange={e => updateField('existingInvestments', e.target.value)} helperText="Stocks, MF, FD, Gold etc." />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={1} fontWeight={600}>Your Financial Goals</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Add the goals you're saving for</Typography>
            {goals.map((goal, i) => (
              <Box key={i} className="goal-row">
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Goal</InputLabel>
                      <Select value={goal.title} onChange={e => updateGoal(i, 'title', e.target.value)} label="Goal">
                        {GOAL_PRESETS.map(g => <MenuItem key={g.value} value={g.label}>{g.icon} {g.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth size="small" label={`Amount (${currencySymbol})`} type="number" value={goal.target_amount} onChange={e => updateGoal(i, 'target_amount', e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth size="small" label="Months" type="number" value={goal.timeline_months} onChange={e => updateGoal(i, 'timeline_months', Number(e.target.value))} inputProps={{ min: 1 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <IconButton color="error" onClick={() => removeGoal(i)} disabled={goals.length <= 1}><DeleteIcon /></IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addGoal} sx={{ mt: 1 }}>Add Goal</Button>
          </Box>
        );

      case 4:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={3} fontWeight={600}>Your Risk Profile</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>How much investment risk are you comfortable with?</Typography>
            <Box className="risk-slider-wrap">
              <Slider
                value={RISK_LEVELS.findIndex(r => r.value === formData.riskAppetite)}
                onChange={(_, v) => updateField('riskAppetite', RISK_LEVELS[v].value)}
                step={1} min={0} max={2}
                marks={RISK_LEVELS.map((r, i) => ({ value: i, label: r.label }))}
                sx={{ maxWidth: 400, mx: 'auto', display: 'block' }}
              />
            </Box>
            <Box className="risk-description" sx={{ mt: 3, textAlign: 'center' }}>
              <Chip label={RISK_LEVELS.find(r => r.value === formData.riskAppetite)?.label} color="primary" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {RISK_LEVELS.find(r => r.value === formData.riskAppetite)?.description}
              </Typography>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box className="step-content">
            <Typography variant="h5" mb={3} fontWeight={600}>Lifestyle & Preferences</Typography>

            <Typography variant="subtitle2" mb={2} color="text.secondary">Preferred Investment Types</Typography>
            <Box className="asset-chips" sx={{ mb: 4 }}>
              {ASSET_CATEGORIES.map(a => (
                <Chip
                  key={a.value}
                  label={a.label}
                  onClick={() => toggleAsset(a.value)}
                  color={formData.preferredAssets.includes(a.value) ? 'primary' : 'default'}
                  variant={formData.preferredAssets.includes(a.value) ? 'filled' : 'outlined'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" mb={2} color="text.secondary">Lifestyle Priority</Typography>
            <RadioGroup value={formData.lifestylePriority} onChange={e => updateField('lifestylePriority', e.target.value)}>
              {LIFESTYLE_PRIORITIES.map(lp => (
                <FormControlLabel key={lp.value} value={lp.value} control={<Radio />}
                  label={<Box><Typography variant="body1">{lp.label}</Typography><Typography variant="caption" color="text.secondary">{lp.description}</Typography></Box>}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </Box>
        );

      default: return null;
    }
  };

  return (
    <Box className="profile-setup-page page-container">
      <Container maxWidth="md">
        <Box className="setup-header" mb={4}>
          <Box className="setup-icon">{stepIcons[activeStep]}</Box>
          <Typography variant="h4" fontWeight={700}>
            {isOnboarded ? '✏️ Update' : '🚀 Set Up'} Your Financial Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Complete these steps for personalized AI-powered financial insights
          </Typography>
          <Box className="step-progress">
            <Typography variant="caption" fontWeight={600} color="primary">
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              — {Math.round(((activeStep + 1) / steps.length) * 100)}% complete
            </Typography>
          </Box>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel className="setup-stepper">
          {steps.map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box className="setup-form-container">
          {errors.submit && <Alert severity="error" sx={{ mb: 3 }}>{errors.submit}</Alert>}

          {renderStep()}

          <Box className="setup-actions">
            <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
              Back
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} endIcon={<ArrowForwardIcon />} variant="contained">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} endIcon={<CheckCircleIcon />} variant="contained" disabled={saving}>
                {saving ? 'Saving...' : isOnboarded ? 'Update Profile' : 'Complete Setup'}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
