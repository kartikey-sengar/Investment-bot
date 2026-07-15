import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function BudgetProgressCard({ category, budgeted, spent, icon: Icon }) {
  const percentage = (spent / budgeted) * 100;
  const remaining = budgeted - spent;
  const isOverBudget = spent > budgeted;
  const color = isOverBudget ? '#EF4444' : percentage > 80 ? '#F59E0B' : '#10B981';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {category}
            </Typography>
          </Box>
          {isOverBudget && (
            <Chip label="Over" size="small" sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontWeight: 600 }} />
          )}
        </Box>

        {/* Amounts */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(176, 181, 212, 0.7)', display: 'block', mb: 0.3 }}>
              Spent
            </Typography>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#e4e7ff' }}>
              ${spent.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'rgba(176, 181, 212, 0.7)', display: 'block', mb: 0.3 }}>
              Budget
            </Typography>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#b0b5d4' }}>
              ${budgeted.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={Math.min(percentage, 100)}
          sx={{
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(0, 212, 255, 0.1)',
            mb: 1.5,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${color}, ${color}dd)`,
              borderRadius: '4px',
            },
          }}
        />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(176, 181, 212, 0.7)' }}>
            {Math.round(percentage)}% spent
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isOverBudget ? '#EF4444' : '#10B981',
              fontWeight: 600,
            }}
          >
            {isOverBudget ? '−' : ''}${Math.abs(remaining).toFixed(2)} {isOverBudget ? 'over' : 'remaining'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
