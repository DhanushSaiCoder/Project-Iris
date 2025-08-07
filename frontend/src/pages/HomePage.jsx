import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import GuestSessionLimitModal from "../components/common/GuestSessionLimitModal";
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
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [showGuestLimitContent, setShowGuestLimitContent] = useState(false);
  const navigate = useNavigate();
  const { developerMode } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);
  
  const handleStartDetection = () => {
    setSessionStartTime(Date.now());
    setIsDetecting(true);
  };
  
  
  const handleEndDetection = () => {
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;
    setIsDetecting(false);

    let currentUserId = "guest"; // Default to guest
    let shouldPostSession = false;
    let shouldNavigateToSummary = false;

    if (user && user.id) {
      currentUserId = user.id; // Use actual user ID if logged in
      shouldPostSession = true;
      shouldNavigateToSummary = true;
    } else {
      // Handle guest sessions
      let guestSessions = parseInt(localStorage.getItem("guestSessions") || "0");
      console.log("Guest sessions before increment:", guestSessions);
      guestSessions++;
      console.log("Guest sessions after increment:", guestSessions);
      localStorage.setItem("guestSessions", guestSessions.toString());

      if (guestSessions >= 3) {
        localStorage.setItem("guestLimitReached", "true");
      }
      shouldNavigateToSummary = true; // Always navigate to summary for guest sessions
      shouldPostSession = false; // Never post guest sessions to backend
    }

    const uniqueClasses = [...new Set(detectedObjects.map((obj) => obj.class))];
    const uniqueDetectionsCount = uniqueClasses.length;
    const totalDetections = detectedObjects.length;

    const payload = {
      userId: currentUserId,
      duration,
      uniqueObjects: uniqueDetectionsCount,
      totalDetections,
      allDetections: detectedObjects,
    };

    if (shouldPostSession) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/session`, payload)
        .then((response) => {
          console.log("Session posted successfully:", response.data);
          if (shouldNavigateToSummary) {
            navigate("/session-summary", { state: { detectedObjects, duration } });
          }
        })
        .catch((error) => {
          console.error("Error posting session:", error.message);
          if (shouldNavigateToSummary) {
            navigate("/session-summary", { state: { detectedObjects, duration } });
          }
        });
    } else if (shouldNavigateToSummary) {
      navigate("/session-summary", { state: { detectedObjects, duration } });
    }
  };

  useEffect(() => {
    const guestLimitReached = localStorage.getItem("guestLimitReached");
    if (guestLimitReached === "true" && !user) {
      setShowGuestLimitContent(true);
    } else {
      setShowGuestLimitContent(false);
      // If user logs in, reset the guest limit flag
      if (user && guestLimitReached === "true") {
        localStorage.removeItem("guestLimitReached");
        localStorage.removeItem("guestSessions");
      }
    }
  }, [user]);
  
  const handleLoadingChange = (loading) => {
    setModelsAreLoading(loading);
  };
  
  const handleObjectDetection = (objects) => {
    setDetectedObjects((prevObjects) => [...prevObjects, ...objects]);
  };
  
   
  
  
  return (
    <div className={styles.homePage}>
      {showGuestLimitContent ? (
        <GuestSessionLimitModal onClose={() => setShowGuestLimitContent(false)} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default HomePage;