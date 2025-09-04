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
    // optionally send init
    worker.postMessage({ type: 'init' });

    setStatus(s => ({ ...s, depth: 'ready' }));

    return () => { mounted = false; /* do not dispose here, keep models alive */ };
  }, []);

  return (
    <ModelContext.Provider value={{ models: modelsRef.current, status }}>
      {children}
    </ModelContext.Provider>
  );
}
