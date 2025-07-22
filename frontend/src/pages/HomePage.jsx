import React from "react";
import VideoStream from "../components/Home/VideoStream";
import styles from "./HomePage.module.css";

const HomePage = () => {
    return (
        <div className={styles.HomePage}>
            <div className={styles.videoStreamDiv}>
                <VideoStream />
            </div>
            <div className={styles.statusDiv}>
                <p>
                    <span className={styles.statusSpan}>Status:</span> Ready to
                    detect obstacles.
                </p>
            </div>
            <div className={styles.startBtnDiv}>
                <button className={styles.startBtn}>Start Detection</button>
            </div>
        </div>
    );
};

export default HomePage;
