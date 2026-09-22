import React from 'react';
import { Card, CardContent, Typography, Box, Grid, LinearProgress, Chip, Stack, Divider, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PredictionResult = ({ result }) => {
  if (!result) return null;

  const { prediction, prediction_label, default_probability, risk_level, recommendation, risk_factors } = result;

  const isDefault = prediction === 1;
  const probPct = (default_probability * 100).toFixed(1);

  // Risk tier color palette
  const getRiskColor = () => {
    if (risk_level === 'High Risk' || isDefault) return { main: '#ef4444', bg: '#fef2f2', border: '#fca5a5' };
    if (risk_level === 'Medium Risk') return { main: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' };
    return { main: '#10b981', bg: '#ecfdf5', border: '#6ee7b7' };
  };

  const riskColor = getRiskColor();

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: `1.5px solid ${riskColor.border}`, backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* Top Banner */}
      <Box sx={{ backgroundColor: riskColor.bg, px: 3, py: 2.5, borderBottom: `1px solid ${riskColor.border}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {isDefault ? (
              <WarningAmberIcon sx={{ color: riskColor.main, fontSize: 32 }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ color: riskColor.main, fontSize: 32 }} />
            )}
            <Box>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 600 }}>
                Model Prediction
              </Typography>
              <Typography variant="h5" sx={{ color: isDefault ? '#dc2626' : '#059669', fontWeight: 700 }}>
                {prediction_label}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={risk_level}
            sx={{
              backgroundColor: riskColor.main,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 1,
              py: 2,
              borderRadius: '20px',
            }}
          />
        </Stack>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Probability Indicator */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                ESTIMATED DEFAULT PROBABILITY
              </Typography>
              <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 800, my: 1 }}>
                {probPct}%
              </Typography>

              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(default_probability * 100, 100)}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: riskColor.main,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>0% (Low Risk)</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>100% (High Risk)</Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Key Risk Factors */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1.5, fontWeight: 600 }}>
                APPLICANT RISK PROFILE ANALYSIS
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1, color: '#334155', fontSize: '0.9rem' } }}>
                {risk_factors && risk_factors.length > 0 ? (
                  risk_factors.map((factor, idx) => <li key={idx}>{factor}</li>)
                ) : (
                  <li>Standard risk footprint within nominal underwriting thresholds.</li>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Underwriting Recommendation Disclaimer */}
        <Alert icon={<InfoOutlinedIcon fontSize="inherit" />} severity="info" sx={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            <strong>Underwriting Guidance:</strong> {recommendation || 'This prediction is an estimated statistical probability output from the Logistic Regression model. It should support, not replace, formal human underwriting review and institutional compliance standards.'}
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
