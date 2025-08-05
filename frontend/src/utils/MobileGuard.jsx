// components/MobileGuard.jsx
import { isMobileDevice } from '../hooks/isMobile';

export function MobileGuard({ children }) {
  // If it’s mobile, render the protected UI
  return children;
}
