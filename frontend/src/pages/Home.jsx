import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MemoryIcon from '@mui/icons-material/Memory';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { getModelInfo } from '../services/api';

const Home = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getModelInfo()
      .then((data) => {
        if (isMounted) {
          setModelInfo(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load model info on home page:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const accuracyPct = modelInfo?.accuracy ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : '88.5%';

  const featureCards = [
    {
      icon: <MemoryIcon sx={{ fontSize: 28 }} />,
      iconBg: '#f0f9ff',
      iconColor: '#0284c7',
      title: 'Machine Learning',
      description: 'Systematic credit risk evaluation utilizing 16 key financial and demographic parameters.',
    },
    {
      icon: <ShowChartIcon sx={{ fontSize: 28 }} />,
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      title: 'Logistic Regression',
      description: loading ? null : `Trained model pipeline delivering verified accuracy of ${accuracyPct}.`,
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28 }} />,
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      title: 'Risk Probability',
      description: 'Generates continuous probability scores categorized into Low, Medium, or High Risk tiers.',
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
      iconBg: '#f3e8ff',
      iconColor: '#9333ea',
      title: 'Fast Prediction',
      description: 'High-performance FastAPI REST backend for real-time credit decision assistance.',
    },
  ];

  return (
    <Box sx={{ minHeight: '88vh', backgroundColor: '#f8fafc' }}>

      {/* ─── HERO SECTION ─── */}
      <Box sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: '40px', md: '60px' },
              alignItems: 'center',
              minHeight: { md: 420 },
            }}
          >
            {/* HERO LEFT: Text + CTA */}
            <Box>
              <Chip
                icon={<SecurityIcon style={{ fontSize: 16, color: '#0369a1' }} />}
                label="AI POWERED"
                sx={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.06em',
                  px: 1,
                  py: 2,
                  borderRadius: '20px',
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3rem', md: '3.4rem' },
                  color: '#0f172a',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                  mb: 0.5,
                }}
              >
                Make Smarter
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3rem', md: '3.4rem' },
                  color: '#0284c7',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                  mb: 2.5,
                }}
              >
                Loan Decisions
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#475569',
                  fontSize: { xs: '1.02rem', md: '1.12rem' },
                  lineHeight: 1.65,
                  mb: 3.5,
                  maxWidth: 520,
                }}
              >
                LoanGuard uses machine learning to evaluate credit risk and predict the likelihood of loan default with high accuracy.
              </Typography>

              <Button
                component={RouterLink}
                to="/predict"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  backgroundColor: '#0284c7',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                  '&:hover': {
                    backgroundColor: '#0369a1',
                    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.45)',
                  },
                }}
              >
                Predict Loan Risk
              </Button>
            </Box>

            {/* HERO RIGHT: Fintech Analytics Visual */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: 300, md: 380 },
              }}
            >
              {/* Main Visual Card */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 440,
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 16px 40px -12px rgba(0, 0, 0, 0.1)',
                  p: 3,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Card Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChartIcon sx={{ color: '#0284c7', fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        Risk Analytics
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Logistic Regression Model
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="LIVE" size="small" sx={{ backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                </Box>

                {/* Visual Bar Chart Area */}
                <Box sx={{ backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', p: 2.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, gap: 1 }}>
                    {[45, 72, 58, 85, 40, 68, 92, 55].map((h, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: `${h}%`,
                          borderRadius: '6px 6px 0 0',
                          backgroundColor: i === 6 ? '#0284c7' : i % 2 === 0 ? '#bae6fd' : '#e0f2fe',
                          transition: 'height 0.5s ease',
                          minWidth: 0,
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <ShieldIcon sx={{ color: '#0284c7', fontSize: 28, opacity: 0.6 }} />
                  </Box>
                </Box>

                {/* Stats Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#ecfdf5', borderRadius: '10px' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>6.3%</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#047857', fontWeight: 600 }}>Default Rate</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f0f9ff', borderRadius: '10px' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{accuracyPct}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Accuracy</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#fffbeb', borderRadius: '10px' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>16</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#b45309', fontWeight: 600 }}>Features</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Floating Card 1: Lower Risk */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: -10, md: 10 },
                  left: { xs: -5, md: -30 },
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #6ee7b7',
                  boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.2)',
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  zIndex: 2,
                }}
              >
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>Lower Risk</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>Better Decisions</Typography>
                </Box>
              </Box>

              {/* Floating Card 2: Data Driven */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -10, md: 15 },
                  right: { xs: -5, md: -20 },
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #bae6fd',
                  boxShadow: '0 8px 24px -6px rgba(2, 132, 199, 0.2)',
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  zIndex: 2,
                }}
              >
                <TrendingUpIcon sx={{ color: '#0284c7', fontSize: 20 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>Data Driven</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>Fair & Accurate</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── WHY CHOOSE LOANGUARD ─── */}
      <Box sx={{ pb: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 800, mb: 1 }}>
              Why Choose LoanGuard?
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem' }}>
              Reliable. Fast. Intelligent. Built for better financial decisions.
            </Typography>
          </Box>

          {/* 2 × 2 Feature Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: '24px',
            }}
          >
            {featureCards.map((card, idx) => (
              <Box
                key={idx}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  p: '28px',
                  minHeight: 170,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {/* 56x56px Circular Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: card.iconBg,
                    color: card.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </Box>

                <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>
                  {card.title}
                </Typography>

                <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.98rem', mt: 'auto' }}>
                  {card.description ? card.description : <Skeleton variant="text" width="90%" />}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── RESPONSIBLE LENDING BANNER ─── */}
      <Box sx={{ pb: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              width: '100%',
              borderRadius: '20px',
              border: '1px solid #bae6fd',
              backgroundColor: '#f0f9ff',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SecurityIcon sx={{ fontSize: 28 }} />
            </Box>

            <Box>
              <Typography sx={{ color: '#0369a1', fontWeight: 800, fontSize: '1.25rem', mb: 0.5 }}>
                Empowering Responsible Lending
              </Typography>
              <Typography sx={{ color: '#334155', lineHeight: 1.6, fontSize: '0.98rem' }}>
                Use data and AI to create fairer, faster, and more transparent loan approval processes.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default Home;
