// src/hooks/useModels.js
import { useState, useEffect } from "react";
import { useModelContext } from "../context/ModelContext";

export function useModels() {
  const { models, status } = useModelContext();
  const [cocoModel, setCocoModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status.coco === 'ready') {
      setCocoModel(models.coco);
      setLoading(false);
      setError(null);
    } else if (status.coco === 'error') {
      setCocoModel(null);
      setLoading(false);
      setError(status.error);
    } else {
      setLoading(true);
      setCocoModel(null);
      setError(null);
    }
  }, [status.coco, models.coco, status.error]);

  return { cocoModel, loading, error };
}
