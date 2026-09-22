import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';

const ConfirmDialog = ({ open, title, content, onConfirm, onCancel, confirmText = 'Delete', confirmColor = 'error' }) => {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 440 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex' }}>
          <WarningAmberIcon fontSize="medium" />
        </Box>
        {title || 'Confirm Action'}
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText sx={{ color: '#475569', fontSize: '0.95rem' }}>
          {content || 'Are you sure you want to proceed with this action? This step cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" sx={{ borderColor: '#cbd5e1' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
