import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useUser } from '../../context/UserContext.jsx';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { profile, isAuthenticated, logout } = useUser();
  const { themeMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar className="navbar-toolbar">
        <Link to="/" className="navbar-brand">
          <AutoGraphIcon sx={{ fontSize: 32, color: '#4f8cff' }} />
          <Typography variant="h6" className="navbar-title">
            Fin<span className="text-gradient">Pilot</span> AI
          </Typography>
        </Link>

        <Box className="navbar-actions">
          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary', mr: 1 }} title="Toggle Theme">
            {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>

          {!isHome && isAuthenticated && (
            <Typography variant="body2" className="navbar-greeting">
              Hey, {profile?.personal?.name?.split(' ')[0] || 'User'} 👋
            </Typography>
          )}

          {isAuthenticated ? (
            <>
              <IconButton onClick={() => navigate('/setup')} size="small" title="Profile">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f8cff', fontSize: 14 }}>
                  {profile?.personal?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <IconButton onClick={() => { logout(); navigate('/'); }} size="small" title="Logout" sx={{ color: '#94a3b8' }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                Sign In
              </Button>
              <Button variant="contained" size="small" onClick={() => navigate('/register')} startIcon={<AccountCircleIcon />}>
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
