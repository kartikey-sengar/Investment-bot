import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton, useMediaQuery, Fab, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import getTheme from './theme.js';
import { useThemeContext } from './context/ThemeContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import Footer from './components/common/Footer.jsx';
import AppRoutes from './routes.jsx';
import './index.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const isLanding = location.pathname === '/';
  const isMobile = useMediaQuery('(max-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Box className={`app-layout ${!isLanding ? 'app-layout--with-sidebar' : ''}`}>
        <Navbar />

        {!isLanding && (
          <>
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onOpen={() => setSidebarOpen(true)}
            />
            {isMobile && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: 'fixed',
                  top: 72,
                  left: 8,
                  zIndex: 99,
                  bgcolor: 'rgba(20,27,45,0.9)',
                  border: '1px solid rgba(148,163,184,0.1)',
                  '&:hover': { bgcolor: 'rgba(30,39,68,0.9)' },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </>
        )}

        <Box className="app-main">
          <Box className="app-content">
            <AppRoutes />
          </Box>
          <Footer />
        </Box>

        {!isLanding && (
          <Tooltip title="Ask FinPilot AI" placement="left">
            <Fab 
              color="primary" 
              aria-label="Ask AI" 
              sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, boxShadow: '0 8px 24px rgba(79,140,255,0.4)', '&:hover': { transform: 'scale(1.05)' }, transition: '0.2s' }}
              onClick={() => navigate('/advisor')}
            >
              <AutoAwesomeIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
    </ThemeProvider>
  );
}
