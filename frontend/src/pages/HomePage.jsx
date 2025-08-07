import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoStream from "../components/Home/VideoStream";
import DetectedObjectsList from "../components/ObjectDetector/DetectedObjectsList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import styles from "./HomePage.module.css";
import { SettingsContext } from "../context/SettingsContext";

const HomePage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsAreLoading, setModelsAreLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [trialCount, setTrialCount] = useState(0);
  const [isSignedUpUser, setIsSignedUpUser] = useState(false); // ✅ NEW STATE
  const navigate = useNavigate();
  const { developerMode } = useContext(SettingsContext);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("trialCount")) || 0;
    const userId = localStorage.getItem("userId");
    setTrialCount(count);
    setIsSignedUpUser(!!userId); // ✅ Set true if userId exists
  }, []);

  const handleStartDetection = () => {
    setSessionStartTime(Date.now());
    setIsDetecting(true);
  };

  const handleEndDetection = () => {
    const sessionEndTime = Date.now();
    const duration = sessionEndTime - sessionStartTime;
    setIsDetecting(false);

    const userId = localStorage.getItem("userId") || "guest";
    const uniqueClasses = [...new Set(detectedObjects.map((obj) => obj.class))];
    const uniqueDetectionsCount = uniqueClasses.length;
    const totalDetections = detectedObjects.length;

    const sessionSummary = {
      userId,
      duration,
      uniqueObjects: uniqueDetectionsCount,
      totalDetections,
      allDetections: detectedObjects,
    };

    if (!isSignedUpUser) {
      const storedSessions = JSON.parse(localStorage.getItem("trialSessions") || "[]");
      storedSessions.push(sessionSummary);
      localStorage.setItem("trialSessions", JSON.stringify(storedSessions));

      const newTrialCount = trialCount + 1;
      localStorage.setItem("trialCount", newTrialCount);
      setTrialCount(newTrialCount);
    } else {
      // Send directly to DB if logged in
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/session`, sessionSummary)
        .then((response) => {
          console.log("Session saved:", response.data);
        })
        .catch((err) => console.error("Error saving session:", err.message));
    }

    navigate("/session-summary", { state: { detectedObjects, duration } });
  };

  const handleLoadingChange = (loading) => {
    setModelsAreLoading(loading);
  };

  const handleObjectDetection = (objects) => {
    setDetectedObjects((prevObjects) => [...prevObjects, ...objects]);
  };

  const handleRedirectToSignup = () => {
    navigate("/signup");
  };

  const isTrialComplete = trialCount >= 3 && !isSignedUpUser;

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
            isTrialComplete
              ? handleRedirectToSignup
              : isDetecting
              ? handleEndDetection
              : handleStartDetection
          }
          disabled={modelsAreLoading}
        >
          {modelsAreLoading ? (
            <LoadingSpinner />
          ) : isTrialComplete ? (
            "Sign Up to Continue"
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
