import React from 'react';
import { Box, Container, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #0a0e1f 0%, #0f1626 50%, #14182d 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ fontSize: '120px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #6366f1)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>404</Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: '#f59e0b' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#e4e7ff', mb: 2 }}>Page Not Found</Typography>
          <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 4, fontSize: '1.05rem' }}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/dashboard')} sx={{ px: 4, py: 1.5, background: 'linear-gradient(135deg, #00d4ff, #6366f1)', color: 'white', fontWeight: 700 }}>Go to Dashboard</Button>
            <Button onClick={() => navigate('/')} variant="outlined" sx={{ px: 4, py: 1.5, border: '2px solid #00d4ff', color: '#00d4ff', fontWeight: 700 }}>Back to Home</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
