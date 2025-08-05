import React, { useState, useEffect } from "react";
import styles from "./History.module.css";
import { Link } from "react-router-dom";

const History = ({ sessions }) => {
    const MAX_ROWS = 5; // Set your desired limit here
    const [sortedSessions, setSortedSessions] = useState([]);

    useEffect(() => {
        const sorted = [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSortedSessions(sorted);
    }, [sessions]);

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className={styles.HistoryContainer}>
            <div className={styles.HistoryTitleContainer}>
                <h1 className={styles.title}>HISTORY</h1>
                <Link to="/all-history" className={styles.Link}>
                    View More
                </Link>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.HistoryTable}>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>User ID</th>
                            <th>Duration</th>
                            <th>Unique Objects</th>
                            <th>Total Detections</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSessions.length > 0 ? (
                            sortedSessions.slice(0, MAX_ROWS).map((session) => (
                                <tr key={session._id}>
                                    <td>{session._id}</td>
                                    <td>{session.userId}</td>
                                    <td>{formatDuration(session.duration)}</td>
                                    <td>{session.uniqueObjects}</td>
                                    <td>{session.totalDetections}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No session history available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
