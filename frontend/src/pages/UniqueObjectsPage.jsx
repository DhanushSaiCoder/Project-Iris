import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PageLoading from "../components/common/PageLoading";
import { BarChart } from "@mui/x-charts/BarChart";
import styles from "./UniqueObjectsPage.module.css";

const UniqueObjectsPage = () => {
    const [uniqueObjects, setUniqueObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

    useEffect(() => {
        const fetchUniqueObjects = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/session/unique-objects`
                );
                setUniqueObjects(response.data.uniqueObjects);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUniqueObjects();
    }, []);

    const sortedObjects = useMemo(() => {
        const sorted = [...uniqueObjects].sort((a, b) => {
            if (sortOrder === "asc") {
                return a.count - b.count;
            }
            return b.count - a.count;
        });
        return sorted;
    }, [uniqueObjects, sortOrder]);

    const top10Objects = useMemo(() => {
        return sortedObjects.slice(0, 10);
    }, [sortedObjects]);

    if (loading) {
        return <PageLoading />;
    }

    if (error) {
        return (
            <div className={styles.UniqueObjectsPage}>
                Error loading unique objects: {error.message}
            </div>
        );
    }

    return (
        <div className={styles.UniqueObjectsPage}>
            <h1 className={styles.Title}>All Unique Detected Objects</h1>

            {top10Objects.length > 0 && (
                <div className={styles.ChartContainer}>
                    <h2 className={styles.ChartTitle}>Top 10 Most Frequent Objects</h2>
                    <BarChart
                        dataset={top10Objects}
                        yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                        series={[{ dataKey: 'count', label: 'Detection Count', color: '#8884d8' }]}
                        layout="horizontal"
                        height={400}
                        sx={(theme) => ({
                            '& .MuiChartsAxis-tickLabel': {
                                fill: theme.palette.text.primary,
                            },
                            '& .MuiChartsAxis-line': {
                                stroke: theme.palette.text.primary,
                            },
                            '& .MuiChartsLegend-series text': {
                                fill: theme.palette.text.primary,
                            },
                            '& .MuiChartsAxis-root .MuiChartsAxis-label': {
                                fill: theme.palette.text.primary,
                            },
                        })}
                    />
                </div>
            )}

            <div className={styles.ObjectsListContainer}>
                <div className={styles.ListHeader}>
                    <h2 className={styles.ListTitle}>All Objects</h2>
                    <div className={styles.SortButtons}>
                        <button onClick={() => setSortOrder("desc")} className={sortOrder === 'desc' ? styles.active : ''}>
                            Most Frequent
                        </button>
                        <button onClick={() => setSortOrder("asc")} className={sortOrder === 'asc' ? styles.active : ''}>
                            Least Frequent
                        </button>
                    </div>
                </div>
                <div className={styles.ObjectsList}>
                    {sortedObjects.length > 0 ? (
                        sortedObjects.map((object, index) => (
                            <div key={index} className={styles.ObjectCard}>
                                <span className={styles.ObjectName}>{object.name}</span>
                                <span className={styles.ObjectCount}>{object.count}</span>
                            </div>
                        ))
                    ) : (
                        <p>No unique objects found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniqueObjectsPage;