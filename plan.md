# Plan for New Calibration Process

## 1. Goal

To refactor the existing calibration process to a simpler, more user-driven workflow with an interactive verification and adjustment step.

## 2. New Workflow

1.  **Step 1: Capture at 1m**
    *   User is instructed to point the camera at an object 1 meter away.
    *   User manually triggers a "Capture" button.
    *   The application captures the raw depth value at the center of the screen.

2.  **Step 2: Capture at 2m**
    *   User is instructed to point the camera at an object 2 meters away and captures.

3.  **Step 3: (Optional) Capture at 3m**
    *   User is instructed to point the camera at an object 3 meters away and captures.

4.  **Step 4: Verification & Adjustment**
    *   The system calculates the initial calibration parameters (`m` and `c`) using linear regression on the captured data points.
    *   The UI displays the live predicted distance of the object in the center of the camera view.
    *   The user is presented with "+" (Too Far) and "-" (Too Near) buttons.
    *   If the user clicks these buttons, the calibration parameters (`m` and/or `c`) are adjusted slightly, and the user can see the live prediction change.
    *   The user can continue to adjust until they are satisfied with the accuracy.

5.  **Step 5: Completion**
    *   User clicks "Finish".
    *   The final, adjusted calibration parameters are saved to `localStorage`.

## 3. Implementation Steps

### 3.1. Refactor `NewCalibrationPage.jsx`

This will be the main focus of the work. The existing state machine and logic for guidance, stability, and auto-capture will be removed and replaced with a simpler step-based UI.

1.  **Simplify State:**
    *   Remove the `processState` state machine (`idle`, `guiding`, `stabilizing`, etc.).
    *   The primary state will be `step` (0, 1, 2 for capture, 3 for verification).
    *   Keep `calibrationData` to store the `[1/depth, distance]` pairs.
    *   Add a new state for the adjustable calibration model, e.g., `adjustableCalibration`.

2.  **Create New UI Components for Each Step:**
    *   **Capture Step UI:**
        *   Display the target distance (e.g., "Point at an object 1m away").
        *   Show a "Capture" button.
        *   When clicked, it should take the `currentDepth` value, create the data point, and advance the `step`.
    *   **Verification Step UI:**
        *   On entering this step, calculate the initial `linearRegression` and store it in `adjustableCalibration`.
        *   Display the live distance calculated using `getDistance(currentDepth, adjustableCalibration)`.
        *   Add three buttons: "Looks Good (Finish)", "Adjust: Too Far", "Adjust: Too Near".

3.  **Implement Adjustment Logic:**
    *   When "Too Far" or "Too Near" is clicked, slightly modify the `m` or `c` value in the `adjustableCalibration` state.
        *   A simple approach is to increase/decrease the intercept `c` by a small, fixed amount (e.g., 0.05). A more advanced approach could involve adjusting `m` as well.
        *   `setAdjustableCalibration({ ...adjustableCalibration, c: adjustableCalibration.c + 0.05 })`
    *   The UI will re-render with the new predicted distance, providing immediate feedback.

4.  **Finish:**
    *   The "Finish" button will save the `adjustableCalibration` object to `localStorage` (via `SettingsContext`) and navigate the user away from the page.

### 3.2. Update `useCalibrationState.js` (Optional but Recommended)

The existing `useCalibrationState.js` hook is not currently used in the `NewCalibrationPage.jsx` but contains some of the same logic. To improve code structure, the logic for managing calibration data and state could be moved from the page component into this hook.

1.  Add a function to the hook for the adjustment step, e.g., `adjustCalibration(adjustmentFactor)`.
2.  Refactor `NewCalibrationPage.jsx` to consume this hook for all state management related to calibration.

### 3.3. No Changes Needed

*   **`calibration.js`**: The `linearRegression` and `getDistance` functions are still perfectly valid and will be used.
*   **`useDepthModel.jsx`**: This hook will continue to provide the raw depth data as needed.
*   **`SettingsContext.jsx`**: The mechanism for saving and loading the calibration data is already in place.

## 4. Plan Execution Order

1.  Start with `NewCalibrationPage.jsx`. Strip out the existing complex UI logic (the `switch (processState)` block).
2.  Implement the new, simpler UI for the capture steps (1m, 2m, 3m).
3.  Implement the UI for the verification step, including the live distance display and the adjustment buttons.
4.  Wire up the adjustment logic to modify the calibration parameters.
5.  Ensure the final calibration is saved correctly.
6.  (Optional) Refactor the state management logic into `useCalibrationState.js` for better separation of concerns.