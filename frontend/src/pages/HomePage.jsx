import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import DetectedObjectsList from "../components/ObjectDetector/DetectedObjectsList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import styles from "./HomePage.module.css";
import SessionSummary from "./SessionSummary";

const HomePage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsAreLoading, setModelsAreLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const navigate = useNavigate();
  
  const handleStartDetection = () => {
    setIsDetecting(true);
  };
  
  
  const handleEndDetection = () => {
    localStorage.setItem("sessionObjects", JSON.stringify(detectedObjects));
    
    setIsDetecting(false);
    navigate("/session-summary");
  };
  
  
  const handleLoadingChange = (loading) => {
    setModelsAreLoading(loading);
  };
  
  const handleObjectDetection = (objects) => {
    setDetectedObjects((prevObjects) => [...prevObjects, ...objects]);
  };
  
   
  
  
  return (
    <div className={styles.homePage}>
            <div
                className={`${styles.mainContentWrapper} ${
                    isDetecting ? styles.detecting : ""
                }`}
            >
                <div className={styles.videoStreamDiv}>
                    <div className={styles.videoWrapper}>
                        <VideoStream
                            isDetecting={isDetecting}
                            onLoadingChange={handleLoadingChange}
                            onObjectDetection={handleObjectDetection}
                        />
                    </div>
                </div>
                {isDetecting && (
                    <div className={styles.detectedObjectsListDiv}>
                        <DetectedObjectsList detectedObjects={detectedObjects} />
                    </div>
                )}
            </div>
            
            <div className={styles.controlsDiv}>
                <button
                    className={`${styles.controlBtn} ${
                        isDetecting ? styles.endBtn : styles.startBtn
                    } ${modelsAreLoading ? styles.disabledBtn : ""}`}
                    onClick={
                        isDetecting ? handleEndDetection : handleStartDetection
                    }
                    disabled={modelsAreLoading}
                >
                    {modelsAreLoading ? (
                        <LoadingSpinner />
                    ) : isDetecting ? (
                        "End Detection"
                    ) : (
                        "Start Detection"
                    )}
                </button>
            </div>
            
        </div>
  );
};

export default HomePage;