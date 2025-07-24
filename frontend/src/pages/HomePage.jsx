import React from "react";
import VideoStream from "../components/Home/VideoStream";
import styles from "./HomePage.module.css";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
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
                <button
                    className={styles.startBtn}
                    onClick={() => {
                        navigate(`/newSession?sessionId=${nanoid(10)}`);
                    }}
                >
                    Start Detection
                </button>
            </div>
        </div>
    );
};

export default HomePage;
