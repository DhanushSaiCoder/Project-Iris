import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { getDistance } from '../utils/calibration';

// Helper functions for array statistics and processing
function median(arr) {
  if (!arr.length) return null;
  const a = Array.from(arr).sort((p, q) => p - q);
  const m = Math.floor(a.length / 2);
  return (a.length % 2 === 1) ? a[m] : (a[m - 1] + a[m]) / 2;
}

function mean(arr) {
  if (!arr.length) return 0;
  let s = 0;
  for (let v of arr) s += v;
  return s / arr.length;
}

function std(arr, arrMean = null) {
  if (!arr.length) return 0;
  const m = (arrMean === null) ? mean(arr) : arrMean;
  let s = 0;
  for (let v of arr) {
    const d = v - m;
    s += d * d;
  }
  return Math.sqrt(s / arr.length);
}

function movingAverage(arr, w) {
  if (w <= 1) return arr.slice();
  const out = new Array(arr.length);
  const half = Math.floor(w / 2);
  for (let i = 0; i < arr.length; i++) {
    let s = 0, c = 0;
    for (let j = i - half; j <= i + half; j++) {
      if (j >= 0 && j < arr.length && isFinite(arr[j])) { s += arr[j]; c++; }
    }
    return out[i] = c ? s / c : arr[i];
  }
}

// Temporal Tracking Helpers
let nextTrackId = 1;
const tracked = new Map(); // id -> TrackedBlob

function iou(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 <= x1 || y2 <= y1) return 0;
  const inter = (x2 - x1) * (y2 - y1);
  const union = a.width * a.height + b.width * b.height - inter;
  return inter / union;
}

function centroid(b) {
  return { cx: b.x + b.width / 2, cy: b.y + b.height / 2 };
}

function matchBlobsToTracks(newBlobs, frameWidth) {
  const assignments = new Map(); // newIndex -> trackId

  // Build a candidate list of matches with scores
  const candidates = [];
  for (let i = 0; i < newBlobs.length; i++) {
    const nb = newBlobs[i];
    for (const [id, tb] of tracked.entries()) {
      const scoreIoU = iou(nb, tb.bbox);
      const cnb = centroid(nb);
      const d = Math.hypot(cnb.cx - tb.centroid.cx, cnb.cy - tb.cy);
      candidates.push({ newIndex: i, trackId: id, iou: scoreIoU, dist: d });
    }
  }

  // Greedy assign: prefer IoU >= 0.3; otherwise nearest distance (within threshold)
  // Sort by descending IoU then ascending distance
  candidates.sort((A, B) => {
    if (B.iou !== A.iou) return B.iou - A.iou;
    return A.dist - B.dist;
  });

  const usedNew = new Set();
  const usedTrack = new Set();
  const maxCentroidPx = Math.max(40, 0.06 * frameWidth);

  for (const c of candidates) {
    if (usedNew.has(c.newIndex) || usedTrack.has(c.trackId)) continue;
    if (c.iou >= 0.30 || c.dist <= maxCentroidPx) {
      assignments.set(c.newIndex, c.trackId);
      usedNew.add(c.newIndex); usedTrack.add(c.trackId);
    }
  }

  // Unassigned new blobs -> new tracks
  for (let i = 0; i < newBlobs.length; i++) {
    if (!assignments.has(i)) {
      assignments.set(i, null); // mark as create
    }
  }

  return assignments; // Map newIndex -> trackId
}

function createTrackedBlob(newBlob, features) {
  const id = nextTrackId++;
  const c = centroid(newBlob);
  const tb = {
    id,
    bbox: newBlob,
    centroid: c,
    framesSeen: 1,
    framesMissing: 0,
    ewma: {
      medianDepth: features.medianDepth,
      depthStd: features.depthStd,
      hazardScore: features.hazardScore || 0,
      obstacleScore: features.obstacleScore || 0,
      maxResidual: features.maxResidual || 0,
      specificHazardLabel: features.specificHazardLabel || 'obstacle', // Default to 'obstacle'
    },
    history: [{ bbox: newBlob, features }]
  };
  tracked.set(id, tb);
  return tb;
}

// EWMA update
function ewmaUpdate(prev, value, alpha) {
  if (prev === undefined || prev === null) return value;
  return alpha * value + (1 - alpha) * prev;
}

function updateTrackWithBlob(tb, newBlob, features, alpha = 0.4) {
  // update bbox & centroid
  tb.bbox = newBlob;
  tb.centroid = centroid(newBlob);

  tb.framesSeen = tb.framesSeen + 1;
  tb.framesMissing = 0;

  tb.ewma.medianDepth = ewmaUpdate(tb.ewma.medianDepth, features.medianDepth, alpha);
  tb.ewma.depthStd    = ewmaUpdate(tb.ewma.depthStd, features.depthStd, alpha);
  tb.ewma.hazardScore = ewmaUpdate(tb.ewma.hazardScore, features.hazardScore || 0, alpha);
  tb.ewma.obstacleScore= ewmaUpdate(tb.ewma.obstacleScore, features.obstacleScore || 0, alpha);
  tb.ewma.maxResidual = Math.max(tb.ewma.maxResidual, features.maxResidual || 0); // max-based
  tb.ewma.specificHazardLabel = features.specificHazardLabel || tb.ewma.specificHazardLabel; // Update if new specific label, otherwise keep old

  tb.history.push({bbox: newBlob, features});
  if (tb.history.length > 12) tb.history.shift();
}

function markTrackMissing(tb) {
  tb.framesMissing = (tb.framesMissing || 0) + 1;
}

// cleanup (call each frame)
function cleanupTracks(maxMissing = 4) {
  for (const [id, tb] of tracked.entries()) {
    if (tb.framesMissing >= maxMissing) tracked.delete(id);
  }
}

// linearFitRows function
function linearFitRows(rowIndices, rowMedians) {
  // compute slope (a) and intercept (b) via least squares
  let n = 0, sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < rowMedians.length; i++) {
    const y = rowMedians[i];
    const x = rowIndices[i];
    if (!isFinite(y)) continue;
    n++;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  if (n < 2) return null;
  const denom = (n * sumXX - sumX * sumX);
  if (Math.abs(denom) < 1e-6) return null;
  const a = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - a * sumX) / n;
  // compute residuals and stats
  const residuals = [];
  for (let i = 0; i < rowMedians.length; i++) {
    const y = rowMedians[i];
    const x = rowIndices[i];
    if (!isFinite(y)) { residuals.push(NaN); continue; }
    const pred = a * x + b;
    residuals.push(y - pred); // positive -> actual deeper than predicted
  }
  const finiteRes = residuals.filter(v => isFinite(v));
  const meanRes = finiteRes.reduce((s, v) => s + v, 0) / finiteRes.length;
  const maxRes = Math.max(...finiteRes);
  const minRes = Math.min(...finiteRes);
  return { a, b, residuals, meanRes, maxRes, minRes };
}

const connectedComponentLabeling = (mask, width, height) => {
    const labels = new Uint32Array(mask.length);
    let nextLabel = 1;
    const disjointSet = [0];

    const find = (i) => {
        if (disjointSet[i] === i) return i;
        return disjointSet[i] = find(disjointSet[i]);
    };

    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            disjointSet[rootJ] = rootI;
        }
    };

    // First pass
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            if (mask[index] === 1) {
                const neighbors = [];
                if (y > 0) neighbors.push(labels[(y - 1) * width + x]); // Top
                if (x > 0) neighbors.push(labels[y * width + (x - 1)]); // Left

                const labeledNeighbors = neighbors.filter(l => l > 0);
                if (labeledNeighbors.length === 0) {
                    labels[index] = nextLabel;
                    disjointSet[nextLabel] = nextLabel;
                    nextLabel++;
                } else {
                    const minLabel = Math.min(...labeledNeighbors);
                    labels[index] = minLabel;
                    for (const label of labeledNeighbors) {
                        if (label !== minLabel) {
                            union(minLabel, label);
                        }
                    }
                }
            }
        }
    }

    // Second pass
    const blobs = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            if (labels[index] > 0) {
                const root = find(labels[index]);
                labels[index] = root;

                if (!blobs[root]) {
                    blobs[root] = { minX: x, minY: y, maxX: x, maxY: y };
                } else {
                    blobs[root].minX = Math.min(blobs[root].minX, x);
                    blobs[root].minY = Math.min(blobs[root].minY, y);
                    blobs[root].maxX = Math.max(blobs[root].maxX, x);
                    blobs[root].maxY = Math.max(blobs[root].maxY, y);
                }
            }
        }
    }

    return Object.values(blobs).map(b => ({
        x: b.minX,
        y: b.minY,
        width: b.maxX - b.minX + 1,
        height: b.maxY - b.minY + 1,
    }));
};

const calculateIoU = (box1, box2) => {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

    const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const box1Area = box1.width * box1.height;
    const box2Area = box2.width * box2.height;
    const unionArea = box1Area + box2Area - intersectionArea;

    return unionArea > 0 ? intersectionArea / unionArea : 0;
};

// Helper to compute median depth of a blob's pixels
const computeBlobMedianDepth = (blob, depthMapData, frameWidth, frameHeight) => {
    const x0 = Math.max(0, Math.floor(blob.x));
    const y0 = Math.max(0, Math.floor(blob.y));
    const x1 = Math.min(frameWidth - 1, Math.floor(blob.x + blob.width - 1));
    const y1 = Math.min(frameHeight - 1, Math.floor(blob.y + blob.height - 1));

    const blobDepths = [];
    for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) {
            const d = depthMapData[yy * frameWidth + xx];
            if (isFinite(d) && d > 0) { // Assuming valid depths are > 0
                blobDepths.push(d);
            }
        }
    }
    return median(blobDepths);
};

// Helper to compute standard deviation of depth of a blob's pixels
const computeBlobDepthStd = (blob, depthMapData, frameWidth, frameHeight, blobMeanDepth = null) => {
    const x0 = Math.max(0, Math.floor(blob.x));
    const y0 = Math.max(0, Math.floor(blob.y));
    const x1 = Math.min(frameWidth - 1, Math.floor(blob.x + blob.width - 1));
    const y1 = Math.min(frameHeight - 1, Math.floor(blob.y + blob.height - 1));

    const blobDepths = [];
    for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) {
            const d = depthMapData[yy * frameWidth + xx];
            if (isFinite(d) && d > 0) {
                blobDepths.push(d);
            }
        }
    }
    return std(blobDepths, blobMeanDepth);
};

// Helper to compute valid pixel count within a blob
const computeBlobValidPixelCount = (blob, depthMapData, frameWidth, frameHeight) => {
    const x0 = Math.max(0, Math.floor(blob.x));
    const y0 = Math.max(0, Math.floor(blob.y));
    const x1 = Math.min(frameWidth - 1, Math.floor(blob.x + blob.width - 1));
    const y1 = Math.min(frameHeight - 1, Math.floor(blob.y + blob.height - 1));

    let count = 0;
    for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) {
            const d = depthMapData[yy * frameWidth + xx];
            if (isFinite(d) && d > 0) {
                count++;
            }
        }
    }
    return count;
};

const useUnidentifiedObstacleDetection = () => {
    const { alertDistance, enableUnidentifiedObstacleDetection, calibration } = useContext(SettingsContext);

    const calculateUnidentifiedObstacles = (depthData, cocoDetections, frameWidth, frameHeight) => {
        if (!enableUnidentifiedObstacleDetection || !depthData || !cocoDetections || !frameWidth || !frameHeight) {
            return [];
        }

        // 1. Create binary mask from depth data
        const mask = new Uint8Array(depthData.length);
        for (let i = 0; i < depthData.length; i++) {
            if (depthData[i] > 0 && depthData[i] < alertDistance) {
                mask[i] = 1;
            } else {
                mask[i] = 0;
            }
        }

        // 2. Perform connected-component labeling to find blobs
        const blobs = connectedComponentLabeling(mask, frameWidth, frameHeight);

        const perBlobResults = [];

        for (const blob of blobs) {
            // Filter out small blobs (noise) - this is already handled by minBlobArea in detectGroundHazard
            // if (blob.width * blob.height < 50) {
            //     continue;
            // }

            let isIdentified = false;
            for (const detection of cocoDetections) {
                const detectionBox = {
                    x: detection.bbox[0],
                    y: detection.bbox[1],
                    width: detection.bbox[2],
                    height: detection.bbox[3],
                };

                if (calculateIoU(blob, detectionBox) > 0.1) {
                    isIdentified = true;
                    break;
                }
            }

            if (!isIdentified) {
                // 1) run detectGroundHazard which also returns depthStd, fit, validPixels
                const hr = detectGroundHazard(blob, depthData, frameWidth, frameHeight, alertDistance, calibration);
                // 2) compute obstacleScore quick heuristic
                const medianDepth = hr.details.medianDepth;
                const depthStd = hr.details.depthStd;
                const validFrac = hr.details.validFraction;
                const planarThresh = 0.12 * Math.max(0.15, medianDepth);
                let obstacleScore = 0;
                if (validFrac >= 0.6 && depthStd <= planarThresh) obstacleScore = 0.8;
                else {
                    const closeness = Math.max(0, (alertDistance - medianDepth) / alertDistance);
                    obstacleScore = Math.min(0.7, 0.2 + 0.7 * closeness * Math.min(1, validFrac / 0.5));
                }
                perBlobResults.push({ blob, features: {
                    medianDepth, depthStd, validPixels: hr.details.validPixels,
                    validFraction: hr.details.validFraction,
                    hazardScore: hr.confidence || 0, obstacleScore, maxResidual: hr.details.fit?.maxRes || 0,
                    // NEW: Store the specific hazard label if it's not 'none'
                    specificHazardLabel: (hr.label !== 'none' && hr.confidence >= HAZARD_CONF_THRESH) ? hr.label : undefined
                }, hazardResult: hr });
            }
        }

        // 3) match & update tracks
        const assignments = matchBlobsToTracks(perBlobResults.map(r=>r.blob), frameWidth);
        for (let i = 0; i < perBlobResults.length; i++) {
            const assigned = assignments.get(i);
            if (assigned === null) createTrackedBlob(perBlobResults[i].blob, perBlobResults[i].features);
            else updateTrackWithBlob(tracked.get(assigned), perBlobResults[i].blob, perBlobResults[i].features, 0.45);
        }
        // mark missing tracks, cleanup
        for (const [id, tb] of tracked) {
            let foundThisFrame = false;
            for (let i = 0; i < perBlobResults.length; i++) {
                if (assignments.get(i) === id) {
                    foundThisFrame = true;
                    break;
                }
            }
            if (!foundThisFrame) markTrackMissing(tb);
        }
        cleanupTracks(4);

        const obstacles = []; // This will now contain the *tracked* obstacles that should be alerted
        // 4) generate alerts from tracked blobs that persisted
        const HAZARD_CONF_THRESH = 0.35;
        const OBSTACLE_CONF_MIN = 0.30;
        for (const tb of tracked.values()) {
            if (tb.framesSeen < 2) continue; // Require persistence for at least 2 frames
            // use EWMA hazard / obstacle scores
            const hz = tb.ewma.hazardScore;
            const ob = tb.ewma.obstacleScore;
            if (hz >= HAZARD_CONF_THRESH) {
                obstacles.push({
                    ...tb.bbox, // Use the latest bbox from the tracked blob
                    type: 'specific_hazard',
                    hazardLabel: tb.ewma.specificHazardLabel, // Use the stored specific label
                    hazardConfidence: hz,
                    medianDepth: tb.ewma.medianDepth,
                    depthStd: tb.ewma.depthStd,
                    validPixels: tb.ewma.validPixels
                });
            } else if (ob >= OBSTACLE_CONF_MIN) {
                obstacles.push({
                    ...tb.bbox, // Use the latest bbox from the tracked blob
                    type: 'obstacle',
                    hazardLabel: 'obstacle',
                    hazardConfidence: ob,
                    medianDepth: tb.ewma.medianDepth,
                    depthStd: tb.ewma.depthStd,
                    validPixels: tb.ewma.validPixels
                });
            }
        }

        return obstacles;
    };

    return { calculateUnidentifiedObstacles };
};

export default useUnidentifiedObstacleDetection;

/**
 * Detect critical ground hazard inside a blob using depth map data.
 *
 * Inputs:
 *  - blob: { x, y, width, height }  (frame coordinates, integers)
 *  - depthMapData: Float32Array or Array of depth in meters, flattened row-major
 *  - frameWidth, frameHeight: integers
 *  - alertDistance: meters (close threshold; not strictly required but useful)
 *  - options: optional tuning parameters
 *
 * Output:
 *  { label: 'none'|'stair_up'|'stair_down'|'hole'|'ramp',
 *    confidence: 0..1,
 *    details: { ... } }
 */
function detectGroundHazard(blob, depthMapData, frameWidth, frameHeight, alertDistance, calibration, options = {}) {
  // ---------- default params (tune these to your sensor & mount) ----------
  const params = {
    // allow slightly smaller blobs to be considered hazards (stairs/edges can be small in frame)
    minBlobArea: 20,                // was 40 -> catch smaller but still meaningful blobs

    // sensor depth validity window (meters)
    validDepthMin: 0.15,            // slightly lower to accept closer returns
    validDepthMax: 20.0,

    // smoothing: smaller to preserve step edges; too large smoothing hides steps
    smoothingWindow: 2,             // was 3 -> preserve small vertical features

    // Gradient thresholds (absolute & relative)
    gradAbsMinMeters: 0.06,         // was 0.08 -> consider 6cm row-to-row changes
    gradRelFactor: 0.03,            // was 0.06 -> relative to medianDepth; lower = more sensitive

    // stairs tuning (handle compressed stair profiles)
    stepMinCount: 2,                // keep 2 steps minimum
    stepMinRowSeparation: 1,        // was 2 -> allow tightly spaced step edges
    stepMinHeightMeters: 0.06,      // was 0.12 -> detect smaller step risers (6cm)
    stepHeightConsistencyRatio: 0.8, // slightly looser consistency

    // hole/drop tuning
    holeMinDepthIncrease: 0.12,     // was 0.2 -> detect 12cm+ drops as potential hazards
    holePlateauRows: 3,             // was 4 -> plateau detection tolerant for compressed depth maps

    // ramp tuning
    rampMinRows: 5,                 // was 6 -> detect shorter ramps in frame
    rampGradStdThresh: 0.04,        // was 0.02 -> tolerate a bit more gradient noise for ramp

    // emergency abrupt change (single row) threshold (lowered)
    emergencyGradFactor: 0.18,      // fraction of medianDepth to mark single big change as emergency (was 0.2)
    emergencyGradAbs: 0.14,         // absolute emergency delta (meters) fallback (was ~0.3)

    // overall confidence floor used by integration
    minConfidenceBase: 0.25,
    // keep any other custom overrides
  };

  // ---------- helpers ----------
  const inBounds = (x, y) => x >= 0 && x < frameWidth && y >= 0 && y < frameHeight;
  const idx = (x, y) => y * frameWidth + x;

  // ---------- Extract per-row robust depth (median) inside the blob ----------
  const x0 = Math.max(0, Math.floor(blob.x));
  const y0 = Math.max(0, Math.floor(blob.y));
  const x1 = Math.min(frameWidth - 1, Math.floor(blob.x + blob.width - 1));
  const y1 = Math.min(frameHeight - 1, Math.floor(blob.y + blob.height - 1));
  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  const area = width * height;
  if (area < params.minBlobArea) return { label: 'none', confidence: 0, details: { reason: 'tiny_blob', area, validPixels: 0, validFraction: 0, depthStd: 0, medianDepth: 0, fit: null } };

  const rowMedians = [];
  const globalDepths = [];

  for (let yy = y0; yy <= y1; yy++) {
    const rowVals = [];
    for (let xx = x0; xx <= x1; xx++) {
      if (!inBounds(xx, yy)) continue;
      const d = calibration ? getDistance(depthMapData[idx(xx, yy)], calibration) : Infinity;
      if (!isFinite(d) || d <= 0) continue;
      if (d < params.validDepthMin || d > params.validDepthMax) continue;
      rowVals.push(d);
    }
    if (rowVals.length === 0) {
      rowMedians.push(NaN);
    } else {
      const m = median(rowVals);
      rowMedians.push(m);
      globalDepths.push(...rowVals);
    }
  }

  if (globalDepths.length < Math.max(20, 0.2 * area)) {
    // Not enough valid measurements inside the blob -> unreliable
    return { label: 'none', confidence: 0, details: { reason: 'sparse_depth', validPixels, validFraction, depthStd: 0, medianDepth: 0, area, fit: null } };
  }

  // Clean row medians: replace NaN rows by linear interpolation or nearest valid
  for (let i = 0; i < rowMedians.length; i++) {
    if (isFinite(rowMedians[i])) continue;
    // find nearest finite above/below
    let a = i - 1;
    while (a >= 0 && !isFinite(rowMedians[a])) a--;
    let b = i + 1;
    while (b < rowMedians.length && !isFinite(rowMedians[b])) b++;
    if (a >= 0 && b < rowMedians.length) {
      rowMedians[i] = (rowMedians[a] + rowMedians[b]) / 2;
    } else if (a >= 0) {
      rowMedians[i] = rowMedians[a];
    } else if (b < rowMedians.length) {
      rowMedians[i] = rowMedians[b];
    } else {
      // no valid rows at all (shouldn't happen because we checked globalDepths)
      rowMedians[i] = median(globalDepths);
    }
  }

  // Smooth the vertical profile to reduce speckle
  const smoothProfile = movingAverage(rowMedians, params.smoothingWindow);

  // NEW: Perform ground-line fit
  const rowIndices = Array.from({ length: smoothProfile.length }, (_, i) => y0 + i); // Absolute row indices
  const fit = linearFitRows(rowIndices, smoothProfile);

  // Compute gradients (row -> next row). Positive gradient: depth increases (farther).
  const grads = [];
  for (let i = 0; i < smoothProfile.length - 1; i++) {
    grads.push(smoothProfile[i + 1] - smoothProfile[i]);
  }

  const medianDepth = median(globalDepths);
  const gradThreshAdaptive = Math.max(params.gradAbsMinMeters, params.gradRelFactor * medianDepth);

  // NEW: Calculate depthStd and validFraction
  const validPixels = globalDepths.length;
  const blobArea = width * height; // Use the width and height from the blob's bounding box
  const validFraction = validPixels / Math.max(blobArea, 1);
  const depthStd = std(globalDepths, medianDepth);

  // Stats
  const absGrads = grads.map(g => Math.abs(g));
  const maxAbsGrad = Math.max(...absGrads);
  const meanGrad = mean(grads);
  const stdGrad = std(grads, meanGrad);

  // ---------- Detect repeated big steps (stairs) ----------
  // Find indices where abs(grad) >= gradThreshAdaptive
  const bigIndices = [];
  for (let i = 0; i < grads.length; i++) {
    if (Math.abs(grads[i]) >= gradThreshAdaptive && Math.abs(grads[i]) >= params.stepMinHeightMeters) {
      // check separation to avoid counting noisy adjacent rows twice
      if (bigIndices.length === 0 || i - bigIndices[bigIndices.length - 1] >= params.stepMinRowSeparation) {
        bigIndices.push(i);
      }
    }
  }

  if (bigIndices.length >= params.stepMinCount) {
    // compute step heights (taking grads at those indices)!
    const stepHeights = bigIndices.map(i => grads[i]); // sign matters
    const absStepHeights = stepHeights.map(h => Math.abs(h));
    const meanStep = mean(absStepHeights);
    const stdStep = std(absStepHeights, meanStep);
    const consistency = meanStep === 0 ? 1 : (stdStep / meanStep);

    // require consistent step heights and each step reasonably large
    if (consistency <= params.stepHeightConsistencyRatio && meanStep >= params.stepMinHeightMeters) {
      // determine direction: if grads are mostly negative => depth decreasing as we go downwards => closer => stair_up
      const avgSigned = mean(stepHeights);
      const label = (avgSigned < 0) ? 'stair_up' : 'stair_down';
      // estimate confidence: more steps and more consistent -> higher
      const conf = Math.min(1, 0.35 + 0.25 * bigIndices.length + 0.4 * (1 - (consistency)));
      return {
        label,
        confidence: conf,
        details: {
          reason: 'multi_step_pattern',
          bigStepCount: bigIndices.length,
          meanStepHeight: meanStep,
          stdStepHeight: stdStep,
          gradThreshAdaptive,
          medianDepth,
          depthStd,
          validPixels,
          validFraction,
          fit
        }
      };
    }
  }

  // ---------- Detect hole/drop: single large positive gradient followed by deeper plateau ----------
  // Hole hypothesis: there exists an index i where grads[i] >= holeMinDepthIncrease (depth increases -> farther)
  // and following rows stay deeper (plateau) for holePlateauRows
  for (let i = 0; i < grads.length; i++) {
    if (grads[i] >= Math.max(params.holeMinDepthIncrease, gradThreshAdaptive)) {
      // check plateau after i+1
      const plateauStart = i + 1;
      const plateauEnd = Math.min(smoothProfile.length - 1, plateauStart + params.holePlateauRows - 1);
      let plateauOk = true;
      const baseDepth = smoothProfile[plateauStart - 1];
      for (let r = plateauStart; r <= plateauEnd; r++) {
        if (smoothProfile[r] < baseDepth + params.holeMinDepthIncrease * 0.9) {
          plateauOk = false;
          break;
        }
      }
      if (plateauOk) {
        // confidence depends on magnitude and plateau length
        const depthIncrease = smoothProfile[plateauStart] - baseDepth;
        const plateauLen = plateauEnd - plateauStart + 1;
        const conf = Math.min(1, 0.3 + 0.4 * (depthIncrease / Math.max(depthIncrease, params.holeMinDepthIncrease)) + 0.3 * (plateauLen / params.holePlateauRows));
        return {
          label: 'hole',
          confidence: conf,
          details: { index: i, depthIncrease, plateauLen, gradThreshAdaptive, medianDepth, depthStd, validPixels, validFraction, fit }
        };
      }
    }
  }

  // ---------- Detect ramp: many rows with small, consistent gradient ----------
  if (smoothProfile.length >= params.rampMinRows) {
    // use linear fit slope approximation: slope = (last - first) / (rows-1)
    const slope = (smoothProfile[smoothProfile.length - 1] - smoothProfile[0]) / (smoothProfile.length - 1);
    // gradients std should be small and slope should be significant relative to threshold
    const slopeAbs = Math.abs(slope);
    const gradsStd = stdGrad;
    if (slopeAbs >= gradThreshAdaptive * 0.25 && gradsStd <= params.rampGradStdThresh) {
      // ramp detected
      const label = (slope < 0) ? 'ramp_up' : 'ramp_down'; // slope < 0 => depth decreases => closer downwards => ramp up
      const conf = Math.min(1, 0.4 + 0.6 * (slopeAbs / Math.max(slopeAbs, gradThreshAdaptive)));
      return {
        label: 'ramp',
        confidence: conf,
        details: { slope, gradsStd, gradThreshAdaptive, medianDepth, depthStd, validPixels, validFraction, fit }
      };
    }
  }

  // ---------- If we reach here, likely noise (small bumps or cracks) ----------
  // Make a final conservative check: if any gradient exceeds a high emergency threshold, mark as hazard
  const emergencyGrad = Math.max(0.3, 0.2 * medianDepth); // huge (>=20-30cm) abrupt change
  if (maxAbsGrad >= emergencyGrad) {
    // abrupt but not repeated -> likely big drop/edge; label as hole with lower confidence
    const conf = Math.min(1, 0.45 + 0.5 * ((maxAbsGrad - emergencyGrad) / Math.max(maxAbsGrad, emergencyGrad)));
    return { label: 'hole', confidence: conf, details: { reason: 'single_abrupt_change', maxAbsGrad, emergencyGrad, medianDepth, depthStd, validPixels, validFraction, fit } };
  }

  // none detected
  return { label: 'none', confidence: 0, details: { maxAbsGrad, meanGrad, stdGrad, gradThreshAdaptive, medianDepth, depthStd, validPixels, validFraction, fit } };
}
