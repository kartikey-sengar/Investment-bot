import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function MetricCard({ icon: Icon, label, value, change, subtext, color = '#00d4ff', showProgress = false, progressValue = 0 }) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <Tooltip title={subtext || ''}>
      <Card
        sx={{
          height: '100%',
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
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2.5 }}>
          {/* Header with icon and label */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 28 }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(176, 181, 212, 0.7)', fontWeight: 500 }}>
              {label}
            </Typography>
          </Box>

          {/* Value */}
          <Box sx={{ mb: change !== undefined ? 1.5 : 0 }}>
            <Typography
              variant="h4"
              sx={{
                color: '#e4e7ff',
                fontWeight: 700,
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Change indicator */}
          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: showProgress ? 1.5 : 0 }}>
              {isPositive ? (
                <TrendingUpIcon sx={{ color: changeColor, fontSize: 18 }} />
              ) : (
                <TrendingDownIcon sx={{ color: changeColor, fontSize: 18 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: changeColor,
                  fontWeight: 600,
                }}
              >
                {isPositive ? '+' : ''}{change}% from last month
              </Typography>
            </Box>
          )}

          {/* Progress bar */}
          {showProgress && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(176, 181, 212, 0.7)' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(176, 181, 212, 0.7)' }}>
                  {Math.round(progressValue)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(0, 212, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    borderRadius: '3px',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Tooltip>
  );
}
