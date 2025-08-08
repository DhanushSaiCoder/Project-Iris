import React, { useEffect, useState } from 'react';
import PageLoading from "../components/common/PageLoading";
import axios from 'axios';
import styles from './AllHistoryPage.module.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowUp, ArrowDown } from 'lucide-react';

const AllHistoryPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [userNames, setUserNames] = useState({}); // New state for usernames
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sessionsPerPage] = useState(10); // Number of sessions per page
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/session`);
                const fetchedSessions = response.data.data;
                setSessions(fetchedSessions);

                // Extract unique user IDs from sessions
                const uniqueUserIds = [...new Set(fetchedSessions.map(session => session.userId))].filter(id => id !== 'guest' && /^[0-9a-fA-F]{24}$/.test(id));
                console.log("Unique User IDs sent to backend:", uniqueUserIds); // Add this line

                if (uniqueUserIds.length > 0) {
                    const usersResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/by-ids`, { userIds: uniqueUserIds });
                    const usersMap = {};
                    usersResponse.data.forEach(user => {
                        usersMap[user._id] = user.fullName;
                    });
                    setUserNames(usersMap);
                }

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

    const handleSort = (column) => {
        let newSortDirection = 'asc';
        if (sortColumn === column) {
            newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }

        setSortDirection(newSortDirection);
        setSortColumn(column);

        const sortedSessions = [...sessions].sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            // Handle date sorting
            if (column === 'createdAt') {
                valA = new Date(valA);
                valB = new Date(valB);
            } else if (column === 'userName') {
                valA = userNames[a.userId] || '';
                valB = userNames[b.userId] || '';
            }

            if (valA < valB) {
                return newSortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return newSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setSessions(sortedSessions);
    };

    if (loading) {
        return <PageLoading />;
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
                            <th onClick={() => handleSort('_id')}><div className={styles.headerContent}>Session ID {sortColumn === '_id' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('userId')}><div className={styles.headerContent}>User ID {sortColumn === 'userId' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('userName')}><div className={styles.headerContent}>Username {sortColumn === 'userName' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('duration')}><div className={styles.headerContent}>Duration {sortColumn === 'duration' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('uniqueObjects')}><div className={styles.headerContent}>Unique Objects {sortColumn === 'uniqueObjects' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('totalDetections')}><div className={styles.headerContent}>Total Detections {sortColumn === 'totalDetections' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                            <th onClick={() => handleSort('createdAt')}><div className={styles.headerContent}>Timestamp {sortColumn === 'createdAt' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSessions.length > 0 ? (
                            currentSessions.map((session) => (
                                <tr key={session._id}>
                                    <td onClick={() => navigate(`/sessionSummary?sessionId=${session._id}`)} style={{ cursor: 'pointer', color: 'var(--color-cta)' }}>{session._id}</td>
                                    <td>{session.userId}</td>
                                    <td>{userNames[session.userId] || 'Guest'}</td>
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