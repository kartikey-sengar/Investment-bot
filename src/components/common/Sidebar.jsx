import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, useMediaQuery, SwipeableDrawer } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FlagIcon from '@mui/icons-material/Flag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/Person';
import './Sidebar.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/goals', label: 'Goals', icon: <FlagIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <ReceiptLongIcon /> },
  { path: '/advisor', label: 'AI Advisor', icon: <PsychologyIcon /> },
  { path: '/simulator', label: 'Simulator', icon: <TuneIcon /> },
  { path: '/setup', label: 'Profile', icon: <PersonIcon /> },
];

export default function Sidebar({ open, onClose, onOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose?.();
  };

  const drawerContent = (
    <Box className="sidebar-content">
      <Box className="sidebar-spacer" />
      <List className="sidebar-list">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
            >
              <ListItemIcon className="sidebar-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} className="sidebar-label" />
              {isActive && <Box className="sidebar-indicator" />}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        className="sidebar-mobile"
      >
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      className="sidebar-desktop"
      PaperProps={{ className: 'sidebar-paper' }}
    >
      {drawerContent}
    </Drawer>
  );
}
