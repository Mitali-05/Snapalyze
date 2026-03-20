import { useState, useCallback } from 'react';

/**
 * useToast — lightweight toast notification hook
 *
 * Usage:
 *   const { toast, ToastComponent } = useToast();
 *   toast.success('Upload complete!');
 *   toast.error('Something went wrong');
 *   // In JSX: <ToastComponent />
 */
const useToast = () => {
  const [state, setState] = useState({
    open:     false,
    message:  '',
    severity: 'info',   // 'success' | 'error' | 'warning' | 'info'
  });

  const show = useCallback((message, severity = 'info') => {
    setState({ open: true, message, severity });
  }, []);

  const toast = {
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info:    (msg) => show(msg, 'info'),
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setState((s) => ({ ...s, open: false }));
  };

  return { toast, toastState: state, handleClose };
};

export default useToast;