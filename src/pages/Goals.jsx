import React, { useState } from 'react';
import { Box, Container, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';

export default function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 50000, current: 25000, deadline: '2025-12-31', category: 'savings' },
    { id: 2, name: 'Home Down Payment', target: 500000, current: 150000, deadline: '2026-06-30', category: 'investment' },
    { id: 3, name: 'Vacation', target: 100000, current: 45000, deadline: '2025-06-30', category: 'lifestyle' },
  ]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: '', current: '', deadline: '', category: 'savings' });

  const handleAddGoal = () => {
    if (formData.name && formData.target) {
      setGoals([...goals, { id: Date.now(), ...formData, target: parseFloat(formData.target), current: parseFloat(formData.current) || 0 }]);
      setFormData({ name: '', target: '', current: '', deadline: '', category: 'savings' });
      setOpen(false);
    }
  };

  const handleDeleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

  return (
    <Box sx={{ background: '#0a0e1f', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: '#e4e7ff', display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon sx={{ color: '#00d4ff' }} /> Financial Goals
            </Typography>
            <Typography sx={{ color: 'rgba(176,181,212,0.8)' }}>Track and achieve your savings and investment targets</Typography>
          </Box>
          <Button startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ background: 'linear-gradient(135deg, #00d4ff, #6366f1)', color: 'white', fontWeight: 700, px: 3 }}>
            New Goal
          </Button>
        </Box>

        <Grid container spacing={3}>
          {goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <Card sx={{ background: 'rgba(26,32,53,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '12px', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#e4e7ff' }}>{goal.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <EditIcon fontSize="small" sx={{ cursor: 'pointer', color: '#00d4ff' }} />
                        <DeleteIcon fontSize="small" sx={{ cursor: 'pointer', color: '#f59e0b' }} onClick={() => handleDeleteGoal(goal.id)} />
                      </Box>
                    </Box>
                    <Chip label={goal.category} size="small" sx={{ mb: 2, background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }} />
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(176,181,212,0.8)' }}>₹{Math.round(goal.current).toLocaleString()} / ₹{Math.round(goal.target).toLocaleString()}</Typography>
                        <Typography variant="body2" sx={{ color: progress >= 100 ? '#10b981' : '#00d4ff', fontWeight: 700 }}>{Math.round(progress)}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min(progress, 100)} sx={{ height: 6, borderRadius: '3px', background: 'rgba(0,212,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00d4ff, #6366f1)' } }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(176,181,212,0.6)' }}>Target: {goal.deadline || 'No deadline'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: '#0a0e1f', color: '#e4e7ff', fontWeight: 700 }}>Create New Goal</DialogTitle>
          <DialogContent sx={{ background: '#0a0e1f', pt: 2 }}>
            <TextField fullWidth label="Goal Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Target Amount (₹)" type="number" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Current Amount (₹)" type="number" value={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Target Date" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
          </DialogContent>
          <DialogActions sx={{ background: '#0a0e1f', p: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#00d4ff' }}>Cancel</Button>
            <Button onClick={handleAddGoal} sx={{ background: 'linear-gradient(135deg, #00d4ff, #6366f1)', color: 'white', fontWeight: 700 }}>Create</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
