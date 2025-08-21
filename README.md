<div align="center">
  <img src="./frontend/public/logo.png" alt="Project Iris Logo" width="150"/>
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
-   **Depth Estimation:** Provides depth information to determine the distance of objects using the fastDepth model.
-   **Audio and Haptic Feedback:** Alerts users to nearby objects through sound and vibration.
-   **Session Tracking:** Records and saves detection sessions for later review.
-   **User Management:** Allows admins to manage user roles and view user activity.
-   **Admin Dashboard:** Provides a comprehensive overview of all session data with charts and statistics.
-   **Customizable Settings:** Allows users to adjust settings like alert distance and feedback types.
-   **Progressive Web App (PWA):** Can be installed on your device for an offline-first experience.

## Tech Stack

**Backend:**

-   **Framework:** Node.js with Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** bcrypt, jsonwebtoken
-   **Dependencies:** `axios`, `bcrypt`, `cors`, `dotenv`, `express`, `jsonwebtoken`, `mongodb`, `mongoose`, `nodemon`

**Frontend:**

-   **Framework:** React.js
-   **Object Detection:** TensorFlow.js with COCO-SSD
-   **Depth Estimation:** TensorFlow.js with fastDepth
-   **UI Libraries:** Material-UI, Lucide React, Recharts
-   **Dependencies:** `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/x-charts`, `@tensorflow-models/coco-ssd`, `@tensorflow-models/depth-estimation`, `@tensorflow/tfjs`, `@tensorflow/tfjs-backend-webgl`, `@tensorflow/tfjs-converter`, `@vercel/analytics`, `axios`, `cra-template-pwa`, `fuse.js`, `jwt-decode`, `lucide-react`, `nanoid`, `react`, `react-dom`, `react-icons`, `react-router-dom`, `react-scripts`, `recharts`, `web-vitals`

## Getting Started

### Prerequisites

-   Node.js and npm installed
-   MongoDB instance (local or cloud)

### Installation

#### Option 1: Manual Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DhanushSaiCoder/Project-Iris.git
    cd Project-Iris
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

#### Option 2: Using Installation Scripts

For a quicker setup, use the provided installation scripts. These scripts will install the dependencies for both the frontend and backend.

-   On Windows, run:
    ```bash
    install_all.bat
    ```
-   On macOS and Linux, run:
    ```bash
    chmod +x install_all.sh
    ./install_all.sh
    ```

### Configuration

1.  **Create a `.env.development` file in the `backend` directory** and add the following environment variables:

    ```
    MONGODB_URL=your_mongodb_connection_string
    PORT=5555
    JWT_SECRET=your_jwt_secret
    ```

2.  The frontend is configured to proxy requests to the backend, so no separate `.env` file is required for the frontend in development.

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
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
│   ├── Controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── sessionModel.js
│   │   └── User.model.js
│   ├── routes/
│   │   ├── Auth.route.js
│   │   ├── sessionsRoute.js
│   │   └── user.route.js
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── build/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── utils/
│       └── workers/
├── .gitignore
├── install_all.bat
├── install_all.sh
├── LICENSE
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.