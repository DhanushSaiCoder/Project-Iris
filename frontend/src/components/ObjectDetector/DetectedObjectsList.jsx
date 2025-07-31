import React, { useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import styles from "./DetectedObjectsList.module.css";

const DetectedObjectsList = ({ detectedObjects }) => {
    const listEndRef = useRef(null);

    useEffect(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [detectedObjects]);

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Detected Objects</h2>
            <ul className={styles.list}>
                {detectedObjects.length === 0 ? (
                    <div className={styles.noObjects}>
                        <p>Scanning for objects...</p>
                    </div>
                ) : (
                    <>
                        {detectedObjects.map((obj, index) => (
                            <li key={`${obj.timestamp}-${index}`} className={styles.objectItem}>
                                <span className={styles.timestamp}>[{obj.timestamp}]</span>
                                <span className={styles.objectName}>{obj.class}</span>
                                <span className={styles.score}>
                                    ({Math.round(obj.score * 100)}%)
                                </span>
                            </li>
                        ))}
                        <div ref={listEndRef} />
                    </>
                )}
            </ul>
        </div>
    );
};

DetectedObjectsList.propTypes = {
    detectedObjects: PropTypes.arrayOf(
        PropTypes.shape({
            timestamp: PropTypes.string.isRequired,
            class: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default memo(DetectedObjectsList);
