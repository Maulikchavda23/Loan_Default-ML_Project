import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Chip, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import TransformIcon from '@mui/icons-material/Transform';
import CalculateIcon from '@mui/icons-material/Calculate';
import PercentIcon from '@mui/icons-material/Percent';
import SecurityIcon from '@mui/icons-material/Security';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { getModelInfo } from '../services/api';

/* ─── Reusable Card Header ─── */
const SectionCardHeader = ({ icon, sectionNum, title, subtitle, iconBg = '#f0f9ff', iconColor = '#0284c7' }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
      <Box
        sx={{
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#0284c7', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          SECTION {sectionNum}
        </Typography>
        <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
    <Divider sx={{ borderColor: '#f1f5f9' }} />
  </Box>
);

/* ─── Shared card styles ─── */
const cardSx = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  minWidth: 0,
};

const About = () => {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    getModelInfo().then(setModelInfo).catch(console.error);
  }, []);

  const accuracyPct = modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : '88.5%';
  const rocAucVal = modelInfo?.roc_auc ? modelInfo.roc_auc.toFixed(2) : '0.73';

  const pipelineNodes = [
    { num: '01', label: 'Applicant Data', desc: '16 Input Fields' },
    { num: '02', label: 'Preprocessing', desc: 'OHE & Scaling' },
    { num: '03', label: 'Logistic Regression', desc: 'Sigmoid Scoring' },
    { num: '04', label: 'Default Probability', desc: '0.0% to 100.0%' },
    { num: '05', label: 'Risk Classification', desc: 'Low, Medium, High' },
  ];

  const modelComparisonData = [
    { name: 'Logistic Regression', accuracy: accuracyPct, status: 'Production Model (Live)' },
    { name: 'Random Forest', accuracy: '88.5%', status: 'Evaluated Model' },
    { name: 'Gradient Boosting', accuracy: '87.8%', status: 'Evaluated Model' },
    { name: 'AdaBoost', accuracy: '86.2%', status: 'Evaluated Model' },
  ];

  /* ─── Shared container ─── */
  const containerSx = {
    width: '100%',
    maxWidth: 1200,
    mx: 'auto',
    px: { xs: 2, sm: 3 },
    boxSizing: 'border-box',
  };

  /* ─── 2-column grid row ─── */
  const twoColGrid = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
    gap: '24px',
  };

  return (
    <Box sx={{ minHeight: '90vh', backgroundColor: '#f8fafc', py: { xs: 4, md: 7 } }}>
      <Box sx={containerSx}>

        {/* ─── PAGE HEADER ─── */}
        <Box sx={{ mb: 5, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          <Chip
            icon={<VerifiedUserIcon style={{ fontSize: 16, color: '#047857' }} />}
            label="Logistic Regression — Production Model"
            sx={{
              backgroundColor: '#ecfdf5', color: '#047857',
              fontWeight: 700, fontSize: '0.8rem',
              px: 1.5, py: 2, borderRadius: '20px', mb: 2.5,
            }}
          />
          <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 800, mb: 1.5, fontSize: { xs: '2.2rem', md: '2.8rem' } }}>
            About the Model
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Learn how LoanGuard predicts the likelihood of loan default using machine learning, feature engineering, and statistical risk classification.
          </Typography>
        </Box>

        {/* ─── CARD STACK ─── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* CARD 01 — MODEL OVERVIEW (Full Width) */}
          <Box sx={cardSx}>
            <SectionCardHeader
              icon={<MemoryIcon sx={{ fontSize: 28 }} />}
              sectionNum="01"
              title="Model Overview"
              subtitle="System Architecture & Objective"
            />
            <Typography sx={{ color: '#334155', lineHeight: 1.7, mb: 2.5 }}>
              LoanGuard is an enterprise credit risk assessment platform designed to estimate the statistical probability of a loan applicant defaulting on debt obligations. The live production model utilizes an optimized <strong>Logistic Regression</strong> machine learning pipeline trained on historical loan underwriting datasets.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: '12px' }}>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Production Algorithm</Typography>
                <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>Logistic Regression</Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Verified Accuracy</Typography>
                <Typography sx={{ color: '#10b981', fontWeight: 700 }}>{accuracyPct}</Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Feature Input Space</Typography>
                <Typography sx={{ color: '#0284c7', fontWeight: 700 }}>16 Standardized Features</Typography>
              </Box>
            </Box>
          </Box>

          {/* ROW 1 — INPUT FEATURES + PREPROCESSING */}
          <Box sx={twoColGrid}>
            {/* Card 02 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<StorageIcon sx={{ fontSize: 28 }} />}
                sectionNum="02"
                title="Input Features"
                subtitle="16 Financial & Demographic Variables"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', mb: 2 }}>
                The model evaluates 16 applicant parameters categorized into three logical risk groups:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mt: 'auto' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                  <Typography sx={{ color: '#0369a1', fontWeight: 700, fontSize: '0.78rem', mb: 0.5 }}>
                    👤 Applicant Profile (7 Features)
                  </Typography>
                  <Typography sx={{ color: '#334155', fontSize: '0.75rem' }}>
                    Age, Income, Education, EmploymentType, MaritalStatus, MonthsEmployed, HasDependents
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #6ee7b7' }}>
                  <Typography sx={{ color: '#047857', fontWeight: 700, fontSize: '0.78rem', mb: 0.5 }}>
                    💳 Credit & Leverage (5 Features)
                  </Typography>
                  <Typography sx={{ color: '#334155', fontSize: '0.75rem' }}>
                    CreditScore, NumCreditLines, DTIRatio, HasMortgage, HasCoSigner
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
                  <Typography sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.78rem', mb: 0.5 }}>
                    🏦 Requested Loan (4 Features)
                  </Typography>
                  <Typography sx={{ color: '#334155', fontSize: '0.75rem' }}>
                    LoanAmount, InterestRate, LoanTerm, LoanPurpose
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Card 03 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<TransformIcon sx={{ fontSize: 28 }} />}
                sectionNum="03"
                title="Preprocessing Pipeline"
                subtitle="Data Transformation & Encoding"
                iconBg="#ecfdf5"
                iconColor="#10b981"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', mb: 2 }}>
                Incoming request parameters pass through a scikit-learn ColumnTransformer preprocessing pipeline:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mt: 'auto' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>
                    One-Hot Encoding (OHE)
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5 }}>
                    Categorical fields (Education, EmploymentType, MaritalStatus, LoanPurpose, binary flags) are transformed into sparse binary columns matching training specifications.
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>
                    StandardScaler Normalization
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5 }}>
                    Numerical metrics (Income, LoanAmount, CreditScore, DTI) are zero-mean unit-variance scaled to eliminate feature magnitude bias.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ROW 2 — LOGISTIC REGRESSION + PROBABILITY */}
          <Box sx={twoColGrid}>
            {/* Card 04 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<CalculateIcon sx={{ fontSize: 28 }} />}
                sectionNum="04"
                title="Logistic Regression"
                subtitle="Live Production Mathematical Function"
                iconBg="#f3e8ff"
                iconColor="#9333ea"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', mb: 2 }}>
                The live inference engine applies optimized weight vectors to compute log-odds and sigmoid activation:
              </Typography>
              <Box sx={{ p: 2, backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '12px', fontFamily: 'monospace', textAlign: 'center', my: 'auto' }}>
                <Typography sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.92rem' }}>
                  P(Default) = 1 / (1 + e^-(β₀ + β₁X₁ + ... + βₖXₖ))
                </Typography>
              </Box>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 2 }}>
                Produces smooth, continuous probability bounds without artificial step-function quantization.
              </Typography>
            </Box>

            {/* Card 05 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<PercentIcon sx={{ fontSize: 28 }} />}
                sectionNum="05"
                title="Prediction Probability"
                subtitle="Continuous Default Risk Metrics"
                iconBg="#fffbeb"
                iconColor="#f59e0b"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', mb: 2 }}>
                Calculates exact probability scores ranging from 0.0% to 100.0%:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mt: 'auto' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>Target 0: No Default</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5 }}>
                    High probability that applicant will successfully fulfill debt repayment schedule.
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>Target 1: Default</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5 }}>
                    High probability that applicant may default or require secondary manual underwriting review.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ROW 3 — RISK CLASSIFICATION + MODEL EVALUATION */}
          <Box sx={twoColGrid}>
            {/* Card 06 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<SecurityIcon sx={{ fontSize: 28 }} />}
                sectionNum="06"
                title="Risk Classification"
                subtitle="Business Rule Categorization Tiers"
                iconBg="#fef2f2"
                iconColor="#ef4444"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', mb: 2 }}>
                Continuous probabilities are mapped into three distinct institutional risk categories:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.2, backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #6ee7b7' }}>
                  <Typography sx={{ color: '#047857', fontWeight: 700, fontSize: '0.88rem' }}>Low Risk</Typography>
                  <Typography sx={{ color: '#047857', fontWeight: 700, fontSize: '0.75rem' }}>Default Probability &lt; 25%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.2, backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
                  <Typography sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.88rem' }}>Medium Risk</Typography>
                  <Typography sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.75rem' }}>25% ≤ Probability &lt; 50%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.2, backgroundColor: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                  <Typography sx={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.88rem' }}>High Risk</Typography>
                  <Typography sx={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.75rem' }}>Default Probability ≥ 50%</Typography>
                </Box>
              </Box>
            </Box>

            {/* Card 07 */}
            <Box sx={{ ...cardSx, height: '100%' }}>
              <SectionCardHeader
                icon={<EqualizerIcon sx={{ fontSize: 28 }} />}
                sectionNum="07"
                title="Model Evaluation"
                subtitle="Production Model vs Benchmark Algorithms"
              />
              <Typography sx={{ color: '#475569', lineHeight: 1.5, fontSize: '0.92rem', mb: 2 }}>
                <strong>Logistic Regression</strong> is deployed as the active production model. Multiple candidate algorithms were benchmarked during model selection:
              </Typography>
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', mt: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>Algorithm</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>Accuracy</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modelComparisonData.map((row, idx) => (
                      <TableRow key={idx} sx={{ backgroundColor: idx === 0 ? '#f0f9ff' : 'transparent', '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {idx === 0 && <CheckCircleIcon fontSize="inherit" sx={{ color: '#0284c7' }} />}
                            <span>{row.name}</span>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: idx === 0 ? '#10b981' : '#475569', fontSize: '0.8rem' }}>
                          {row.accuracy}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={idx === 0 ? 'Production' : 'Evaluated'}
                            size="small"
                            color={idx === 0 ? 'success' : 'default'}
                            sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Box>

          {/* CARD 08 — PREDICTION PIPELINE WORKFLOW (Full Width) */}
          <Box sx={cardSx}>
            <SectionCardHeader
              icon={<TransformIcon sx={{ fontSize: 28 }} />}
              sectionNum="08"
              title="Prediction Pipeline Workflow"
              subtitle="End-to-End Execution Sequence"
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
                gap: '12px',
                alignItems: 'stretch',
                pt: 1,
              }}
            >
              {pipelineNodes.map((node, index) => (
                <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', borderColor: '#bae6fd' },
                    }}
                  >
                    <Chip label={`Step ${node.num}`} size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, mb: 1 }} />
                    <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem' }}>
                      {node.label}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5 }}>
                      {node.desc}
                    </Typography>
                  </Box>
                  {index < pipelineNodes.length - 1 && (
                    <ArrowForwardIcon
                      sx={{
                        color: '#94a3b8',
                        fontSize: 18,
                        position: 'absolute',
                        right: -15,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: { xs: 'none', md: 'block' },
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default About;
