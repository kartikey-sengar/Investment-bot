import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

export default function Loader({ variant = 'spinner', message = 'Loading...', count = 3 }) {
  if (variant === 'skeleton') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="rounded" height={24} width="60%" sx={{ bgcolor: 'rgba(148,163,184,0.08)' }} />
            <Skeleton variant="rounded" height={140} sx={{ bgcolor: 'rgba(148,163,184,0.06)', borderRadius: 2 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, p: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={180} sx={{ bgcolor: 'rgba(148,163,184,0.06)', borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      py: 8,
    }}>
      <CircularProgress
        size={44}
        sx={{
          color: '#4f8cff',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}
