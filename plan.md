
# Plan for "Unidentified Obstacle Detection" Feature

## 1. Goal

Implement a feature to alert users about nearby obstacles that are not identified by the existing COCO-SSD object detection model. This will enhance user safety by warning them about potential collisions with objects that the primary model doesn't recognize.

## 2. Core Concept

The implementation will leverage the existing depth estimation model (FastDepth) in conjunction with the object detection model (COCO-SSD).

The process will be as follows:
1.  The depth model generates a depth map of the scene.
2.  This depth map is processed to identify contiguous regions (blobs) of pixels that are closer to the user than a predefined threshold. These are potential obstacles.
3.  The system checks if these close-proximity blobs overlap with the bounding boxes of objects already detected by the COCO-SSD model.
4.  If a blob does *not* significantly overlap with any known, detected object, it is classified as an "unidentified obstacle," and an alert is triggered.

## 3. Detailed Implementation Steps

### 3.1. Frontend Logic (in a new hook `useUnidentifiedObstacleDetection.jsx`)

A new custom hook will be created to encapsulate the logic for this feature. This hook will be used in `VideoStream.jsx`.

**Inputs to the hook:**
-   Depth map data from `useDepthModel`.
-   Detected objects array (with bounding boxes) from `useModels` (COCO-SSD).
-   The `alertDistance` setting from `SettingsContext`.
-   A new setting to enable/disable this feature, let's call it `enableUnidentifiedObstacleDetection`.

**Steps within the hook:**

1.  **Depth Map Processing:**
    -   Create a binary mask from the depth map. Pixels representing a distance less than `alertDistance` will be set to `1`, and all others to `0`.
    -   To reduce noise (e.g., small, spurious depth readings), apply a filtering step to the binary mask. A simple approach would be to ignore small blobs below a certain pixel count.

2.  **Blob Detection:**
    -   Implement or use a library for connected-component analysis (blob detection) on the binary mask. This will group the `1`s into distinct obstacle blobs.
    -   For each blob, calculate its bounding box. This gives us a list of potential "unidentified obstacles" with their locations on the screen.

3.  **Cross-Referencing with COCO-SSD Detections:**
    -   Iterate through each obstacle blob found in the previous step.
    -   For each blob, iterate through the list of objects detected by COCO-SSD.
    -   Calculate the Intersection over Union (IoU) between the blob's bounding box and each COCO-SSD object's bounding box.
    -   If a blob's IoU with any COCO-SSD object is above a certain threshold (e.g., 0.2), we assume it's part of a known object and discard it.
    -   If a blob has a low IoU with *all* COCO-SSD objects, it is confirmed as an "unidentified obstacle."

4.  **Output of the hook:**
    -   The hook will return an array of bounding boxes for the confirmed "unidentified obstacles."

### 3.2. User Interface and Notifications (`VideoStream.jsx`)

1.  **Visualization:**
    -   In the `VideoStream.jsx` component, the bounding boxes of the unidentified obstacles will be rendered on the canvas.
    -   These bounding boxes will have a distinct style (e.g., a dashed red line) to differentiate them from the standard object detection boxes.

2.  **Alerts:**
    -   When an unidentified obstacle is detected, a new, specific alert will be triggered.
    -   A new audio announcement will be created (e.g., "Unidentified obstacle detected"). This will be spoken using the `speech.js` utility.
    -   A new haptic feedback pattern will be created in `haptics.js` and triggered to provide a physical notification.
    -   Alerts should be debounced to avoid overwhelming the user.

### 3.3. Settings (`SettingsContext.jsx` and `SettingsPage.jsx`)

1.  **New Setting:**
    -   A new boolean state, `enableUnidentifiedObstacleDetection`, will be added to `SettingsContext.jsx`. It will be persisted to `localStorage` like the other settings.
    -   The default value for this setting will be `true`.

2.  **UI Toggle:**
    -   A new switch or checkbox will be added to the `SettingsPage.jsx` to allow users to easily enable or disable this feature.

## 4. Foreseen Challenges and Considerations

-   **Performance:** The blob detection and IoU calculations will run on every frame, so the implementation must be highly performant to avoid dropping the frame rate. The processing will be done on the main thread unless we can offload it to a worker.
-   **Blob Detection Implementation:** Finding a lightweight, dependency-free blob detection library for JavaScript, or implementing one from scratch, will be a key task. A simple scanline-based algorithm should be sufficient and performant.
-   **Tuning:** The distance threshold (`alertDistance`), the IoU threshold for cross-referencing, and the minimum blob size for noise reduction will need to be tuned to achieve a good balance between sensitivity and false positives.
-   **User Experience:** The frequency and nature of the alerts must be carefully managed to be helpful without being annoying. Debouncing and clear, concise alert messages are crucial.

