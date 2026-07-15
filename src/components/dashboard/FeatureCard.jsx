import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'linear-gradient(135deg, #00d4ff, #6366f1)',
  onClick 
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.4), rgba(26, 32, 53, 0.2))',
        border: '1.5px solid rgba(0, 212, 255, 0.15)',
        borderRadius: '20px',
        padding: '32px 24px',
        backdropFilter: 'blur(12px)',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: '280px',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)`,
          pointerEvents: 'none',
        },
        
        '&:hover': {
          transform: 'translateY(-12px)',
          borderColor: 'rgba(0, 212, 255, 0.4)',
          boxShadow: '0 30px 80px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(0, 212, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.6), rgba(26, 32, 53, 0.35))',
          '& .feature-icon': {
            transform: 'scale(1.15) rotate(5deg)',
          },
          '& .feature-arrow': {
            transform: 'translateX(6px)',
            color: '#00d4ff',
          },
        },
      }}
    >
      {/* Icon Container */}
      <Box
        className="feature-icon"
        sx={{
          width: '64px',
          height: '64px',
          background: gradient,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 12px 32px ${gradient.split('(')[2].split(',')[0]}30`,
        }}
      >
        <Icon sx={{ fontSize: '2rem', color: '#fff' }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <Typography 
          sx={{ 
            fontSize: '1.2rem', 
            fontWeight: 700,
            color: '#e4e7ff',
            mb: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>
        <Typography 
          sx={{ 
            fontSize: '0.9rem',
            color: 'rgba(176, 181, 212, 0.8)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Arrow */}
      <Box 
        className="feature-arrow"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'rgba(0, 212, 255, 0.7)',
          fontSize: '0.9rem',
          fontWeight: 600,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        Learn More
        <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
      </Box>
    </Box>
  );
}
