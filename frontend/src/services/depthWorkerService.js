// src/services/depthWorkerService.js
let depthWorker = null;

/**
 * Returns the single shared depth worker. Creates it if missing.
 * The worker script path must match your bundler (this uses Vite/CRA-style new URL).
 */
export function getDepthWorker() {
  if (depthWorker) {
    console.log("getDepthWorker: Returning cached worker.");
    return depthWorker;
  }

  console.log("getDepthWorker: Creating new worker instance.");
  depthWorker = new Worker(new URL("../workers/depth.worker.js", import.meta.url), {
    type: "module",
  });

  depthWorker.onerror = (e) => {
    console.error("Depth worker error:", e);
  };

  return depthWorker;
}

export function terminateDepthWorker() {
  if (depthWorker) {
    try {
      depthWorker.terminate();
    } catch (e) {
      console.warn("Error terminating depth worker:", e);
    }
    depthWorker = null;
  }
}
