import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      return setError('Please enter both email and password.');
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0e1f 0%, #0f1626 100%)',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Card Container */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.7), rgba(26, 32, 53, 0.4))',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '24px',
            padding: { xs: '32px 24px', md: '48px' },
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0, 212, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
              pointerEvents: 'none',
            },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                letterSpacing: '-0.02em',
                mb: 1,
                color: '#e4e7ff',
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: 'rgba(176, 181, 212, 0.8)',
              }}
            >
              Sign in to access your personalized financial insights
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#fca5a5',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Email Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'rgba(0, 212, 255, 0.8)',
                  mb: 1,
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1.5, color: 'rgba(0, 212, 255, 0.5)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(20, 24, 41, 0.6)',
                    borderColor: 'rgba(0, 212, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4ff',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#e4e7ff',
                    '&::placeholder': {
                      color: 'rgba(176, 181, 212, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Password Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'rgba(0, 212, 255, 0.8)',
                  mb: 1,
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1.5, color: 'rgba(0, 212, 255, 0.5)' }} />,
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        minWidth: 'auto',
                        p: 0.5,
                        color: 'rgba(0, 212, 255, 0.6)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(20, 24, 41, 0.6)',
                    borderColor: 'rgba(0, 212, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4ff',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#e4e7ff',
                    '&::placeholder': {
                      color: 'rgba(176, 181, 212, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 1,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #00d4ff, #6366f1)',
                boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 20px 60px rgba(0, 212, 255, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  cursor: 'not-allowed',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          {/* Divider */}
          <Divider
            sx={{
              my: 3,
              borderColor: 'rgba(0, 212, 255, 0.1)',
              opacity: 0.5,
            }}
          />

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: 'rgba(176, 181, 212, 0.8)', mb: 1 }}>
              Don't have an account?
            </Typography>
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#00d4ff',
                textDecoration: 'none',
                transition: 'all 300ms ease',
                '&:hover': {
                  color: '#06f9ff',
                  textDecoration: 'underline',
                },
              }}
            >
              Create a free account →
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
