# CipherSQL - Interactive SQL Learning Platform

CipherSQL is a full-stack web application designed to help users learn and practice SQL through interactive assignments. Users can write SQL queries, execute them in real-time, and get instant feedback on their solutions.

## Features

- 🔐 **User Authentication**: Secure signup/login system with JWT tokens
- 📝 **Interactive SQL Editor**: Monaco Editor integration for writing SQL queries
- ✅ **Real-time Validation**: Instant feedback on query correctness
- 🎯 **Progress Tracking**: Track solved assignments with visual indicators
- 💾 **Auto-save**: Queries are automatically saved to localStorage
- 🔍 **AI Hints**: Get hints when stuck on a problem
- 📊 **Multiple Difficulty Levels**: Easy, Medium, and Hard assignments
- 🎨 **Modern UI**: Clean and responsive design with SCSS

## Tech Stack

### Frontend
- **React** 19.2.0
- **React Router** 7.11.0
- **Monaco Editor** - VS Code's editor for SQL writing
- **SASS** - For styling
- **Vite** - Build tool

### Backend
- **Node.js** & **Express** 4.18.2
- **MongoDB** (Mongoose 8.0.3) - User data, assignments, attempts
- **PostgreSQL** (pg 8.11.3) - SQL query execution sandbox
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (running on default port 27017)
- **PostgreSQL** (running on default port 5432)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ciphersql
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ciphersql

# PostgreSQL Connection
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ciphersql_sandbox

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

No additional configuration needed for frontend.

## Database Setup

### PostgreSQL Setup

1. **Create the database**:

```sql
CREATE DATABASE ciphersql_sandbox;
```

2. **Run the setup script**:

Navigate to `backend` folder and run:

```bash
psql -U postgres -d ciphersql_sandbox -f database_setup.sql
```

Or manually execute the SQL commands in `backend/database_setup.sql` which creates sample tables (employees, departments, customers, orders, products).

### MongoDB Setup

MongoDB collections will be automatically created when you first run the backend. The application will seed 16 SQL assignments on first startup.

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3000`

Expected output:
```
MongoDB connected successfully
PostgreSQL connected successfully
Server running on port 3000
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to: `http://localhost:5173`

## Project Structure

```
ciphersql/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connections
│   │   ├── controllers/
│   │   │   ├── assignmentController.js
│   │   │   ├── authController.js
│   │   │   └── queryController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── Assignment.js
│   │   │   ├── Attempt.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── assignmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── queryRoutes.js
│   │   ├── services/
│   │   │   ├── llmService.js        # AI hint generation
│   │   │   └── queryExecutor.js     # SQL execution engine
│   │   ├── utils/
│   │   │   └── seedDatabase.js      # Database seeding
│   │   └── server.js                # Express app entry point
│   ├── database_setup.sql           # PostgreSQL schema
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── AssignmentAttemptPage.jsx
│   │   │   ├── AssignmentListPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/
│   │   │   ├── authService.js       # Authentication API client
│   │   │   └── mockApi.js           # API client
│   │   ├── styles/
│   │   │   └── global.scss
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Usage Guide

### 1. Create an Account

- Navigate to the signup page
- Enter username, email, and password
- Click "Sign Up"

### 2. Login

- Go to the login page
- Enter your credentials
- Click "Login"

### 3. Browse Assignments

- View all available SQL assignments on the homepage
- See difficulty levels (Easy, Medium, Hard)
- Solved assignments are marked with a green checkmark

### 4. Solve an Assignment

- Click on any assignment card
- Read the question and table schema
- Write your SQL query in the editor
- Click "Run Query" to test your solution
- Get instant feedback on correctness
- Your query is auto-saved as you type

### 5. Get Hints

- If stuck, click the "Get Hint" button
- AI will provide guidance without giving away the answer

