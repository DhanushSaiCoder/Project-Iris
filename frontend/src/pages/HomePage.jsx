import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import DetectedObjectsList from "../components/ObjectDetector/DetectedObjectsList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import styles from "./HomePage.module.css";
import SessionSummary from "./SessionSummary";
import { SettingsContext } from "../context/SettingsContext";

const HomePage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsAreLoading, setModelsAreLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const navigate = useNavigate();
  const { developerMode } = useContext(SettingsContext);
  
  const handleStartDetection = () => {
    setSessionStartTime(Date.now());
    setIsDetecting(true);
  };
  
  
  const handleEndDetection = () => {
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;
    setIsDetecting(false);

    const userId = "user123"; // Replace with dynamic user ID if available
    const uniqueClasses = [...new Set(detectedObjects.map((obj) => obj.class))];
    const uniqueDetectionsCount = uniqueClasses.length;
    const totalDetections = detectedObjects.length;

    const payload = {
      userId,
      duration,
      uniqueObjects: uniqueDetectionsCount,
      totalDetections,
      allDetections: detectedObjects,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/session`, payload)
      .then((response) => {
        console.log("Session posted successfully:", response.data);
        navigate("/session-summary", { state: { detectedObjects, duration } });
      })
      .catch((error) => {
        console.error("Error posting session:", error.message);
        // Even if there's an error, navigate to the summary page
        navigate("/session-summary", { state: { detectedObjects, duration } });
      });
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
                {isDetecting && developerMode && (
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