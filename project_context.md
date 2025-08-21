# Project Iris - Codebase Context

This document summarizes the core functionalities and purpose of key files within the Project Iris codebase, based on an initial analysis. This context will be updated after major changes to the project.

## Root Directory Files

### `README.md`
- **Purpose:** Provides a high-level overview of the project, setup instructions, and general information.

### `package.json`
- **Purpose:** Defines project metadata, scripts, and dependencies for the root project (if any global scripts/dependencies are defined here).

### `package-lock.json`
- **Purpose:** Records the exact version of each dependency installed, ensuring consistent builds across environments.

### `.gitignore`
- **Purpose:** Specifies intentionally untracked files that Git should ignore.

### `install_all.bat`
- **Purpose:** A batch script for Windows to automate the installation of project dependencies.

### `install_all.sh`
- **Purpose:** A shell script for Unix-like systems to automate the installation of project dependencies.

### `LICENSE`
- **Purpose:** Contains the licensing information for the project.

## Backend Files

### `backend/.gitignore`
- **Purpose:** Specifies intentionally untracked files specific to the backend that Git should ignore.

### `backend/package.json`
- **Purpose:** Defines project metadata, scripts, and dependencies for the backend service.

### `backend/package-lock.json`
- **Purpose:** Records the exact version of each dependency installed for the backend, ensuring consistent builds.

### `backend/server.js`
- **Purpose:** Main entry point for the backend Express.js server.
- **Key Functionalities:**
    - Initializes Express app.
    - Connects to MongoDB using Mongoose.
    - Loads environment variables from `.env.production` or `.env.development`.
    - Configures middleware (Express JSON parser, CORS).
    - Mounts API routes (`/auth`, `/session`, `/api/users`).
    - Serves static frontend build files in `testing` environment.
    - Starts the server on a specified port.

### `backend/Controllers/authController.js`
- **Purpose:** Handles user authentication logic.
- **Key Functionalities:**
    - `signup`: Registers a new user, hashes password using `bcrypt`, generates a JWT token, and saves user to database.
    - `login`: Authenticates an existing user, compares password, and generates a JWT token upon successful login.
    - `healthCheck`: Simple endpoint to check backend health.

### `backend/Controllers/sessionController.js`
- **Purpose:** Manages user session data.
- **Key Functionalities:**
    - `createSession`: Saves a new session record, including `userId`, `duration`, `totalDetections`, `allDetections`, and calculates `uniqueObjects`.
    - `getAllSessions`: Retrieves all sessions, populating user details.
    - `getSessionById`: Fetches a specific session by its ID.
    - `importGuestSessions`: Imports guest session data for a newly registered user.
    - `getUniqueObjects`: Aggregates and returns counts of unique detected objects across all sessions.

### `backend/Controllers/userController.js`
- **Purpose:** Handles user-related operations (excluding authentication).
- **Key Functionalities:**
    - `getUsers`: Retrieves a list of all users (excluding passwords).
    - `updateUserRole`: Updates the role of a specific user.
    - `getUsersByIds`: Retrieves user details for a given array of user IDs.

### `backend/models/sessionModel.js`
- **Purpose:** Defines the Mongoose schema for session data.
- **Key Fields:** `userId` (references `User` model), `duration`, `uniqueObjects`, `totalDetections`, `allDetections` (array of objects with `class`, `confidence`, `timestamp`).

### `backend/models/User.model.js`
- **Purpose:** Defines the Mongoose schema for user data.
- **Key Fields:** `fullName`, `email` (unique), `password`, `role` (enum: `admin`, `user`, `developer`, default: `user`).

### `backend/routes/Auth.route.js`
- **Purpose:** Defines API routes for authentication.
- **Routes:**
    - `POST /signup`: Maps to `authController.signup`.
    - `POST /login`: Maps to `authController.login`.
    - `GET /health-check`: Maps to `authController.healthCheck`.

### `backend/routes/sessionsRoute.js`
- **Purpose:** Defines API routes for session management.
- **Routes:**
    - `POST /`: Maps to `sessionController.createSession`.
    - `POST /guest-import`: Maps to `sessionController.importGuestSessions`.
    - `GET /`: Maps to `sessionController.getAllSessions`.
    - `GET /unique-objects`: Maps to `sessionController.getUniqueObjects`.
    - `GET /:id`: Maps to `sessionController.getSessionById`.

### `backend/routes/user.route.js`
- **Purpose:** Defines API routes for user management.
- **Routes:**
    - `GET /`: Maps to `userController.getUsers`.
    - `POST /by-ids`: Maps to `userController.getUsersByIds`.
    - `PUT /:id/role`: Maps to `userController.updateUserRole`.

## Frontend Files

### `frontend/.gitignore`
- **Purpose:** Specifies intentionally untracked files specific to the frontend that Git should ignore.

### `frontend/package.json`
- **Purpose:** Defines project metadata, scripts, and dependencies for the frontend React application.

### `frontend/package-lock.json`
- **Purpose:** Records the exact version of each dependency installed for the frontend, ensuring consistent builds.

### `frontend/src/App.js`
- **Purpose:** Main React application component, handles routing and global layout.
- **Key Functionalities:**
    - Sets up `react-router-dom` for navigation.
    - Defines public and protected routes.
    - Manages Header and Footer visibility based on current route.
    - Implements a `MobileGuard` (currently a placeholder).
    - Uses Material-UI `ThemeProvider` for dark mode.
    - Integrates `NotificationProvider` and `Analytics`.
    - Redirects to `/launch` page on first visit.

### `frontend/src/index.js`
- **Purpose:** Entry point for the React application.
- **Key Functionalities:**
    - Renders the `App` component into the DOM.
    - Wraps `App` with `SettingsProvider` and `AuthProvider` to provide global context.
    - Registers/unregisters service worker.
    - Reports web vitals.

### `frontend/src/context/AuthContext.jsx`
- **Purpose:** Provides authentication state and functions to the React app.
- **Key Functionalities:**
    - Manages `user` object and `token` state.
    - `login`: Authenticates user, sets token in `localStorage` and `axios` headers.
    - `signup`: Registers user, handles token, and imports any stored guest session data.
    - `logout`: Clears token and user data.
    - Uses `jwt-decode` to parse token.

### `frontend/src/context/NotificationContext.jsx`
- **Purpose:** Provides a global notification system using Material-UI Snackbars.
- **Key Functionalities:**
    - `showNotification`: Displays a snackbar with a given message and severity.
    - Manages notification state and auto-hiding.

### `frontend/src/context/ProtectedRoute.jsx`
- **Purpose:** Component for protecting routes that require user authentication.
- **Key Functionalities:**
    - Checks for `token` and `loading` state from `AuthContext`.
    - Redirects to `/login` if not authenticated.
    - Redirects to `/guest-limit` if `guestLimitReached` is true and user is not logged in.

### `frontend/src/context/SettingsContext.jsx`
- **Purpose:** Provides global application settings and their management.
- **Key Functionalities:**
    - Manages various settings (e.g., `audioAnnouncements`, `hapticFeedback`, `alertDistance`, `developerMode`, `torch`).
    - Persists settings to `localStorage`.
    - Provides setter functions for each setting.

### `frontend/src/hooks/isMobile.jsx`
- **Purpose:** Custom hook to detect if the device is mobile.
- **Key Functionalities:**
    - Uses `navigator.userAgent` to determine mobile status.
    - **Note:** As observed, `MobileGuard.jsx` imports this but doesn't currently use its return value for conditional rendering.

### `frontend/src/hooks/useCamera.jsx`
- **Purpose:** Custom hook for managing camera access.
- **Key Functionalities:**
    - Requests `getUserMedia` for video stream.
    - Manages `videoRef` and `ready` state.
    - Integrates `torch` setting from `SettingsContext`.
    - Handles camera start/stop and error logging.

### `frontend/src/hooks/useDepthModel.jsx`
- **Purpose:** Custom hook for interacting with the depth estimation model (running in a web worker).
- **Key Functionalities:**
    - Initializes and communicates with `depth.worker.js`.
    - Manages `loading`, `error`, and `depthMap` states.
    - `predictDepth`: Sends image data to the worker for depth prediction.

### `frontend/src/hooks/useModels.jsx`
- **Purpose:** Custom hook for loading TensorFlow.js object detection models.
- **Key Functionalities:**
    - Loads the COCO-SSD model (`lite_mobilenet_v2`).
    - Sets up the WebGL backend for TensorFlow.js.
    - Manages `cocoModel`, `loading`, and `error` states.

### `frontend/src/utils/haptics.js`
- **Purpose:** Provides utility functions for haptic feedback (vibrations).
- **Key Functionalities:**
    - `getHapticPattern`: Returns predefined vibration patterns based on alert type.
    - `triggerHapticFeedback`: Triggers vibration with debounce to prevent overuse.
    - Checks for `navigator.vibrate` support.

### `frontend/src/utils/loadingMessages.js`
- **Purpose:** Stores an array of strings for display during loading sequences.
- **Key Functionalities:**
    - Exports `loadingMessages` array.

### `frontend/src/utils/MobileGuard.jsx`
- **Purpose:** (Currently) A wrapper component.
- **Key Functionalities:**
    - Renders its children directly.
    - **Note:** Imports `isMobileDevice` but does not use it to conditionally render content or redirect, suggesting it might be a placeholder or incomplete implementation for mobile-specific logic.

### `frontend/src/utils/speech.js`
- **Purpose:** Provides text-to-speech functionality using the Web Speech API.
- **Key Functionalities:**
    - `speak`: Queues and speaks text aloud.
    - `cancelSpeech`: Stops current speech.
    - `clearSpeechQueue`: Clears the entire speech queue and stops current speech.
    - Manages voice loading and speech queue processing.
    - Provides a callback for status updates.

### `frontend/src/workers/depth.worker.js`
- **Purpose:** Web worker for running the FastDepth TensorFlow.js model.
- **Key Functionalities:**
    - Loads the depth estimation model (`model.json`).
    - Warms up the model for better performance.
    - `predictDepth`: Takes image data, preprocesses it, runs the model, and returns the depth map.
    - Handles TensorFlow.js setup within the worker.

## How to Update This Context File

To keep this `project_context.md` file up-to-date after significant code changes, follow these steps:

1.  **Identify Changed Files:** Determine which files relevant to the core functionality have been modified.
2.  **Review Changes:** Carefully examine the changes made to these files to understand their impact on the file's purpose, key functionalities, or dependencies.
3.  **Locate Section:** Find the corresponding section for the modified file within this `project_context.md`.
4.  **Update Context:** Revise the summary for that file, ensuring it accurately reflects the current state and new functionalities. If a new core file is added, create a new section for it.
5.  **Maintain Conciseness:** Keep descriptions concise and focused on the most important aspects.
6.  **Commit:** Commit the updated `project_context.md` along with your code changes.
