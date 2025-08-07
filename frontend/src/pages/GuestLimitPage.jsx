import React from 'react';
import GuestSessionLimitModal from '../components/common/GuestSessionLimitModal';

const GuestLimitPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <GuestSessionLimitModal />
    </div>
  );
};

export default GuestLimitPage;