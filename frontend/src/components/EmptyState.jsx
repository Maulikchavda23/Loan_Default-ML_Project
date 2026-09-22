import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Link as RouterLink } from 'react-router-dom';

const EmptyState = ({ title = 'No History Available', description = 'You have not made any predictions yet.', actionText = 'Make a Prediction', actionPath = '/predict' }) => {
  return (
    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, textAlign: 'center', py: 6, px: 3 }}>
      <CardContent sx={{ maxWidth: 460, mx: 'auto' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          {description}
        </Typography>
        {actionText && actionPath && (
          <Button component={RouterLink} to={actionPath} variant="contained" color="primary">
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
