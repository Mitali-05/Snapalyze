import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Global toast snackbar.
 * Place once in App.js and pass the props from useToast().
 *
 * <ToastSnackbar state={toastState} onClose={handleClose} />
 */
const ToastSnackbar = ({ state, onClose }) => (
  <Snackbar
    open={state.open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert
      onClose={onClose}
      severity={state.severity}
      variant="filled"
      elevation={6}
      sx={{ minWidth: 280, borderRadius: 2, fontWeight: 500 }}
    >
      {state.message}
    </Alert>
  </Snackbar>
);

export default ToastSnackbar;