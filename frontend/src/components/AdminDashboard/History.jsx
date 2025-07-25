import React from "react";
import styles from "./History.module.css";
import { Link } from "react-router-dom";

const History = () => {
    const sessionHistory = [
        {
            sessionId: "SID12345",
            startTime: "14:30",
            duration: "25:30",
            alerts: 3,
        },
        {
            sessionId: "SID12346",
            startTime: "15:10",
            duration: "40:34",
            alerts: 5,
        },
        {
            sessionId: "SID12347",
            startTime: "16:00",
            duration: "30:45",
            alerts: 2,
        },
        {
            sessionId: "SID12346",
            startTime: "15:10",
            duration: "40:34",
            alerts: 5,
        },
        {
            sessionId: "SID12347",
            startTime: "16:00",
            duration: "30:45",
            alerts: 2,
        },
    ];

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
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Alerts</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionHistory.map((session, index) => (
                        <tr key={index}>
                            <td>{session.sessionId}</td>
                            <td>{session.startTime}</td>
                            <td>{session.duration}</td>
                            <td>{session.alerts}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default History;
