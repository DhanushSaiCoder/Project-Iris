import React from 'react';
import styles from './GuestSessionLimitModal.module.css';
import { useNavigate } from 'react-router-dom';

const GuestSessionLimitModal = ({ onClose }) => {
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/signup');
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Session Limit Reached</h2>
                <p className={styles.modalMessage}>
                    You have completed all your guest sessions. Please sign up to continue using Project Iris and unlock unlimited sessions!
                </p>
                <button onClick={handleSignupClick} className={styles.signupButton}>
                    Sign Up Now
                </button>
                <button onClick={onClose} className={styles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default GuestSessionLimitModal;
