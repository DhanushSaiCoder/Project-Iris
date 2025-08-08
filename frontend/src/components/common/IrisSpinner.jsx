import React from 'react';

const IrisSpinner = ({ size = 24 }) => {
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
    backgroundColor: '#3a3a3a',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'corePulse 1.8s ease-in-out infinite',
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
    animation: 'ringExpand 1.8s ease-out infinite',
    opacity: 0,
  };

  return (
    <>
      <style>{`
        @keyframes corePulse {
          0%, 100% {
            background-color: #3a3a3a;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            background-color: #2a2a2a;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @keyframes ringExpand {
          0% {
            width: 6px;
            height: 6px;
            border-color: #3a3a3a;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          20% {
            opacity: 0.8;
            border-color: #3a3a3a;
          }
          40% {
            opacity: 0.6;
            border-color: #2a2a2a;
          }
          70% {
            opacity: 0.3;
            border-color: #121212;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            width: 100%;
            height: 100%;
            border-color: #121212;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .iris-spinner-core {
            animation: none !important;
            background-color: #3a3a3a !important;
          }
          .iris-spinner-ring {
            animation: none !important;
            opacity: 0.3 !important;
            border-color: #2a2a2a !important;
            width: 100% !important;
            height: 100% !important;
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>
      
      <div style={spinnerStyles}>
        {/* Central processing core */}
        <div className="iris-spinner-core" style={coreStyles}></div>
        
        {/* Detection rings */}
        <div 
          className="iris-spinner-ring" 
          style={{...ringStyles, animationDelay: '0s'}}
        ></div>
        <div 
          className="iris-spinner-ring" 
          style={{...ringStyles, animationDelay: '0.3s'}}
        ></div>
        <div 
          className="iris-spinner-ring" 
          style={{...ringStyles, animationDelay: '0.6s'}}
        ></div>
      </div>
    </>
  );
};

export default IrisSpinner;