import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

import styles from "./AdminDashboardPage.module.css";
import chartStyles from "./Charts.module.css";

// --- Helper Functions ---

// Utility: generate an HSL-based color palette for N items
const generateColors = (count) =>
    Array.from({ length: count }).map(
        (_, i) => `hsl(${Math.round((i * 360) / count)}, 70%, 50%)`
    );

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
};

// --- Inlined Chart Components ---

const ObjectDetectionChartInlined = ({ sessions, topN = 8 }) => {
    const counts = sessions.reduce((acc, session) => {
        session.allDetections.forEach(({ class: cls }) => {
            acc[cls] = (acc[cls] || 0) + 1;
        });
        return acc;
    }, {});

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, topN);
    const rest = sorted.slice(topN);
    const restTotal = rest.reduce((sum, [, cnt]) => sum + cnt, 0);
    const finalEntries = restTotal > 0 ? [...top, ["Others", restTotal]] : top;

    const chartData = finalEntries.map(([label, value], idx) => ({
        id: idx,
        label,
        value,
    }));

    const colors = generateColors(chartData.length);

    return (
        <div style={{ width: "100%", height: 350, color: "white" }}>
            <h3 style={{ textAlign: "center", marginBottom: 8 }}>
                Most Frequently Detected Objects
            </h3>
            <p style={{ textAlign: "center", marginBottom: 16, opacity: 0.7 }}>
                Showing top {topN} classes plus Others
            </p>

            <PieChart
                series={[
                    {
                        data: chartData,
                        highlightScope: {
                            faded: "global",
                            highlighted: "item",
                        },
                        faded: { innerRadius: 30, outerRadius: 100 },
                        colors,
                    },
                ]}
                height={250}
                legend={{
                    position: { vertical: "middle", horizontal: "right" },
                    slotProps: {
                        root: {
                            sx: {
                                maxHeight: 200,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                flexWrap: "wrap",
                            },
                        },
                    },
                }}
                sx={{
                    "& .MuiChartsLegend-series text": {
                        fill: "#FFF",
                        fontSize: "0.8rem",
                    },
                    "& .MuiChartsArcLabel-root": {
                        fill: "#FFF",
                    },
                }}
            />
        </div>
    );
};

const SessionDurationChartInlined = ({ sessions }) => {
    const durationBins = {
        "0-5 min": 0,
        "5-10 min": 0,
        "10-15 min": 0,
        "15-20 min": 0,
        "20+ min": 0,
    };

    sessions.forEach((session) => {
        const durationInMinutes = session.duration / 60000;

        if (durationInMinutes >= 0 && durationInMinutes < 5) {
            durationBins["0-5 min"]++;
        } else if (durationInMinutes >= 5 && durationInMinutes < 10) {
            durationBins["5-10 min"]++;
        } else if (durationInMinutes >= 10 && durationInMinutes < 15) {
            durationBins["10-15 min"]++;
        } else if (durationInMinutes >= 15 && durationInMinutes < 20) {
            durationBins["15-20 min"]++;
        } else {
            durationBins["20+ min"]++;
        }
    });

    const chartData = Object.values(durationBins);
    const xAxisLabels = Object.keys(durationBins);

    return (
        <div
            style={{
                width: "100%",
                height: 300,
                textAlign: "center",
                color: "white",
            }}
        >
            <h3 style={{ fontSize: "1.1em", marginBottom: "8px" }}>
                Session Duration Distribution
            </h3>
            <p
                style={{
                    fontSize: "0.8em",
                    marginBottom: "25px",
                    opacity: 0.8,
                }}
            >
                Shows how long user sessions typically last.
            </p>
            <BarChart
                xAxis={[
                    {
                        scaleType: "band",
                        data: xAxisLabels,
                        sx: {
                            ".MuiChartsAxis-tickLabel": {
                                fill: "#FFFFFF",
                            },
                            ".MuiChartsAxis-line": {
                                stroke: "#FFFFFF",
                            },
                        },
                    },
                ]}
                series={[
                    {
                        data: chartData,
                        label: "Number of Sessions",
                        color: "#42A5F5",
                    },
                ]}
                height={200}
                sx={{
                    ".MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF",
                    },
                    ".MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#FFFFFF",
                    },
                    "& .MuiChartsLegend-series text": {
                        fill: "#FFFFFF",
                    },
                }}
            />
        </div>
    );
};

const UniqueObjectsDistributionChartInlined = ({ sessions }) => {
    const uniqueObjectsBins = {
        "0-5": 0,
        "6-10": 0,
        "11-15": 0,
        "16-20": 0,
        "20+": 0,
    };

    sessions.forEach((session) => {
        const uniqueObjects = session.uniqueObjects;

        if (uniqueObjects >= 0 && uniqueObjects <= 5) {
            uniqueObjectsBins["0-5"]++;
        } else if (uniqueObjects >= 6 && uniqueObjects <= 10) {
            uniqueObjectsBins["6-10"]++;
        } else if (uniqueObjects >= 11 && uniqueObjects <= 15) {
            uniqueObjectsBins["11-15"]++;
        } else if (uniqueObjects >= 16 && uniqueObjects <= 20) {
            uniqueObjectsBins["16-20"]++;
        } else {
            uniqueObjectsBins["20+"]++;
        }
    });

    const chartData = Object.values(uniqueObjectsBins);
    const xAxisLabels = Object.keys(uniqueObjectsBins);

    return (
        <div
            style={{
                width: "100%",
                height: 300,
                textAlign: "center",
                color: "white",
            }}
        >
            <h3 style={{ fontSize: "1.1em", marginBottom: "8px" }}>
                Unique Objects Detected per Session
            </h3>
            <p
                style={{
                    fontSize: "0.8em",
                    marginBottom: "25px",
                    opacity: 0.8,
                }}
            >
                Distribution of the number of unique objects identified in each
                session.
            </p>
            <BarChart
                xAxis={[
                    {
                        scaleType: "band",
                        data: xAxisLabels,
                        sx: {
                            ".MuiChartsAxis-tickLabel": {
                                fill: "#FFFFFF",
                            },
                            ".MuiChartsAxis-line": {
                                stroke: "#FFFFFF",
                            },
                        },
                    },
                ]}
                series={[
                    {
                        data: chartData,
                        label: "Number of Sessions",
                        color: "#66BB6A",
                    },
                ]}
                height={200}
                sx={{
                    ".MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF",
                    },
                    ".MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#FFFFFF",
                    },
                    "& .MuiChartsLegend-series text": {
                        fill: "#FFFFFF",
                    },
                }}
            />
        </div>
    );
};

const TotalDetectionsChartInlined = ({ sessions }) => {
    const chartData = sessions.map((session, index) => ({
        id: session._id || index,
        value: session.totalDetections,
        label: `${index + 1}`,
    }));

    chartData.sort((a, b) => a.value - b.value);

    const xAxisLabels = chartData.map((data) => data.label);
    const seriesData = chartData.map((data) => data.value);

    return (
        <div
            style={{
                width: "100%",
                height: 300,
                textAlign: "center",
                color: "white",
            }}
        >
            <h3 style={{ fontSize: "1.1em", marginBottom: "8px" }}>
                Total Detections per Session
            </h3>
            <p
                style={{
                    fontSize: "0.8em",
                    marginBottom: "25px",
                    opacity: 0.8,
                }}
            >
                Visualizes the total number of objects detected in each session.
            </p>
            <BarChart
                xAxis={[
                    {
                        scaleType: "band",
                        data: xAxisLabels,
                        sx: {
                            ".MuiChartsAxis-tickLabel": {
                                fill: "#FFFFFF",
                            },
                            ".MuiChartsAxis-line": {
                                stroke: "#FFFFFF",
                            },
                        },
                    },
                ]}
                series={[
                    {
                        data: seriesData,
                        label: "Total Detections",
                        color: "#FFA726",
                    },
                ]}
                height={200}
                sx={{
                    ".MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF",
                    },
                    ".MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#FFFFFF",
                    },
                    "& .MuiChartsLegend-series text": {
                        fill: "#FFFFFF",
                    },
                }}
            />
        </div>
    );
};

// --- Main Component ---

const AdminDashboardPage = () => {
    // State Management
    const [sessions, setSessions] = useState([]);
    const [activeUsersDetails, setActiveUsersDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getUserRoleFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.role;
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        return null;
    };

    const userRole = getUserRoleFromToken();
    const isAdmin = userRole === "admin";

    // Effects
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/session`
                );
                setSessions(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const uniqueUserIds = useMemo(
        () => [...new Set(sessions.map((session) => session.userId))],
        [sessions]
    );

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (uniqueUserIds.length > 0) {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/api/users/by-ids`,
                        { userIds: uniqueUserIds }
                    );
                    setActiveUsersDetails(response.data);
                } catch (err) {
                    console.error("Error fetching user details:", err);
                }
            } else {
                setActiveUsersDetails([]); // Clear if no unique users
            }
        };

        if (!loading && sessions.length > 0) {
            fetchUserDetails();
        } else if (!loading && sessions.length === 0) {
            setActiveUsersDetails([]); // No sessions, no active users
        }
    }, [loading, sessions, uniqueUserIds]);

    // Event Handlers
    const handleMonitorUser = (userId) => {
        console.log(`Monitoring user: ${userId}`);
        navigate(`/monitor-user/${userId}`);
    };

    // Data Calculations for Inlined Components
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce(
        (acc, session) => acc + session.duration,
        0
    );
    const totalUniqueObjects = sessions.reduce(
        (acc, session) => acc + session.uniqueObjects,
        0
    );
    const totalDetections = sessions.reduce(
        (acc, session) => acc + session.totalDetections,
        0
    );
    const averageSessionDuration =
        totalSessions > 0 ? totalDuration / totalSessions : 0;
    const uniqueUsers = uniqueUserIds.length;

    const MAX_ROWS = 5; // Set your desired limit here
    const sortedSessions = [...sessions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Conditional Rendering for Loading/Error States
    if (loading) {
        return (
            <div className={styles.AdminDashboardPage}>
                <h1 className={styles.Title}>DASHBOARD</h1>

                {/* Stats Skeleton */}
                <div className={styles.StatsContainer}>
                    <div className={styles.StatsTitleContainer}>
                        <h1 className={styles.statsTitle}>STATS</h1>
                        <div
                            className={styles.skeletonLine}
                            style={{ width: "80px", height: "12px" }}
                        ></div>
                    </div>
                    <div className={styles.StatsDetailsContainer}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.StatsDetailsCard}>
                                <div
                                    className={styles.skeletonLine}
                                    style={{
                                        width: "60%",
                                        height: "24px",
                                        marginBottom: "8px",
                                    }}
                                ></div>
                                <div
                                    className={styles.skeletonLine}
                                    style={{ width: "80%", height: "12px" }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Users Skeleton */}
                <div className={styles.ActiveUsersContainer}>
                    <div className={styles.ActiveUsersTitleContainer}>
                        <h1>ACTIVE USERS</h1>
                        <div
                            className={styles.skeletonLine}
                            style={{ width: "80px", height: "12px" }}
                        ></div>
                    </div>
                    <div className={styles.ActiveUsersDetails}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.UserCard}>
                                <div
                                    className={styles.skeletonLine}
                                    style={{
                                        width: "70%",
                                        height: "16px",
                                        marginBottom: "4px",
                                    }}
                                ></div>
                                <div
                                    className={styles.skeletonLine}
                                    style={{ width: "50%", height: "12px" }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Skeleton */}
                <div className={styles.HistoryContainer}>
                    <div className={styles.HistoryTitleContainer}>
                        <h1 className={styles.title}>HISTORY</h1>
                        <div
                            className={styles.skeletonLine}
                            style={{ width: "80px", height: "12px" }}
                        ></div>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.HistoryTable}>
                            <thead>
                                <tr>
                                    <th>
                                        <div
                                            className={styles.skeletonLine}
                                            style={{
                                                width: "80%",
                                                height: "12px",
                                            }}
                                        ></div>
                                    </th>
                                    <th>
                                        <div
                                            className={styles.skeletonLine}
                                            style={{
                                                width: "80%",
                                                height: "12px",
                                            }}
                                        ></div>
                                    </th>
                                    <th>
                                        <div
                                            className={styles.skeletonLine}
                                            style={{
                                                width: "80%",
                                                height: "12px",
                                            }}
                                        ></div>
                                    </th>
                                    <th>
                                        <div
                                            className={styles.skeletonLine}
                                            style={{
                                                width: "80%",
                                                height: "12px",
                                            }}
                                        ></div>
                                    </th>
                                    <th>
                                        <div
                                            className={styles.skeletonLine}
                                            style={{
                                                width: "80%",
                                                height: "12px",
                                            }}
                                        ></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div
                                                className={styles.skeletonLine}
                                                style={{
                                                    width: "90%",
                                                    height: "12px",
                                                }}
                                            ></div>
                                        </td>
                                        <td>
                                            <div
                                                className={styles.skeletonLine}
                                                style={{
                                                    width: "90%",
                                                    height: "12px",
                                                }}
                                            ></div>
                                        </td>
                                        <td>
                                            <div
                                                className={styles.skeletonLine}
                                                style={{
                                                    width: "90%",
                                                    height: "12px",
                                                }}
                                            ></div>
                                        </td>
                                        <td>
                                            <div
                                                className={styles.skeletonLine}
                                                style={{
                                                    width: "90%",
                                                    height: "12px",
                                                }}
                                            ></div>
                                        </td>
                                        <td>
                                            <div
                                                className={styles.skeletonLine}
                                                style={{
                                                    width: "90%",
                                                    height: "12px",
                                                }}
                                            ></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts Skeleton */}
                <div className={chartStyles.ChartsContainer}>
                    <h2 className={chartStyles.Title}>CHARTS</h2>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={chartStyles.chartCard}>
                            <div
                                className={styles.skeletonLine}
                                style={{
                                    width: "70%",
                                    height: "20px",
                                    marginBottom: "16px",
                                }}
                            ></div>
                            <div
                                className={styles.skeletonRect}
                                style={{ width: "100%", height: "250px" }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.AdminDashboardPage}>
                Error loading dashboard: {error.message}
            </div>
        );
    }

    // Main Render
    return (
        <div className={styles.AdminDashboardPage}>
            <h1 className={styles.Title}>DASHBOARD</h1>

            {isAdmin && (
                <div className={styles.AdminToolsContainer}>
                    <div className={styles.AdminToolsTitleContainer}>
                        <h1 className={styles.adminToolsTitle}>ADMIN TOOLS</h1>
                    </div>
                    <div className={styles.AdminToolsDetailsContainer}>
                        <Link
                            to="/user-management"
                            className={styles.AdminToolCard}
                        >
                            <h2>Manage Users</h2>
                            <p>View and modify user roles.</p>
                        </Link>
                    </div>
                </div>
            )}

            {/* Stats Component Inlined */}
            <div className={styles.StatsContainer}>
                <div className={styles.StatsTitleContainer}>
                    <h1 className={styles.statsTitle}>STATS</h1>
                    <Link to="/all-stats" className={styles.ViewMore}>
                        View More
                    </Link>
                </div>
                <div className={styles.StatsDetailsContainer}>
                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>{totalSessions}</h1>
                        <p>Total Sessions</p>
                    </div>
                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>
                            {formatDuration(totalDuration)}
                        </h1>
                        <p>Total Duration</p>
                    </div>
                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>{totalDetections}</h1>
                        <p>Total Detections</p>
                    </div>
                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>
                            {totalUniqueObjects}
                        </h1>
                        <p>Unique Objects</p>
                    </div>
                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>
                            {formatDuration(averageSessionDuration)}
                        </h1>
                        <p>Avg. Session Duration</p>
                    </div>

                    <div className={styles.StatsDetailsCard}>
                        <h1 className={styles.statsData}>{uniqueUsers}</h1>
                        <p>Unique Users</p>
                    </div>
                </div>
            </div>

            {/* Active Users Component Inlined */}
            <div className={styles.ActiveUsersContainer}>
                <div className={styles.ActiveUsersTitleContainer}>
                    <h1>ACTIVE USERS</h1>
                    <Link to="/all-active-users" className={styles.ViewMore}>
                        View More
                    </Link>
                </div>
                <div className={styles.ActiveUsersDetails}>
                    {activeUsersDetails.length > 0 ? (
                        activeUsersDetails.map((user) => (
                            <div key={user._id} className={styles.UserCard}>
                                <p className={styles.userFullName}>
                                    <span className={styles.fullName}>
                                        {user.fullName}
                                    </span>
                                </p>
                                <p className={styles.SessionId}>
                                    <span>{user._id}</span>
                                </p>
                                <p
                                    className={styles.Moniter}
                                    onClick={() => handleMonitorUser(user._id)}
                                >
                                    Monitor User
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No active users found.</p>
                    )}
                </div>
            </div>

            {/* History Component Inlined */}
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
                                sortedSessions
                                    .slice(0, MAX_ROWS)
                                    .map((session) => (
                                        <tr key={session._id}>
                                            <td>{session._id}</td>
                                            <td>{session.userId}</td>
                                            <td>
                                                {formatDuration(
                                                    session.duration
                                                )}
                                            </td>
                                            <td>{session.uniqueObjects}</td>
                                            <td>{session.totalDetections}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        No session history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={chartStyles.ChartsContainer}>
                <h2 className={chartStyles.Title}>CHARTS</h2>
                <div className={chartStyles.chartCard}>
                    <ObjectDetectionChartInlined sessions={sessions} />
                </div>
                <div className={chartStyles.chartCard}>
                    <SessionDurationChartInlined sessions={sessions} />
                </div>
                <div className={chartStyles.chartCard}>
                    <UniqueObjectsDistributionChartInlined
                        sessions={sessions}
                    />
                </div>
                <div className={chartStyles.chartCard}>
                    <TotalDetectionsChartInlined sessions={sessions} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
