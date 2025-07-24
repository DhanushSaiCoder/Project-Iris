<div align="center">
  <img src="frontend/src/assets/images/logo.png" alt="Project Iris Logo" width="200"/>
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

Project-Iris is a web-based application designed for user monitoring, likely through computer vision. The name "Iris" suggests a focus on eye-tracking or a similar visual monitoring technology. The application includes features for calibration, user sessions, and administrative oversight. It is built as a Progressive Web App (PWA), allowing for offline use and a native-like application experience.

## Key Features

*   **User Monitoring:** Real-time monitoring of the user, forming the core functionality of the application.
*   **Calibration:** A dedicated calibration page to ensure accurate monitoring.
*   **Session Management:** Users can start, stop, and view summaries of their monitoring sessions.
*   **Settings:** A comprehensive settings page allowing users to configure options such as:
    *   Alert Distance
    *   Haptic Feedback
    *   Auto-Calibration
*   **Admin Dashboard:** A separate interface for administrators to manage and monitor the application.
*   **Responsive Design:** The application includes a mobile guard to ensure a proper user experience on different devices.
*   **PWA Enabled:** Can be installed on devices for offline access and a more integrated experience.

## Tech Stack

*   **Frontend:** React
*   **Routing:** React Router
*   **Styling:** CSS Modules and standard CSS
*   **Build Tool:** Create React App

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or yarn)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/DhanushSaiCoder/Project-Iris.git
    ```
2.  Navigate to the frontend directory
    ```sh
    cd Project-Iris/frontend
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```

### Usage

To run the application in development mode:

```sh
npm start
```

This will open the application in your default browser at `http://localhost:3000`.

To build the application for production:

```sh
npm run build
```

## Project Structure

The project follows a standard Create React App structure.

```
frontend/
├── public/         # Public assets and index.html
└── src/
    ├── assets/       # Images and other static assets
    ├── components/   # Reusable React components
    ├── context/      # React context providers
    ├── hooks/        # Custom React hooks
    ├── pages/        # Top-level page components
    ├── styles/       # Global styles
    └── utils/        # Utility functions
```

## License

Distributed under the MIT License. See `LICENSE` for more information.