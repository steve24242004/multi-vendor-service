# Multi-Vendor Service Application

This is a full-stack multi-vendor service application that allows users to request services and technicians to manage those requests.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)

## About the Project

This project is a web-based platform designed to connect users with service technicians. Users can sign up, log in, and create service requests. Technicians can view and manage the service requests assigned to them.

### Features

- User authentication (signup and login)
- Role-based access control (User and Technician)
- Users can create, view, and manage their service requests.
- Technicians can view and update the status of service requests.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/multi-vendor-service.git
    ```
2.  **Backend Setup**
    - Navigate to the backend directory:
      ```sh
      cd multi-vendor-service/backend
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `backend` directory and add the following variables:
      ```
      PORT=5000
      MONGO_URI=<YOUR_MONGO_DB_URI>
      JWT_SECRET=<YOUR_JWT_SECRET>
      ```
3.  **Frontend Setup**
    - Navigate to the frontend directory:
      ```sh
      cd ../frontend/multi-vendor
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `frontend/multi-vendor` directory and add the following variable:
      ```
      VITE_API_URL=http://localhost:5000
      ```

## Usage

1.  **Start the backend server**
    - In the `backend` directory, run:
      ```sh
      npm run dev
      ```
2.  **Start the frontend development server**
    - In the `frontend/multi-vendor` directory, run:
      ```sh
      npm run dev
      ```
3.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Technologies Used

### Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/) for authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing

### Frontend

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) for API requests

## Project Structure

```
multi-vendor-service/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── serviceRequestController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── ServiceRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── serviceRequestRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    └── multi-vendor/
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   ├── context/
        │   ├── pages/
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        ├── .env
        ├── package.json
        └── vite.config.js
```
