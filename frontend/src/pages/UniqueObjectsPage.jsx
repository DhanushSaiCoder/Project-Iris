import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLoading from "../components/common/PageLoading";
import styles from "./UniqueObjectsPage.module.css";

const UniqueObjectsPage = () => {
    const [uniqueObjects, setUniqueObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <div className={styles.ObjectsList}>
                {uniqueObjects.length > 0 ? (
                    uniqueObjects.map((object, index) => (
                        <div key={index} className={styles.ObjectCard}>
                            {object}
                        </div>
                    ))
                ) : (
                    <p>No unique objects found.</p>
                )}
            </div>
        </div>
    );
};

export default UniqueObjectsPage;
