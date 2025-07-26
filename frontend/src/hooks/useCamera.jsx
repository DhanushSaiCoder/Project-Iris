import { useState, useEffect, useRef } from "react";

export function useCamera() {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function start() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setReady(true);
            } catch (e) {
                console.error("Camera start failed", e);
                setReady(false);
            }
        }
        start();
    }, []);

    return { videoRef, ready };
}
