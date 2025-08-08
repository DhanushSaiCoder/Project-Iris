import React, { useEffect, useState } from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    const [shouldRender, setShouldRender] = useState(true);
    const [animationClass, setAnimationClass] = useState(styles.fadeIn);

    const handleClose = () => {
        setAnimationClass(styles.fadeOut);
        setTimeout(() => {
            setShouldRender(false);
            onCancel(); // Call onCancel after animation
        }, 300); // Duration of fadeOut animation
    };

    const handleConfirm = () => {
        setAnimationClass(styles.fadeOut);
        setTimeout(() => {
            setShouldRender(false);
            onConfirm(); // Call onConfirm after animation
        }, 300); // Duration of fadeOut animation
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div className={`${styles.modalOverlay} ${animationClass}`}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={handleClose} className={styles.cancelButton}>Cancel</button>
                    <button onClick={handleConfirm} className={styles.confirmButton}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;