// frontend/src/context/ModelContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getCocoModel } from '../services/modelService';
import { getDepthWorker } from '../services/depthWorkerService';

const ModelContext = createContext(null);

export function useModelContext() {
  return useContext(ModelContext);
}

export function ModelProvider({ children }) {
  const modelsRef = useRef({ coco: null, depthWorker: null });
  const [status, setStatus] = useState({ coco: 'idle', depth: 'idle', error: null });

  useEffect(() => {
    console.log("ModelContext status changed:", status);
    let mounted = true;

    setStatus(s => ({ ...s, coco: 'loading' }));
    getCocoModel().then(m => {
      if (!mounted) return;
      modelsRef.current.coco = m;
      setStatus(s => ({ ...s, coco: 'ready' }));
    }).catch(err => {
      console.error('Coco load failed', err);
      if (!mounted) return;
      setStatus(s => ({ ...s, coco: 'error', error: err }));
    });

    setStatus(s => ({ ...s, depth: 'loading' }));
    const worker = getDepthWorker();
    modelsRef.current.depthWorker = worker;
    console.log("ModelContext: Sending 'load' message to depth worker.");
    worker.postMessage({ type: 'load' });

    // Add listener for depth worker messages
    const onDepthWorkerMessage = (e) => {
      if (!mounted) return;
      if (e.data.type === "model_loaded") {
        console.log("ModelContext: Depth model loaded and warmed up.");
        setStatus(s => ({ ...s, depth: 'ready' }));
      } else if (e.data.type === "error") {
        console.error("ModelContext: Depth worker error:", e.data.error);
        setStatus(s => ({ ...s, depth: 'error', error: e.data.error }));
      }
    };

    worker.addEventListener("message", onDepthWorkerMessage);

    return () => {
      mounted = false;
      worker.removeEventListener("message", onDepthWorkerMessage); // Clean up listener
      /* do not dispose here, keep models alive */
    };
  }, []);

  return (
    <ModelContext.Provider value={{ models: modelsRef.current, status }}>
      {children}
    </ModelContext.Provider>
  );
}
