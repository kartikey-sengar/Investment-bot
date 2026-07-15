import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useUser } from '../../context/UserContext.jsx';
import { expenseAPI } from '../../services/api.js';
import { EXPENSE_CATEGORIES } from '../../utils/constants.js';
import { formatCurrency } from '../../utils/formatters.js';
import Loader from '../common/Loader.jsx';

export default function RecentExpensesWidget() {
  const { userId, profile } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      if (!userId) return;
      try {
        const res = await expenseAPI.list(userId);
        setExpenses(res.data.slice(0, 5)); // Just the 5 most recent
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, [userId]);

  const currency = profile?.personal?.currency || 'INR';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Recent Expenses</Typography>
        
        {loading ? (
          <Loader variant="skeleton" />
        ) : expenses.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No expenses logged yet.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map(exp => {
                  const cat = EXPENSE_CATEGORIES.find(c => c.value === exp.category);
                  return (
                    <TableRow key={exp.id}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip 
                          label={`${cat?.icon || ''} ${cat?.label || exp.category}`} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${cat?.color || '#94a3b8'}15`, 
                            color: cat?.color || '#94a3b8', 
                            border: `1px solid ${cat?.color || '#94a3b8'}30`,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, py: 1.5 }}>
                        {formatCurrency(exp.amount, currency)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
