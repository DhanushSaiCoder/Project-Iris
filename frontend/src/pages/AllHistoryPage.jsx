import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AllHistoryPage.module.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AllHistoryPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sessionsPerPage] = useState(10); // Number of sessions per page

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/session`);
                setSessions(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

    // Get current sessions for pagination
    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className={styles.container}>Loading session history...</div>;
    }

    if (error) {
        return <div className={styles.container}>Error loading session history: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.historyHeader}>
                <button
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                    aria-label="Go back"
                >
                    <ChevronLeft className={styles.icon} />
                    <span className={styles.backText}>Back</span>
                </button>
                <h1 className={styles.historyTitle}>ALL SESSION HISTORY</h1>
                <div className={styles.spacer} />
            </header>
            <div className={styles.tableContainer}>
                <table className={styles.HistoryTable}>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>User ID</th>
                            <th>Duration</th>
                            <th>Unique Objects</th>
                            <th>Total Detections</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSessions.length > 0 ? (
                            currentSessions.map((session) => (
                                <tr key={session._id}>
                                    <td onClick={() => navigate(`/sessionSummary?sessionId=${session._id}`)} style={{ cursor: 'pointer', color: 'var(--color-cta)' }}>{session._id}</td>
                                    <td>{session.userId}</td>
                                    <td>{formatDuration(session.duration)}</td>
                                    <td>{session.uniqueObjects}</td>
                                    <td>{session.totalDetections}</td>
                                    <td>{new Date(session.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No session history available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>
                    Page {currentPage} of {Math.ceil(sessions.length / sessionsPerPage)}
                </span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(sessions.length / sessionsPerPage)}
                    className={styles.pageButton}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllHistoryPage;