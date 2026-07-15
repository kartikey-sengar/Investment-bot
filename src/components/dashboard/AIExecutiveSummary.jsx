import { Card, CardContent, Typography, Box, Skeleton, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useUser } from '../../context/UserContext.jsx';
import { useAIInsights } from '../../hooks/useAIInsights.js';
import { useEffect } from 'react';

export default function AIExecutiveSummary() {
  const { userId, profile } = useUser();
  const { insights, loading, fetchInsights } = useAIInsights();

  useEffect(() => {
    if (userId && profile && !insights && !loading) {
      // Fetch insights in the background for the dashboard summary
      fetchInsights(userId, profile);
    }
  }, [userId, profile, insights, loading, fetchInsights]);

  return (
    <Card sx={{ 
      mb: 3, 
      background: 'var(--color-accent-gradient)', 
      color: '#ffffff',
      border: 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(10px)' }} />
      <Box sx={{ position: 'absolute', bottom: -20, right: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(5px)' }} />

      <CardContent sx={{ position: 'relative', zIndex: 1, p: '24px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: 'rgba(255,255,255,0.9)' }} />
          <Typography variant="h6" fontWeight={700}>AI Executive Summary</Typography>
          <Chip label="Gemini" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }} />
        </Box>
        
        {loading ? (
          <Box>
            <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: '80%' }} />
          </Box>
        ) : insights?.summary ? (
          <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.95)' }}>
            "{insights.summary}"
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Configure GEMINI_API_KEY in backend .env to unlock AI insights.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
