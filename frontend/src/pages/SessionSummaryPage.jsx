import React, { useState, useEffect } from "react";
import PageLoading from "../components/common/PageLoading";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SessionAnalytics from "../components/SessionSummary/SessionAnalytics";
import NoDataState from "../components/SessionSummary/NoDataState";
import SessionSummarySkeleton from "../components/SessionSummary/SessionSummarySkeleton";
import styles from "./SessionSummaryPage.module.css";
import { List, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

// Define a color palette for the bars as gradient pairs
const GRADIENT_PAIRS = [
    ["#4A90E2", "#2C5E8E"], // Blue
    ["#50E3C2", "#349A7E"], // Teal
    ["#F5A623", "#B87E1A"], // Orange
    ["#F8E71C", "#C4B516"], // Yellow
    ["#D0021B", "#8A0112"], // Red
    ["#BD10E0", "#8C0DA8"], // Purple
    ["#9013FE", "#6C0FB8"], // Violet
    ["#4A4A4A", "#2F2F2F"], // Gray
    ["#B8E986", "#8CB866"], // Light Green
    ["#7ED321", "#5E9C19"]  // Green
];

const SessionSummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [detectedObjects, setDetectedObjects] = useState(location.state?.detectedObjects || []);
    const [duration, setDuration] = useState(location.state?.duration || 0);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = new URLSearchParams(location.search).get('sessionId');

        if (sessionId && (detectedObjects.length === 0 || duration === 0)) {
            const fetchSessionData = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/session/${sessionId}`);
                    setDetectedObjects(response.data.allDetections);
                    setDuration(response.data.duration);
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching session data:", err);
                    setError(err);
                    setLoading(false);
                }
            };
            fetchSessionData();
        } else {
            setLoading(false);
        }
    }, [location.search, detectedObjects.length, duration]);

    if (loading) {
        return <PageLoading />;
    }

    if (error) {
        return <div className={styles.container}>Error loading session summary: {error.message}</div>;
    }

    if (!detectedObjects || detectedObjects.length === 0) {
        return <NoDataState />;
    }

    const classCounts = detectedObjects.reduce((acc, obj) => {
        acc[obj.class] = (acc[obj.class] || 0) + 1;
        return acc;
    }, {});

    const sortedClasses = Object.keys(classCounts).sort(
        (a, b) => classCounts[b] - classCounts[a]
    );

    const colorMap = sortedClasses.reduce((acc, className, index) => {
        acc[className] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
        return acc;
    }, {});

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Session Summary</h1>
                <p className={styles.subtitle}>
                    A detailed breakdown of the objects detected during your session.
                </p>
            </header>

            <SessionAnalytics detectedObjects={detectedObjects} colorMap={colorMap} duration={duration} />

            <div className={styles.detailsSection}>
                <button 
                    className={`${styles.detailsTitle} ${!isDetailsOpen ? styles.collapsed : ''}`}
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    aria-expanded={isDetailsOpen}
                    aria-controls="detection-list"
                >
                    <div className={styles.detailsTitleContent}>
                        <List /> 
                        <span>All Detections</span>
                    </div>
                    {isDetailsOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                <div 
                    id="detection-list"
                    className={`${styles.objectListContainer} ${isDetailsOpen ? styles.open : ''}`}
                >
                    <div className={styles.objectList}>
                        {detectedObjects.map((obj, i) => (
                            <div key={i} className={styles.objectItem}>
                                <span className={styles.objectName}>{obj.class}</span>
                                <span 
                                    className={styles.objectScore}
                                    style={{ background: `linear-gradient(to right, ${colorMap[obj.class][0]}, ${colorMap[obj.class][1]})` }}
                                >
                                    {typeof obj.score === 'number' ? `${(obj.score * 100).toFixed(0)}%` : 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => navigate("/")}
                >
                    <PlayCircle />
                    Start New Session
                </button>
            </div>
        </div>
    );
};

export default SessionSummaryPage;