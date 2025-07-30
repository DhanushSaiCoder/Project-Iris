import React from "react";
import styles from "./DetectedObjectsList.module.css";
import { useEffect, useRef } from "react";
const DetectedObjectsList = ({ detectedObjects }) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [detectedObjects]);

    return (
        <div ref={listRef} className={styles.container}>
            <div className={styles.header}>Detected Objects</div>
            <div className={styles.list}>
                {detectedObjects.length === 0 ? (
                    <div className={styles.noObjects}>
                        No objects detected yet.
                    </div>
                ) : (
                    detectedObjects.map((obj, index) => (
                        <div key={index} className={styles.objectItem}>
                            <span className={styles.timestamp}>
                                [{obj.timestamp}]
                            </span>
                            <span className={styles.objectName}>
                                {obj.class}
                            </span>
                            <span className={styles.score}>
                                ({Math.round(obj.score * 100)}%)
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DetectedObjectsList;
