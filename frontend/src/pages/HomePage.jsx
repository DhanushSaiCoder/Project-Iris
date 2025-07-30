import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [videoWidth, setVideoWidth] = useState(0);
    const navigate = useNavigate();

    const handleStartDetection = () => {
        setIsDetecting(true);
    };

    const handleEndDetection = () => {
        navigate("/session-summary");
    };

    return (
        <div className={styles.HomePage}>
            <div className={styles.videoStreamDiv} style={{ width: videoWidth }}>
                <VideoStream 
                    isDetecting={isDetecting} 
                    onModelsLoaded={() => setModelsLoaded(true)} 
                    onVideoReady={setVideoWidth}
                />
            </div>
            <div className={styles.startBtnDiv}>
                <button
                    className={isDetecting ? styles.endBtn : styles.startBtn}
                    onClick={isDetecting ? handleEndDetection : handleStartDetection}
                    disabled={!modelsLoaded}
                >
                    {modelsLoaded
                        ? isDetecting
                            ? "End Detection"
                            : "Start Detection"
                        : "Loading Models..."}
                </button>
            </div>
        </div>
    );
};

export default HomePage;
