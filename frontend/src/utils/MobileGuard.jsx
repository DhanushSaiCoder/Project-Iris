// components/MobileGuard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobileDevice } from '../hooks/isMobile';

export function MobileGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobileDevice()) {
      navigate('/admin');  // or whatever path you choose
    }
  }, [navigate]);

  // If it’s mobile, render the protected UI
  return isMobileDevice() ? children : null;
}
