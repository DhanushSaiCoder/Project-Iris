import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

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
                obstacles.push(blob);
            }
        }

        return obstacles;
    };

    return { calculateUnidentifiedObstacles };
};

export default useUnidentifiedObstacleDetection;
