import React from 'react';
import styles from "./ReCaliberateDevice.module.css"
import { RotateCcw } from 'lucide-react';

const ReCaliberateDevice = () => {
    return (
        <div className={styles.ReCaliberateDevice}>
            <button><RotateCcw />Recaliberate Device</button>
        </div>
    );
}

export default ReCaliberateDevice;
