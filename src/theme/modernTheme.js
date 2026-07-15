import { createTheme } from '@mui/material/styles';

// Modern color palette - Financial app focused
const colors = {
  // Primary: Deep Teal/Cyan
  primary: '#00D4FF',      // Bright cyan for main CTAs
  primaryDark: '#0099CC',  // Dark teal for hover
  primaryLight: '#4DE5FF', // Light cyan for backgrounds
  
  // Secondary: Indigo/Purple
  secondary: '#6366F1',    // Indigo for secondary actions
  secondaryDark: '#4F46E5',
  secondaryLight: '#818CF8',
  
  // Tertiary: Gradient accent
  tertiary: '#A855F7',     // Purple for highlights
  
  // Semantic colors
  success: '#10B981',      // Green for income/gains
  warning: '#F59E0B',      // Amber for warnings
  error: '#EF4444',        // Red for losses/errors
  info: '#3B82F6',         // Blue for information
  
  // Neutrals - Dark theme optimized
  dark: '#0A0E1F',         // Darkest background
  darkCard: '#14162D',     // Card background
  darkSecondary: '#1A2039', // Secondary darker
  
  light: '#F5F7FF',        // Very light blue-tinted white
  lightSecondary: '#E4E7FF', // Light secondary
  
  // Text colors
  textPrimary: '#E4E7FF',
  textSecondary: '#B0B5D4',
  textTertiary: '#8B91AC',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
    },
    secondary: {
      main: colors.secondary,
      dark: colors.secondaryDark,
      light: colors.secondaryLight,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: colors.dark,
      paper: colors.darkCard,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: colors.textPrimary,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: colors.textPrimary,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
      fontWeight: 700,
      color: colors.textPrimary,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: colors.textPrimary,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.textPrimary,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: colors.textSecondary,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: colors.textTertiary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.95rem',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 12px 40px rgba(0, 212, 255, 0.3)`,
          '&:hover': {
            boxShadow: `0 20px 60px rgba(0, 212, 255, 0.4)`,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`,
          boxShadow: `0 12px 40px rgba(99, 102, 241, 0.25)`,
          '&:hover': {
            boxShadow: `0 20px 60px rgba(99, 102, 241, 0.35)`,
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          border: `2px solid ${colors.primary}`,
          color: colors.primary,
          '&:hover': {
            background: `rgba(0, 212, 255, 0.1)`,
            border: `2px solid ${colors.primaryLight}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, rgba(26, 32, 53, 0.8), rgba(26, 32, 53, 0.5))`,
          border: `1px solid rgba(0, 212, 255, 0.15)`,
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 300ms ease',
          '&:hover': {
            boxShadow: '0 20px 60px rgba(0, 212, 255, 0.15)',
            borderColor: `rgba(0, 212, 255, 0.3)`,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(20, 24, 41, 0.6)',
            borderColor: 'rgba(0, 212, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            transition: 'all 300ms ease',
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            color: colors.textPrimary,
            '&::placeholder': {
              color: colors.textTertiary,
              opacity: 1,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(0, 212, 255, 0.3)`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary,
            borderWidth: '2px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, rgba(10, 14, 31, 0.9), rgba(15, 22, 38, 0.8))`,
          backdropFilter: 'blur(12px)',
          border: `1px solid rgba(0, 212, 255, 0.1)`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkSecondary} 100%)`,
          border: `1px solid rgba(0, 212, 255, 0.1)`,
          backdropFilter: 'blur(12px)',
        },
      },
    },
  },
});

export { colors };
export default theme;
