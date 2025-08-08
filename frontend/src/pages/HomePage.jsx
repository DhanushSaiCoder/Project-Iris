import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import GuestSessionLimitModal from "../components/common/GuestSessionLimitModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import DetectedObjectsList from "../components/ObjectDetector/DetectedObjectsList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import LoadingSpinnerSecondary from "../components/common/LoadingSpinnerSecondary";
import styles from "./HomePage.module.css";
import SessionSummary from "./SessionSummary";
import { SettingsContext } from "../context/SettingsContext";
import FullScreenLoading from "../components/common/FullScreenLoading"; // Import the new component

const HomePage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsAreLoading, setModelsAreLoading] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isPostingSession, setIsPostingSession] = useState(false);
  
  const navigate = useNavigate();
  const { developerMode } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const guestLimitReached = localStorage.getItem("guestLimitReached");
    if (guestLimitReached === "true" && !user) {
      navigate("/guest-limit");
    } else if (user && guestLimitReached === "true") {
      // If user logs in, reset the guest limit flag
      localStorage.removeItem("guestLimitReached");
      localStorage.removeItem("guestSessionsCount");
      localStorage.removeItem("guestSessionData"); // Also clear stored guest session data
    }
  }, [user, navigate]);
  
  const handleStartDetection = () => {
    setSessionStartTime(Date.now());
    setIsDetecting(true);
  };
  
  
  const handleEndDetection = () => {
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;
    setIsDetecting(false);

    const currentUserId = user ? user.id : "guest"; // Set currentUserId based on login status
    let shouldPostSession = !!user; // Post session if user is logged in
    let shouldNavigateToSummary = true; // Always navigate to summary

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

    if (!user) {
      // For guest users, store session data locally
      const storedGuestSessions = JSON.parse(localStorage.getItem("guestSessionData") || "[]");
      storedGuestSessions.push(payload);
      localStorage.setItem("guestSessionData", JSON.stringify(storedGuestSessions));

      let guestSessionsCount = parseInt(localStorage.getItem("guestSessionsCount") || "0");
      guestSessionsCount++;
      localStorage.setItem("guestSessionsCount", guestSessionsCount.toString());

      if (guestSessionsCount >= 3) {
        localStorage.setItem("guestLimitReached", "true");
      }
      shouldPostSession = false; // Ensure guest sessions are not posted to backend here
    }

    if (shouldPostSession) {
      setIsPostingSession(true);
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/session`, payload)
        .then((response) => {
          console.log("Session posted successfully:", response.data);
          if (shouldNavigateToSummary) {
            navigate("/session-summary", { state: { detectedObjects, duration } });
          }
        })
        .catch((error) => {
          console.error("Error posting session:", error.response ? error.response.data : error.message);
          if (shouldNavigateToSummary) {
            navigate("/session-summary", { state: { detectedObjects, duration } });
          }
        })
        .finally(() => {
          setIsPostingSession(false);
        });
    } else if (shouldNavigateToSummary) {
      navigate("/session-summary", { state: { detectedObjects, duration } });
    }
  };

  const handleLoadingChange = (loading) => {
    setModelsAreLoading(loading);
  };
  
  const handleObjectDetection = (objects) => {
    setDetectedObjects((prevObjects) => [...prevObjects, ...objects]);
  };
  
   
  
  
  return (
    <div className={styles.homePage}>
        {modelsAreLoading && <FullScreenLoading />}
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
                    } ${modelsAreLoading || isPostingSession ? styles.disabledBtn : ""}`}
                    onClick={
                        isDetecting ? handleEndDetection : handleStartDetection
                    }
                    disabled={modelsAreLoading || isPostingSession}
                >
                    {modelsAreLoading || isPostingSession ? (
                        <LoadingSpinner />
                    ) : isDetecting ? (
                        "End Detection"
                    ) : (
                        "Start Detection"
                    )}
                </button>
                {/* The loading message is now handled by FullScreenLoading */}
            </div>
        </>
    </div>
  );
};

export default HomePage;