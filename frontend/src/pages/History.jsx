import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Stack, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import {
  getPredictionHistory,
  deletePredictionRecord,
  clearPredictionHistory,
  exportHistoryToCSV,
} from '../services/historyStorage';
import HistoryCharts from '../components/HistoryCharts';
import HistoryTable from '../components/HistoryTable';
import HistoryDetailsModal from '../components/HistoryDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getPredictionHistory();
    setHistory(data);
  };

  // View Details Modal
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  // Single Item Delete Confirmation
  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      const updated = deletePredictionRecord(deleteId);
      setHistory(updated);
      setDeleteId(null);
    }
  };

  // Clear All History Confirmation
  const handleConfirmClearAll = () => {
    const updated = clearPredictionHistory();
    setHistory(updated);
    setIsClearConfirmOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportHistoryToCSV();
  };

  // Metrics calculation
  const totalCount = history.length;
  const defaultCount = history.filter((h) => h.result?.prediction === 1 || h.result?.prediction_label === 'Default').length;
  const noDefaultCount = totalCount - defaultCount;
  const highRiskCount = history.filter((h) => h.result?.risk_level === 'High Risk').length;
  const avgProbability = totalCount > 0
    ? (history.reduce((acc, h) => acc + (h.result?.default_probability || 0), 0) / totalCount) * 100
    : 0;

  return (
    <Box sx={{ minHeight: '90vh', backgroundColor: '#f8fafc', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex' }}>
              <HistoryIcon fontSize="medium" />
            </Box>
            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 800 }}>
              Prediction Audit History & Analytics
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Historical record of all performed loan default risk assessments, visual distribution analytics, and audit exports.
          </Typography>
        </Box>

        {history.length === 0 ? (
          <EmptyState
            title="No Prediction History Found"
            description="You haven't generated any loan default predictions yet. Submit an applicant profile to view historical logs, analytics charts, and exportable CSV reports."
            actionText="Make Your First Prediction"
            actionPath="/predict"
          />
        ) : (
          <>
            {/* 5 SUMMARY KPI CARDS */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {/* Total Predictions */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                      Total Assessments
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 800, my: 0.5 }}>
                      {totalCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                      Logged Predictions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* No Defaults */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                      No Defaults
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 800, my: 0.5 }}>
                      {noDefaultCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                      {totalCount > 0 ? `${((noDefaultCount / totalCount) * 100).toFixed(0)}% of Total` : '0%'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Defaults */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                      Defaults Predicted
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 800, my: 0.5 }}>
                      {defaultCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                      {totalCount > 0 ? `${((defaultCount / totalCount) * 100).toFixed(0)}% of Total` : '0%'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* High Risk Cases */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                      High Risk Tiers
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#b91c1c', fontWeight: 800, my: 0.5 }}>
                      {highRiskCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 600 }}>
                      Requires Manual Review
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Default Probability */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                      Avg Probability
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 800, my: 0.5 }}>
                      {avgProbability.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Mean Default Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* ANALYTICS CHARTS */}
            <HistoryCharts history={history} />

            {/* AUDIT HISTORY TABLE */}
            <HistoryTable
              history={history}
              onViewRecord={handleViewRecord}
              onDeleteRecord={handleDeleteClick}
              onClearAll={() => setIsClearConfirmOpen(true)}
              onExportCSV={handleExportCSV}
            />
          </>
        )}

        {/* DETAILS MODAL */}
        <HistoryDetailsModal
          open={isDetailsOpen}
          record={selectedRecord}
          onClose={() => setIsDetailsOpen(false)}
        />

        {/* SINGLE DELETE CONFIRM DIALOG */}
        <ConfirmDialog
          open={Boolean(deleteId)}
          title="Delete History Record?"
          content="Are you sure you want to remove this prediction record from history? This action cannot be undone."
          confirmText="Delete Record"
          confirmColor="error"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />

        {/* CLEAR ALL CONFIRM DIALOG */}
        <ConfirmDialog
          open={isClearConfirmOpen}
          title="Clear All Prediction History?"
          content="Are you sure you want to clear all prediction records from history? All stored audits, charts, and CSV data will be permanently deleted."
          confirmText="Clear All History"
          confirmColor="error"
          onConfirm={handleConfirmClearAll}
          onCancel={() => setIsClearConfirmOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default History;
