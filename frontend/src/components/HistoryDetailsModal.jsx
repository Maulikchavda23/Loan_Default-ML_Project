import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Chip, Divider, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PredictionResult from './PredictionResult';

const HistoryDetailsModal = ({ open, record, onClose }) => {
  if (!record) return null;

  const { id, timestamp, inputs = {}, result = {} } = record;
  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'N/A';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
            Prediction Record Details
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            ID: {id} | Timestamp: {formattedDate}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Prediction Result Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Inference Output
          </Typography>
          <PredictionResult result={result} />
        </Box>

        {/* Input Parameters Overview */}
        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Applicant Input Parameters (16 Fields)
        </Typography>

        <Grid container spacing={2}>
          {/* Section 1: Applicant Info */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ color: '#0284c7', fontWeight: 700, mb: 1.5 }}>
                👤 Personal & Employment Profile
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Age</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.Age} Years</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Annual Income</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${Number(inputs.Income || 0).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Education</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.Education}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Employment Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.EmploymentType}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Marital Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.MaritalStatus}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Months Employed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.MonthsEmployed} Months</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Has Dependents</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.HasDependents === 1 || inputs.HasDependents === 'Yes' ? 'Yes' : 'No'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Section 2: Credit Info */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 700, mb: 1.5 }}>
                💳 Credit & Leverage Profile
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Credit Score</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.CreditScore}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Credit Lines</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.NumCreditLines}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>DTI Ratio</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(Number(inputs.DTIRatio || 0) * 100).toFixed(1)}%</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Has Mortgage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.HasMortgage === 1 || inputs.HasMortgage === 'Yes' ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Has Co-Signer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.HasCoSigner === 1 || inputs.HasCoSigner === 'Yes' ? 'Yes' : 'No'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Section 3: Loan Info */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1.5 }}>
                🏦 Loan Request Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Loan Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${Number(inputs.LoanAmount || 0).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Interest Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.InterestRate}%</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Loan Term</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.LoanTerm} Months</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Loan Purpose</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inputs.LoanPurpose}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryDetailsModal;
