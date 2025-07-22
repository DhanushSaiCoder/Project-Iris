// utils/isMobile.js
export function isMobileDevice() {
  // Simple UA sniff (good for most cases)
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}
