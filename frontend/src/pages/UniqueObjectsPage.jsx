import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PageLoading from "../components/common/PageLoading";
import { BarChart, PieChart } from "@mui/x-charts";
import { useIsMobile } from "../hooks/isMobile";
import styles from "./UniqueObjectsPage.module.css";

const UniqueObjectsPage = () => {
    const [uniqueObjects, setUniqueObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
    const isMobile = useIsMobile();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredObjects = useMemo(() => {
        return uniqueObjects.filter(object =>
            object.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [uniqueObjects, searchTerm]);

    const sortedObjects = useMemo(() => {
        const sorted = [...filteredObjects].sort((a, b) => { // Use filteredObjects here
            if (sortOrder === "asc") {
                return a.count - b.count;
            }
            return b.count - a.count;
        });
        return sorted;
    }, [filteredObjects, sortOrder]); // Dependency on filteredObjects

    const topObjectsForChart = useMemo(() => {
        return sortedObjects.slice(0, isMobile ? 5 : 10); // Show top 5 on mobile, top 10 on desktop
    }, [sortedObjects, isMobile]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedObjects.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedObjects.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

            {topObjectsForChart.length > 0 && (
                <div className={styles.ChartContainer}>
                    <h2 className={styles.ChartTitle}>Top {isMobile ? 5 : 10} Most Frequent Objects</h2>
                    <BarChart
                        dataset={topObjectsForChart}
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

            {topObjectsForChart.length > 0 && (
                <div className={styles.ChartContainer}>
                    <h2 className={styles.ChartTitle}>Proportion of Top {isMobile ? 5 : 10} Objects</h2>
                    <PieChart
                        series={[
                            {
                                data: topObjectsForChart.map((obj, index) => ({
                                    id: index,
                                    value: obj.count,
                                    label: obj.name,
                                })),
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, outerRadius: 100 },
                            },
                        ]}
                        height={200}
                        sx={(theme) => ({
                            '& .MuiChartsLegend-series text': {
                                fill: theme.palette.text.primary,
                            },
                            '& .MuiChartsArcLabel-root': {
                                fill: theme.palette.text.primary,
                            },
                        })}
                    />
                </div>
            )}

            <div className={styles.ObjectsListContainer}>
                <div className={styles.ListHeader}>
                    <h2 className={styles.ListTitle}>All Objects</h2>
                    <input
                        type="text"
                        placeholder="Search objects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.SearchInput}
                    />
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
                    {currentItems.length > 0 ? (
                        currentItems.map((object, index) => (
                            <div key={index} className={styles.ObjectCard}>
                                <span className={styles.ObjectName}>{object.name}</span>
                                <span className={styles.ObjectCount}>{object.count}</span>
                            </div>
                        ))
                    ) : (
                        <p>No unique objects found.</p>
                    )}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={styles.Pagination}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? styles.active : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniqueObjectsPage;