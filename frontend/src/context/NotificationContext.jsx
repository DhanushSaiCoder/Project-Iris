import React, { createContext, useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, severity = 'info') => {
    setNotification({ message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
