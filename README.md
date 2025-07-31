<div align="center">
  <img src="./frontend/src/assets/images/logo.png" alt="Project Iris Logo" width="200"/>
</div>

<h1 align="center">Project-Iris</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge"/>
</div>

<div align="center">
  <img src="https://img.shields.io/github/license/DhanushSaiCoder/Project-Iris" alt="License Badge"/>
  <img src="https://img.shields.io/github/last-commit/DhanushSaiCoder/Project-Iris" alt="Last Commit Badge"/>
  <img src="https://img.shields.io/github/repo-size/DhanushSaiCoder/Project-Iris" alt="Repo Size Badge"/>
</div>


# Project Iris - Frontend

Project Iris is a web-based application designed to provide real-time object detection and depth estimation capabilities, primarily for mobile devices. It leverages TensorFlow.js for on-device machine learning, offering features like user monitoring, administrative dashboards, and customizable settings.

## Technologies Used

-   **React:** A JavaScript library for building user interfaces.
-   **TensorFlow.js:** A library for machine learning in JavaScript, enabling on-device model execution.
    -   `@tensorflow-models/coco-ssd`: For object detection.
    -   `@tensorflow/tfjs`: Core TensorFlow.js library.
    -   `@tensorflow/tfjs-backend-webgl`: WebGL backend for accelerated computations.
    -   `@tensorflow/tfjs-converter`: For loading pre-trained models.
-   **React Router DOM:** For declarative routing in React applications.
-   **Lucide React:** A collection of open-source icons.
-   **Nano ID:** A tiny, secure, URL-friendly, unique string ID generator.
-   **Web Vitals:** For measuring and reporting on the performance of the application.
-   **PWA (Progressive Web App):** Configured for offline capabilities and enhanced user experience.

## Key Features

-   **Real-time Object Detection:** Utilizes COCO-SSD model for detecting objects in video streams.
-   **Depth Estimation:** Employs a MIDAS depth model for real-time depth perception.
-   **Mobile-First Design:** Optimized for mobile devices with a dedicated `MobileGuard` component.
-   **User Monitoring:** Provides a dedicated page for user monitoring.
-   **Admin Dashboard:** Features active users, history, and statistics.
-   **Customizable Settings:**
    -   Alert Distance
    -   Haptic Feedback
    -   Auto-calibration on launch
    -   Device re-calibration
-   **Session Management:** Includes pages for new sessions and session summaries.
-   **Camera Access Handling:** Dedicated page for camera access denied scenarios.
-   **Incompatible Browser Detection:** Informs users about browser compatibility issues.
-   **Help and Privacy Pages:** Provides essential information and privacy notes.

## Installation and Running Locally

To get the Project Iris frontend up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm start
    ```

    This will open the application in your default browser at `http://localhost:3000`.

4.  **Build for production:**
    ```bash
    npm run build
    ```
    This command builds the app for production to the `build` folder.

## Project Structure

The project follows a standard React application structure, with a focus on modularity and clear separation of concerns.

```
frontend/
├── public/                 # Public assets, including HTML template and ML models
│   ├── models/             # Pre-trained machine learning models (e.g., MIDAS)
│   └── ...
├── src/                    # Source code
│   ├── assets/             # Static assets like images
│   ├── components/         # Reusable UI components
│   │   ├── AdminDashboard/
│   │   ├── common/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── Home/
│   │   ├── ObjectDetector/
│   │   └── SettingsPage/
│   ├── context/            # React Context API for global state management (e.g., SettingsContext)
│   ├── hooks/              # Custom React hooks for reusable logic (e.g., useCamera, useDepthModel)
│   ├── pages/              # Top-level components representing different views/routes
│   ├── styles/             # Global styles and CSS variables
│   ├── utils/              # Utility functions and helpers (e.g., MobileGuard)
│   ├── workers/            # Web Workers for offloading heavy computations (e.g., depth.worker.js)
│   ├── App.js              # Main application component and routing
│   ├── index.js            # Entry point of the React application
│   └── ...
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency tree lock file
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License.
