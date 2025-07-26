// NewSession.jsx
import React, { useContext, useEffect } from "react";
import styles from "./NewSession.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { SettingsContext } from "../context/SettingsContext";

export default function NewSession({
    imageUrl,
    status = "Detecting Obstacles",
}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { sessionId, setSessionId } = useContext(SettingsContext);

    useEffect(() => {
        const idFromParams = searchParams.get("sessionId");
        if (idFromParams) {
            if (sessionId !== idFromParams) {
                setSessionId(idFromParams);
            }
        } else if (!sessionId) {
            setSessionId(nanoid(10));
        }
    }, [searchParams, sessionId, setSessionId]);

    console.log("sessionId: ", sessionId);
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cameraStreamDiv}>
                    <img
                        src={imageUrl}
                        alt="Session livestream"
                        className={styles.image}
                    />
                </div>
                <p className={styles.status}>
                    <span className={styles.statusLabel}>Status:</span> {status}
                </p>
                <button
                    className={styles.button}
                    onClick={() => {
                        navigate(`/sessionSummary?sessionId=${sessionId}`, {
                            replace: true,
                        });
                    }}
                >
                    Stop Detection
                </button>
            </div>
        </div>
    );
}
