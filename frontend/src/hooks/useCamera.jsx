import { useState, useEffect, useRef } from "react";

export function useCamera() {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let stream;

        async function start() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", torch: true },
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
    }, []);

    return { videoRef, ready };
}