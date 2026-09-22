import React, { useState, useRef } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Button, CircularProgress, Alert, InputAdornment, Tooltip, Stack, Divider
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import SendIcon from '@mui/icons-material/Send';
import { predictLoanDefault } from '../services/api';
import { savePredictionRecord } from '../services/historyStorage';
import PredictionResult from '../components/PredictionResult';

const initialFormData = {
  Age: 35,
  Income: 50000,
  Education: "Bachelor's",
  EmploymentType: 'Full-time',
  MaritalStatus: 'Single',
  MonthsEmployed: 60,
  HasDependents: 0,
  CreditScore: 700,
  NumCreditLines: 3,
  DTIRatio: 0.25,
  HasMortgage: 1,
  HasCoSigner: 1,
  LoanAmount: 20000,
  InterestRate: 8.5,
  LoanTerm: 36,
  LoanPurpose: 'Home',
};

const Prediction = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const resultRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Age || formData.Age < 18 || formData.Age > 100) {
      newErrors.Age = 'Age must be between 18 and 100';
    }
    if (!formData.Income || Number(formData.Income) <= 0) {
      newErrors.Income = 'Annual income must be greater than 0';
    }
    if (formData.MonthsEmployed < 0) {
      newErrors.MonthsEmployed = 'Months employed cannot be negative';
    }
    if (!formData.CreditScore || formData.CreditScore < 300 || formData.CreditScore > 850) {
      newErrors.CreditScore = 'Credit score must be between 300 and 850';
    }
    if (formData.NumCreditLines < 0) {
      newErrors.NumCreditLines = 'Number of credit lines cannot be negative';
    }
    if (formData.DTIRatio === '' || formData.DTIRatio < 0 || formData.DTIRatio > 1) {
      newErrors.DTIRatio = 'DTI ratio must be a decimal between 0.0 and 1.0 (e.g. 0.25 for 25%)';
    }
    if (!formData.LoanAmount || Number(formData.LoanAmount) <= 0) {
      newErrors.LoanAmount = 'Loan amount must be greater than 0';
    }
    if (formData.InterestRate === '' || Number(formData.InterestRate) < 0) {
      newErrors.InterestRate = 'Interest rate must be 0 or greater';
    }
    if (!formData.LoanTerm || Number(formData.LoanTerm) <= 0) {
      newErrors.LoanTerm = 'Loan term must be greater than 0 months';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        Age: parseInt(formData.Age, 10),
        Income: parseFloat(formData.Income),
        LoanAmount: parseFloat(formData.LoanAmount),
        CreditScore: parseInt(formData.CreditScore, 10),
        MonthsEmployed: parseInt(formData.MonthsEmployed, 10),
        NumCreditLines: parseInt(formData.NumCreditLines, 10),
        InterestRate: parseFloat(formData.InterestRate),
        LoanTerm: parseInt(formData.LoanTerm, 10),
        DTIRatio: parseFloat(formData.DTIRatio),
        Education: formData.Education,
        EmploymentType: formData.EmploymentType,
        MaritalStatus: formData.MaritalStatus,
        HasMortgage: parseInt(formData.HasMortgage, 10),
        HasDependents: parseInt(formData.HasDependents, 10),
        LoanPurpose: formData.LoanPurpose,
        HasCoSigner: parseInt(formData.HasCoSigner, 10),
      };

      const result = await predictLoanDefault(payload);
      setPredictionResult(result);

      // Save complete input & prediction record into localStorage
      savePredictionRecord(payload, result);

      // Smooth auto-scroll to the prediction result section
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Prediction Submission Error:', err);
      setApiError(err.message || 'Unable to connect to the prediction service. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '90vh', backgroundColor: '#f8fafc', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 800, mb: 0.5 }}>
            Loan Default Risk Assessment Form
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Provide complete applicant, financial position, and loan request parameters to estimate default probability.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION 1: APPLICANT INFORMATION */}
          <Card elevation={0} sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex' }}>
                  <PersonOutlineIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    Section 1: Applicant Information
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Personal demographics, employment history, and family status
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="Age"
                    type="number"
                    value={formData.Age}
                    onChange={handleChange}
                    error={Boolean(errors.Age)}
                    helperText={errors.Age || "Applicant's age in years (18-100)"}
                    InputProps={{ inputProps: { min: 18, max: 100 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Annual Income"
                    name="Income"
                    type="number"
                    value={formData.Income}
                    onChange={handleChange}
                    error={Boolean(errors.Income)}
                    helperText={errors.Income || 'Gross annual income in USD'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Education Level"
                    name="Education"
                    value={formData.Education}
                    onChange={handleChange}
                    helperText="Highest educational qualification"
                  >
                    <MenuItem value="High School">High School</MenuItem>
                    <MenuItem value="Bachelor's">Bachelor's</MenuItem>
                    <MenuItem value="Master's">Master's</MenuItem>
                    <MenuItem value="PhD">PhD</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Employment Type"
                    name="EmploymentType"
                    value={formData.EmploymentType}
                    onChange={handleChange}
                    helperText="Current employment status"
                  >
                    <MenuItem value="Full-time">Full-time (Salaried)</MenuItem>
                    <MenuItem value="Part-time">Part-time (Business)</MenuItem>
                    <MenuItem value="Self-employed">Self-employed</MenuItem>
                    <MenuItem value="Unemployed">Unemployed</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Marital Status"
                    name="MaritalStatus"
                    value={formData.MaritalStatus}
                    onChange={handleChange}
                    helperText="Current marital status"
                  >
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Months Employed"
                    name="MonthsEmployed"
                    type="number"
                    value={formData.MonthsEmployed}
                    onChange={handleChange}
                    error={Boolean(errors.MonthsEmployed)}
                    helperText={errors.MonthsEmployed || 'Duration in current employment (months)'}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Has Dependents"
                    name="HasDependents"
                    value={formData.HasDependents}
                    onChange={handleChange}
                    helperText="Does applicant have financial dependents?"
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* SECTION 2: CREDIT INFORMATION */}
          <Card elevation={0} sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex' }}>
                  <CreditScoreIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    Section 2: Credit Information
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Credit score, debt leverage ratios, and existing financial obligations
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Credit Score"
                    name="CreditScore"
                    type="number"
                    value={formData.CreditScore}
                    onChange={handleChange}
                    error={Boolean(errors.CreditScore)}
                    helperText={errors.CreditScore || "Enter applicant's credit score (300-850)"}
                    InputProps={{ inputProps: { min: 300, max: 850 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Number of Credit Lines"
                    name="NumCreditLines"
                    type="number"
                    value={formData.NumCreditLines}
                    onChange={handleChange}
                    error={Boolean(errors.NumCreditLines)}
                    helperText={errors.NumCreditLines || 'Total active credit accounts'}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="DTI Ratio"
                    name="DTIRatio"
                    type="number"
                    value={formData.DTIRatio}
                    onChange={handleChange}
                    error={Boolean(errors.DTIRatio)}
                    helperText={errors.DTIRatio || 'Debt-to-income ratio (e.g. 0.25 = 25%)'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Total monthly debt payments divided by gross monthly income (0.0 to 1.0)">
                            <HelpOutlineIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                      inputProps: { step: 0.01, min: 0, max: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Existing Mortgage"
                    name="HasMortgage"
                    value={formData.HasMortgage}
                    onChange={handleChange}
                    helperText="Does applicant have an active mortgage?"
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Has Co-Signer"
                    name="HasCoSigner"
                    value={formData.HasCoSigner}
                    onChange={handleChange}
                    helperText="Is a creditworthy co-signer backing the loan?"
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* SECTION 3: LOAN INFORMATION */}
          <Card elevation={0} sx={{ mb: 4, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex' }}>
                  <AccountBalanceWalletIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    Section 3: Loan Information
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Requested loan amount, term, interest rate, and stated purpose
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Loan Amount"
                    name="LoanAmount"
                    type="number"
                    value={formData.LoanAmount}
                    onChange={handleChange}
                    error={Boolean(errors.LoanAmount)}
                    helperText={errors.LoanAmount || 'Requested loan principal in USD'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Interest Rate"
                    name="InterestRate"
                    type="number"
                    value={formData.InterestRate}
                    onChange={handleChange}
                    error={Boolean(errors.InterestRate)}
                    helperText={errors.InterestRate || 'Annual interest rate percentage'}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      inputProps: { step: 0.1, min: 0 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Loan Term"
                    name="LoanTerm"
                    value={formData.LoanTerm}
                    onChange={handleChange}
                    helperText="Loan duration in months"
                  >
                    <MenuItem value={12}>12 Months (1 Year)</MenuItem>
                    <MenuItem value={24}>24 Months (2 Years)</MenuItem>
                    <MenuItem value={36}>36 Months (3 Years)</MenuItem>
                    <MenuItem value={48}>48 Months (4 Years)</MenuItem>
                    <MenuItem value={60}>60 Months (5 Years)</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Loan Purpose"
                    name="LoanPurpose"
                    value={formData.LoanPurpose}
                    onChange={handleChange}
                    helperText="Stated purpose of requested loan"
                  >
                    <MenuItem value="Home">Home Improvement / Real Estate</MenuItem>
                    <MenuItem value="Auto">Auto Purchase</MenuItem>
                    <MenuItem value="Education">Higher Education</MenuItem>
                    <MenuItem value="Business">Small Business Expansion</MenuItem>
                    <MenuItem value="Other">Personal / Medical / Other</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* API ERROR ALERT */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {apiError}
            </Alert>
          )}

          {/* SUBMIT BUTTON */}
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                px: 6,
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '10px',
                minWidth: 260,
              }}
            >
              {loading ? 'Predicting...' : 'Predict Loan Risk'}
            </Button>
          </Box>
        </form>

        {/* RESULT SECTION WITH AUTO-SCROLL REF */}
        <Box ref={resultRef}>
          {predictionResult && (
            <Box sx={{ pt: 2, pb: 4 }}>
              <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 700, mb: 2 }}>
                Prediction Result Output
              </Typography>
              <PredictionResult result={predictionResult} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Prediction;
