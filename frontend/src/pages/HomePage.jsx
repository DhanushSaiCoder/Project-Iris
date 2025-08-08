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

const loadingMessages = [
    "Waking up the AI... It's not a morning person.",
    "Teaching the model the difference between a cat and a croissant.",
    "Calibrating the photon cannons...",
    "Reticulating splines... whatever that means.",
    "Loading the object-o-matic 9000.",
    "Don't worry, the hamsters powering the server are getting a water break.",
    "Compiling the 1s and 0s. Mostly 0s.",
    "Polishing the pixels for a premium experience.",
    "Negotiating with the electrons to move faster.",
    "The AI is checking itself out in the mirror... vanity."
];

const HomePage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsAreLoading, setModelsAreLoading] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
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

  useEffect(() => {
    let interval;
    if (modelsAreLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000); // Change message every 3 seconds
    }
    return () => clearInterval(interval);
  }, [modelsAreLoading]);
  
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
                {modelsAreLoading && (
                    <div className={styles.loadingMessage}>
                        <p>{loadingMessage}</p>
                    </div>
                )}
            </div>
        </>
    </div>
  );
};

export default HomePage;