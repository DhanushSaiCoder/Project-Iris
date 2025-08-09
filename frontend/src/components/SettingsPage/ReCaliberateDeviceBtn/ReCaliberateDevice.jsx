import React from 'react';
import styles from "./ReCaliberateDevice.module.css"
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReCaliberateDevice = () => {
    const navigate = useNavigate()
    return (
        <div className={styles.ReCaliberateDevice}>
            <button onClick={() => { navigate('/calibration') }}><RotateCcw />Recaliberate Device</button>
        </div>
    );
}

export default ReCaliberateDevice;