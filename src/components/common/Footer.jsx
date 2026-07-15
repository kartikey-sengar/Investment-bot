import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 4,
        mt: 'auto',
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        ⚠️ This platform provides educational financial insights, not professional financial advice.
      </Typography>
      <Typography variant="caption" color="text.disabled">
        © {new Date().getFullYear()} FinPilot AI. Built with React, Material UI & Gemini AI.
      </Typography>
    </Box>
  );
}
