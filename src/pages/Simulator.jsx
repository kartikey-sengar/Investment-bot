import React, { useState } from 'react';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Slider, Grid, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Simulator() {
  const [params, setParams] = useState({ principal: 100000, rate: 7, years: 10, compounds: 12 });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(params.principal);
    const r = parseFloat(params.rate) / 100;
    const n = parseFloat(params.compounds);
    const t = parseFloat(params.years);
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    setResult({ amount: Math.round(amount), interest: Math.round(interest) });
  };

  return (
    <Box sx={{ background: '#0a0e1f', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 32, color: '#00d4ff' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#e4e7ff' }}>Investment Simulator</Typography>
            <Typography sx={{ color: 'rgba(176,181,212,0.8)' }}>Calculate your investment growth with compound interest</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(26,32,53,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#e4e7ff' }}>Simulation Parameters</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Principal Amount (₹)</Typography>
                  <TextField fullWidth type="number" value={params.principal} onChange={(e) => setParams({ ...params, principal: e.target.value })} sx={{ '& .MuiInputBase-root': { background: 'rgba(0,212,255,0.05)' } }} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Annual Interest Rate (%)</Typography>
                  <Slider value={parseFloat(params.rate)} onChange={(e) => setParams({ ...params, rate: e.target.value.toString() })} min={0} max={20} step={0.1} />
                  <Typography sx={{ color: '#00d4ff', fontWeight: 700 }}>{params.rate}%</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Time Period (Years)</Typography>
                  <Slider value={parseFloat(params.years)} onChange={(e) => setParams({ ...params, years: e.target.value.toString() })} min={1} max={50} step={1} />
                  <Typography sx={{ color: '#00d4ff', fontWeight: 700 }}>{params.years} years</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Compounds Per Year</Typography>
                  <TextField fullWidth select type="number" value={params.compounds} onChange={(e) => setParams({ ...params, compounds: e.target.value })} sx={{ '& .MuiInputBase-root': { background: 'rgba(0,212,255,0.05)' } }} />
                </Box>
                <Button fullWidth onClick={calculate} sx={{ background: 'linear-gradient(135deg, #00d4ff, #6366f1)', color: 'white', fontWeight: 700, py: 1.5 }}>Calculate</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(26,32,53,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#e4e7ff' }}>Results</Typography>
                {result ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 3, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                      After {params.years} year(s), your investment will grow significantly!
                    </Alert>
                    <Box sx={{ p: 2, borderRadius: '8px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', mb: 2 }}>
                      <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Initial Amount</Typography>
                      <Typography variant="h6" sx={{ color: '#e4e7ff', fontWeight: 700 }}>₹{Math.round(parseFloat(params.principal)).toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: '8px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', mb: 2 }}>
                      <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Interest Earned</Typography>
                      <Typography variant="h6" sx={{ color: '#a855f7', fontWeight: 700 }}>₹{result.interest.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: '8px', background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: 'rgba(176,181,212,0.8)', mb: 1 }}>Total Amount</Typography>
                      <Typography variant="h4" sx={{ color: '#00d4ff', fontWeight: 900 }}>₹{result.amount.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={{ color: 'rgba(176,181,212,0.6)', textAlign: 'center', py: 8 }}>Enter parameters and click Calculate to see results</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
