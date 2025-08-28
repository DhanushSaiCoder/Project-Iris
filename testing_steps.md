## Comprehensive Testing Guide for `obstacleDetection` Branch

Before merging the `obstacleDetection` branch into `main`, please perform the following comprehensive tests to ensure all features are working as expected and no regressions have been introduced.

**1. Verify Your Current Branch:**
First, ensure you are on the `obstacleDetection` branch:
```bash
git branch
```
You should see `* obstacleDetection` indicating you are on the correct branch.

**2. Start the Application:**
If your backend and frontend servers are not already running, start them:
*   **Backend:** Open a terminal, navigate to `C:\Users\dhanu\Documents\codes\RepoDestinations\Project-Iris\Project-Iris\backend`, and run `node server.js`.
*   **Frontend:** Open another terminal, navigate to `C:\Users\dhanu\Documents\codes\RepoDestinations\Project-Iris\Project-Iris\frontend`, and run `npm start`.
Access the application in your web browser, usually at `http://localhost:3000`.

**3. Comprehensive Feature Test Checklist:**

Once the application is running and you've granted camera permissions (if prompted), start the detection and go through the following scenarios:

*   **Core Functionality:**
    *   Toggle the "Unidentified Obstacle Detection" feature on and off in the settings. Verify that detection starts/stops as expected.
    *   Test basic obstacle detection with large, clear objects like walls and pillars. You should hear "Obstacle detected" and see bounding boxes.

*   **Ground Hazard Detection (Critical):**
    *   **Stairs (Up/Down):** Point your camera at stairs. Verify that you receive accurate "Stair up detected" or "Stair down detected" alerts. Observe if the bounding boxes correctly outline the steps.
    *   **Holes/Drops:** Test with a significant drop-off (e.g., a large step down, an open manhole, or a deep ditch). Confirm that "Hole detected" alerts are triggered.
    *   **Ramps:** Point your camera at a ramp. Check for "Ramp detected" alerts.
    *   **General Ground Noise:** Point the camera at minor ground variations (e.g., small cracks, pebbles, uneven pavement). Confirm that these *do not* trigger any alerts, as they should be filtered out by the new algorithm.

*   **Temporal Tracking:**
    *   Observe if the alerts are stable and less "flickery" compared to before.
    *   Briefly obscure an obstacle with your hand and then reveal it. See if the detection quickly re-acquires and continues tracking the same obstacle without generating a new alert.

*   **Field of View Cropping:**
    *   Visually confirm that the detection area is now cropped to the central 70% horizontally and 90% vertically. The outline should reflect this.
    *   Observe the overall performance (smoothness, frame rate). Does it feel responsive?

*   **Alerts and Feedback:**
    *   Listen for the specific audio alerts ("Stair up detected", "Hole detected", "Ramp detected", "Obstacle detected").
    *   Verify that haptic feedback is triggered with the alerts.

*   **Edge Cases (if possible):**
    *   Test with challenging surfaces like glass or highly reflective objects. Note if they cause false positives or missed detections.
    *   Test in varying lighting conditions (e.g., low light).

*   **No Regressions:**
    *   Navigate through other parts of the application (e.g., settings, admin dashboard if applicable).
    *   Verify that the COCO-SSD detection for known objects (people, chairs, etc.) is still working correctly.

Please provide detailed observations for each point. This will help determine if the branch is truly ready for merging.
