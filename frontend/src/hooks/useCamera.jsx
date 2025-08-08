import { useState, useEffect, useRef, useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

export function useCamera() {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);
    const { torch } = useContext(SettingsContext);

    useEffect(() => {
        let stream;

        async function start() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", torch: torch },
                });
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play()
                        .then(() => setReady(true))
                        .catch(e => {
                            console.error("Video play failed", e);
                            setReady(false);
                        });
                };
            } catch (e) {
                console.error("Camera start failed", e);
                setReady(false);
            }
        }

        start();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [torch]);

    return { videoRef, ready };
}