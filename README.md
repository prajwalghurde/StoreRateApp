# StoreRatings - FullStack Web Application (React Frontend & Node Backend)

Welcome to StoreRatings! This web application allows users to discover, rate, and review stores. It features a role-based access system with distinct functionalities for System Administrators, Normal Users, and Store Owners.

This README focuses on the **ReactJS frontend** and **Express.js backend** of the application. It assumes you have a compatible backend API already developed and running.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)

   - [General Features](#general-features)
   - [System Administrator Features](#system-administrator-features)
   - [Normal User Features](#normal-user-features)
   - [Store Owner Features](#store-owner-features)

3. [Tech Stack](#tech-stack)

   - [Frontend](#frontend)
   - [Backend](#backend)

4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)

   - [Cloning the Repository](#cloning-the-repository)
   - [Installation](#installation)
   - [Environment Configuration](#environment-configuration)
   - [Running the Application](#running-the-application)

6. [Available Scripts](#available-scripts)
7. [Application Usage & Functionalities](#application-usage--functionalities)

   - [1. User Registration (Normal User)](#1-user-registration-normal-user)
   - [2. User Login (All Roles)](#2-user-login-all-roles)
   - [3. System Administrator](#3-system-administrator)
   - [4. Normal User](#4-normal-user)
   - [5. Store Owner](#5-store-owner)
   - [6. Profile Management (All Logged-in Users)](#6-profile-management-all-logged-in-users)
   - [7. Logging Out](#7-logging-out)

8. [API Integration](#api-integration)
9. [Form Validations](#form-validations)
10. [Contributing](#contributing)
11. [License](#license)

## Overview

StoreRatings provides a platform for:

- **Normal Users:** To sign up, browse registered stores, search for stores, and submit/modify ratings (1-5) for them.
- **Store Owners:** To view ratings and statistics specific to their registered store.
- **System Administrators:** To manage the entire platform, including users, stores, and view overall platform statistics.

The application uses a single login system, and user access to functionalities is determined by their assigned role.

## Features

### General Features

- **Role-Based Access Control:** Differentiated user experience based on roles.
- **Single Sign-On (SSO):** Unified login for all user types.
- **User Registration:** Normal users can sign up.
- **Secure Authentication:** Token-based authentication (e.g., JWT).
- **Password Management:** Users can update their passwords.
- **Responsive Design:** Built with TailwindCSS for usability across devices.
- **Filtering and Sorting:** Data tables support filtering and sorting for key fields.
- **Clear Loading and Error States:** User-friendly feedback during data operations.

### System Administrator Features

- **Dashboard:** View total users, total stores, and total submitted ratings.
- **User Management:**

  - Add new users (System Admin, Normal User, Store Owner) by specifying Name, Email, Password, Address, and Role.
  - View a list of all normal and admin users (Name, Email, Address, Role).
  - View detailed information for any user. If the user is a Store Owner, their store's rating is displayed.
  - Filter users by Name, Email, Address, and Role.

- **Store Management:**

  - Add new stores by providing Name, Email, Address, and assigning a Store Owner.
  - View a list of all stores (Name, Email, Address, Overall Rating).
  - Filter stores by Name, Email, and Address.

- **Logout**

### Normal User Features

- **Signup & Login:** Register and access the platform.
- **Store Discovery:**

  - View a list of all registered stores.
  - Store listings display: Store Name, Address, Overall Rating, and the user's own submitted rating (if any).
  - Search for stores by Name and Address.

- **Rating System:**

  - Submit ratings (1 to 5) for individual stores.
  - Modify their previously submitted ratings.

- **Password Update:** Change their account password.
- **Logout**

### Store Owner Features

- **Login:** Access the platform with store owner credentials.
- **Dashboard:**

  - View a list of users who have submitted ratings for their store (Name, Email, Rating Given).
  - See the average rating of their store.

- **Password Update:** Change their account password.
- **Logout**

## Tech Stack

### Frontend

- **ReactJS** – JavaScript library for building UI
- **Redux Toolkit** – Efficient and predictable state management
- **React Router DOM** – Client-side routing and navigation
- **TailwindCSS** – Utility-first CSS framework for rapid styling
- **Axios** – For making HTTP requests to backend API
- **JavaScript (ES6+)** – Language used for frontend logic

### Backend

- **Express.js** – Web framework for Node.js used to build APIs
- **PostgreSQL** – Relational database used to store structured data
- **Sequelize ORM** – Used to define models, relationships, and query PostgreSQL
- **JWT Authentication** – Secures endpoints using token-based auth
- **bcryptjs** – Password hashing before storing in database
- **dotenv** – Loads environment variables from `.env`
- **CORS** – Allows secure API access across different origins
- **Node.js** – JavaScript runtime for executing backend logic

## Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL installed and running
- Backend server must be available at a defined API base URL (e.g., `http://localhost:5000/api`)

## Getting Started

### Cloning the Repository

```bash
git clone https://github.com/OFFICIALNITIN/store_rating_app.git
cd store-ratings
```

### Installation

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file in the root of the frontend project:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
cd backend
npm run start
```

```bash
cd frontend
npm run start
```

## Available Scripts

In the project directory, you can run:

```bash
npm start        # Runs app in development mode
npm run build    # Builds app for production
```

## Application Usage & Functionalities

### 1. User Registration (Normal User)

- Fill registration form with valid name, email, password, address
- Password must include uppercase and a special character

### 2. User Login (All Roles)

- Login form redirects based on role:

  - Admin: `/admin/dashboard`
  - User: `/user/stores`
  - Store Owner: `/ownerStore/dashboard`

### 3. System Administrator

- Manage users/stores
- View statistics
- Filter/search and view individual user/store data

### 4. Normal User

- Browse & search stores
- Submit/update ratings
- Change password

### 5. Store Owner

- See users who rated their store
- View average rating
- Change password

### 6. Profile Management (All Logged-in Users)

- Change password securely

### 7. Logging Out

- Clears JWT token from localStorage

## API Integration

Ensure your backend API conforms to expected endpoints like:

`- POST /auth/login`
`- POST /auth/register`
`- GET /users/stores`
`- POST /users/ratings`
`- PUT /users/ratings/:id`
`- PUT /users/update-password`
`- GET /admin/dashboard`
`- POST /admin/users`
`- POST /admin/stores`
`- GET /admin/users`
`- GET /admin/stores`
`- GET /admin/users/:id`
`- GET /owner/dashboard`

## Form Validations

- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8–16 chars, 1 uppercase, 1 special character
- **Email**: Must be valid email format

## Contributing

Feel free to open issues and contribute improvements or bug fixes. Make sure you write clean, readable code and document any new features.

## License

This project is licensed under the MIT License.
