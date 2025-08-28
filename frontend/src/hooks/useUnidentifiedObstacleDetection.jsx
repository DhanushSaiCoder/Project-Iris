import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

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
    const { alertDistance, enableUnidentifiedObstacleDetection } = useContext(SettingsContext);

    const calculateUnidentifiedObstacles = (depthData, cocoDetections, frameWidth, frameHeight) => {
        if (!enableUnidentifiedObstacleDetection || !depthData || !cocoDetections || !frameWidth || !frameHeight) {
            return [];
        }

        // 1. Create binary mask from depth data
        const mask = new Uint8Array(depthData.length);
        for (let i = 0; i < depthData.length; i++) {
            // Assuming depthData contains distance in meters
            if (depthData[i] > 0 && depthData[i] < alertDistance) {
                mask[i] = 1;
            } else {
                mask[i] = 0;
            }
        }

        // 2. Perform connected-component labeling to find blobs
        const blobs = connectedComponentLabeling(mask, frameWidth, frameHeight);

        // 3. Filter blobs and cross-reference with COCO detections
        const obstacles = [];
        for (const blob of blobs) {
            // Filter out small blobs (noise)
            if (blob.width * blob.height < 50) { // Example threshold
                continue;
            }

            let isIdentified = false;
            for (const detection of cocoDetections) {
                const detectionBox = {
                    x: detection.bbox[0],
                    y: detection.bbox[1],
                    width: detection.bbox[2],
                    height: detection.bbox[3],
                };

                if (calculateIoU(blob, detectionBox) > 0.1) { // Example threshold
                    isIdentified = true;
                    break;
                }
            }

            if (!isIdentified) {
              // Integration constants (tune later)
              const HAZARD_CONF_THRESH = 0.35;        // lower than 0.5 to catch more hazards
              const OBSTACLE_CONF_MIN = 0.30;        // minimum confidence to call something an obstacle
              const SPARSE_PIXELS_FRACTION = 0.15;   // require at least 15% valid pixels inside bbox
              const AREA_MIN_PIXELS = 16;            // minimal absolute valid pixels
              const CLOSE_FACTOR = 1.0;              // consider blob close if medianDepth <= alertDistance * CLOSE_FACTOR

              // 1) run hazard detector (pass tuned params via options if you made detectGroundHazard accept them)
              const hazardResult = detectGroundHazard(blob, depthData, frameWidth, frameHeight, alertDistance /*, {paramsOverride} */);

              // extract robust metrics (fallback to cheap recompute if missing)
              const medianDepth = (hazardResult.details && hazardResult.details.medianDepth) || computeBlobMedianDepth(blob, depthData, frameWidth, frameHeight);
              const depthStd    = (hazardResult.details && hazardResult.details.depthStd)    || computeBlobDepthStd(blob, depthData, frameWidth, frameHeight, medianDepth);
              const validPixels = (hazardResult.details && hazardResult.details.validPixels) || computeBlobValidPixelCount(blob, depthData, frameWidth, frameHeight);
              const blobArea    = Math.max(1, Math.floor(blob.width) * Math.floor(blob.height));
              const validFraction = validPixels / Math.max(blobArea, 1);

              // 2) If detectGroundHazard found a specific hazard with reasonable confidence -> register it
              if (hazardResult.label && hazardResult.label !== 'none' && hazardResult.confidence >= HAZARD_CONF_THRESH) {
                obstacles.push({
                  ...blob,
                  type: 'specific_hazard',
                  hazardLabel: hazardResult.label,         // 'stair_up', 'hole',...
                  hazardConfidence: hazardResult.confidence,
                  medianDepth, depthStd, validPixels
                });
                continue; // done with this blob
              }

              // 3) If not a specific hazard, decide whether this is a general 'Obstacle' or just minor ground noise
              // Quick reject conditions (treat as noise):
              //  - too few valid pixels OR very small area -> ignore
              if (validPixels < Math.max(AREA_MIN_PIXELS, SPARSE_PIXELS_FRACTION * blobArea)) {
                // insufficient reliable depth inside blob -> ignore
                continue;
              }

              // 4) Is it close enough to be relevant?
              if (!(isFinite(medianDepth) && medianDepth > 0 && medianDepth <= alertDistance * CLOSE_FACTOR)) {
                // Not close enough: ignore for now
                continue;
              }

              // 5) Decide obstacle confidence from shape & depth stats:
              // If the blob has low depth variance and covers decent area -> high chance it's a vertical/solid obstacle (wall, pillar).
              // If variance is high but there was insufficient repeated step pattern, treat as "possibly irregular obstacle" with moderate confidence.

              // Heuristics (numbers to tune):
              const lowVarianceThresh = 0.12 * medianDepth;  // if depthStd is less than ~12% of median => fairly planar vertical surface
              const largeAreaFraction = 0.4;                 // if >40% of bbox has valid pixels, it's a solid object
              const tallThinRatio = (blob.height / Math.max(1, blob.width)) >= 1.3; // pillar-like

              let obstacleConfidence = 0;

              if (depthStd <= lowVarianceThresh) {
                // solid, planar or vertical object close by -> strong obstacle
                obstacleConfidence = 0.6 + 0.4 * Math.min(1, validFraction / largeAreaFraction);
              } else {
                // not planar: irregular surface, but still close and sizable -> moderate confidence
                // scale by closeness (closer => more urgent)
                const closeness = Math.max(0, (alertDistance - medianDepth) / alertDistance); // 0..1
                obstacleConfidence = 0.25 + 0.6 * closeness * Math.min(1, validFraction / 0.5);
              }

              // Strong extra boosts for obvious wall/pillar shapes
              if ( (blob.height >= 0.25 * frameHeight && tallThinRatio && medianDepth <= alertDistance) ||
                   (validFraction >= 0.7 && blob.width >= 0.15 * frameWidth && blob.height >= 0.15 * frameHeight) ) {
                obstacleConfidence = Math.max(obstacleConfidence, 0.75);
              }

              // 6) If obstacleConfidence passes a minimum, push generic obstacle
              if (obstacleConfidence >= OBSTACLE_CONF_MIN) {
                obstacles.push({
                  ...blob,
                  type: 'obstacle',
                  hazardLabel: 'obstacle', // Assign 'obstacle' as the label for general obstacles
                  hazardConfidence: obstacleConfidence,
                  medianDepth, depthStd, validPixels
                });
              } else {
                // else: ignore as minor ground noise
                // Optionally: log for offline tuning
              }
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
function detectGroundHazard(blob, depthMapData, frameWidth, frameHeight, alertDistance, options = {}) {
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
  if (area < params.minBlobArea) return { label: 'none', confidence: 0, details: { reason: 'tiny_blob', area } };

  const rowMedians = [];
  const globalDepths = [];

  for (let yy = y0; yy <= y1; yy++) {
    const rowVals = [];
    for (let xx = x0; xx <= x1; xx++) {
      if (!inBounds(xx, yy)) continue;
      const d = depthMapData[idx(xx, yy)];
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
    return { label: 'none', confidence: 0, details: { reason: 'sparse_depth', validPixels: globalDepths.length, area } };
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

  // Compute gradients (row -> next row). Positive gradient: depth increases (farther).
  const grads = [];
  for (let i = 0; i < smoothProfile.length - 1; i++) {
    grads.push(smoothProfile[i + 1] - smoothProfile[i]);
  }

  const medianDepth = median(globalDepths);
  const gradThreshAdaptive = Math.max(params.gradAbsMinMeters, params.gradRelFactor * medianDepth);

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
          medianDepth
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
          details: { index: i, depthIncrease, plateauLen, gradThreshAdaptive, medianDepth }
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
        details: { slope, gradsStd, gradThreshAdaptive, medianDepth }
      };
    }
  }

  // ---------- If we reach here, likely noise (small bumps or cracks) ----------
  // Make a final conservative check: if any gradient exceeds a high emergency threshold, mark as hazard
  const emergencyGrad = Math.max(0.3, 0.2 * medianDepth); // huge (>=20-30cm) abrupt change
  if (maxAbsGrad >= emergencyGrad) {
    // abrupt but not repeated -> likely big drop/edge; label as hole with lower confidence
    const conf = Math.min(1, 0.45 + 0.5 * ((maxAbsGrad - emergencyGrad) / Math.max(maxAbsGrad, emergencyGrad)));
    return { label: 'hole', confidence: conf, details: { reason: 'single_abrupt_change', maxAbsGrad, emergencyGrad, medianDepth } };
  }

  // none detected
  return { label: 'none', confidence: 0, details: { maxAbsGrad, meanGrad, stdGrad, gradThreshAdaptive, medianDepth } };
}
