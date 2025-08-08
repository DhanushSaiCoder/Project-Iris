import React from 'react';

const IrisSpinnerSecondary = ({ size = 24 }) => {
  const spinnerStyles = {
    position: 'relative',
    display: 'inline-block',
    width: size,
    height: size,
    minWidth: '20px',
    minHeight: '20px',
  };

  const coreStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: size <= 16 ? '2px' : size >= 24 ? '4px' : '3px',
    height: size <= 16 ? '2px' : size >= 24 ? '4px' : '3px',
    backgroundColor: '#ebf4ff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'coreSecondaryPulse 1.8s ease-in-out infinite',
    zIndex: 3,
  };

  const ringStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    border: '1px solid transparent',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'ringSecondaryExpand 1.8s ease-out infinite',
    opacity: 0,
  };

  return (
    <>
      <style>{`
        @keyframes coreSecondaryPulse {
          0%, 100% {
            background-color: #ebf4ff;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            background-color: #d0e0f0;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @keyframes ringSecondaryExpand {
          0% {
            width: 6px;
            height: 6px;
            border-color: #ebf4ff;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          20% {
            opacity: 0.8;
            border-color: #ebf4ff;
          }
          40% {
            opacity: 0.6;
            border-color: #d0e0f0;
          }
          70% {
            opacity: 0.3;
            border-color: #d0e0f0;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            width: 100%;
            height: 100%;
            border-color: #d0e0f0;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .iris-spinner-secondary-core {
            animation: none !important;
            background-color: #ebf4ff !important;
          }
          .iris-spinner-secondary-ring {
            animation: none !important;
            opacity: 0.3 !important;
            border-color: #d0e0f0 !important;
            width: 100% !important;
            height: 100% !important;
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>
      
      <div style={spinnerStyles}>
        {/* Central processing core */}
        <div className="iris-spinner-secondary-core" style={coreStyles}></div>
        
        {/* Detection rings */}
        <div 
          className="iris-spinner-secondary-ring" 
          style={{...ringStyles, animationDelay: '0s'}}
        ></div>
        <div 
          className="iris-spinner-secondary-ring" 
          style={{...ringStyles, animationDelay: '0.3s'}}
        ></div>
        <div 
          className="iris-spinner-secondary-ring" 
          style={{...ringStyles, animationDelay: '0.6s'}}
        ></div>
      </div>
    </>
  );
};

export default IrisSpinnerSecondary;