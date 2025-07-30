import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import DetectedObjectsList from "../components/ObjectDetector/DetectedObjectsList";
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [modelsAreLoading, setModelsAreLoading] = useState(false);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const navigate = useNavigate();

    const handleStartDetection = () => {
        setIsDetecting(true);
    };

    const handleEndDetection = () => {
        setIsDetecting(false);
        navigate("/session-summary");
    };

    const handleLoadingChange = (loading) => {
        setModelsAreLoading(loading);
    };

    const handleObjectDetection = (objects) => {
        setDetectedObjects(prevObjects => [...prevObjects, ...objects]);
    };

    return (
        <div className={styles.HomePage}>
            <div className={styles.videoStreamDiv}>
                <div className={styles.videoWrapper}>
                    <VideoStream
                        isDetecting={isDetecting}
                        onLoadingChange={handleLoadingChange}
                        onObjectDetection={handleObjectDetection}
                    />
                </div>
            </div>
            <div className={styles.startBtnDiv}>
                <button
                    className={
                        isDetecting && modelsAreLoading
                            ? styles.disabledBtn
                            : isDetecting
                            ? styles.endBtn
                            : styles.startBtn
                    }
                    onClick={
                        isDetecting ? handleEndDetection : handleStartDetection
                    }
                    disabled={isDetecting && modelsAreLoading}
                >
                    {isDetecting
                        ? modelsAreLoading
                            ? "Loading Models..."
                            : "End Detection"
                        : "Start Detection"}
                </button>
            </div>
            <DetectedObjectsList detectedObjects={detectedObjects} />
        </div>
    );
};

export default HomePage;
