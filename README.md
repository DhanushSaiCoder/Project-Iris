<div align="center">
  <img src="./frontend/src/assets/images/logo.png" alt="Project Iris Logo" width="150"/>
  <h1 align="center">Project Iris</h1>
  <strong>
    A web-based smart assistant for the visually impaired, providing real-time environmental awareness through object and depth detection.<br/><br/>
  </strong>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow Badge"/>
</div>

<div align="center">
  <img src="https://img.shields.io/github/last-commit/DhanushSaiCoder/Project-Iris" alt="Last Commit Badge"/>
  <img src="https://img.shields.io/github/repo-size/DhanushSaiCoder/Project-Iris" alt="Repo Size Badge"/>
  <img src="https://img.shields.io/github/license/DhanushSaiCoder/Project-Iris" alt="License Badge"/>
</div>

## Features

-   **Real-time Object Detection:** Uses the COCO-SSD model to identify a wide range of objects.
-   **Depth Estimation:** Provides depth information to determine the distance of objects.
-   **Audio and Haptic Feedback:** Alerts users to nearby objects through sound and vibration.
-   **Session Tracking:** Records and saves detection sessions for later review.
-   **Admin Dashboard:** Provides a comprehensive overview of all session data with charts and statistics.
-   **Customizable Settings:** Allows users to adjust settings like alert distance and feedback types.
-   **Progressive Web App (PWA):** Can be installed on your device for an offline-first experience.

## Tech Stack

**Backend:**

-   **Framework:** Node.js with Express.js
-   **Database:** MongoDB with Mongoose
-   **Dependencies:** `axios`, `cors`, `dotenv`, `express`, `mongodb`, `mongoose`, `nodemon`

**Frontend:**

-   **Framework:** React.js
-   **Object Detection:** TensorFlow.js with COCO-SSD
-   **Depth Estimation:** TensorFlow.js with ARPortraitDepth
-   **UI Libraries:** Material-UI, Lucide React, Recharts
-   **Dependencies:** `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/x-charts`, `@tensorflow-models/coco-ssd`, `@tensorflow-models/depth-estimation`, `@tensorflow/tfjs`, `axios`, `lucide-react`, `nanoid`, `react`, `react-dom`, `react-icons`, `react-router-dom`, `react-scripts`, `recharts`, `web-vitals`

## Getting Started

### Prerequisites

-   Node.js and npm installed
-   MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/project-iris.git
    cd project-iris
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Create a `.env` file in the `backend` directory** and add the following environment variables:

    ```
    MONGODB_URL=your_mongodb_connection_string
    PORT=5555
    ```

2.  **Create a `.env` file in the `frontend` directory** and add the following environment variable:
    ```
    REACT_APP_BACKEND_URL=http://localhost:5555
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm start
    ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
Project-Iris/
├── backend/
│   ├── models/
│   │   └── sessionModel.js
│   ├── routes/
│   │   └── sessionsRoute.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── workers/
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
