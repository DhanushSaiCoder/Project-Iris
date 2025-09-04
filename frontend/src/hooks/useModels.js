// src/hooks/useModels.js
import { useState, useEffect } from "react";
import { getCocoModel } from "../services/modelService";

export function useModels() {
  const [cocoModel, setCocoModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const model = await getCocoModel(); // cached promise/instance
        if (!cancelled) setCocoModel(model);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      // DO NOT dispose the model here — keep it cached for other mounts.
    };
  }, []);

  return { cocoModel, loading, error };
}
