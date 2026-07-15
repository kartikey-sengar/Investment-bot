import { Box, Typography, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  color = '#00d4ff',
  progress,
  unit = ''
}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(99, 102, 241, 0.05))',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        borderRadius: '16px',
        padding: '20px',
        backdropFilter: 'blur(12px)',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 50px rgba(0, 212, 255, 0.15)`,
          borderColor: 'rgba(0, 212, 255, 0.35)',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(99, 102, 241, 0.08))',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          sx={{ 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'rgba(176, 181, 212, 0.7)',
          }}
        >
          {title}
        </Typography>
        {Icon && (
          <Box
            sx={{
              p: 1,
              background: `linear-gradient(135deg, ${color}22, ${color}10)`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            <Icon sx={{ fontSize: '1.3rem' }} />
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography 
          sx={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00d4ff, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
          {unit && <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>{unit}</span>}
        </Typography>
      </Box>

      {change !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: '0.9rem', color: '#ef4444' }} />
          )}
          <Typography 
            sx={{ 
              fontSize: '0.8rem', 
              fontWeight: 600,
              color: isPositive ? '#6ee7b7' : '#fca5a5',
            }}
          >
            {isPositive ? '+' : ''}{change}% this month
          </Typography>
        </Box>
      )}

      {progress !== undefined && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(176, 181, 212, 0.7)' }}>
              Progress
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#00d4ff' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #00d4ff, #6366f1)',
                borderRadius: '3px',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
