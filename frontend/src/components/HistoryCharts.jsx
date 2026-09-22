import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const RISK_COLORS = {
  'Low Risk': '#10b981',
  'Medium Risk': '#f59e0b',
  'High Risk': '#ef4444',
};

const PREDICTION_COLORS = {
  'No Default': '#10b981',
  'Default': '#ef4444',
};

const HistoryCharts = ({ history = [] }) => {
  if (!history || history.length === 0) return null;

  // 1. Calculate Risk Level Breakdown
  const riskCounts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 };
  // 2. Calculate Prediction Breakdown
  const predCounts = { 'No Default': 0, 'Default': 0 };
  // 3. Activity by Date
  const activityMap = {};

  history.forEach((item) => {
    const res = item.result || {};
    const risk = res.risk_level || 'Low Risk';
    const predLabel = res.prediction_label || (res.prediction === 1 ? 'Default' : 'No Default');

    if (riskCounts[risk] !== undefined) riskCounts[risk]++;
    else riskCounts[risk] = 1;

    if (predCounts[predLabel] !== undefined) predCounts[predLabel]++;
    else predCounts[predLabel] = 1;

    const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
    activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
  });

  const riskData = Object.keys(riskCounts)
    .filter((key) => riskCounts[key] > 0)
    .map((key) => ({ name: key, value: riskCounts[key] }));

  const predData = Object.keys(predCounts).map((key) => ({ name: key, count: predCounts[key] }));

  const activityData = Object.keys(activityMap).map((date) => ({
    date,
    predictions: activityMap[date],
  })).reverse(); // Oldest to newest

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Chart 1: Risk Tier Distribution */}
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
              Risk Tier Distribution
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
              Breakdown of evaluated applicants by risk classification
            </Typography>

            <Box sx={{ width: '100%', height: 220, mt: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#0284c7'} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => [`${val} Applicants`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart 2: Prediction Outcome Breakdown */}
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
              Prediction Outcomes
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
              Binary model classification outcomes
            </Typography>

            <Box sx={{ width: '100%', height: 220, mt: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <RechartsTooltip formatter={(val) => [`${val} Records`, 'Count']} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {predData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={PREDICTION_COLORS[entry.name] || '#0284c7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart 3: Prediction Activity Timeline */}
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
              Prediction Volume Activity
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
              Number of credit assessments performed over time
            </Typography>

            <Box sx={{ width: '100%', height: 220, mt: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <RechartsTooltip formatter={(val) => [`${val} Predictions`, 'Volume']} />
                  <Line type="monotone" dataKey="predictions" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HistoryCharts;
