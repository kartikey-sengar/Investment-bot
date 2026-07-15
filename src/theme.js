import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#00d4ff' : '#0099e6',
      light: mode === 'dark' ? '#06f9ff' : '#33aaed',
      dark: mode === 'dark' ? '#00a8cc' : '#0066b3',
      contrastText: mode === 'dark' ? '#0a0e1f' : '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#6366f1' : '#5e4ba8',
      light: mode === 'dark' ? '#818cf8' : '#7d6fb5',
      dark: mode === 'dark' ? '#4f46e5' : '#3d2978',
      contrastText: '#ffffff',
    },
    success: { 
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#047857',
    },
    warning: { 
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#b45309',
    },
    error: { 
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#b91c1c',
    },
    info: { 
      main: '#00d4ff',
      light: '#06f9ff',
      dark: '#00a8cc',
    },
    background: {
      default: mode === 'dark' ? '#0a0e1f' : '#f5f7ff',
      paper: mode === 'dark' ? '#1a2035' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e4e7ff' : '#1a1f3a',
      secondary: mode === 'dark' ? '#b0b5d4' : '#525766',
      disabled: mode === 'dark' ? '#556184' : '#a4a9bb',
    },
    divider: mode === 'dark' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(0, 153, 230, 0.1)',
  },

  typography: {
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
    h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.005em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0' },
    caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'dark' ? '#0f1419' : '#ffffff',
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'dark' ? 'rgba(148,163,184,0.2) #1a202c' : 'rgba(15,23,42,0.1) #f8fafc',
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'dark' ? '#1a202c' : '#f8fafc',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.1)',
          borderRadius: '4px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: { 
          borderRadius: 12, 
          padding: '11px 28px', 
          fontWeight: 600, 
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          fontSize: '0.95rem',
          letterSpacing: '0.3px',
          boxShadow: mode === 'dark' 
            ? '0 4px 20px rgba(59, 130, 246, 0.2)' 
            : '0 4px 15px rgba(37, 99, 235, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.2)',
            transition: 'left 400ms ease',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        containedPrimary: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #00d4ff 0%, #0099e6 50%, #6366f1 100%)' 
            : 'linear-gradient(135deg, #0099e6 0%, #0077c4 50%, #5e4ba8 100%)',
          color: mode === 'dark' ? '#0a0e1f' : '#ffffff',
          boxShadow: mode === 'dark' 
            ? '0 10px 40px rgba(0, 212, 255, 0.4)' 
            : '0 8px 32px rgba(0, 153, 230, 0.3)',
          '&:hover': {
            boxShadow: mode === 'dark' 
              ? '0 20px 60px rgba(0, 212, 255, 0.5)' 
              : '0 16px 48px rgba(0, 153, 230, 0.4)',
            transform: 'translateY(-4px)',
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #06f9ff 0%, #00bbff 50%, #818cf8 100%)' 
              : 'linear-gradient(135deg, #00bbff 0%, #0088dd 50%, #7d6fb5 100%)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
            boxShadow: mode === 'dark' 
              ? '0 12px 40px rgba(0, 212, 255, 0.35)' 
              : '0 10px 32px rgba(0, 153, 230, 0.25)',
          },
        },
        outlined: {
          borderColor: mode === 'dark' 
            ? 'rgba(0, 212, 255, 0.5)' 
            : 'rgba(0, 153, 230, 0.4)',
          color: mode === 'dark' ? '#00d4ff' : '#0099e6',
          borderWidth: '2px',
          '&:hover': {
            borderColor: mode === 'dark' ? '#00d4ff' : '#0099e6',
            backgroundColor: mode === 'dark' 
              ? 'rgba(0, 212, 255, 0.1)' 
              : 'rgba(0, 153, 230, 0.08)',
            boxShadow: mode === 'dark'
              ? '0 10px 30px rgba(0, 212, 255, 0.2)'
              : '0 8px 24px rgba(0, 153, 230, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          color: mode === 'dark' ? '#00d4ff' : '#0099e6',
          '&:hover': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(0, 212, 255, 0.12)' 
              : 'rgba(0, 153, 230, 0.08)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1a2035' : '#ffffff',
          border: mode === 'dark' 
            ? '1px solid rgba(0, 212, 255, 0.12)' 
            : '1px solid rgba(0, 153, 230, 0.1)',
          borderRadius: 18,
          boxShadow: mode === 'dark' 
            ? '0 12px 48px rgba(0, 212, 255, 0.12), inset 0 1px 0 rgba(0, 212, 255, 0.08)' 
            : '0 8px 32px rgba(0, 153, 230, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: mode === 'dark'
              ? 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.25), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0, 153, 230, 0.2), transparent)',
            pointerEvents: 'none',
          },
          '&:hover': {
            borderColor: mode === 'dark' 
              ? 'rgba(0, 212, 255, 0.25)' 
              : 'rgba(0, 153, 230, 0.2)',
            boxShadow: mode === 'dark' 
              ? '0 24px 64px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(0, 212, 255, 0.08)' 
              : '0 16px 48px rgba(0, 153, 230, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transform: 'translateY(-8px)',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(20, 24, 41, 0.8)' 
              : 'rgba(245, 247, 255, 0.9)',
            borderRadius: 12,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            border: mode === 'dark'
              ? '1px solid rgba(0, 212, 255, 0.15)'
              : '1px solid rgba(0, 153, 230, 0.15)',
            backdropFilter: 'blur(12px)',
            '& fieldset': { 
              borderColor: mode === 'dark' 
                ? 'rgba(0, 212, 255, 0.15)' 
                : 'rgba(0, 153, 230, 0.15)',
              transition: 'all 250ms ease',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' 
                ? 'rgba(0, 212, 255, 0.35)' 
                : 'rgba(0, 153, 230, 0.28)',
              boxShadow: mode === 'dark'
                ? '0 6px 20px rgba(0, 212, 255, 0.12)'
                : '0 6px 16px rgba(0, 153, 230, 0.1)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#00d4ff' : '#0099e6',
              borderWidth: '2px',
              boxShadow: mode === 'dark' 
                ? '0 0 0 4px rgba(0, 212, 255, 0.2), 0 10px 30px rgba(0, 212, 255, 0.15)' 
                : '0 0 0 4px rgba(0, 153, 230, 0.15), 0 8px 24px rgba(0, 153, 230, 0.1)',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '0.965rem',
            fontWeight: 500,
            color: mode === 'dark' ? '#e4e7ff' : '#1a1f3a',
          },
          '& .MuiInputBase-input::placeholder': {
            color: mode === 'dark' 
              ? 'rgba(176, 181, 212, 0.5)' 
              : 'rgba(82, 87, 102, 0.5)',
            opacity: 1,
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: mode === 'dark' 
            ? 'rgba(15, 20, 31, 0.8)' 
            : 'rgba(248, 250, 252, 0.9)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            backgroundColor: mode === 'dark'
              ? 'rgba(15, 20, 31, 0.95)'
              : 'rgba(248, 250, 252, 0.95)',
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#0f1424' : '#ffffff',
          borderRight: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' 
            ? 'rgba(10, 14, 26, 0.85)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: mode === 'dark' 
            ? '1px solid rgba(59, 130, 246, 0.1)' 
            : '1px solid rgba(37, 99, 235, 0.08)',
          color: mode === 'dark' ? '#f1f5f9' : '#0f172a',
          boxShadow: mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.2)'
            : '0 4px 16px rgba(0, 0, 0, 0.05)',
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' 
            ? 'transparent' 
            : 'transparent',
          border: mode === 'dark' 
            ? '1px solid rgba(59, 130, 246, 0.15)' 
            : '1px solid rgba(37, 99, 235, 0.1)',
          borderRadius: '14px !important',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:before': { display: 'none' },
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0 8px 24px rgba(59, 130, 246, 0.15)'
              : '0 8px 20px rgba(37, 99, 235, 0.1)',
            borderColor: mode === 'dark'
              ? 'rgba(59, 130, 246, 0.3)'
              : 'rgba(37, 99, 235, 0.2)',
          },
          '&.Mui-expanded': {
            margin: '0 !important',
            backgroundColor: mode === 'dark'
              ? 'rgba(59, 130, 246, 0.08)'
              : 'rgba(37, 99, 235, 0.05)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '8px 4px',
          border: mode === 'dark' 
            ? '1px solid rgba(59, 130, 246, 0.25)' 
            : '1px solid rgba(37, 99, 235, 0.15)',
          backgroundColor: mode === 'dark' 
            ? 'rgba(59, 130, 246, 0.12)' 
            : 'rgba(37, 99, 235, 0.08)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(59, 130, 246, 0.2)' 
              : 'rgba(37, 99, 235, 0.12)',
            borderColor: mode === 'dark' 
              ? 'rgba(59, 130, 246, 0.4)' 
              : 'rgba(37, 99, 235, 0.25)',
            boxShadow: mode === 'dark'
              ? '0 4px 12px rgba(59, 130, 246, 0.15)'
              : '0 4px 12px rgba(37, 99, 235, 0.1)',
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
          boxShadow: mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 16px rgba(0, 0, 0, 0.05)',
          padding: '14px 16px',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiAlertTitle-root': {
            fontWeight: 700,
            marginBottom: '6px',
            fontSize: '0.95rem',
          },
        },
        standardSuccess: {
          backgroundColor: mode === 'dark'
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(16, 185, 129, 0.1)',
          color: mode === 'dark' ? '#6ee7b7' : '#047857',
          borderLeft: '3px solid #10b981',
          borderImage: 'linear-gradient(180deg, #10b981, #059669) 1',
        },
        standardWarning: {
          backgroundColor: mode === 'dark'
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(245, 158, 11, 0.1)',
          color: mode === 'dark' ? '#fcd34d' : '#b45309',
          borderLeft: '3px solid #f59e0b',
          borderImage: 'linear-gradient(180deg, #f59e0b, #d97706) 1',
        },
        standardError: {
          backgroundColor: mode === 'dark'
            ? 'rgba(239, 68, 68, 0.15)'
            : 'rgba(239, 68, 68, 0.1)',
          color: mode === 'dark' ? '#fca5a5' : '#b91c1c',
          borderLeft: '3px solid #ef4444',
          borderImage: 'linear-gradient(180deg, #ef4444, #dc2626) 1',
        },
        standardInfo: {
          backgroundColor: mode === 'dark'
            ? 'rgba(59, 130, 246, 0.15)'
            : 'rgba(37, 99, 235, 0.1)',
          color: mode === 'dark' ? '#93c5fd' : '#1e40af',
          borderLeft: '3px 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          fontSize: '0.95rem',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            width: '0%',
            height: '2px',
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' 
              : 'linear-gradient(90deg, #2563eb, #7c3aed)',
            transition: 'width 300ms ease',
          },
          '&:hover': {
            color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
            '&::after': {
              width: '100%',
            },
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#3b82f6' : '#2563eb',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 250ms ease',
          fontWeight: 500,
          '&:hover': {
            color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: { fontWeight: 700, fontSize: '3rem' },
        h2: { fontWeight: 700, fontSize: '2.25rem' },
        h3: { fontWeight: 600, fontSize: '1.875rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 500, fontSize: '1rem' },
      },
    },
  },
});

export default getTheme;
