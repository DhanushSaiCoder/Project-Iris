import React from "react";
import styles from "./History.module.css";
import { Link } from "react-router-dom";

const History = ({ sessions }) => {
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className={styles.HistoryContainer}>
            <div className={styles.HistoryTitleContainer}>
                <h1 className={styles.title}>HISTORY</h1>
                <Link to="/" className={styles.Link}>
                    View More
                </Link>
            </div>
            <table className={styles.HistoryTable}>
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Duration</th>
                        <th>Total Detections</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <tr key={session._id}>
                                <td>{session._id}</td>
                                <td>{formatDuration(session.duration)}</td>
                                <td>{session.totalDetections}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No session history available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default History;
