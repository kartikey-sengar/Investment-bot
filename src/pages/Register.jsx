import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Link, Checkbox, FormControlLabel, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUser } from '../context/UserContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    if (!formData.email) return 'Please enter your email address';
    if (!formData.password) return 'Please enter a password';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!agreedToTerms) return 'Please accept the terms and conditions';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);
    try {
      await register(formData.fullName, formData.email, formData.password);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite reverse',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Card Container */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.7), rgba(26, 32, 53, 0.4))',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            borderRadius: '24px',
            padding: { xs: '32px 24px', md: '48px' },
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(168, 85, 247, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInUp 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
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
              Create Account
            </Typography>
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: 'rgba(176, 181, 212, 0.8)',
              }}
            >
              Start your journey to financial mastery with AI-powered insights
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
            {/* Full Name Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'rgba(168, 85, 247, 0.8)',
                  mb: 1,
                }}
              >
                Full Name
              </Typography>
              <TextField
                fullWidth
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1.5, color: 'rgba(168, 85, 247, 0.5)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(20, 24, 41, 0.6)',
                    borderColor: 'rgba(168, 85, 247, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a855f7',
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

            {/* Email Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'rgba(168, 85, 247, 0.8)',
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
                  startAdornment: <EmailIcon sx={{ mr: 1.5, color: 'rgba(168, 85, 247, 0.5)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(20, 24, 41, 0.6)',
                    borderColor: 'rgba(168, 85, 247, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a855f7',
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
                  color: 'rgba(168, 85, 247, 0.8)',
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
                  startAdornment: <LockIcon sx={{ mr: 1.5, color: 'rgba(168, 85, 247, 0.5)' }} />,
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        minWidth: 'auto',
                        p: 0.5,
                        color: 'rgba(168, 85, 247, 0.6)',
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
                    borderColor: 'rgba(168, 85, 247, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a855f7',
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

            {/* Confirm Password Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'rgba(168, 85, 247, 0.8)',
                  mb: 1,
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1.5, color: 'rgba(168, 85, 247, 0.5)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(20, 24, 41, 0.6)',
                    borderColor: 'rgba(168, 85, 247, 0.15)',
                    backdropFilter: 'blur(8px)',
                    '&:hover fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a855f7',
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

            {/* Terms Checkbox */}
            <Box
              sx={{
                background: 'rgba(168, 85, 247, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={loading}
                    sx={{
                      color: 'rgba(168, 85, 247, 0.6)',
                      '&.Mui-checked': {
                        color: '#a855f7',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(176, 181, 212, 0.9)' }}>
                    I agree to the{' '}
                    <Link
                      href="#"
                      sx={{
                        color: '#a855f7',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="#"
                      sx={{
                        color: '#a855f7',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>

            {/* Sign Up Button */}
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
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                boxShadow: '0 12px 40px rgba(168, 85, 247, 0.3)',
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  cursor: 'not-allowed',
                },
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Box>

          {/* Divider */}
          <Divider
            sx={{
              my: 3,
              borderColor: 'rgba(168, 85, 247, 0.1)',
              opacity: 0.5,
            }}
          />

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: 'rgba(176, 181, 212, 0.8)', mb: 1 }}>
              Already have an account?
            </Typography>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#a855f7',
                textDecoration: 'none',
                transition: 'all 300ms ease',
                '&:hover': {
                  color: '#d8b4fe',
                  textDecoration: 'underline',
                },
              }}
            >
              Sign in instead →
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
