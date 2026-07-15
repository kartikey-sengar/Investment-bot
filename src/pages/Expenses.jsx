import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser } from '../context/UserContext.jsx';
import { expenseAPI, aiAPI } from '../services/api.js';
import { EXPENSE_CATEGORIES } from '../utils/constants.js';
import { formatCurrency } from '../utils/formatters.js';
import Loader from '../components/common/Loader.jsx';
import './Expenses.css';

export default function Expenses() {
  const { userId, profile, isOnboarded } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: '', amount: '', description: '', recurring: false });
  const [adding, setAdding] = useState(false);
  const [aiCatLoading, setAiCatLoading] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const currency = profile?.personal?.currency || 'INR';

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [expRes, sumRes] = await Promise.all([expenseAPI.list(userId), expenseAPI.summary(userId)]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!form.category || !form.amount) return;
    setAdding(true);
    try {
      await expenseAPI.create(userId, { ...form, amount: Number(form.amount) });
      setForm({ category: '', amount: '', description: '', recurring: false });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    try { await expenseAPI.delete(id); fetchData(); } catch (err) { console.error(err); }
  };

  // ALL hooks MUST be before any early returns (React Rules of Hooks)
  const totalSpending = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const filteredExpenses = useMemo(() => {
    if (filterCat === 'all') return expenses;
    return expenses.filter(e => e.category === filterCat);
  }, [expenses, filterCat]);
  const chartData = useMemo(() => summary.map(s => {
    const cat = EXPENSE_CATEGORIES.find(c => c.value === s.category);
    return { name: cat?.label || s.category, value: s.total, color: cat?.color || '#64748b' };
  }), [summary]);

  const handleAICategorize = async () => {
    if (!form.description?.trim()) return;
    setAiCatLoading(true);
    try {
      const res = await aiAPI.chat(`Categorize this expense in one word from these categories: ${EXPENSE_CATEGORIES.map(c => c.value).join(', ')}. Expense description: "${form.description}". Reply ONLY with the category value, nothing else.`, userId, null);
      const answer = res.data.answer.trim().toLowerCase();
      const match = EXPENSE_CATEGORIES.find(c => answer.includes(c.value));
      if (match) setForm(f => ({ ...f, category: match.value }));
    } catch (e) { console.error(e); }
    finally { setAiCatLoading(false); }
  };

  if (!isOnboarded) return <Box className="page-container" py={8} textAlign="center"><Typography>Set up your profile first</Typography></Box>;
  if (loading) return <Loader variant="skeleton" />;

  return (
    <Box className="expenses-page page-container">
      <Box className="page-header">
        <Typography variant="h4" fontWeight={700}>💳 Expense Tracker</Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>Track and categorize your spending</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Add Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Add Expense</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} label="Category">
                    {EXPENSE_CATEGORIES.map(c => <MenuItem key={c.value} value={c.value}>{c.icon} {c.label}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField size="small" label={`Amount (${currency})`} type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                <TextField size="small" label="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                {form.description?.trim() && (
                  <Button size="small" variant="outlined" startIcon={aiCatLoading ? <CircularProgress size={14} /> : <AutoFixHighIcon />} onClick={handleAICategorize} disabled={aiCatLoading}>
                    {aiCatLoading ? 'AI Thinking...' : 'AI Auto-Categorize'}
                  </Button>
                )}
                <FormControlLabel control={<Switch checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))} size="small" />} label={<Typography variant="body2" color="text.secondary">Recurring Monthly</Typography>} />
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={adding || !form.category || !form.amount}>
                  {adding ? 'Adding...' : 'Add Expense'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          {chartData.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Category Breakdown</Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                        {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e2744', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                        formatter={(v) => formatCurrency(v, currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                {chartData.map(item => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" sx={{ flex: 1 }}>{item.name}</Typography>
                    <Typography variant="caption" fontWeight={600}>{formatCurrency(item.value, currency)}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Expenses Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Total Spending Summary */}
          <Card sx={{ mb: 2, background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.15)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">TOTAL SPENDING THIS MONTH</Typography>
              <Typography variant="h5" fontWeight={800} color="warning.main">{formatCurrency(totalSpending, currency)}</Typography>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All" onClick={() => setFilterCat('all')} variant={filterCat === 'all' ? 'filled' : 'outlined'} color={filterCat === 'all' ? 'primary' : 'default'} size="small" />
            {EXPENSE_CATEGORIES.map(c => (
              <Chip key={c.value} label={`${c.icon} ${c.label}`} onClick={() => setFilterCat(c.value)} variant={filterCat === c.value ? 'filled' : 'outlined'} color={filterCat === c.value ? 'primary' : 'default'} size="small" />
            ))}
          </Box>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Recent Expenses ({expenses.length})</Typography>
              {expenses.length === 0 ? (
                <Typography color="text.secondary" py={4} textAlign="center">No expenses recorded yet</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredExpenses.slice(0, 25).map(exp => {
                        const cat = EXPENSE_CATEGORIES.find(c => c.value === exp.category);
                        return (
                          <TableRow key={exp.id} hover>
                            <TableCell><Chip label={`${cat?.icon || ''} ${cat?.label || exp.category}`} size="small" sx={{ bgcolor: `${cat?.color}15`, color: cat?.color, border: `1px solid ${cat?.color}30` }} /></TableCell>
                            <TableCell>{exp.description || '—'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(exp.amount, currency)}</TableCell>
                            <TableCell align="right"><IconButton size="small" color="error" onClick={() => handleDelete(exp.id)}><DeleteIcon fontSize="small" /></IconButton></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
